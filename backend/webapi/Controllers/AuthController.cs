using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Net;

namespace chiffon_back.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private MapperConfiguration config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<Models.User, Context.User>();
                cfg.CreateMap<Context.User, Models.User>();
            });

        private readonly chiffon_back.Context.ChiffonDbContext ctx = Code.ContextHelper.ChiffonContext();

        private readonly ILogger<AuthController> _logger;

        public AuthController(ILogger<AuthController> logger)
        {
            _logger = logger;
        }


        [HttpPost("auth")]
        public ActionResult<Models.SignIn> SignIn(Models.SignIn user)
        {
            try
            {
                if (ctx.Users.FirstOrDefault(x=>
                    x.Email==user.Email &&
                    x.PasswordHash==user.PasswordHash)!=null)
                {
                    return Ok();
                }
            }
            catch (Exception ex)
            {
                
            }
            return NotFound(); //?Forbid()?;
        }

        [HttpPost("signup")]
        public ActionResult<Models.User> SignUp(Models.User mdUser)
        {
            try
            {
                Context.User dbUser = config.CreateMapper()
                    .Map<Context.User>(mdUser);

                dbUser.Created = DateTime.Now;
                dbUser.VendorId = 1;
                dbUser.FirstName = mdUser.Email;
                dbUser.IsLocked = false;
                ctx.Users.Add(dbUser);
                ctx.SaveChanges();

                Models.User newUser =  config.CreateMapper()
                    .Map<Models.User>(dbUser);
                
                return Ok(newUser);
            }
            catch (Exception ex)
            {

            }
            return NotFound(); //?Forbid()?; 
        }

        [HttpPost("check-account")]
        public ActionResult<Models.User> CheckAccount(Models.User mdUser)
        {
            try
            {
                if (ctx.Users.FirstOrDefault(x => x.Email == mdUser.Email) != null)
                {
                    return Ok(new
                    {
                        status = "User exists",
                        userExists = true,
                    });
                }
            }
            catch (Exception ex)
            {

            }
            return Ok(new
            {
                status = "User does not exists",
                userExists = false,
            });
        }

    }
}
