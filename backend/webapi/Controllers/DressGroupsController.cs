using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Web.Http.Cors; // пространство имен CORS

namespace chiffon_back.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [EnableCors(origins: "http://185.40.31.18:3000,http://185.40.31.18:3010", headers: "*", methods: "*")]
    public class DressGroupsController : ControllerBase
    {
        private MapperConfiguration config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<Models.DressGroup, Context.DressGroup>();
                cfg.CreateMap<Context.DressGroup, Models.DressGroup>();
            });

        private readonly chiffon_back.Context.ChiffonDbContext ctx = Code.ContextHelper.ChiffonContext();

        private readonly ILogger<DressGroupsController> _logger;

        public DressGroupsController(ILogger<DressGroupsController> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name = "DressGroups")]
        public IEnumerable<Models.DressGroup> Get()
        {
            return ctx.DressGroups.OrderBy(x => x.ParentDressGroupId).ThenBy(x => x.DressGroupName)
                .Select(x =>
                    config.CreateMapper()
                        .Map<Models.DressGroup>(x))
                .ToList();
        }

        [HttpPost(Name = "DressGroups")]
        public ActionResult<Models.DressGroup> Post(Models.DressGroup dressGroup)
        {
            try
            {
                Context.DressGroup item = config.CreateMapper()
                    .Map<Context.DressGroup>(dressGroup);

                ctx.DressGroups.Add(item);
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
