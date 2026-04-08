using AutoMapper;
using chiffon_back.Context;
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
    public class DyeStaffsController : ControllerBase
    {
        private MapperConfiguration config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<Models.DyeStaff, Context.DyeStaff>();
                cfg.CreateMap<Context.DyeStaff, Models.DyeStaff>();
                cfg.CreateMap<Models.PostDyeStaff, Context.DyeStaff>();
            });

        private readonly chiffon_back.Context.ChiffonDbContext ctx = Code.ContextHelper.ChiffonContext();

        private readonly ILogger<DyeStaffsController> _logger;

        public DyeStaffsController(ILogger<DyeStaffsController> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name = "DyeStaffs")]
        public IEnumerable<Models.DyeStaff> Get()
        {
            var list = ctx.DyeStaffs.OrderBy(x => x.DyeStaffName)
                .Select(x =>
                    config.CreateMapper()
                        .Map<Models.DyeStaff>(x))
            .ToList();

            return list.AsEnumerable();
        }

        [HttpPost(Name = "DyeStaffs")]
        public ActionResult<Models.DyeStaff> Post(Models.PostDyeStaff dyeStaff)
        {
            try
            {
                Context.DyeStaff item = config.CreateMapper()
                    .Map<Context.DyeStaff>(dyeStaff);

                ctx.DyeStaffs.Add(item);
                ctx.SaveChanges();

                if (dyeStaff.ProductId != null)
                {
                    Context.Product? prod = ctx.Products.FirstOrDefault(x => x.Id == dyeStaff.ProductId.Value);
                    if (prod != null)
                    {
                        prod.DyeStaffId = item.Id;
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
