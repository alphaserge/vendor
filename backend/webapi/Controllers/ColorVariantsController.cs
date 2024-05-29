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
            var query = from p in ctx.ColorVariants
                        select new Models.ColorVariant
                        {
                            Id = p.Id,
                        };

            return query.ToList();
        }

        [HttpPost(Name = "ColorVariants")]
        public ActionResult Post(Models.PostColorVariant colVar)
        {
            try
            {
                return CreatedAtAction(nameof(Get), new { id = colVar.Id }, null);
            }
            catch (Exception ex)
            {
                return CreatedAtAction(nameof(Get), new { id = -1 }, null);
            }
        }
    }
}
