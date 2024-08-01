using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace chiffon_back.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PlainDyedTypesController : ControllerBase
    {
        private MapperConfiguration config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<Models.PlainDyedType, Context.PlainDyedType>();
                cfg.CreateMap<Context.PlainDyedType, Models.PlainDyedType>();
            });

        private readonly chiffon_back.Context.ChiffonDbContext ctx = Code.ContextHelper.ChiffonContext();

        private readonly ILogger<PlainDyedTypesController> _logger;

        public PlainDyedTypesController(ILogger<PlainDyedTypesController> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name = "PlainDyedTypes")]
        public IEnumerable<Models.PlainDyedType> Get()
        {
            return ctx.PlainDyedTypes.OrderBy(x => x.PlainDyedTypeName)
                .Select(x =>
                    config.CreateMapper()
                        .Map<Models.PlainDyedType>(x))
                .ToList();
        }

        [HttpPost(Name = "PlainDyedTypes")]
        public ActionResult<Models.Vendor> Post(Models.PlainDyedType plainDyedType)
        {
            try
            {
                Context.PlainDyedType vendor = config.CreateMapper()
                    .Map<Context.PlainDyedType>(plainDyedType);

                ctx.PlainDyedTypes.Add(vendor);
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
