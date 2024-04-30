using AutoMapper;
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
            return ctx.Seasons.OrderBy(x => x.SeasonName)
                .Select(x =>
                    config.CreateMapper()
                        .Map<Models.Season>(x))
                .ToList();

            /*return Enumerable.Range(1, 5).Select(index => new Season
            {
                Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            })
            .ToArray();*/
        }


        [HttpPost(Name = "Seasons")]
        public ActionResult<Models.Season> Post1(Models.Season Season)
        {
            try
            {
                Context.Season vendor = config.CreateMapper()
                    .Map<Context.Season>(Season);

                ctx.Seasons.Add(vendor);
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
