using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Web.Http.Cors; // пространство имен CORS

namespace chiffon_back.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [EnableCors(origins: "http://185.40.31.18:3000,http://185.40.31.18:3010", headers: "*", methods: "*")]
    public class ProductTypesController : ControllerBase
    {
        private MapperConfiguration config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<Models.ProductType, Context.ProductType>();
                cfg.CreateMap<Context.ProductType, Models.ProductType>();
            });

        private readonly chiffon_back.Context.ChiffonDbContext ctx = Code.ContextHelper.ChiffonContext();

        private readonly ILogger<ProductTypesController> _logger;

        public ProductTypesController(ILogger<ProductTypesController> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name = "ProductTypes")]
        public IEnumerable<Models.ProductType> Get()
        {
            return ctx.ProductTypes.OrderBy(x => x.TypeName)
                .Select(x =>
                    config.CreateMapper()
                        .Map<Models.ProductType>(x))
                .ToList();
        }

        [HttpPost(Name = "ProductTypes")]
        public ActionResult<Models.ProductType> Post(Models.ProductType productType)
        {
            try
            {
                Context.ProductType item = config.CreateMapper()
                    .Map<Context.ProductType>(productType);

                ctx.ProductTypes.Add(item);
                ctx.SaveChanges();

                return CreatedAtAction(nameof(Get), new { id = item.Id }, item);
            }
            catch (Exception ex)
            {
                return CreatedAtAction(nameof(Get), new { id = -1 }, null);
            }
        }
    }
}
