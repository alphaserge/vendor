using AutoMapper;
using chiffon_back.Context;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Net;
using System.Net.Http;

namespace chiffon_back.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ColorVariantsController : ControllerBase
    {

        private MapperConfiguration config = new MapperConfiguration(cfg =>
        {
            cfg.CreateMap<Models.ColorVariant, Context.ColorVariant>();
            cfg.CreateMap<Context.ColorVariant, Models.ColorVariant>();
        });

        private readonly chiffon_back.Context.ChiffonDbContext ctx = Code.ContextHelper.ChiffonContext();

        private readonly ILogger<ColorVariantsController> _logger;

        public ColorVariantsController(ILogger<ColorVariantsController> logger)
        {
            _logger = logger;
        }

        // временно [Authorize]
        [HttpGet(Name = "ColorVariants")]
        public IEnumerable<Models.ColorVariant> Get()
        {
            var c = ctx.ColorVariants.ToList();
            var mapper = config.CreateMapper();
            var query = from p in ctx.ColorVariants
                    select mapper.Map<Models.ColorVariant>(p);

            var cv = query.ToList();
            return cv;
        }

        [HttpPost(Name = "ColorVariants")]
        public ActionResult Post(Models.PostColorVariant colVar)
        {
            try
            {
                return CreatedAtAction(nameof(Get), new { id = colVar.ColorVariantId }, null);
            }
            catch (Exception ex)
            {
                return CreatedAtAction(nameof(Get), new { id = -1 }, null);
            }
        }
    }
}
