using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace chiffon_back.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class OverWorkTypesController : ControllerBase
    {
        private MapperConfiguration config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<Models.OverWorkType, Context.OverWorkType>();
                cfg.CreateMap<Context.OverWorkType, Models.OverWorkType>();
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
            return ctx.OverWorkTypes.OrderBy(x => x.OverWorkName)
                .Select(x =>
                    config.CreateMapper()
                        .Map<Models.OverWorkType>(x))
                .ToList();
        }

        [HttpPost(Name = "OverWorkTypes")]
        public ActionResult<Models.Vendor> Post(Models.OverWorkType Vendor)
        {
            try
            {
                Context.OverWorkType vendor = config.CreateMapper()
                    .Map<Context.OverWorkType>(Vendor);

                ctx.OverWorkTypes.Add(vendor);
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
