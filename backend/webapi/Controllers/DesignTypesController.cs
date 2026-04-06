using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
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
                cfg.CreateMap<Models.PostDesignType, Context.DesignType>();
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
            var list = ctx.DesignTypes.OrderBy(x => x.DesignName)
                .Select(x =>
                    config.CreateMapper()
                        .Map<Models.DesignType>(x))
            .ToList();

            return list.AsEnumerable();
        }

        [HttpPost(Name = "DesignTypes")]
        public ActionResult<Models.DesignType> Post(Models.PostDesignType designType)
        {
            try
            {
                Context.DesignType item = config.CreateMapper()
                    .Map<Context.DesignType>(designType);

                ctx.DesignTypes.Add(item);
                ctx.SaveChanges();

                if (designType.ProductId != null)
                {
                    ctx.ProductsInDesignTypes.Add(
                        new Context.ProductsInDesignTypes()
                        {
                            ProductId = designType.ProductId.Value,
                            DesignTypeId = designType.Id
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
