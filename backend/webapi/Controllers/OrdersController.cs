﻿using AutoMapper;
using chiffon_back.Code;
using chiffon_back.Models;
using Microsoft.AspNetCore.Authorization;
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
    public class OrdersController : ControllerBase
    {
        private MapperConfiguration config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<Models.Order, Context.Order>();
                cfg.CreateMap<Context.Order, Models.Order>();
                cfg.CreateMap<Models.OrderItem, Context.OrderItem>();
                cfg.CreateMap<Context.OrderItem, Models.OrderItem>();
            });

        private readonly chiffon_back.Context.ChiffonDbContext ctx = Code.ContextHelper.ChiffonContext();

        private IConfiguration _configuration;

        private readonly ILogger<OrdersController> _logger;

        private readonly IWebHostEnvironment _webHostEnvironment;

        public OrdersController(ILogger<OrdersController> logger, IConfiguration configuration, IWebHostEnvironment webHostEnvironment)
        {
            _logger = logger;
            _configuration = configuration;
            _webHostEnvironment = webHostEnvironment;
        }

        [HttpGet(Name = "Orders")]
        public IEnumerable<Models.Order> Get()
        {
            List<Models.Order> orders =
                ctx.Orders.OrderByDescending(x => x.Created)
                .Select(x =>
                    config.CreateMapper()
                        .Map<Models.Order>(x))
                .ToList();

            foreach (var o in orders) {
                var items = from oi in ctx.OrderItems.Where(x => x.OrderId == o.Id)
                            join p in ctx.Products on oi.ProductId equals p.Id into jointable
                            from j in jointable.DefaultIfEmpty()
                            join v in ctx.Vendors on j.VendorId equals v.Id into joinvendors
                            from jv in joinvendors.DefaultIfEmpty()
                            select new { oi, j, jv };
                
                List<Models.OrderItem> orderItems = new List<Models.OrderItem>();
                foreach (var item in items) {
                    Models.OrderItem orderItem = new Models.OrderItem()
                    {
                        OrderId = o.Id,
                        ProductId = item.oi.ProductId,
                        Id = item.oi.Id,
                        ArtNo = item.j.ArtNo,
                        RefNo = item.j.RefNo,
                        ItemName = item.j.ItemName,
                        Composition = item.j.Composition,
                        Design = item.j.Design,
                        Price = item.oi.Price,
                        Quantity = item.oi.Quantity,
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
                from o in ctx.Orders
                join oi in ctx.OrderItems on o.Id equals oi.OrderId into jointable
                from j in jointable.DefaultIfEmpty()
                join p in ctx.Products on j.ProductId equals p.Id into jointable1
                from j1 in jointable1.DefaultIfEmpty()
                select new { Order = o, v = j == null ? 0 : j.Quantity, j1.ItemName, j1.ArtNo, j1.RefNo, j1.Design, j1.Price }; */
            return orders.AsEnumerable();
        }

        [HttpGet("{id}")]
        //public Models.Product? Product([FromQuery] string id)
        public Models.Order? GetOrder([FromQuery] string id)
        {
            Models.Order? order =
                ctx.Orders.Where(x => x.Id.ToString() == id)
                .Select(x =>
                    config.CreateMapper()
                        .Map<Models.Order>(x)).FirstOrDefault();

            var items = from oi in ctx.OrderItems.Where(x => x.OrderId == order.Id)
                        join p in ctx.Products on oi.ProductId equals p.Id into jointable
                        from j in jointable.DefaultIfEmpty()
                        select new { oi, j };

            List<Models.OrderItem> orderItems = new List<Models.OrderItem>();
            foreach (var item in items)
            {
                Models.OrderItem orderItem = new Models.OrderItem()
                {
                    OrderId = order.Id,
                    ProductId = item.oi.ProductId,
                    Id = item.oi.Id,
                    ArtNo = item.j.ArtNo,
                    RefNo = item.j.RefNo,
                    ItemName = item.j.ItemName,
                    Composition = item.j.Composition,
                    Design = item.j.Design,
                    Price = item.oi.Price,
                    Quantity = item.oi.Quantity
                };

                orderItems.Add(orderItem);
            }
            order.Items = orderItems.ToArray();

            /*var q =
                from o in ctx.Orders
                join oi in ctx.OrderItems on o.Id equals oi.OrderId into jointable
                from j in jointable.DefaultIfEmpty()
                join p in ctx.Products on j.ProductId equals p.Id into jointable1
                from j1 in jointable1.DefaultIfEmpty()
                select new { Order = o, v = j == null ? 0 : j.Quantity, j1.ItemName, j1.ArtNo, j1.RefNo, j1.Design, j1.Price }; */
            return order;
        }

        [HttpPost(Name = "Orders")]
        public ActionResult<Models.Order> Post(Models.Order order)
        {
            try
            {
                Context.Order newOrder = config.CreateMapper()
                    .Map<Context.Order>(order);
                newOrder.Created = DateTime.Now;
                newOrder.VendorId = 1;

                int? max = 0;
                try { 
                    max = ctx.Orders.Max(x => x.Number);
                    if (!max.HasValue)
                    max = 0;
                } catch (Exception ex)
                {
                    max = 0;
                }
                newOrder.Number = max.Value + 1;

                ctx.Orders.Add(newOrder);

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
                    $"<th style={label}><b>Design</b></th><th style={label}><b>Quantity</b></th>" + 
                    $"<th style={label}><b>Price (per 1 m.)</b></th></thead>";

                List<LinkedResource> linkedRes = new List<LinkedResource>();
                foreach(var item in order.Items)
                {
                    numItem++;
                    Context.OrderItem newItem = config.CreateMapper()
                        .Map<Context.OrderItem>(item);
                    
                    newItem.OrderId = newOrder.Id;

                    ctx.OrderItems.Add(newItem);

                    Context.Product? product = ctx.Products.FirstOrDefault(x => x.Id == newItem.ProductId);

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
                            + newItem.Quantity + $" m </td><td style={rightAlign}>" 
                            + String.Format("{0:0.0#}", item.Price) + " $</td></tr>";
                        linkedRes.Add(LinkedImg);

                        if (item.Price != null && newItem.Quantity != null)
                            total += item.Price.Value  * newItem.Quantity.Value;
                    }
                }
                itemsBody += "</table>";

                ctx.SaveChanges();

                //------------------------------mail
                using (MailMessage mess = new MailMessage())
                {
                    string? frontendUrl = _configuration.GetValue<string>("Url:Frontend");
                    string? ordersManager = _configuration.GetValue<string>("Orders:Manager");

                    string body = $"<p style={header}>Dear {newOrder.ClientName}!</p><p style={header}>You have successfully created a new order with number " + newOrder.Number + "</p>";
                    body += "<table cellspacing=2>";
                    body += $"<tr><td style={label}>Your order number:</td><td>{newOrder.Number}</tr></td>";
                    body += $"<tr><td style={label}>Order date:</td><td>{newOrder.Created}</tr></td>";
                    body += $"<tr><td style={label}>Client name:</td><td>{newOrder.ClientName}</tr></td>";
                    body += $"<tr><td style={label}>Client phone:</td><td>{newOrder.ClientPhone}</tr></td>";
                    body += $"<tr><td style={label}>Client email:</td><td>{newOrder.ClientEmail}</tr></td>";
                    body += $"<tr><td style={label}>Delivery address:</td><td>{newOrder.ClientAddress}</td></tr></table>";
                    body += $"<p style={headerBlack}>Your order composition:</p>{itemsBody}";
                    body += $"<p><b>Total price: {total} $</b></p>";
                    body += $"<p>Your order link <a href='{frontendUrl}/orders/{newOrder.Id}'>here</a> </p>";
                    body += $"<p style={header}>Best regards, textile company Angelika</p>";
                    body += $"<p style={headerBlack}>Our contacts:</p>";
                    body += "<p>Showroom address:<br/>Yaroslavskoe shosse, possession 1 building 1, Mytishchi, Moscow region, Russia.<br/>Postal code: 141009<br/>Phones: +7(926)018-01-25, +7(916)876-20-08";
                    body += "<p>Headquarters:<br/>Bolshaya Gruzinskaya, 20, 3A/P Moscow, Russia.<br/>Postal code: 123242</p>";

                    AlternateView AV = AlternateView.CreateAlternateViewFromString(body, null, MediaTypeNames.Text.Html);
                    foreach(LinkedResource res in linkedRes)
                        AV.LinkedResources.Add(res);

                    SmtpClient client = new SmtpClient("smtp.mail.ru", Convert.ToInt32(587))
                    {
                        Credentials = new NetworkCredential("elizarov.sa@mail.ru", "KZswYNWrd9eY1xVfvkre"),
                        EnableSsl = true,
                        DeliveryMethod = SmtpDeliveryMethod.Network,
                        Timeout = 5000
                    };
                    
                    mess.From = new MailAddress("elizarov.sa@mail.ru");
                    mess.To.Add(new MailAddress(newOrder.ClientEmail));
                    mess.To.Add(new MailAddress(ordersManager));
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


                return CreatedAtAction(nameof(Get), new { id = newOrder.Id }, newOrder);
            }
            catch (Exception ex)
            {
                return CreatedAtAction(nameof(Get), new { id = -1 }, null);
            }
        }
    }
}