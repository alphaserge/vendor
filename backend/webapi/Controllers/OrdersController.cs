using AutoMapper;
using chiffon_back.Code;
using chiffon_back.Context;
using chiffon_back.Models;
using DocumentFormat.OpenXml.Vml;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Http.HttpResults;


//using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Data;
using System.IO;
using System.Net;
using System.Net.Mail;
using System.Net.Mime;
using System.Reflection.PortableExecutable;
using System.Security.Cryptography;
using System.Text;
using System.Web;
//using System.Web.Http;
using System.Web.Http.Cors; // пространство имен CORS

namespace chiffon_back.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [EnableCors(origins: "http://185.40.31.18:3000,http://185.40.31.18:3010", headers: "*", methods: "*")]

    public class OrdersFilter
    {
        public string type { get; set; }
        public string value { get; set; }
        public string id { get; set; }
    }

    public class OrdersController : ControllerBase
    {
        private MapperConfiguration config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<Models.Order, Context.Order>();
                cfg.CreateMap<Context.Order, Models.Order>();
                cfg.CreateMap<Models.OrderItem, Context.OrderItem>();
                cfg.CreateMap<Context.OrderItem, Models.OrderItem>();
                cfg.CreateMap<Models.Vendor, Context.Vendor>();
                cfg.CreateMap<Context.Vendor, Models.Vendor>();
                cfg.CreateMap<Models.Payment, Context.Payment>();
                cfg.CreateMap<Context.Payment, Models.Payment>();
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

        [HttpGet("Order")]
        public Models.Order Order([FromQuery] string id)
        {
            try
            {
                //var user = ctx.Users.FirstOrDefault(x => x.Id.ToString() == id);
                //int? vendorId = user != null ? user.VendorId : 0;
                //if (vendorId <= 0) vendorId = 1;
                //if (vendorId < 0) vendorId = 0;

                Models.Order o = config.CreateMapper().Map<Models.Order>(ctx.Orders.FirstOrDefault(x => x.Id.ToString() == id));

                var items = from oi in ctx.OrderItems.Where(x => x.OrderId == o.Id)
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
                        OrderId = o.Id,
                        ProductId = item.oi.ProductId,
                        Id = item.oi.Id,
                        ArtNo = item.j.ArtNo,
                        RefNo = item.j.RefNo,
                        ItemName = item.j.ItemName,
                        //Composition = item.j.Composition,
                        Design = item.j.Design,
                        Price = item.oi.Price,
                        Quantity = item.oi.Quantity,
                        VendorId = item.j.VendorId,
                        VendorName = item.jv.VendorName,
                        StockId = item.oi.StockId,
                        StockName = ctx.Stocks.FirstOrDefault(x => x.Id == item.oi.StockId)?.StockName,
                        Delivered = item.oi.Delivered,
                        DeliveryCompany = item.oi.DeliveryCompany,
                        DeliveryNo = item.oi.DeliveryNo,
                        Shipped = item.oi.Shipped,
                        Details = item.oi.Details,
                        //Paid= item.oi.pa,
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

                return o;
            }
            catch (Exception ex)
            {
                Console.WriteLine();
                Console.WriteLine("-----------------------------------------------------------");
                Console.WriteLine();
                Console.WriteLine(String.Format("{0:dd.MM.yyyy HH:mm:ss} OrdersController/Order: {1}", DateTime.Now, ex.Message));
                Console.WriteLine(String.Format("{0:dd.MM.yyyy HH:mm:ss} OrdersController/Order: {1}", DateTime.Now, ex.InnerException != null ? ex.InnerException.Message : ""));
            }
            return new Models.Order();
        }

        [HttpGet("OrdersOld")]
        public IEnumerable<Models.Order> Get(string type, string value, string id)
        {
            bool save = false;
            foreach(var c in ctx.Currencies)
            {
                decimal course = Helper.GetCurrencyCourse(c.ShortName!.ToUpper(), DateTime.Now);
                if (course != c.Rate)
                {
                    c.Rate = course;
                    save = true;
                }
            }
            if (save)
            {
                ctx.SaveChanges();
            }

            DataTable dt = new DataTable();

            var mapper = config.CreateMapper();
            List <Models.Vendor> vendorList = ctx.Vendors.Select(x => mapper.Map<Models.Vendor>(x)).ToList();

            var ordersQuery = ctx.Orders.AsQueryable();

            if (!id.IsNullOrEmpty())
            {
                ordersQuery = ordersQuery.Where(x => x.Id.ToString() == id);
            }
            else
            {
                switch (type)
                {
                    case "client":
                        if (!value.IsNullOrEmpty())
                        {
                            ordersQuery = ordersQuery.Where(x => x.ClientEmail!.Trim().ToLower() == value.Trim().ToLower());
                        }
                        break;
                    case "vendor":
                        if (!value.IsNullOrEmpty())
                        {
                            ordersQuery = ordersQuery.Where(x => x.VendorId.ToString() == value);
                        }
                        break;

                }
            }

            List<Models.Order> orders = ordersQuery.OrderByDescending(x => x.Created)
                .Select(x => mapper.Map<Models.Order>(x))
                .ToList();

            foreach (var o in orders) {
                o.VendorName = ctx.Vendors.FirstOrDefault(x => x.Id == o.VendorId)?.VendorName;

                var payQuery = from p in ctx.Payments.Where(x => x.OrderId == o.Id)
                               join c in ctx.Currencies on p.CurrencyId equals c.Id into jointable
                               from j in jointable.DefaultIfEmpty()
                               select new { j, p };

                o.PaySumm = payQuery.Sum(x => x.j.Rate != null && x.j.Rate> 0m ? x.j.Rate * x.p.Amount : 0m);
                //o.PaySumm = ctx.Payments.Where(x => x.OrderId == o.Id).Sum(x => x.Amount); //TODO: Course!!!!

                var query = from oi in ctx.OrderItems.Where(x => x.OrderId == o.Id)
                            join p in ctx.Products on oi.ProductId equals p.Id into jointable
                            from j in jointable.DefaultIfEmpty()
                            join v in ctx.ColorVariants on oi.ColorVariantId equals v.Id into joincv
                            from cv in joincv.DefaultIfEmpty()
                            select new { oi, j, cv };

                var items = query.ToList();

                if (items.Count == 0) {
                    continue;
                }

                decimal total = 0m;
                List<Models.OrderItem> orderItems = new List<Models.OrderItem>();
                foreach (var item in items) {
                    if (item.oi.Quantity != null && item.oi.Price != null)
                    {
                        total += item.oi.Quantity.Value * item.oi.Price.Value;
                    }

                    Models.OrderItem orderItem = new Models.OrderItem()
                    {
                        OrderId = o.Id,
                        ProductId = item.oi.ProductId,
                        ColorVariantId = item.cv.Id,
                        Id = item.oi.Id,
                        ArtNo = item.j.ArtNo,
                        RefNo = item.j.RefNo,
                        ItemName = item.j.ItemName,
                        //Composition = item.j.Composition,
                        Design = item.j.Design,
                        Price = item.oi.Price,
                        Quantity = item.oi.Quantity,
                        Unit = item.oi.Unit,
                        Details = item.oi.Details,
                        Shipped = item.oi.Shipped,
                        Delivered = item.oi.Delivered,
                        DeliveryCompany = item.oi.DeliveryCompany,
                        DeliveryNo = item.oi.DeliveryNo,
                        ColorNo = item.oi.ColorNo,
                        ColorNames = item.oi.ColorNames,
                        StockId = item.oi.StockId,
                        StockName = ctx.Stocks.FirstOrDefault(x => x.Id == item.oi.StockId)?.StockName,
                        VendorId = item.j.VendorId,
                        VendorName = vendorList.FirstOrDefault(x=>x.Id==item.j.VendorId)?.VendorName,
                        //Paid = item.oi.Paid // (ctx.Payments.FirstOrDefault(x => x.Amount > 0m && x.What == "order" && x.WhatId == item.oi.OrderId)) != null,
                    };

                    string imagePath = string.Empty;
                    var imageFiles = DirectoryHelper.GetImageFiles(item.cv.Uuid!);
                    if (imageFiles.Count > 0)
                    {
                        orderItem.imagePath = imageFiles[0];
                    }
                    else
                    {
                        orderItem.imagePath = @"colors\nopicture.png";
                    }
                    orderItems.Add(orderItem);

                    if (!String.IsNullOrEmpty(item.oi.Details))
                    {
                        try
                        {
                            orderItem.Total = Convert.ToDecimal(dt.Compute(item.oi.Details, ""));
                        }
                        catch (Exception ex)
                        {

                        }
                    }

                }
                o.Total = total;
                o.Items = orderItems.ToArray();
            }

            return orders.AsEnumerable();
        }

        // method for Vendor managers
        [HttpGet("OrderItems")]
        public IEnumerable<Models.OrderItem> GetOrderItems([FromQuery] string vendorId)
        {
            DataTable dt = new DataTable();

            var query =
                from oi in ctx.OrderItems join p in ctx.Products//.Where(x=>x.VendorId.ToString()==vendorId) 
                    on oi.ProductId equals p.Id into jointable
                    from j in jointable.DefaultIfEmpty()
                    orderby oi.OrderId, j.ItemName
                    select new { oi, j};

            var items = query.ToList();

            bool acceptAllOrders = ctx.Vendors.FirstOrDefault(x => x.Id.ToString() == vendorId)?.VendorType == "owner";

            List<Models.OrderItem> orderItems = new List<Models.OrderItem>();
            foreach (var item in items)
            {
                if (!acceptAllOrders && item.j.VendorId.ToString() != vendorId)
                {
                    continue;
                }

                var order = ctx.Orders.FirstOrDefault(x => x.Id == item.oi.OrderId);
                var payQuery = from p in ctx.Payments.Where(x => x.OrderId == item.oi.OrderId)
                               join c in ctx.Currencies on p.CurrencyId equals c.Id into jointable
                               from j in jointable.DefaultIfEmpty()
                               select new { j, p };
                decimal? paySumm = payQuery.Sum(x => x.j.Rate != null && x.j.Rate > 0m ? x.j.Rate * x.p.Amount : 0m);
                decimal? totalSumm = ctx.OrderItems.Where(x => x.OrderId == item.oi.OrderId).Sum(x => x.Quantity* x.Price);

                Models.OrderItem orderItem = new Models.OrderItem()
                {
                    OrderId = item.oi.OrderId,
                    ProductId = item.oi.ProductId,
                    Id = item.oi.Id,
                    ArtNo = item.j.ArtNo,
                    RefNo = item.j.RefNo,
                    ItemName = item.j.ItemName,
                    //Composition = item.j.Composition,
                    Design = item.j.Design,
                    Price = item.oi.Price,
                    Quantity = item.oi.Quantity,
                    Unit = item.oi.Unit,
                    Details = item.oi.Details,
                    Shipped = item.oi.Shipped,
                    Delivered = item.oi.Delivered,
                    DeliveryCompany = item.oi.DeliveryCompany,
                    DeliveryNo = item.oi.DeliveryNo,
                    ColorNo = item.oi.ColorNo,
                    ColorNames = item.oi.ColorNames,
                    StockId = item.oi.StockId,
                    StockName = ctx.Stocks.FirstOrDefault(x => x.Id == item.oi.StockId)?.StockName,
                    VendorId = item.j.VendorId,
                    VendorName = ctx.Vendors.FirstOrDefault(x=>x.Id==item.j.VendorId)?.VendorName,
                    Paid = paySumm != null && totalSumm != null && paySumm >= totalSumm // ctx.Payments.FirstOrDefault(x=>x.Amount>0m && x.What=="order" && x.WhatId==item.oi.OrderId) != null
                };

                string imagePath = @"colors\nopicture.png";
                if (item.oi.ColorVariantId != null && item.oi.ColorVariantId != -1)
                {
                    Context.ColorVariant? cv = ctx.ColorVariants.FirstOrDefault(x => x.Id == item.oi.ColorVariantId);
                    if (cv != null)
                    {
                        var imageFiles = DirectoryHelper.GetImageFiles(cv.Uuid!);
                        if (imageFiles.Count > 0)
                        {
                            imagePath = imageFiles[0];
                        }
                    }
                }
                else
                {
                    var product = ctx.Products.FirstOrDefault(x => x.Id == item.j.Id);
                    if (product != null)
                    {
                        string[] uuids = PhotoHelper.GetPhotoUuids(product.PhotoUuids);
                        if (uuids.Length > 0)
                        {
                            var imageFiles = DirectoryHelper.GetImageFiles(uuids[0]);
                            imagePath = imageFiles[0];
                        }
                    }
                }

                if (!String.IsNullOrEmpty(item.oi.Details))
                {
                    try
                    {
                        orderItem.Total = Convert.ToDecimal(dt.Compute(item.oi.Details, ""));
                    } 
                    catch (Exception ex)
                    {

                    }
                }

                orderItem.imagePath = imagePath;
                orderItems.Add(orderItem);
            }

            return orderItems.AsEnumerable();
        }

        // method for Angelika managers
        [HttpGet("Orders")]
        public IEnumerable<Models.Order> GetOrders()
        {
            DataTable dt = new DataTable();

            bool save = false;
            decimal courseUsd = Helper.GetCurrencyCourse("USD", DateTime.Now);
            // todo decimal courseEur = Helper.GetCurrencyCourse("USD", DateTime.Now);

            var curr = ctx.Currencies.FirstOrDefault(x => x.ShortName!.ToUpper() == "RUR");
            if (courseUsd != curr!.Rate)
            { 
                curr.Rate = courseUsd;
                ctx.SaveChanges();
            }

            var ordersQuery = from o in ctx.Orders orderby o.Id descending select o;

            List<Models.Order> orders = new List<Models.Order>();

            foreach (var o in ordersQuery.ToList()) {
                var query =
                    from oi in ctx.OrderItems.Where(x => x.OrderId == o.Id)
                    join p in ctx.Products on oi.ProductId equals p.Id into jointable
                    from j in jointable.DefaultIfEmpty()
                    orderby oi.OrderId, j.ItemName
                    select new { oi, j };

                Models.Order order = new Models.Order();
                order.Id = o.Id;
                order.Created = o.Created;
                order.ClientAddress = o.ClientAddress;
                order.ClientPhone = o.ClientPhone;
                order.Number = o.Number;
                order.ClientEmail = o.ClientEmail;
                order.ClientName = o.ClientName;
                order.Uuid = o.Uuid;
                //order.PaySumm = ctx.Payments.Where(x => x.OrderId == o.Id).Sum(x => x.Amount);

                var payQuery = from p in ctx.Payments.Where(x => x.OrderId == o.Id)
                               join c in ctx.Currencies on p.CurrencyId equals c.Id into jointable
                               from j in jointable.DefaultIfEmpty()
                               select new { j, p };
                decimal? paySumm = payQuery.Sum(x => x.j.Rate != null && x.j.Rate > 0m ? x.p.Amount / x.j.Rate : 0m);
                if (paySumm != null)
                {
                    order.PaySumm = Math.Round(paySumm.Value, 2);
                }

                var mapper = config.CreateMapper();
                order.Payments = ctx.Payments.Where(x => x.OrderId == o.Id).Select(x => 
                new Models.Payment
                {
                    OrderId = x.OrderId,
                    CurrencyId = x.CurrencyId,
                    Amount = Math.Round(x.Amount, 2),
                    Date = x.Date,
                    Currency = ctx.Currencies.FirstOrDefault(c=>c.Id==x.CurrencyId).ShortName
                }).ToArray();

                decimal total = 0m;
                List<Models.OrderItem> orderItems = new List<Models.OrderItem>();
                foreach (var item in query.ToList())
                {
                    if (item.oi.Quantity != null && item.oi.Price != null)
                    {
                        total += item.oi.Quantity.Value * item.oi.Price.Value;
                    }
                    Models.OrderItem orderItem = new Models.OrderItem()
                    {
                        OrderId = item.oi.OrderId,
                        ProductId = item.oi.ProductId,
                        Id = item.oi.Id,
                        ArtNo = item.j.ArtNo,
                        RefNo = item.j.RefNo,
                        ItemName = item.j.ItemName,
                        //Composition = item.j.Composition,
                        Design = item.j.Design,
                        Price = item.oi.Price,
                        Quantity = item.oi.Quantity,
                        Unit = item.oi.Unit,
                        Details = item.oi.Details,
                        Shipped = item.oi.Shipped,
                        Delivered = item.oi.Delivered,
                        DeliveryCompany = item.oi.DeliveryCompany,
                        DeliveryNo = item.oi.DeliveryNo,
                        ColorNo = item.oi.ColorNo,
                        ColorNames = item.oi.ColorNames,
                        StockId = item.oi.StockId,
                        StockName = ctx.Stocks.FirstOrDefault(x => x.Id == item.oi.StockId)?.StockName,
                        VendorId = item.j.VendorId,
                        VendorName = ctx.Vendors.FirstOrDefault(x => x.Id == item.j.VendorId)?.VendorName,
                    };

                    string imagePath = @"colors\nopicture.png";
                    if (item.oi.ColorVariantId != null && item.oi.ColorVariantId != -1)
                    {
                        Context.ColorVariant? cv = ctx.ColorVariants.FirstOrDefault(x => x.Id == item.oi.ColorVariantId);
                        if (cv != null)
                        {
                            var imageFiles = DirectoryHelper.GetImageFiles(cv.Uuid!);
                            if (imageFiles.Count > 0)
                            {
                                imagePath = imageFiles[0];
                            }
                        }
                    } else
                    {
                        var product = ctx.Products.FirstOrDefault(x => x.Id == item.j.Id);
                        if (product != null)
                        {
                            string[] uuids = PhotoHelper.GetPhotoUuids(product.PhotoUuids);
                            if (uuids.Length > 0)
                            {
                                var imageFiles = DirectoryHelper.GetImageFiles(uuids[0]);
                                imagePath = imageFiles[0];
                            }
                        }
                    }

                    /* if (String.IsNullOrEmpty(imagePath))
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
                     }*/

                    if (!String.IsNullOrEmpty(item.oi.Details))
                    {
                        try
                        {
                            orderItem.Total = Convert.ToDecimal(dt.Compute(item.oi.Details, ""));
                        }
                        catch (Exception ex)
                        {

                        }
                    }

                    orderItem.imagePath = imagePath;
                    orderItems.Add(orderItem);
                }
                order.Total = total;
                order.Items = orderItems.ToArray();
                orders.Add(order);
            }
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

            if (order == null)
                return null;

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
                    //Composition = item.j.Composition,
                    Design = item.j.Design,
                    Price = item.oi.Price,
                    Quantity = item.oi.Quantity,
                    Details = item.oi.Details,
                    Shipped = item.oi.Shipped,
                    Delivered = item.oi.Delivered,
                    DeliveryCompany = item.oi.DeliveryCompany,
                    DeliveryNo = item.oi.DeliveryNo,
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

        [HttpPost("Create")]
        public ActionResult<Models.Order> Post([FromBody]Models.Order order)
        {
            try
            {
                string informPassword = "";

                // create user first if not exists
                string[] names = Helper.ParseFirstLastName(order.ClientName!.Trim());
                var user = ctx.Users.FirstOrDefault(x => x.Email!.Trim().ToLower() == order.ClientEmail!.Trim().ToLower());
                if (user == null)
                {
                    user = new Context.User()
                    {
                        Created = DateTime.Now,
                        PasswordHash = order.Hash.ToString(),
                        Email = order.ClientEmail!.Trim().ToLower(),
                        FirstName = names[0],
                        LastName = names[1],
                        Phones = order.ClientPhone!.Trim(),
                        VendorId = 1,
                        RegistrationHash = Helper.CreateHash(),
                        IsLocked = false
                    };
                    ctx.Users.Add(user);
                    ctx.SaveChanges();
                    informPassword = order.Password;
                    Console.WriteLine("Orders(post): User saved");
                }

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
                    $"<th style={label}><b>Design/Color</b></th><th style={label}><b>Quantity</b></th>" + 
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
                        Context.ColorVariant cv = ctx.ColorVariants.FirstOrDefault(x => x.Id == item.ColorVariantId);

                        if (cv != null)
                        {
                            var imageFiles = DirectoryHelper.GetImageFiles(cv?.Uuid!);
                            if (imageFiles.Count > 0)
                            {
                                img = imageFiles[0];
                            }
                        } 
                        else
                        {
                            string[] uuids = PhotoHelper.GetPhotoUuids(product.PhotoUuids);
                            {
                                if (uuids.Length > 0)
                                {
                                    var imageFiles = DirectoryHelper.GetImageFiles(uuids[0]);
                                    img = imageFiles[0];
                                }
                            }
                        }

                        if (String.IsNullOrEmpty(img))
                        {
                            img = @"colors\nopicture.png";
                        }

                        string webRootPath = _webHostEnvironment.WebRootPath;
                        string contentRootPath = _webHostEnvironment.ContentRootPath;
                        string path = System.IO.Path.Combine(contentRootPath, img);
                        string mediaType = MediaTypeNames.Image.Jpeg;
                        switch (System.IO.Path.GetExtension(path).ToLower())
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
                            + product.Design + "<br/>" + item.ColorNames + $"</td><td style={rightAlign}>" 
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
                    string? frontendUrl = _configuration.GetValue<string>("Url:Website");
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
                    body += $"<p>Your order link <a href='{frontendUrl}/orders?id={newOrder.Id}'>here</a> </p>";
                    if (!informPassword.IsNullOrEmpty())
                    {
                        body += $"<p>Your email is login, the password is: {informPassword} </p>";
                    }

                    body += $"<p style={header}>Best regards, textile company Angelika</p>";
                    body += $"<p style={headerBlack}>Our contacts:</p>";
                    body += "<p>Showroom address:<br/>Yaroslavskoe shosse, possession 1 building 1, Mytishchi, Moscow region, Russia.<br/>Postal code: 141009<br/>Phones: +7(926)018-01-25, +7(916)876-20-08";
                    body += "<p>Headquarters:<br/>Bolshaya Gruzinskaya, 20, 3A/P Moscow, Russia.<br/>Postal code: 123242</p>";

                    AlternateView AV = AlternateView.CreateAlternateViewFromString(body, null, MediaTypeNames.Text.Html);
                    foreach(LinkedResource res in linkedRes)
                        AV.LinkedResources.Add(res);

                    SmtpClient client = new SmtpClient("smtp.mail.ru", Convert.ToInt32(587))
                    {
                        Credentials = new NetworkCredential("elizarov.sa@mail.ru", "5nwKmZ2SpintVmFRQVZV"), //"KZswYNWrd9eY1xVfvkre"),
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
                    Console.WriteLine("New order created and email was sended");
                }
                //------------------------------


                return CreatedAtAction(nameof(Get), new { id = newOrder.Id }, newOrder);
            }
            catch (Exception ex)
            {
                return CreatedAtAction(nameof(Get), new { id = -1 }, null);
            }
        }


        [HttpPost("Details")]
        public ActionResult<Models.Order> Details(Models.Order order)
        {
            int rc = 0;
            try
            {
                foreach (var it in ctx.OrderItems.Where(x => x.OrderId == order.Id))
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

        [HttpPost("ChangeDetails")]
        public ActionResult ChangeDetails([FromBody] Models.ChangeDetails cd)
        {
            try
            {
                Context.OrderItem oi = ctx.OrderItems.FirstOrDefault(x => x.Id == cd.Id);
                if (oi != null)
                {
                    oi.Details = cd.Details;
                    oi.DeliveryCompany = cd.DeliveryCompany;
                    oi.DeliveryNo = cd.DeliveryNo;
                    ctx.SaveChanges();
                }

                return Ok();// CreatedAtAction(nameof(Context.OrderItem), new { id = cd.Id }, "");
            }
            catch (Exception ex)
            {
                Console.WriteLine();
                Console.WriteLine("-----------------------------------------------------------");
                Console.WriteLine();
                Console.WriteLine(String.Format("{0:dd.MM.yyyy HH:mm:ss} OrdersController/ChangeDetails: {1}", DateTime.Now, ex.Message));
                Console.WriteLine(String.Format("{0:dd.MM.yyyy HH:mm:ss} OrdersController/ChangeDetails: {1}", DateTime.Now, ex.InnerException != null ? ex.InnerException.Message : ""));
                return CreatedAtAction(nameof(Context.OrderItem), new { id = -1 }, null);
            }
        }

        [HttpPost("DeliveryInfo")]
        public ActionResult DeliveryInfo([FromBody] Models.DeliveryInfo di)
        {
            throw new Exception("Not supported since 23/08/2025");

            try
            {
                Context.OrderItem oi = ctx.OrderItems.FirstOrDefault(x => x.Id == di.Id);
                if (oi != null)
                {
                    oi.DeliveryNo = di.DeliveryNo;
                    oi.DeliveryCompany = di.DeliveryCompany;
                    ctx.SaveChanges();
                }

                return CreatedAtAction(nameof(Context.OrderItem), new { id = di.Id }, "");
            }
            catch (Exception ex)
            {
                Console.WriteLine();
                Console.WriteLine("-----------------------------------------------------------");
                Console.WriteLine();
                Console.WriteLine(String.Format("{0:dd.MM.yyyy HH:mm:ss} OrdersController/DeliveryInfo: {1}", DateTime.Now, ex.Message));
                Console.WriteLine(String.Format("{0:dd.MM.yyyy HH:mm:ss} OrdersController/DeliveryInfo: {1}", DateTime.Now, ex.InnerException != null ? ex.InnerException.Message : ""));
                return CreatedAtAction(nameof(Context.OrderItem), new { id = -1 }, null);
            }
        }

        [HttpPost("Accept")]
        public ActionResult Accept([FromBody] OrderItemAccept acpt)
        {
            throw new Exception("Not supported now");

            try
            {
                Context.OrderItem oi = ctx.OrderItems.FirstOrDefault(x => x.Id == acpt.ItemId);
                if (oi != null)
                {
                    if (false && oi.Details.IsNullOrEmpty()) //!!!!!
                    {
                        oi.Details = $"{oi.Quantity} {oi.Unit.Replace("rolls", "r").Replace("meters","m")}";
                        var q = oi.Quantity;
                        var r = ctx.Products.FirstOrDefault(x=>x.Id==oi.ProductId).RollLength;
                        String details = "";
                        if (q != null && r != null)
                        {
                            Decimal n = Math.Floor(q.Value / r.Value);
                            if (n > 0)
                            {
                                details = String.Format("{0:0.##}", n) + "*" + String.Format("{0:0.##}", r);
                            }
                            q -= n * r;
                            details += "+" + String.Format("{0:0.##}", q);
                            oi.Details = details;
                        }
                        
                    }
                    ctx.SaveChanges();
                }

                return CreatedAtAction(nameof(Context.OrderItem), new { id = acpt.ItemId }, "");
            }
            catch (Exception ex)
            {
                Console.WriteLine();
                Console.WriteLine("-----------------------------------------------------------");
                Console.WriteLine();
                Console.WriteLine(String.Format("{0:dd.MM.yyyy HH:mm:ss} OrdersController/Accept: {1}", DateTime.Now, ex.Message));
                Console.WriteLine(String.Format("{0:dd.MM.yyyy HH:mm:ss} OrdersController/Accept: {1}", DateTime.Now, ex.InnerException != null ? ex.InnerException.Message : ""));
                return CreatedAtAction(nameof(Context.OrderItem), new { id = -1 }, null);
            }
        }

        [HttpPost("Confirm")]
        public ActionResult Confirm([FromBody] Models.ConfirmCode confirm)
        {
            string label = "'font-weight: normal; font-size: 100%; padding: 5px 12px;'";
            string cell = "'padding: 10px 20px;'";
            string rightAlign = "'text-align: right;padding: 10px 20px;'";
            string header = "'font-weight: #400; color: #66f;'";
            string headerBlack = "'font-weight: bold; color: #000;'";

            using (MailMessage mess = new MailMessage())
            {
                string? frontendUrl = _configuration.GetValue<string>("Url:Frontend");
                string? ordersManager = _configuration.GetValue<string>("Orders:Manager");

                string body = $"<p style={header}>Dear {confirm.ClientName}!</p><p style={header}>You order confirmation code is {confirm.Code}</p>";
                body += $"<p style={header}>Best regards, textile company Angelika</p>";
                body += $"<p style={headerBlack}>Our contacts:</p>";
                body += "<p>Showroom address:<br/>Yaroslavskoe shosse, possession 1 building 1, Mytishchi, Moscow region, Russia.<br/>Postal code: 141009<br/>Phones: +7(926)018-01-25, +7(916)876-20-08";
                body += "<p>Headquarters:<br/>Bolshaya Gruzinskaya, 20, 3A/P Moscow, Russia.<br/>Postal code: 123242</p>";

                SmtpClient client = new SmtpClient("smtp.mail.ru", Convert.ToInt32(587))
                {
                    Credentials = new NetworkCredential("elizarov.sa@mail.ru", "5nwKmZ2SpintVmFRQVZV"), //"KZswYNWrd9eY1xVfvkre"),
                    EnableSsl = true,
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    Timeout = 5000
                };

                mess.From = new MailAddress("elizarov.sa@mail.ru");
                mess.To.Add(new MailAddress(confirm.Email));
                mess.To.Add(new MailAddress(ordersManager));
                mess.Subject = "A new order confirmation code";
                mess.SubjectEncoding = Encoding.UTF8;

                //mess.Body = $"<h2>Hello, {mdUser.FirstName}!</h2><p>You received this letter because this address was used when creating an account on the Anzhelika company website</p><p>To complete your account creation, click <a href='{frontendUrl}/confirm?token={hash}'>this link</a></p>";
                // !! to do - add link to order !!
                mess.Body = body;
                //mess.AlternateViews.Add(AV);
                mess.IsBodyHtml = true;
                /* try
                {
                    mess.Attachments.Add(new Attachment(какой файл добавлять для отправки));
                }
                catch { } */
                client.Send(mess);
                mess.Dispose();
                client.Dispose();
                Console.WriteLine("A new order confirmation email was sended");

                return Ok(new { email = confirm.Email });
            }
        }

        [HttpGet("ClientOrdersShort")]
        public IEnumerable<Models.ClientOrderShort> ClientOrdersShort([FromQuery] string email)
        {
            var filteredOrders = from o in ctx.Orders.Where(x => x.ClientEmail != null &&
                              x.ClientEmail.Trim().ToLower() == email.Trim().ToLower()).OrderByDescending(x => x.Created) select o;

            List<Models.ClientOrderShort> orders = new List<ClientOrderShort>();
            foreach (var o in filteredOrders.ToList())
            {
                var query = from oi in ctx.OrderItems.Where(x => x.OrderId == o.Id)
                            join vv in ctx.ColorVariants on oi.ColorVariantId equals vv.Id into color_variants
                            from cv in color_variants.DefaultIfEmpty()
                            select new { oi, cv };
                ClientOrderShort order = new ClientOrderShort()
                {
                    Id = o.Id,
                    Created = o.Created,
                    ClientName = o.ClientName,
                    Number = o.Number,

                };

                List<string> names = new List<string>();
                List<string> images = new List<string>();
                foreach (var q in query.ToList())
                {
                    var imageFiles = DirectoryHelper.GetImageFiles(q.cv.Uuid!);
                    if (imageFiles.Count > 0)
                    {
                        images.Add(imageFiles[0]);
                        //
                    }
                }
                order.Images = images.ToArray();
                orders.Add(order);
            }

            return orders.AsEnumerable();
        }

        [HttpPost("SendInvoice")]
        public string SendInvoice([FromBody]Models.Invoice inv)
        {
            int rc = 0;
            try
            {
                //Invoice inv = new Invoice();
                //string fileName = "invoice1.docx";
                //string language = "Russian";
                string path = String.Format(@"files");
                //img = @"colors\nopicture.png";
                string fileName = String.Format("invoice_{0}.docx", inv.Number != null ? inv.Number.Value : "nonumber");
                string contentRootPath = _webHostEnvironment.ContentRootPath;
                path = System.IO.Path.Combine(contentRootPath, "files");
                new InvoiceReports().CreateInvoice(inv, path, fileName, "Russian");
                /*foreach (var it in ctx.OrderItems.Where(x => x.OrderId == order.Id))
                {
                    var item = order.Items.FirstOrDefault(x => x.Id == it.Id);
                    if (item != null)
                    {
                        it.Details = item.Details;
                        rc++;
                    }
                }
                ctx.SaveChanges();*/

                //var message = new { FileName = Path.Combine(path, fileName) };
                //return new OkObjectResult(message);
                return System.IO.Path.Combine(@"files", fileName);
            }
            catch (Exception ex)
            {
                return "error"; //BadRequest(ex.Message);
            }
        }


    }
}
