using AutoMapper;
using chiffon_back.Context;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace chiffon_back.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SeasonsController : ControllerBase
    {
        private MapperConfiguration config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<Models.Season, Context.Season>();
                cfg.CreateMap<Context.Season, Models.Season>();
            });

        private readonly chiffon_back.Context.ChiffonDbContext ctx = Code.ContextHelper.ChiffonContext();

        private readonly ILogger<SeasonsController> _logger;

        public SeasonsController(ILogger<SeasonsController> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name = "Seasons")]
        public IEnumerable<Models.Season> Get()
        {
            List<Models.Season> seasons = 
                ctx.Seasons.OrderBy(x => x.SeasonName)
                .Select(x =>
                    config.CreateMapper()
                        .Map<Models.Season>(x))
                .ToList();

            seasons.Add(new Models.Season() { Id = -1, SeasonName = "ALL" });

            return seasons.AsEnumerable();
        }


        [HttpPost(Name = "Seasons")]
        public ActionResult<Models.Season> Post1(Models.Season Season)
        {
            try
            {
                Context.Season item = config.CreateMapper()
                    .Map<Context.Season>(Season);

                ctx.Seasons.Add(item);
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
