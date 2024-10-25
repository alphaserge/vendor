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
    [EnableCors(origins: "http://185.40.31.18:3000", headers: "*", methods: "*")]
    public class ProductStylesController : ControllerBase
    {
        private MapperConfiguration config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<Models.ProductStyle, Context.ProductStyle>();
                cfg.CreateMap<Context.ProductStyle, Models.ProductStyle>();
            });

        private readonly chiffon_back.Context.ChiffonDbContext ctx = Code.ContextHelper.ChiffonContext();

        private readonly ILogger<ProductStylesController> _logger;

        public ProductStylesController(ILogger<ProductStylesController> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name = "ProductStyles")]
        public IEnumerable<Models.ProductStyle> Get()
        {
            return ctx.ProductStyles.OrderBy(x => x.StyleName)
                .Select(x =>
                    config.CreateMapper()
                        .Map<Models.ProductStyle>(x))
                .ToList();
        }

        [HttpPost(Name = "ProductStyles")]
        public ActionResult<Models.ProductStyle> Post(Models.ProductStyle productStyle)
        {
            try
            {
                Context.ProductStyle item = config.CreateMapper()
                    .Map<Context.ProductStyle>(productStyle);

                ctx.ProductStyles.Add(item);
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
