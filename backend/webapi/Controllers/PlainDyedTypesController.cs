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
    public class PlainDyedTypesController : ControllerBase
    {
        private MapperConfiguration config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<Models.PlainDyedType, Context.PlainDyedType>();
                cfg.CreateMap<Context.PlainDyedType, Models.PlainDyedType>();
                cfg.CreateMap<Models.PostPlainDyedType, Context.PlainDyedType>();
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
            var list = ctx.PlainDyedTypes.OrderBy(x => x.PlainDyedTypeName)
                .Select(x =>
                    config.CreateMapper()
                        .Map<Models.PlainDyedType>(x))
                .ToList();

            return list.AsEnumerable();
        }

        [HttpPost(Name = "PlainDyedTypes")]
        public ActionResult<Models.PlainDyedType> Post(Models.PostPlainDyedType plainDyedType)
        {
            try
            {
                Context.PlainDyedType item = config.CreateMapper()
                    .Map<Context.PlainDyedType>(plainDyedType);

                ctx.PlainDyedTypes.Add(item);
                ctx.SaveChanges();

                if (plainDyedType.ProductId != null)
                {
                    Context.Product? prod = ctx.Products.FirstOrDefault(x => x.Id == plainDyedType.ProductId.Value);
                    if (prod != null)
                    {
                        prod.PlainDyedTypeId = item.Id;
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
