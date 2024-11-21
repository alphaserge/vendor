using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Net;
using System.Web.Http.Cors; // пространство имен CORS

namespace chiffon_back.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [EnableCors(origins: "http://185.40.31.18:3000,http://185.40.31.18:3010", headers: "*", methods: "*")]
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
            var list = ctx.PrintTypes.OrderBy(x => x.TypeName)
                .Select(x =>
                    config.CreateMapper()
                        .Map<Models.PrintType>(x))
            .ToList();

            list.Add(new Models.PrintType() { Id = -2, TypeName = "ADD NEW" });
            return list.AsEnumerable();
        }

        [HttpPost(Name = "PrintTypes")]
        public ActionResult<Models.PrintType> Post(Models.PrintType printType)
        {
            try
            {
                Context.PrintType item = config.CreateMapper()
                    .Map<Context.PrintType>(printType);

                ctx.PrintTypes.Add(item);
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
