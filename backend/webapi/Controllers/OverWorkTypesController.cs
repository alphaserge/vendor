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
    [EnableCors(origins: "http://185.40.31.18:3000,http://185.40.31.18:3010", headers: "*", methods: "*")]
    public class OverWorkTypesController : ControllerBase
    {
        private MapperConfiguration config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<Models.OverWorkType, Context.OverWorkType>();
                cfg.CreateMap<Context.OverWorkType, Models.OverWorkType>();
                cfg.CreateMap<Models.PostOverWorkType, Context.OverWorkType>();
            });

        private readonly chiffon_back.Context.ChiffonDbContext ctx = Code.ContextHelper.ChiffonContext();

        private readonly ILogger<OverWorkTypesController> _logger;

        public OverWorkTypesController(ILogger<OverWorkTypesController> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name = "OverWorkTypes")]
        public IEnumerable<Models.OverWorkType> Get()
        {
            var overworks = ctx.OverWorkTypes.OrderBy(x => x.OverWorkName)
                .Select(x =>
                    config.CreateMapper()
                        .Map<Models.OverWorkType>(x))
                .ToList();

            return overworks.AsEnumerable();
        }

        [HttpPost(Name = "OverWorkTypes")]
        public ActionResult<Models.OverWorkType> Post(Models.PostOverWorkType overwork)
        {
            try
            {
                Context.OverWorkType item = config.CreateMapper()
                    .Map<Context.OverWorkType>(overwork);

                ctx.OverWorkTypes.Add(item);
                ctx.SaveChanges();

                if (overwork.ProductId != null)
                {
                    ctx.ProductsInOverWorkTypes.Add(
                        new Context.ProductsInOverWorkTypes()
                        {
                            ProductId = overwork.ProductId.Value,
                            OverWorkTypeId = overwork.Id
                        });
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
