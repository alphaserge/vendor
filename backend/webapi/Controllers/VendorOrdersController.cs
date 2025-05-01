using AutoMapper;
using chiffon_back.Code;
using chiffon_back.Context;
using chiffon_back.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Hosting.Server;

//using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.EntityFrameworkCore;
using System.IO;
using System.Net;
using System.Net.Mail;
using System.Net.Mime;
using System.Text;
using System.Web;
using System.Web.Http.Cors; // пространство имен CORS

namespace chiffon_back.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [EnableCors(origins: "http://185.40.31.18:3000,http://185.40.31.18:3010", headers: "*", methods: "*")]
    public class VendorOrdersController : ControllerBase
    {
        private MapperConfiguration config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<Models.VendorOrder, Context.VendorOrder>();
                cfg.CreateMap<Context.VendorOrder, Models.VendorOrder>();
                cfg.CreateMap<Models.OrderItem, Context.OrderItem>();
                cfg.CreateMap<Context.OrderItem, Models.OrderItem>();
            });

        private readonly chiffon_back.Context.ChiffonDbContext ctx = Code.ContextHelper.ChiffonContext();

        private IConfiguration _configuration;

        private readonly ILogger<VendorOrdersController> _logger;

        private readonly IWebHostEnvironment _webHostEnvironment;

        public VendorOrdersController(ILogger<VendorOrdersController> logger, IConfiguration configuration, IWebHostEnvironment webHostEnvironment)
        {
            _logger = logger;
            _configuration = configuration;
            _webHostEnvironment = webHostEnvironment;
        }

        [HttpGet(Name = "VendorOrders/{vendorId}")]
        public IEnumerable<Models.VendorOrder> Get(int? vendorId, [FromQuery] string status)
        {
            if (vendorId == null)
            {
                return new List<Models.VendorOrder>().AsEnumerable();
            }

            var query = ctx.VendorOrders.AsQueryable();
            if (vendorId != 1)
            {
                query = query.Where(x => x.VendorId == vendorId);
            }
            switch (status)
            {
                case "sent": query = query.Where(x => x.Sent.HasValue); break;
                case "recieved": query = query.Where(x => x.Received.HasValue); break;
            }

            List<Models.VendorOrder> orders = query
                .Select(x => config.CreateMapper().Map<Models.VendorOrder>(x)).ToList();

            foreach (Models.VendorOrder o in orders)
            {
                var order = ctx.Vendors.FirstOrDefault(x => x.Id == vendorId);
                if (order != null)
                {
                    o.VendorName = order.VendorName;
                }
            }

            foreach (var o in orders)
            {
                var items = from oi in ctx.OrderItems.Where(x => x.VendorOrderId == o.Id)
                            join p in ctx.Products on oi.ProductId equals p.Id into jointable
                            from j in jointable.DefaultIfEmpty()
                            join v in ctx.Vendors on j.VendorId equals v.Id into joinvendors
                            from jv in joinvendors.DefaultIfEmpty()
                            select new { oi, j, jv };

                List<Models.OrderItem> orderItems = new List<Models.OrderItem>();
                foreach (var item in items)
                {
                    Models.OrderItem orderItem = new Models.OrderItem()
                    {
                        VendorOrderId = o.Id,
                        ProductId = item.oi.ProductId,
                        Id = item.oi.Id,
                        ArtNo = item.j.ArtNo,
                        RefNo = item.j.RefNo,
                        ItemName = item.j.ItemName,
                        Composition = item.j.Composition,
                        Design = item.j.Design,
                        Price = item.oi.Price,
                        Quantity = item.oi.Quantity,
                        VendorQuantity = item.oi.VendorQuantity,
                        OrderRolls = item.oi.OrderRolls,
                        Details = item.oi.Details,
                        VendorId = item.j.VendorId,
                        VendorName = item.jv.VendorName
                    };

                    string imagePath = string.Empty;
                    if (!String.IsNullOrEmpty(item.j.PhotoUuids))
                    {
                        foreach (string uuid in PhotoHelper.GetPhotoUuids(item.j.PhotoUuids))
                        {
                            var imageFiles = DirectoryHelper.GetImageFiles(uuid);
                            if (imageFiles.Count > 0)
                            {
                                imagePath = imageFiles[0];
                                break;
                            }
                        }
                    }

                    if (String.IsNullOrEmpty(imagePath))
                    {
                        foreach (var cv in ctx.ColorVariants.Where(x => x.ProductId == item.j.Id).ToList())
                        {
                            var imageFiles = DirectoryHelper.GetImageFiles(cv.Uuid!);
                            if (imageFiles.Count > 0)
                            {
                                imagePath = imageFiles[0];
                                break;
                            }
                        }
                    }

                    orderItem.imagePath = imagePath;
                    orderItems.Add(orderItem);
                }
                o.Items = orderItems.ToArray();
            }

            /*var q =
                from o in ctx.VendorOrders
                join oi in ctx.OrderItems on o.Id equals oi.VendorOrderId into jointable
                from j in jointable.DefaultIfEmpty()
                join p in ctx.Products on j.ProductId equals p.Id into jointable1
                from j1 in jointable1.DefaultIfEmpty()
                select new { VendorOrder = o, v = j == null ? 0 : j.Quantity, j1.ItemName, j1.ArtNo, j1.RefNo, j1.Design, j1.Price }; */
            return orders.AsEnumerable();
        }

        //[HttpGet(Name = "VendorReady")]
        [HttpGet("ready")]
        public IEnumerable<Models.VendorOrder> GetReady()
        {
            List<Models.VendorOrder> orders = new List<Models.VendorOrder>();

            var items = from oi in ctx.OrderItems.Where(x => x.VendorOrderId == null)
                        join p in ctx.Products on oi.ProductId equals p.Id into jointable
                        from jp in jointable.DefaultIfEmpty()
                        join v in ctx.Vendors on jp.VendorId equals v.Id into joinvendors
                        from jv in joinvendors.DefaultIfEmpty()
                        orderby jv.VendorName
                        select new { oi, jp, jv };

            List<Models.OrderItem> orderItems = new List<Models.OrderItem>();
            //Models.VendorOrder order = new Models.VendorOrder();
            bool first = true;
            int vendorId = -1;
            string? vendorName = "";
            foreach (var item in items)
            {
                if (item.jv.Id != vendorId && !first)
                {
                    Models.VendorOrder order = new Models.VendorOrder();
                    order.VendorId = vendorId;
                    order.VendorName = vendorName;
                    order.Items = orderItems.ToArray();
                    orders.Add(order);
                    orderItems.Clear();
                }
                first = false;
                vendorId = item.jv.Id;
                vendorName = item.jv.VendorName;

                Models.OrderItem orderItem = new Models.OrderItem()
                {
                    ProductId = item.oi.ProductId,
                    Id = item.oi.Id,
                    ArtNo = item.jp.ArtNo,
                    RefNo = item.jp.RefNo,
                    ItemName = item.jp.ItemName,
                    Composition = item.jp.Composition,
                    Design = item.jp.Design,
                    Price = item.oi.Price,
                    Quantity = item.oi.Quantity,
                    VendorQuantity = item.oi.VendorQuantity,
                    OrderRolls = item.oi.OrderRolls,
                    Details = item.oi.Details,
                    VendorId = item.jp.VendorId,
                    VendorName = item.jv.VendorName
                };

                string imagePath = string.Empty;
                if (!String.IsNullOrEmpty(item.jp.PhotoUuids))
                {
                    foreach (string uuid in PhotoHelper.GetPhotoUuids(item.jp.PhotoUuids))
                    {
                        var imageFiles = DirectoryHelper.GetImageFiles(uuid);
                        if (imageFiles.Count > 0)
                        {
                            imagePath = imageFiles[0];
                            break;
                        }
                    }
                }

                if (String.IsNullOrEmpty(imagePath))
                {
                    foreach (var cv in ctx.ColorVariants.Where(x => x.ProductId == item.jp.Id).ToList())
                    {
                        var imageFiles = DirectoryHelper.GetImageFiles(cv.Uuid!);
                        if (imageFiles.Count > 0)
                        {
                            imagePath = imageFiles[0];
                            break;
                        }
                    }
                }

                orderItem.imagePath = imagePath;
                orderItems.Add(orderItem);
            }

            if (orderItems.Count > 0)
            {
                Models.VendorOrder order = new Models.VendorOrder();
                order.VendorId = vendorId;
                order.VendorName = vendorName;
                order.Items = orderItems.ToArray();
                orders.Add(order);
            }

            return orders.AsEnumerable();
        }

        [HttpGet("{id}")]
        //public Models.Product? Product([FromQuery] string id)
        public Models.VendorOrder? GetVendorOrder([FromQuery] string id)
        {
            Models.VendorOrder? order =
                ctx.VendorOrders.Where(x => x.Id.ToString() == id)
                .Select(x =>
                    config.CreateMapper()
                        .Map<Models.VendorOrder>(x)).FirstOrDefault();

            var items = from oi in ctx.OrderItems.Where(x => x.VendorOrderId == order.Id)
                        join p in ctx.Products on oi.ProductId equals p.Id into jointable
                        from j in jointable.DefaultIfEmpty()
                        select new { oi, j };

            List<Models.OrderItem> orderItems = new List<Models.OrderItem>();
            foreach (var item in items)
            {
                Models.OrderItem orderItem = new Models.OrderItem()
                {
                    VendorOrderId = order.Id,
                    ProductId = item.oi.ProductId,
                    Id = item.oi.Id,
                    ArtNo = item.j.ArtNo,
                    RefNo = item.j.RefNo,
                    ItemName = item.j.ItemName,
                    Composition = item.j.Composition,
                    Design = item.j.Design,
                    Price = item.oi.Price,
                    Quantity = item.oi.Quantity,
                    VendorQuantity = item.oi.VendorQuantity,
                    OrderRolls = item.oi.OrderRolls,
                    Details = item.oi.Details,
                };

                orderItems.Add(orderItem);
            }
            order.Items = orderItems.ToArray();

            /*var q =
                from o in ctx.VendorOrders
                join oi in ctx.OrderItems on o.Id equals oi.VendorOrderId into jointable
                from j in jointable.DefaultIfEmpty()
                join p in ctx.Products on j.ProductId equals p.Id into jointable1
                from j1 in jointable1.DefaultIfEmpty()
                select new { VendorOrder = o, v = j == null ? 0 : j.Quantity, j1.ItemName, j1.ArtNo, j1.RefNo, j1.Design, j1.Price }; */
            return order;
        }

        [HttpPost("SendToVendor/{vendorId}")]
        public ActionResult<Models.VendorOrder> Post(int vendorId)
        {
            try
            {
                var vendor = ctx.Vendors.FirstOrDefault(x => x.Id == vendorId);
                if (vendor == null)
                {
                    return CreatedAtAction(nameof(Get), new { id = -2 }, null);
                }

                var query = from oi in ctx.OrderItems.Where(x => x.VendorOrderId == null)
                            join p in ctx.Products.Where(x => x.VendorId == vendorId) on oi.ProductId equals p.Id //into jointable
                            //from j in jointable.DefaultIfEmpty()
                            select new { oi, p };
                var items = query.ToList();
                if (items.Count == 0)
                {
                    return CreatedAtAction(nameof(Get), new { id = -1 }, null);
                }

                Context.VendorOrder newVendorOrder = new Context.VendorOrder();
                newVendorOrder.Created = DateTime.Now;
                newVendorOrder.VendorId = vendorId;

                int? max = 0;
                try
                {
                    max = ctx.VendorOrders.Max(x => x.Number);
                    if (!max.HasValue)
                        max = 0;
                }
                catch (Exception ex)
                {
                    max = 0;
                }
                newVendorOrder.Number = max.Value + 1;
                ctx.VendorOrders.Add(newVendorOrder);
                ctx.SaveChanges();

                foreach (var item in items)
                {
                    var orderItem = ctx.OrderItems.FirstOrDefault(x => x.Id == item.oi.Id);
                    if (orderItem != null)
                        orderItem.VendorOrderId = newVendorOrder.Id;
                }
                ctx.SaveChanges();

                string label = "'font-weight: normal; font-size: 100%; padding: 5px 12px;'";
                string cell = "'padding: 10px 20px;'";
                string rightAlign = "'text-align: right;padding: 10px 20px;'";
                string header = "'font-weight: #400; color: #66f;'";
                string headerBlack = "'font-weight: bold; color: #000;'";

                int numItem = 0;
                decimal total = 0m;
                string itemsBody = $"<table style='background-color: #def; padding: 20px;'>" +
                    $"<thead><th style={label}><b>Photo</b></th><th style={label}><b>Fabric name</b></th>" +
                    $"<th style={label}><b>Ref No.</b></th><th style={label}><b>Art No.</b></th>" +
                    $"<th style={label}><b>Design</b></th><th style={label}><b>Quantity</b></th></thead>";

                List<LinkedResource> linkedRes = new List<LinkedResource>();
                foreach (var item in items)
                {
                    numItem++;
                    Context.Product? product = ctx.Products.FirstOrDefault(x => x.Id == item.oi.ProductId);

                    if (product != null)
                    {
                        string img = String.Empty;
                        foreach (var cv in ctx.ColorVariants.Where(x => x.ProductId == product.Id).ToList())
                        {
                            var imageFiles = DirectoryHelper.GetImageFiles(cv.Uuid!);
                            if (imageFiles.Count > 0)
                            {
                                img = imageFiles[0];
                                break;
                            }
                        }

                        if (String.IsNullOrEmpty(img))
                        {
                            img = @"colors\nopicture.png";
                        }

                        string webRootPath = _webHostEnvironment.WebRootPath;
                        string contentRootPath = _webHostEnvironment.ContentRootPath;
                        string path = Path.Combine(contentRootPath, img);
                        string mediaType = MediaTypeNames.Image.Jpeg;
                        switch (Path.GetExtension(path).ToLower())
                        {
                            case ".png": mediaType = MediaTypeNames.Image.Png; break;
                            case ".webp": mediaType = MediaTypeNames.Image.Webp; break;
                            case ".bmp": mediaType = MediaTypeNames.Image.Bmp; break;
                            case ".gif": mediaType = MediaTypeNames.Image.Gif; break;
                            case ".tiff": mediaType = MediaTypeNames.Image.Tiff; break;
                        }

                        LinkedResource LinkedImg = new LinkedResource(path, mediaType);
                        LinkedImg.ContentId = $"img{numItem}";
                        itemsBody += $"<tr><td style={cell}><img src=cid:{LinkedImg.ContentId} id='img' alt='' width='80px' height='80px'/></td><td style={cell}>"
                            + product.ItemName + $"</td><td style={cell}>"
                            + product.RefNo + $"</td style={cell}><td>"
                            + product.ArtNo + $"</td><td style={cell}>"
                            + product.Design + $"</td><td style={rightAlign}>"
                            + item.oi.Quantity + $" m </td></tr>";
                        linkedRes.Add(LinkedImg);

                        if (item.oi.Price != null && item.oi.Quantity != null)
                            total += item.oi.Price.Value * item.oi.Quantity.Value;
                    }
                }
                itemsBody += "</table>";

                //------------------------------mail
                using (MailMessage mess = new MailMessage())
                {
                    string? frontendUrl = _configuration.GetValue<string>("Url:Frontend");
                    string? ordersManager = _configuration.GetValue<string>("VendorOrders:Manager");

                    string body = $"<p style={header}>Dear {vendor.VendorName}!</p><p style={header}>Company Angelica created order with number {newVendorOrder.Number}</p>";
                    body += "<table cellspacing=2>";
                    body += $"<tr><td style={label}>Your order number:</td><td>{newVendorOrder.Number}</tr></td>";
                    body += $"<tr><td style={label}>VendorOrder date:</td><td>{newVendorOrder.Created}</tr></td>";
                    body += $"<p style={headerBlack}>New order composition:</p>{itemsBody}";
                    body += $"<p><b>Total price: {total} $</b></p>";
                    body += $"<p>Your order link <a href='{frontendUrl}/orders/{newVendorOrder.Id}'>here</a> </p>";
                    body += $"<p style={header}>Best regards, textile company Angelika</p>";
                    body += $"<p style={headerBlack}>Our contacts:</p>";
                    body += "<p>Showroom address:<br/>Yaroslavskoe shosse, possession 1 building 1, Mytishchi, Moscow region, Russia.<br/>Postal code: 141009<br/>Phones: +7(926)018-01-25, +7(916)876-20-08";
                    body += "<p>Headquarters:<br/>Bolshaya Gruzinskaya, 20, 3A/P Moscow, Russia.<br/>Postal code: 123242</p>";

                    AlternateView AV = AlternateView.CreateAlternateViewFromString(body, null, MediaTypeNames.Text.Html);
                    foreach (LinkedResource res in linkedRes)
                        AV.LinkedResources.Add(res);

                    SmtpClient client = new SmtpClient("smtp.mail.ru", Convert.ToInt32(587))
                    {
                        Credentials = new NetworkCredential("elizarov.sa@mail.ru", "KZswYNWrd9eY1xVfvkre"),
                        EnableSsl = true,
                        DeliveryMethod = SmtpDeliveryMethod.Network,
                        Timeout = 5000
                    };

                    mess.From = new MailAddress("elizarov.sa@mail.ru");
                    mess.To.Add(new MailAddress(vendor.Email));
                    mess.Subject = "A new order has been created in the company Angelika";
                    mess.SubjectEncoding = Encoding.UTF8;
                    //mess.Body = $"<h2>Hello, {mdUser.FirstName}!</h2><p>You received this letter because this address was used when creating an account on the Anzhelika company website</p><p>To complete your account creation, click <a href='{frontendUrl}/confirm?token={hash}'>this link</a></p>";
                    // !! to do - add link to order !!
                    mess.Body = body;
                    mess.AlternateViews.Add(AV);
                    mess.IsBodyHtml = true;
                    /*try
                    {
                        mess.Attachments.Add(new Attachment(какой файл добавлять для отправки));
                    }
                    catch { }*/
                    client.Send(mess);
                    mess.Dispose();
                    client.Dispose();
                    Console.WriteLine("SignUp: Email was sended");
                }

                //------------------------------


                return CreatedAtAction(nameof(Get), new { id = newVendorOrder.Id }, newVendorOrder);
            }
            catch (Exception ex)
            {
                return CreatedAtAction(nameof(Get), new { id = -1 }, null);
            }
        }


        //[HttpPost("SendToVendor/{vendorId}")]
        [HttpPost("VendorQuantity")]
        public ActionResult<Models.VendorOrder> VendorQuantity(Models.VendorOrder order)
        {
            int rc = 0;
            try
            {
                //var items = ctx.OrderItems.Where(x => x.VendorOrderId == order.Id);

                foreach(var it in ctx.OrderItems.Where(x => x.VendorOrderId == order.Id))
                {
                    var item = order.Items.FirstOrDefault(x => x.Id==it.Id);
                    if (item != null)
                    {
                        it.VendorQuantity = item.VendorQuantity;
                        rc++;
                    }
                }
                ctx.SaveChanges();

                return CreatedAtAction(nameof(Get), new { id = order.Id }, rc);
            }
            catch (Exception ex)
            {
                return CreatedAtAction(nameof(Get), new { id = -1 }, null);
            }
        }


        [HttpPost("Details")]
        public ActionResult<Models.VendorOrder> Details(Models.VendorOrder order)
        {
            int rc = 0;
            try
            {
                //var items = ctx.OrderItems.Where(x => x.VendorOrderId == order.Id);

                foreach (var it in ctx.OrderItems.Where(x => x.VendorOrderId == order.Id))
                {
                    var item = order.Items.FirstOrDefault(x => x.Id == it.Id);
                    if (item != null)
                    {
                        it.Details = item.Details;
                        rc++;
                    }
                }
                ctx.SaveChanges();

                return CreatedAtAction(nameof(Get), new { id = order.Id }, rc);
            }
            catch (Exception ex)
            {
                return CreatedAtAction(nameof(Get), new { id = -1 }, null);
            }
        }

    }

}
