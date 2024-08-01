using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace chiffon_back.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PrintTypesController : ControllerBase
    {
        private MapperConfiguration config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<Models.PrintType, Context.PrintType>();
                cfg.CreateMap<Context.PrintType, Models.PrintType>();
            });

        private readonly chiffon_back.Context.ChiffonDbContext ctx = Code.ContextHelper.ChiffonContext();

        private readonly ILogger<PrintTypesController> _logger;

        public PrintTypesController(ILogger<PrintTypesController> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name = "PrintTypes")]
        public IEnumerable<Models.PrintType> Get()
        {
            return ctx.PrintTypes.OrderBy(x => x.TypeName)
                .Select(x =>
                    config.CreateMapper()
                        .Map<Models.PrintType>(x))
                .ToList();
        }

        [HttpPost(Name = "PrintTypes")]
        public ActionResult<Models.Vendor> Post(Models.PrintType printType)
        {
            try
            {
                Context.PrintType vendor = config.CreateMapper()
                    .Map<Context.PrintType>(printType);

                ctx.PrintTypes.Add(vendor);
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
