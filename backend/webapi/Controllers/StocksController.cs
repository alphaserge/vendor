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
    public class StocksController : ControllerBase
    {
        private MapperConfiguration config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<Models.Stock, Context.Stock>();
                cfg.CreateMap<Context.Stock, Models.Stock>();
            });

        private readonly chiffon_back.Context.ChiffonDbContext ctx = Code.ContextHelper.ChiffonContext();

        private readonly ILogger<StocksController> _logger;

        public StocksController(ILogger<StocksController> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name = "Stocks")]
        public IEnumerable<Models.Stock> Get()
        {
            List<Models.Stock> seasons = 
                ctx.Stocks.OrderBy(x => x.StockName)
                .Select(x =>
                    config.CreateMapper()
                        .Map<Models.Stock>(x))
                .ToList();

            //seasons.Add(new Models.Stock() { Id = -1, StockName = "ALL" });

            return seasons.AsEnumerable();
        }


        [HttpPost(Name = "Stocks")]
        public ActionResult<Models.Stock> Post1(Models.Stock Stock)
        {
            try
            {
                Context.Stock item = config.CreateMapper()
                    .Map<Context.Stock>(Stock);

                ctx.Stocks.Add(item);
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
