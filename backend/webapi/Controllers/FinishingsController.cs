using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace chiffon_back.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FinishingsController : ControllerBase
    {
        private MapperConfiguration config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<Models.Finishings, Context.Finishing>();
                cfg.CreateMap<Context.Finishing, Models.Finishings>();
                cfg.CreateMap<Models.PostFinishings, Context.Finishing>();
            });

        private readonly chiffon_back.Context.ChiffonDbContext ctx = Code.ContextHelper.ChiffonContext();

        private readonly ILogger<FinishingsController> _logger;

        public FinishingsController(ILogger<FinishingsController> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name = "Finishings")]
        public IEnumerable<Models.Finishings> Get()
        {
            return ctx.Finishings.OrderBy(x => x.FinishingName)
                .Select(x =>
                    config.CreateMapper()
                        .Map<Models.Finishings>(x))
                .ToList();
        }

        [HttpPost(Name = "Finishings")]
        public ActionResult<Models.Finishings> Post(Models.PostFinishings finishing)
        {
            try
            {
                Context.Finishing item = config.CreateMapper()
                    .Map<Context.Finishing>(finishing);

                ctx.Finishings.Add(item);
                ctx.SaveChanges();

                if (finishing.ProductId != null)
                {
                    Context.Product? prod = ctx.Products.FirstOrDefault(x => x.Id == finishing.ProductId.Value);
                    if (prod != null)
                    {
                        prod.FinishingId = finishing.Id;
                    }
                    ctx.SaveChanges();
                }

                return CreatedAtAction(nameof(Get), new { id = item.Id }, item);
            }
            catch (Exception ex)
            {
                return CreatedAtAction(nameof(Get), new { id = -1 }, null);
            }
        }
    }
}
