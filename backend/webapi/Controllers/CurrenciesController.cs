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
    public class CurrenciesController : ControllerBase
    {
        private MapperConfiguration config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<Models.Currency, Context.Currency>();
                cfg.CreateMap<Context.Currency, Models.Currency>();
            });

        private readonly chiffon_back.Context.ChiffonDbContext ctx = Code.ContextHelper.ChiffonContext();

        private readonly ILogger<CurrenciesController> _logger;

        public CurrenciesController(ILogger<CurrenciesController> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name = "Currencies")]
        public IEnumerable<Models.Currency> Get()
        {
            List<Models.Currency> seasons = 
                ctx.Currencies.OrderBy(x => x.CurrencyName)
                .Select(x =>
                    config.CreateMapper()
                        .Map<Models.Currency>(x))
                .ToList();

            //seasons.Add(new Models.Currency() { Id = -1, CurrencyName = "ALL" });

            return seasons.AsEnumerable();
        }


        [HttpPost(Name = "Currencies")]
        public ActionResult<Models.Currency> Post1(Models.Currency Currency)
        {
            try
            {
                Context.Currency item = config.CreateMapper()
                    .Map<Context.Currency>(Currency);

                ctx.Currencies.Add(item);
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
