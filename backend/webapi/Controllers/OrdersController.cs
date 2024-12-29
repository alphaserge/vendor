using AutoMapper;
using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;
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

        private readonly ILogger<OrdersController> _logger;

        public OrdersController(ILogger<OrdersController> logger)
        {
            _logger = logger;
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
                            select new { oi, j };
                
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
                        Price = item.j.Price,
                        Quantity = item.oi.Quantity
                    };

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

        [HttpGet(Name = "Order")]
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
                    Price = item.j.Price,
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

                ctx.Orders.Add(newOrder);

                foreach(var item in order.Items)
                {
                    Context.OrderItem newItem = config.CreateMapper()
                        .Map<Context.OrderItem>(item);

                    ctx.OrderItems.Add(newItem);
                }

                ctx.SaveChanges();

                return CreatedAtAction(nameof(Get), new { id = newOrder.Id }, newOrder);
            }
            catch (Exception ex)
            {
                return CreatedAtAction(nameof(Get), new { id = -1 }, null);
            }
        }
    }
}
