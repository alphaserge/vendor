using AutoMapper;
using chiffon_back.Code;
using chiffon_back.Context;
using chiffon_back.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace chiffon_back.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TextileTypesController : ControllerBase
    {
        private MapperConfiguration config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<Models.TextileType, Context.TextileType>();
                cfg.CreateMap<Context.TextileType, Models.TextileType>();
                cfg.CreateMap<Models.ProductsInTextileTypes, Context.ProductsInTextileTypes>();
                cfg.CreateMap<Context.ProductsInTextileTypes, Models.ProductsInTextileTypes>();
            });

        private readonly chiffon_back.Context.ChiffonDbContext ctx = Code.ContextHelper.ChiffonContext();

        private readonly ILogger<TextileTypesController> _logger;

        public TextileTypesController(ILogger<TextileTypesController> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name = "TextileTypes")]
        public IEnumerable<Models.TextileType> Get()
        {
            return ctx.TextileTypes.OrderBy(x => x.TextileTypeName)
                .Select(x =>
                    config.CreateMapper()
                        .Map<Models.TextileType>(x))
                .ToList();
        }

        [HttpPost(Name = "TextileTypes")]
        public ActionResult<Models.Vendor> Post(Models.TextileType textileType)
        {
            try
            {
                Context.TextileType textile = config.CreateMapper()
                    .Map<Context.TextileType>(textileType);

                ctx.TextileTypes.Add(textile);
                ctx.SaveChanges();

                return CreatedAtAction(nameof(Get), new { id = textile.Id }, textile);
            }
            catch (Exception ex)
            {
                return CreatedAtAction(nameof(Get), new { id = -1 }, null);
            }
        }

        [HttpPost("ProductAddTextileType")]
        public ActionResult Post(Models.ProductsInTextileTypes ptt)
        {
            try
            {
                Context.ProductsInTextileTypes item = config.CreateMapper().Map<Context.ProductsInTextileTypes>(ptt);
                ctx.ProductsInTextileTypes.Add(item);
                ctx.SaveChanges();
                return CreatedAtAction(nameof(Get), new { Id = item.Id });
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpPost("ProductRemoveTextileType")]
        public ActionResult Remove(RemoveTextileTypes data)
        {
            try
            {
                ctx.ProductsInTextileTypes.RemoveRange(ctx.ProductsInTextileTypes.Where(x => x.Id == data.Id));
                ctx.SaveChanges();
                return CreatedAtAction(nameof(Get), new { ok = true });
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpPost("Finish")]
        public ActionResult Finish(FinishTextileTypes data)
        {
            try
            {
                var percent = ctx.ProductsInTextileTypes.Where(x=>x.ProductId==data.ProductId).Sum(x=>x.Value);
                if (percent>=100)
                {
                    return BadRequest("Current value equal or above 100%");
                }
                percent = 100 - percent;

                Context.ProductsInTextileTypes item = new Context.ProductsInTextileTypes()
                {
                    ProductId = data.ProductId.Value,
                    TextileTypeId = data.TextileTypeId.Value,
                    Value = percent
                };
                ctx.ProductsInTextileTypes.Add(item);
                ctx.SaveChanges();
                return CreatedAtAction(nameof(Get), new { Id = item.Id });
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpPost("ApplySample")]
        public ActionResult ApplySample(Models.ApplySample sample)
        {
            try
            {
                ctx.ProductsInTextileTypes.RemoveRange(ctx.ProductsInTextileTypes.Where(x => x.ProductId == sample.ProductId));

                foreach (var item in ctx.ProductsInTextileTypes.Where(x => x.ProductId == sample.SampleId))
                {
                    ctx.ProductsInTextileTypes.Add(new Context.ProductsInTextileTypes() 
                    { 
                        ProductId = sample.ProductId, 
                        TextileTypeId = item.TextileTypeId, 
                        Value = item.Value 
                    });
                }
                ctx.SaveChanges();
                return CreatedAtAction(nameof(Get), new { Ok = true });
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }



    }
}
