using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace chiffon_back.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UsersController : ControllerBase
    {
        private MapperConfiguration config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<Models.User, Context.User>();
            });

        private readonly chiffon_back.Context.ChiffonDbContext ctx = Code.ContextHelper.ChiffonContext();

        private readonly ILogger<UsersController> _logger;

        public UsersController(ILogger<UsersController> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name = "users")]
        public IEnumerable<Models.User> GetUsers()
        {
            return ctx.Users
                .Select(x =>
                    config.CreateMapper()
                        .Map<Models.User>(x))
                .ToList();
        }

        [HttpGet("{id}")]
        public Models.User GetUser(int id)
        {
            return config.CreateMapper()
                .Map<Models.User>(ctx.Users.FirstOrDefault(x => x.Id == id));
        }

/*        [HttpPost(Name = "user1")]
        public ActionResult<Models.User> Post(Models.User user)
        {
            try
            {
                Context.User dbUser = config.CreateMapper()
                    .Map<Context.User>(user);

                ctx.Users.Add(dbUser);
                ctx.SaveChanges();

                return CreatedAtAction(nameof(GetUsers), new { id = dbUser.Id }, dbUser);
            }
            catch (Exception ex)
            {
                return CreatedAtAction(nameof(GetUsers), new { id = -1 }, null);
            }
        } */

        [HttpPost(Name = "auth")]
        public ActionResult<Models.User> Auth(Models.User user)
        {
            try
            {
                Context.User dbUser = config.CreateMapper()
                    .Map<Context.User>(user);

                ctx.Users.Add(dbUser);
                ctx.SaveChanges();

                return CreatedAtAction(nameof(GetUsers), new { id = dbUser.Id }, dbUser);
            }
            catch (Exception ex)
            {
                return CreatedAtAction(nameof(GetUsers), new { id = -1 }, null);
            }
        }

    }
}
