using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace chiffon_back.Controllers
{
    [ApiController]
    [Route("[controller]")]
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
            return ctx.ProductStyles
                .Select(x =>
                    config.CreateMapper()
                        .Map<Models.ProductStyle>(x))
                .ToList();
        }

        [HttpPost(Name = "ProductStyles")]
        public ActionResult<Models.Vendor> Post(Models.ProductStyle Vendor)
        {
            try
            {
                Context.ProductStyle vendor = config.CreateMapper()
                    .Map<Context.ProductStyle>(Vendor);

                ctx.ProductStyles.Add(vendor);
                ctx.SaveChanges();

                return CreatedAtAction(nameof(Get), new { id = vendor.Id }, vendor);
            }
            catch (Exception ex)
            {
                return CreatedAtAction(nameof(Get), new { id = -1 }, null);
            }
        }
    }
}
