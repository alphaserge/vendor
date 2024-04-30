using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace chiffon_back.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DesignTypesController : ControllerBase
    {
        private MapperConfiguration config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<Models.DesignType, Context.DesignType>();
                cfg.CreateMap<Context.DesignType, Models.DesignType>();
            });

        private readonly chiffon_back.Context.ChiffonDbContext ctx = Code.ContextHelper.ChiffonContext();

        private readonly ILogger<DesignTypesController> _logger;

        public DesignTypesController(ILogger<DesignTypesController> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name = "DesignTypes")]
        public IEnumerable<Models.DesignType> Get()
        {
            return ctx.DesignTypes.OrderBy(x => x.DesignName)
                .Select(x =>
                    config.CreateMapper()
                        .Map<Models.DesignType>(x))
                .ToList();
        }

        [HttpPost(Name = "DesignTypes")]
        public ActionResult<Models.Vendor> Post(Models.DesignType Vendor)
        {
            try
            {
                Context.DesignType vendor = config.CreateMapper()
                    .Map<Context.DesignType>(Vendor);

                ctx.DesignTypes.Add(vendor);
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
