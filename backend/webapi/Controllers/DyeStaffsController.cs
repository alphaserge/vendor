using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace chiffon_back.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DyeStaffsController : ControllerBase
    {
        private MapperConfiguration config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<Models.DyeStaff, Context.DyeStaff>();
                cfg.CreateMap<Context.DyeStaff, Models.DyeStaff>();
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
            return ctx.DyeStaffs.OrderBy(x => x.DyeStaffName)
                .Select(x =>
                    config.CreateMapper()
                        .Map<Models.DyeStaff>(x))
                .ToList();
        }

        [HttpPost(Name = "DyeStaffs")]
        public ActionResult<Models.Vendor> Post(Models.DyeStaff dyeStaff)
        {
            try
            {
                Context.DyeStaff vendor = config.CreateMapper()
                    .Map<Context.DyeStaff>(dyeStaff);

                ctx.DyeStaffs.Add(vendor);
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
