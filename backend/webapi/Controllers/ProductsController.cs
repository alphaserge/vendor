using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace chiffon_back.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProductsController : ControllerBase
    {
        private MapperConfiguration config = new MapperConfiguration(cfg =>
            {
                /**/
                cfg.CreateMap<Models.Product, Context.Product>();
                cfg.CreateMap<Models.Color, Context.Color>();
                cfg.CreateMap<Models.Season, Context.Season>();
                cfg.CreateMap<Models.DesignType, Context.DesignType>();
                cfg.CreateMap<Models.OverWorkType, Context.OverWorkType>();
                cfg.CreateMap<Models.ProductsInColors, Context.ProductsInColors>();
                cfg.CreateMap<Models.ProductsInDesignTypes, Context.ProductsInDesignTypes>();
                cfg.CreateMap<Models.ProductsInOverWorkTypes, Context.ProductsInOverWorkTypes>();
                cfg.CreateMap<Models.ProductsInSeasons, Context.ProductsInSeasons>();
                cfg.CreateMap<Models.ProductStyle, Context.ProductStyle>();
                cfg.CreateMap<Models.ProductType, Context.ProductType>();
                cfg.CreateMap<Models.Vendor, Context.Vendor>();

                cfg.CreateMap<Context.Color, Models.Color>();
                cfg.CreateMap<Context.Season, Models.Season>();
                cfg.CreateMap<Context.DesignType, Models.DesignType>();
                cfg.CreateMap<Context.OverWorkType, Models.OverWorkType>();
                cfg.CreateMap<Context.ProductsInColors, Models.ProductsInColors>();
                cfg.CreateMap<Context.ProductsInDesignTypes, Models.ProductsInDesignTypes>();
                cfg.CreateMap<Context.ProductsInOverWorkTypes, Models.ProductsInOverWorkTypes>();
                cfg.CreateMap<Context.ProductsInSeasons, Models.ProductsInSeasons>();
                cfg.CreateMap<Context.ProductStyle, Models.ProductStyle>();
                cfg.CreateMap<Context.ProductType, Models.ProductType>();
                cfg.CreateMap<Context.Vendor, Models.Vendor>();
                cfg.CreateMap<Context.Product, Models.Product>();

            });

        private readonly chiffon_back.Context.ChiffonDbContext ctx = Code.ContextHelper.ChiffonContext();

        private readonly ILogger<ProductsController> _logger;

        public ProductsController(ILogger<ProductsController> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name = "Products")]
        public IEnumerable<Models.Product> Get()
        {
            return ctx.Products
                .Select(x =>
                    config.CreateMapper()
                        .Map<Models.Product>(x))
                .ToList();


            /*return Enumerable.Range(1, 5).Select(index => new Product
            {
                Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            })
            .ToArray();*/
        }

        
/*        [HttpPost(Name = "Products")]
        public ActionResult<Models.Product> Post(Models.Product product)
        {
            try
            {
                Context.Product prod = config.CreateMapper()
                    .Map<Context.Product>(product);

                ctx.Products.Add(prod);
                ctx.SaveChanges();

                return CreatedAtAction(nameof(Get), new { id = prod.Id }, prod);
            }
            catch (Exception ex)
            {
                return CreatedAtAction(nameof(Get), new { id = -1 }, null);
            }
        }*/

        [HttpPost(Name = "Products")]
        public ActionResult<Models.Product> Post1(Models.Product product)
        {
            try
            {
                Context.Product prod = config.CreateMapper()
                    .Map<Context.Product>(product);

                ctx.Products.Add(prod);
                ctx.SaveChanges();

                return CreatedAtAction(nameof(Get), new { id = prod.Id }, prod);
            }
            catch (Exception ex)
            {
                return CreatedAtAction(nameof(Get), new { id = -1 }, null);
            }
        }
    }
}
