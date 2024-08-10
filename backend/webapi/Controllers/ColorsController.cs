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
    [EnableCors(origins: "http://localhost:3000", headers: "*", methods: "*")]
    public class ColorsController : ControllerBase
    {
        private MapperConfiguration config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<Models.Color, Context.Color>();
                cfg.CreateMap<Context.Color, Models.Color>();
            });

        private readonly chiffon_back.Context.ChiffonDbContext ctx = Code.ContextHelper.ChiffonContext();

        private readonly ILogger<ColorsController> _logger;

        public ColorsController(ILogger<ColorsController> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name = "Colors")]
        public IEnumerable<Models.Color> Get()
        {
            List<Models.Color> colors =
                ctx.Colors.OrderBy(x => x.ColorName)
                .Select(x =>
                    config.CreateMapper()
                        .Map<Models.Color>(x))
                .ToList();

            colors.Add(new Models.Color() { Id = -2, ColorName = "ADD NEW" });
            return colors.AsEnumerable();
        }

        [HttpPost(Name = "Colors")]
        public ActionResult<Models.Vendor> Post(Models.Color color)
        {
            try
            {
                Context.Color newColor = config.CreateMapper()
                    .Map<Context.Color>(color);

                if (newColor.RGB.StartsWith('#'))
                    newColor.RGB = newColor.RGB.Trim('#');

                ctx.Colors.Add(newColor);
                ctx.SaveChanges();

                return CreatedAtAction(nameof(Get), new { id = newColor.Id }, newColor);
            }
            catch (Exception ex)
            {
                return CreatedAtAction(nameof(Get), new { id = -1 }, null);
            }
        }
    }
}
