using AutoMapper;
using chiffon_back.Code;
using chiffon_back.Context;
using chiffon_back.Models;
using DocumentFormat.OpenXml.Drawing.Charts;
using DocumentFormat.OpenXml.Office2010.Excel;
using DocumentFormat.OpenXml.Vml;
using DocumentFormat.OpenXml.Wordprocessing;



//using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Data;
using System.Net;
using System.Net.Mail;
using System.Net.Mime;
using System.Text;
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
                cfg.CreateMap<Models.OrderPost, Context.Order>();
                cfg.CreateMap<Context.Order, Models.OrderPost>();
                cfg.CreateMap<Models.OrderItemPost, Context.OrderItem>();
                cfg.CreateMap<Context.OrderItem, Models.OrderItemPost>();
                cfg.CreateMap<Models.OrderItem, Context.OrderItem>();
                cfg.CreateMap<Context.OrderItem, Models.OrderItem>();
                cfg.CreateMap<Models.ClientOrder, Context.Order>();
                cfg.CreateMap<Context.Order, Models.ClientOrder>();
                cfg.CreateMap<Models.ClientOrderItem, Context.OrderItem>();
                cfg.CreateMap<Context.OrderItem, Models.ClientOrderItem>();
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
        public Models.Order Order([FromQuery] string uuid)
        {
            System.Data.DataTable dt = new System.Data.DataTable();
            try
            {
                //var user = ctx.Users.FirstOrDefault(x => x.Id.ToString() == id);
                //int? vendorId = user != null ? user.VendorId : 0;
                //if (vendorId <= 0) vendorId = 1;
                //if (vendorId < 0) vendorId = 0;

                Models.Order o = config.CreateMapper().Map<Models.Order>(ctx.Orders.FirstOrDefault(x => x.Uuid == uuid));

                var items = (from oi in ctx.OrderItems.Where(x => x.OrderId == o.Id)
                            join p in ctx.Products on oi.ProductId equals p.Id into jointable
                            from j in jointable.DefaultIfEmpty()
                            join v in ctx.Vendors on j.VendorId equals v.Id into joinvendors
                            from jv in joinvendors.DefaultIfEmpty()
                            select new { oi, j, jv }).ToList();

                decimal summ = 0m;
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
                        ColorNo = item.oi.ColorNo,
                        ColorNames = item.oi.ColorNames,
                        //Composition = item.j.Composition,
                        Design = item.j.Design,
                        Price = item.oi.Price,
                        Quantity = item.oi.Quantity,
                        Unit = item.oi.Unit,
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
                        foreach (string photoUuid in PhotoHelper.GetPhotoUuids(item.j.PhotoUuids))
                        {
                            var imageFiles = DirectoryHelper.GetImageFiles(photoUuid);
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

                    object obj = dt.Compute(orderItem.Details, "");
                    orderItem.Total = !obj.Equals(System.DBNull.Value) ? Convert.ToDecimal(obj) : 0m;
                    orderItem.imagePath = imagePath;
                    orderItems.Add(orderItem);
                    summ += (orderItem.Total != 0m ? orderItem.Total : orderItem.Quantity)*orderItem.Price;
                }

                o.Items = orderItems.ToArray();
                o.Total = summ;

                o.Payments = ctx.Payments
                    .Where(x => x.OrderId == Convert.ToInt32(o.Id))
                    .Select(x => config.CreateMapper().Map<Models.Payment>(x)).ToArray();

                foreach (Models.Payment p in o.Payments)
                {
                    p.Currency = ctx.Currencies.FirstOrDefault(c => c.Id == p.CurrencyId).ShortName;
                }
                o.TotalPaid = o.Payments.Sum(x => x.Amount);

                return o;
            }
            catch (Exception ex)
            {
                Log("Order", ex);
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
                if (course > 0 && course != c.Rate)
                {
                    c.Rate = course;
                    save = true;
                }
            }
            if (save)
            {
                ctx.SaveChanges();
            }

            System.Data.DataTable dt = new System.Data.DataTable();

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
                    
                    total += item.oi.Quantity * item.oi.Price;

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
        [HttpGet("VendorOrderItems")]
        public IEnumerable<Models.OrderItem> GetVendorOrderItems([FromQuery] string vendorId)
        {
            System.Data.DataTable dt = new System.Data.DataTable();

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

                var payQuery = ctx.Payments.Where(x => x.OrderId == item.oi.OrderId);
                decimal? paySumm = payQuery.Sum(x => x.Amount != null ? x.Amount : 0m);
                decimal? totalSumm = 0m;
                foreach (var oi in ctx.OrderItems.Where(x => x.OrderId == item.oi.OrderId))
                {
                    decimal t = 0m;
                    if (!String.IsNullOrEmpty(item.oi.Details))
                    {
                        try
                        {
                            t = Convert.ToDecimal(dt.Compute(item.oi.Details, ""));
                        }
                        catch (Exception ex)
                        {

                        }
                    } else
                    {
                        t = oi.Quantity;
                    }

                    totalSumm += t * oi.Price;
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
                    ClientDeliveryCompany = item.oi.ClientDeliveryCompany,
                    ClientDeliveryNo = item.oi.ClientDeliveryNo,
                    ColorNo = item.oi.ColorNo,
                    ColorNames = item.oi.ColorNames,
                    StockId = item.oi.StockId,
                    StockName = ctx.Stocks.FirstOrDefault(x => x.Id == item.oi.StockId)?.StockName,
                    VendorId = item.j.VendorId,
                    VendorName = ctx.Vendors.FirstOrDefault(x=>x.Id==item.j.VendorId)?.VendorName,
                    PaidShare = paySumm != null && totalSumm > 0m ? paySumm / totalSumm : 0m,
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

                /*orderItem.Total = 0m;
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

                totalSumm = orderItem.Total * orderItem.Price;
                orderItem.PaidShare = paySumm != null && totalSumm > 0m ? paySumm / totalSumm : 0m;*/

                orderItem.imagePath = imagePath;
                orderItems.Add(orderItem);
            }

            return orderItems.AsEnumerable();
        }

        // method for Angelika managers
        [HttpGet("Orders")]
        public IEnumerable<Models.Order> GetOrders()
        {
            System.Data.DataTable dt = new System.Data.DataTable();

            bool save = false;
            /*decimal courseUsd = Helper.GetCurrencyCourse("USD", DateTime.Now);
            // todo decimal courseEur = Helper.GetCurrencyCourse("USD", DateTime.Now);

            if (courseUsd < 0)
            {
                var curr = ctx.Currencies.FirstOrDefault(x => x.ShortName!.ToUpper() == "RUR");
                if (curr != null && curr.Rate != null)
                {
                    courseUsd = curr.Rate.Value;
                }
            }
            else
            {
                var curr = ctx.Currencies.FirstOrDefault(x => x.ShortName!.ToUpper() == "RUR");
                if (courseUsd != curr!.Rate)
                {
                    curr.Rate = courseUsd;
                    ctx.SaveChanges();
                }
            }*/

            var ordersQuery = from o in ctx.Orders where o.IsSamples != true orderby o.Id descending select o;

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
                order.PaySumm = ctx.Payments.Where(x => x.OrderId == o.Id).Sum(x => x.Amount);


                decimal total = 0m;
                List<Models.OrderItem> orderItems = new List<Models.OrderItem>();
                foreach (var item in query.ToList())
                {
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
                        ClientDeliveryCompany = item.oi.ClientDeliveryCompany,
                        ClientDeliveryNo = item.oi.ClientDeliveryNo,
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

                    orderItem.Total = 0m;
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
                    decimal? q = orderItem.Total > 0m ? orderItem.Total : item.oi.Quantity;
                    if (q != null)
                    {
                        total += q.Value * item.oi.Price;
                    }

                    orderItem.imagePath = imagePath;
                    orderItems.Add(orderItem);
                }
                order.Total = total;
                order.PaidLevel = total > 0m && order.PaySumm != null ? Math.Round(order.PaySumm.Value / total, 2) : 0m;
                order.Items = orderItems.ToArray();
                orders.Add(order);
            }
            return orders.AsEnumerable();
        }


        [HttpGet("ClientOrder")]
        public Models.ClientOrder GetClientOrder(string uuid)
        {
            Models.ClientOrder? order = ctx.Orders.Where(x => x.Uuid == uuid)
                .Select(x => config.CreateMapper().Map<Models.ClientOrder>(x)).FirstOrDefault();

            System.Data.DataTable dt = new System.Data.DataTable();

            var query =
                from oi in ctx.OrderItems.Where(x => x.OrderId == order.Id)
                join p in ctx.Products
                    on oi.ProductId equals p.Id into jointable
                from j in jointable.DefaultIfEmpty()
                orderby oi.OrderId, j.ItemName
                select new { oi, j };

            var items = query.ToList();

            foreach (var item in items)
            {
                decimal actualQuantity = String.IsNullOrWhiteSpace(item.oi.Details) ? item.oi.Quantity : Convert.ToDecimal(dt.Compute(item.oi.Details, ""));
                decimal totalCost = item.oi.Price * actualQuantity;

                Models.ClientOrderItem orderItem = new Models.ClientOrderItem()
                {
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
                    ClientDeliveryCompany = item.oi.ClientDeliveryCompany,
                    ClientDeliveryNo = item.oi.ClientDeliveryNo,
                    ColorNo = item.oi.ColorNo,
                    ColorNames = item.oi.ColorNames,
                    StockId = item.oi.StockId,
                    StockName = ctx.Stocks.FirstOrDefault(x => x.Id == item.oi.StockId)?.StockName,
                    VendorId = item.j.VendorId,
                    VendorName = ctx.Vendors.FirstOrDefault(x => x.Id == item.j.VendorId)?.VendorName,
                    TotalCost = totalCost
                    //PaidShare = paySumm != null && totalSumm > 0m ? paySumm / totalSumm : 0m,
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

                orderItem.imagePath = imagePath;
                order.Items.Add(orderItem);
            }

            order.Payments = ctx.Payments
                .Where(x => x.OrderId == order.Id)
                .Select(x => config.CreateMapper().Map<Models.Payment>(x)).ToList();

            foreach (Models.Payment p in order.Payments)
            {
                p.Currency = ctx.Currencies.FirstOrDefault(c => c.Id == p.CurrencyId).ShortName;
            }

            decimal? paid = order.Payments.Sum(x => x.Amount);
            order.TotalPaid = paid != null ? paid.Value : 0m;

            return order;
        }

        [HttpGet("ClientOrders")]
        public IEnumerable<Models.ClientOrder> GetClientOrders(string email, bool isSamples)
        {
            var orders = (from o in ctx.Orders where o.ClientEmail == email && o.IsSamples == isSamples orderby o.Id descending select new Models.ClientOrder
            {
                Id = o.Id,
                Created = o.Created,
                ClientAddress = o.ClientAddress,
                ClientPhone = o.ClientPhone,
                Number = o.Number,
                ClientEmail = o.ClientEmail,
                ClientName = o.ClientName,
                Uuid = o.Uuid,
                Items = ctx.OrderItems
                    .Where(x => x.OrderId == o.Id)
                    .Select(i => new ClientOrderItem 
                     { 
                        Id = i.Id,
                        ProductId = i.ProductId,
                        Details = i.Details,
                        Price = i.Price,
                        Quantity = i.Quantity}).ToList()
            }).ToList();

            System.Data.DataTable dt = new System.Data.DataTable();
            foreach (var order in orders)
            {
                decimal total = 0;
                order.Photos = new List<string>();
                foreach (var oi in order.Items)
                {

                    decimal actualQuantity = String.IsNullOrWhiteSpace(oi.Details) ? oi.Quantity : Convert.ToDecimal(dt.Compute(oi.Details, ""));
                    total += oi.Price * actualQuantity;

                    string imagePath = @"colors\nopicture.png";
                    if (oi.ColorVariantId != null && oi.ColorVariantId != -1)
                    {
                        Context.ColorVariant? cv = ctx.ColorVariants.FirstOrDefault(x => x.Id == oi.ColorVariantId);
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
                        var product = ctx.Products.FirstOrDefault(x => x.Id == oi.ProductId);
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
                    order.Photos.Add(imagePath);

                }
                order.TotalCost = total;
            }

            return orders;
        }


        [HttpGet("OrderItems")]
        public IEnumerable<Models.ClientOrderItem> GetOrderItems([FromQuery] string orderId)
        {
            System.Data.DataTable dt = new System.Data.DataTable();

            var query =
                from oi in ctx.OrderItems.Where(x => x.OrderId.ToString() == orderId)
                join p in ctx.Products
                    on oi.ProductId equals p.Id into jointable
                from j in jointable.DefaultIfEmpty()
                orderby oi.OrderId, j.ItemName
                select new { oi, j };

            var items = query.ToList();

            List<Models.ClientOrderItem> orderItems = new List<Models.ClientOrderItem>();
            foreach (var item in items)
            {
                    decimal actualQuantity = String.IsNullOrWhiteSpace(item.oi.Details) ? item.oi.Quantity : Convert.ToDecimal(dt.Compute(item.oi.Details, ""));
                    decimal totalCost = item.oi.Price * actualQuantity;

                Models.ClientOrderItem orderItem = new Models.ClientOrderItem()
                {
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
                    ClientDeliveryCompany = item.oi.ClientDeliveryCompany,
                    ClientDeliveryNo = item.oi.ClientDeliveryNo,
                    ColorNo = item.oi.ColorNo,
                    ColorNames = item.oi.ColorNames,
                    StockId = item.oi.StockId,
                    StockName = ctx.Stocks.FirstOrDefault(x => x.Id == item.oi.StockId)?.StockName,
                    VendorId = item.j.VendorId,
                    VendorName = ctx.Vendors.FirstOrDefault(x => x.Id == item.j.VendorId)?.VendorName,
                    TotalCost = totalCost
                    //PaidShare = paySumm != null && totalSumm > 0m ? paySumm / totalSumm : 0m,
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

                orderItem.imagePath = imagePath;
                orderItems.Add(orderItem);
            }

            return orderItems.AsEnumerable();
        }

        // method for Angelika managers
        [HttpGet("OrderPayments")]
        public Models.OrderPayments? OrderPayments([FromQuery] int orderId)
        {
            System.Data.DataTable dt = new System.Data.DataTable();

            Models.OrderPayments orderPayments = new OrderPayments();

            Context.Order? order = ctx.Orders.FirstOrDefault(x => x.Id == orderId);

            if (order == null)
            {
                return null;
            }

            decimal total = 0m;
            foreach (var item in ctx.OrderItems.Where(x => x.OrderId == orderId))
            {
                if (item.Price != null)
                {
                    Decimal? amount = null;
                    if (!String.IsNullOrWhiteSpace(item.Details))
                    {
                        try
                        {
                            amount = Convert.ToDecimal(dt.Compute(item.Details, ""));
                        }
                        catch (Exception e) { }
                    }
                    if (amount == null)
                    {
                        amount = item.Quantity;
                    }
                    if (amount != null)
                    {
                        total += amount.Value * item.Price;
                    }
                }
            }

            orderPayments.Number = order.Number;
            orderPayments.Created = order.Created;
            orderPayments.Total = total;

            var mapper = config.CreateMapper();
            orderPayments.Items = ctx.Payments.Where(x => x.OrderId == orderId).Select(x =>
            new Models.Payment
            {
                OrderId = x.OrderId,
                CurrencyId = x.CurrencyId,
                Amount = Math.Round(x.Amount, 2),
                CurrencyAmount = Math.Round(x.CurrencyAmount, 2),
                Date = x.Date,
                Currency = ctx.Currencies.FirstOrDefault(c => c.Id == x.CurrencyId).ShortName
            }).ToArray();

            decimal paySumm = 0m;
            foreach (var p in orderPayments.Items)
            {
                paySumm += p.Amount;
            }
            orderPayments.PaySumm = paySumm;

            return orderPayments;
        }

        // method for Angelika managers
        [HttpGet("SampleOrders")]
        public IEnumerable<Models.Order> GetSampleOrders()
        {
            System.Data.DataTable dt = new System.Data.DataTable();

            bool save = false;
            /*decimal courseUsd = Helper.GetCurrencyCourse("USD", DateTime.Now);
            // todo decimal courseEur = Helper.GetCurrencyCourse("USD", DateTime.Now);

            if (courseUsd < 0)
            {
                var curr = ctx.Currencies.FirstOrDefault(x => x.ShortName!.ToUpper() == "RUR");
                if (curr != null && curr.Rate != null)
                {
                    courseUsd = curr.Rate.Value;
                }
            }
            else
            {
                var curr = ctx.Currencies.FirstOrDefault(x => x.ShortName!.ToUpper() == "RUR");
                if (courseUsd != curr!.Rate)
                {
                    curr.Rate = courseUsd;
                    ctx.SaveChanges();
                }
            }*/

            var ordersQuery = from o in ctx.Orders where o.IsSamples == true orderby o.Id descending select o;

            List<Models.Order> orders = new List<Models.Order>();

            foreach (var o in ordersQuery.ToList())
            {
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
                    Currency = ctx.Currencies.FirstOrDefault(c => c.Id == x.CurrencyId).ShortName
                }).ToArray();

                List<Models.OrderItem> orderItems = new List<Models.OrderItem>();
                foreach (var item in query.ToList())
                {
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
                        ClientDeliveryCompany = item.oi.ClientDeliveryCompany,
                        ClientDeliveryNo = item.oi.ClientDeliveryNo,
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
                order.Total = 5m * orderItems.Count; //!!!!
                order.Items = orderItems.ToArray();
                orders.Add(order);
            }
            return orders.AsEnumerable();
        }


        [HttpGet("{id}")]
        //public Models.Product? Product([FromQuery] string id)
        public Models.Order? GetOrder([FromQuery] string uuid)
        {
            Models.Order? order =
                ctx.Orders.Where(x => x.Uuid == uuid)
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

        [HttpDelete("OrderItem")]
        public ActionResult<int> DeleteOrderItem([FromBody] int id)
        {
            try
            {
                int? orderId = ctx.OrderItems.FirstOrDefault(x => x.Id == id)!.OrderId;
                ctx.OrderItems.Remove(ctx.OrderItems.FirstOrDefault(x => x.Id == id)!);
                ctx.SaveChanges();
                var itemsExist = ctx.OrderItems.Where(x => x.OrderId == orderId).Count() > 0;
                var paymentsExist = ctx.Payments.Where(x => x.OrderId == orderId).Count() > 0;
                if (!itemsExist && !paymentsExist)
                {
                    ctx.Orders.Remove(ctx.Orders.FirstOrDefault(x => x.Id == orderId)!);
                    ctx.SaveChanges();
                }
                return Ok();

            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpPost("Create")]
        public ActionResult<Models.OrderPost> Post([FromBody]Models.OrderPost order)
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

                //set is samples order:
                newOrder.IsSamples = false;
                if (order.Items.Length>0 && order.Items[0].Quantity == -1)
                {
                    newOrder.IsSamples = true;
                }

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

                    Context.ColorVariant cv = ctx.ColorVariants.FirstOrDefault(x => x.Id == item.ColorVariantId);

                    Context.OrderItem newItem = config.CreateMapper()
                        .Map<Context.OrderItem>(item);
                    
                    newItem.OrderId = newOrder.Id;

                    string colorNames = "";
                    if (cv != null)
                    {
                        if (cv.Price != null)
                        {
                            newItem.Price = cv.Price.Value;
                        }
                        var colorIds = ctx.ColorVariantsInColors.Where(x => x.ColorVariantId == cv.Id).Select(x => x.ColorId).ToList();
                        newItem.ColorNames = String.Join(", ", ctx.Colors.Where(x => colorIds.Contains(x.Id)).Select(x => x.ColorName));
                    } else
                    {
                        newItem.ColorNames = "custom color";
                    }

                    ctx.OrderItems.Add(newItem);

                    Context.Product? product = ctx.Products.FirstOrDefault(x => x.Id == newItem.ProductId);

                    if (product != null)
                    {
                        string img = String.Empty;
                        

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
                            + product.Design + "<br/>" + colorNames + $"</td><td style={rightAlign}>" 
                            + newItem.Quantity + $" m </td><td style={rightAlign}>" 
                            + String.Format("{0:0.0#}", item.Price) + " $</td></tr>";
                        linkedRes.Add(LinkedImg);

                        if (cv != null && cv.Price != null)
                            item.Price = cv.Price.Value;
                        
                        total += (item.Price != null ? item.Price.Value : 0m) * newItem.Quantity;
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
                Log("Post", ex);
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
                    Models.OrderItem? item = order.Items.FirstOrDefault(x => x.Id == it.Id);
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
                string? frontendUrl = _configuration.GetValue<string>("Url:Frontend");
                string? ordersManager = _configuration.GetValue<string>("Orders:Manager");

                Context.OrderItem? oi = ctx.OrderItems.FirstOrDefault(x => x.Id == cd.Id);
                if (oi != null)
                {
                    oi.Details = cd.Details;
                    oi.DeliveryCompany = cd.DeliveryCompany;
                    oi.DeliveryNo = cd.DeliveryNo;
                    ctx.SaveChanges();

                    if (cd.Details != null)
                    {
                        int nullDetailsItems = ctx.OrderItems.Count(x => x.OrderId == oi.OrderId && String.IsNullOrWhiteSpace(x.Details));
                        if (nullDetailsItems == 0)
                        {
                            Context.Order? order = ctx.Orders.FirstOrDefault(x => x.Id == oi.OrderId);
                            if (order != null)
                            {
                                // inform client
                                SendMessage(order.ClientEmail,
                                    order.ClientName,
                                    $"The contents of your order number {order.Number} dated {order.Created} have been confirmed by the supplier. To further complete your order, you must make payment; to do this, please follow the link below.",
                                    $"{frontendUrl}/orders?id={order.Id}",
                                    $"Changes to your order number {order.Number}");
                            }
                        }
                    }
                }

                return Ok();// CreatedAtAction(nameof(Context.OrderItem), new { id = cd.Id }, "");
            }
            catch (Exception ex)
            {
                Log("ChangeDetails", ex);
                return CreatedAtAction(nameof(Context.OrderItem), new { id = -1 }, null);
            }
        }

        [HttpPost("OrderItemUpdate")]
        public ActionResult OrderItemUpdate([FromBody] Models.OrderItemUpdate data)
        {
            try
            {
                Context.OrderItem? oi = ctx.OrderItems.FirstOrDefault(x => x.Id == data.Id);
                if (oi != null)
                {
                    oi.StockId = ctx.Stocks.FirstOrDefault(x => x.StockName == data.Stock).Id;
                    oi.ClientDeliveryCompany = data.ClientDeliveryCompany;
                    oi.ClientDeliveryNo = data.ClientDeliveryNo;
                    ctx.SaveChanges();
                }

                return Ok();// CreatedAtAction(nameof(Context.OrderItem), new { id = cd.Id }, "");
            }
            catch (Exception ex)
            {
                Log("OrderItemUpdate", ex);
                return CreatedAtAction(nameof(Context.OrderItem), new { id = -1 }, null);
            }
        }



        [HttpPost("DeliveryInfo")]
        public ActionResult DeliveryInfo([FromBody] Models.DeliveryInfo di)
        {
            //throw new Exception("Not supported since 23/08/2025");

            try
            {
                Context.OrderItem oi = ctx.OrderItems.FirstOrDefault(x => x.Id == di.Id);
                if (oi != null)
                {
                    oi.DeliveryNo = di.DeliveryNo;
                    oi.DeliveryCompany = di.DeliveryCompany;
                    oi.ClientDeliveryNo = di.ClientDeliveryNo;
                    oi.ClientDeliveryCompany = di.ClientDeliveryCompany;
                    oi.StockId = di.StockId;
                    ctx.SaveChanges();
                }

                return CreatedAtAction(nameof(Context.OrderItem), new { id = di.Id }, "");
            }
            catch (Exception ex)
            {
                Log("DeliveryInfo", ex); return CreatedAtAction(nameof(Context.OrderItem), new { id = -1 }, null);
            }
        }

        public void SendMessage(string email, string clientName, string text, string url, string subject)
        {
            string label = "'font-weight: normal; font-size: 100%; padding: 5px 12px;'";
            string cell = "'padding: 10px 20px;'";
            string rightAlign = "'text-align: right;padding: 10px 20px;'";
            string none = "''";
            string header = "'font-weight: #400; color: #66f;'";
            string width600 = "'max-width: 600px;'";
            string headerBlack = "'font-weight: bold; color: #000;'";

            using (MailMessage mess = new MailMessage())
            {

                string? frontendUrl = _configuration.GetValue<string>("Url:Frontend");
                string? ordersManager = _configuration.GetValue<string>("Orders:Manager");

                string body = $"<p>Dear {clientName}!</p>"; // ..style={header}
                body += $"<p style={width600}>{text}</p>";
                if (!String.IsNullOrWhiteSpace(url))
                {
                    body += $"<p>Your order link <a href='{url}'>here</a> </p>";
                }

                body += $"<p>Best regards, textile company Angelika</p>";
                body += $"<p>Our contacts:</p>";
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
                mess.To.Add(new MailAddress(email));
                mess.To.Add(new MailAddress(ordersManager));
                mess.Subject = subject;
                mess.SubjectEncoding = Encoding.UTF8;

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
                        if (r != null)
                        {
                            Decimal n = Math.Floor(q / r.Value);
                            if (n > 0)
                            {
                                details = String.Format("{0:0.##}", n) + "*" + String.Format("{0:0.##}", r);
                            }
                            q -= n * r.Value;
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
                Log("Accept", ex);
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
        public ActionResult<string> SendInvoice([FromBody]Models.InvoiceData inv)
        {
            System.Data.DataTable dt = new System.Data.DataTable();

            int rc = 0;
            try
            {
                //Invoice inv = new Invoice();
                //string fileName = "invoice1.docx";
                //string language = "Russian";
                string path = String.Format(@"files");
                //img = @"colors\nopicture.png";
                string fileName = String.Format("invoice_{0}.docx", inv.Order.Number != null ? inv.Order.Number : "no number");
                string contentRootPath = _webHostEnvironment.ContentRootPath;
                path = System.IO.Path.Combine(contentRootPath, "files");
                decimal knittingLeng = 0m, wovenLeng = 0m;
                decimal knittingCost = 0m, wovenCost = 0m;
                foreach (var it in inv.Order.Items)
                {
                    bool knitt = true;
                    var product = ctx.Products.FirstOrDefault(x=>x.Id == it.ProductId);
                    if (product == null) throw new Exception("Product not found");

                    string productTypeName = "knitting";
                    var productType = ctx.ProductTypes.FirstOrDefault(x=>x.Id==product.ProductTypeId);
                    if (productType != null)
                    {
                        productTypeName = productType!.TypeName!.ToLower().Trim();
                    }

                    decimal amount = 0; 
                    amount = it.Quantity;
                    if (!String.IsNullOrEmpty(it.Details))
                    {
                        try
                        {
                            amount = Convert.ToDecimal(dt.Compute(it.Details, ""));
                        }
                        catch (Exception ex) { throw new Exception($"Invalid details {it.Details}. Error:{ex.Message}"); }
                    }

                    if (productTypeName == "knitting") {
                        knittingLeng += amount;
                        knittingCost += it.Price * amount;
                    } else
                    {
                        wovenLeng += amount;
                        wovenCost += it.Price * amount;
                    }
                }

                decimal rate = 0m;
                decimal total = knittingCost + wovenCost;
                if (total > 0m)
                {
                    rate = inv.PayAmount / total;
                    //!show total price when partial payment!
                    //!knittingCost *= rate;
                    //!wovenCost *= rate;
                }

                Invoice invoice = new Invoice()
                {
                    Currency = "RUR",
                    Customer = inv.Customer,
                    Date = DateTime.Now,
                    Number = inv.Order.Number,
                    Supplier = "ООО \"Текстильная компания Анжелика\"\"",
                    SupplierBankBIC = "044525500",
                    SupplierBankName = "\"КОММЕРЧЕСКИЙ ИНДО БАНК\" ООО Г.МОСКВА",
                    SupplierCorrAccount = "30101810400000000500",
                    SupplierFirmAccount = "40702810500000000066",
                    SupplierDetails = "Общество с ограниченной ответственностью \"Текстильная компания \"АНЖЕЛИКА\", ИНН, 7706270562, КПП, 770601001, 119049,город Москва, улица Донская, дом 4, строение 2, 8 495 969 24 38",
                    SupplierINN = "7706270562",
                    SupplierKPP = "770601001",
                    Phones = "",
                    Knitting = knittingLeng*rate,
                    KnittingCost = knittingCost * rate,
                    Woven = wovenLeng * rate,
                    WovenCost = wovenCost * rate,
                    courseUSD = Helper.GetCurrencyCourse("USD", DateTime.Now)
                };

                if (invoice.courseUSD <=0 )
                {
                    throw new Exception("Course USD not available. Please try later.");
                }

                new InvoiceReports().CreateInvoice(invoice, path, fileName, "Russian");
                
                return Ok(System.IO.Path.Combine(@"files", fileName));
            }
            catch (Exception ex)
            {
                Log("SendInvoice", ex);
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("DeliveryNo")]
        public string DeliveryNo([FromQuery] string deliveryCompany)
        {
            try
            {
                string year2d = DateTime.Now.Year.ToString().Substring(2);
                string def = "0000-" + year2d;

                var query = ctx.OrderItems.Where(x =>
                    x.DeliveryCompany == deliveryCompany &&
                    x.DeliveryNo != null &&
                    //x.DeliveryNo.Length > 4 &&
                    x.DeliveryNo.EndsWith(year2d))
                    .Select(x => x.DeliveryNo);

                int maxNo = 0;
                try
                {
                    maxNo = query.Max(x => Convert.ToInt32(x.Substring(0, x.Length - 3)));
                }
                catch (Exception e)
                {

                }

                return (maxNo + 1).ToString("D4") + "-" + year2d;
            }
            catch (Exception ex)
            {
                Log("DeliveryNo", ex);
            }
            return null;
        }

        // method for Vendor managers
        [HttpGet("OrderPaidShare")]
        public decimal OrderPaidShare([FromQuery] string orderId)
        {
            System.Data.DataTable dt = new System.Data.DataTable();

            decimal totalSumm = 0m;
            foreach (var oi in ctx.OrderItems.Where(x => x.OrderId.ToString() == orderId))
            {
                decimal t = 0m;
                if (!String.IsNullOrEmpty(oi.Details))
                {
                    try
                    {
                        t = Convert.ToDecimal(dt.Compute(oi.Details, ""));
                    }
                    catch (Exception ex) {}
                }
                else
                {
                    t = oi.Quantity;
                }
                totalSumm += t * oi.Price;
            }

            var payQuery = ctx.Payments.Where(x => x.OrderId.ToString() == orderId);
            decimal paySumm = payQuery.Sum(x => x.Amount);
            decimal PaidShare = totalSumm > 0m ? paySumm / totalSumm : 0m;

            return PaidShare;
        }


        public void Log(string method, Exception ex)
        {
            Console.WriteLine();
            Console.WriteLine("-----------------------------------------------------------");
            Console.WriteLine();
            Console.WriteLine(String.Format("{0:dd.MM.yyyy HH:mm:ss} OrdersController/{1}: {2}", DateTime.Now, method, ex.Message));
            Console.WriteLine(String.Format("{0:dd.MM.yyyy HH:mm:ss} OrdersController/{1}: {2}", DateTime.Now, method, ex.InnerException != null ? ex.InnerException.Message : ""));
        }

    }
}
