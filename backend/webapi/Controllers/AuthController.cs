using AutoMapper;
using chiffon_back.Context;
using chiffon_back.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;

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
                cfg.CreateMap<Context.JwtToken, Models.JwtToken>();
            });

        private readonly chiffon_back.Context.ChiffonDbContext ctx = Code.ContextHelper.ChiffonContext();

        private readonly ILogger<AuthController> _logger;

        public AuthController(ILogger<AuthController> logger)
        {
            _logger = logger;
        }

        private string CreateToken(string email)
        {
            var claims = new List<Claim> { new Claim(ClaimTypes.Name, email) };
            // создаем JWT-токен
            var jwt = new JwtSecurityToken(
                    issuer: AuthOptions.ISSUER,
                    audience: AuthOptions.AUDIENCE,
                    claims: claims,
                    expires: DateTime.UtcNow.Add(TimeSpan.FromMinutes(2)),
                    signingCredentials: new SigningCredentials(AuthOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256));

            return new JwtSecurityTokenHandler().WriteToken(jwt);
        }

        [HttpPost("auth")]
        public ActionResult<Models.User> SignIn(Models.SignIn user)
        {
            try
            {
                Context.User? us = ctx.Users.FirstOrDefault(x =>
                                   x.Email == user.Email &&
                                   x.PasswordHash == user.PasswordHash);
                if (us!=null)
                {
                    var dbToken = ctx.JwtTokens.FirstOrDefault(x => x.UserId == us.Id && x.ExpiresAt >= DateTime.Now);
                    if (dbToken == null)
                    {
                        dbToken = new Context.JwtToken()
                        {
                            ExpiresAt = DateTime.Now.AddDays(14),
                            Token = CreateToken(user.Email),
                            UserId = us.Id
                        };
                        ctx.JwtTokens.Add(dbToken);
                        ctx.SaveChanges();
                    }

                    Models.User mdUser = config.CreateMapper()
                        .Map<Models.User>(us);

                    mdUser.Token = dbToken.Token;

                    return Ok(mdUser);
                }
            }
            catch (Exception ex) {}

            return NotFound(new Models.JwtToken());
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

                Context.JwtToken dbToken = new Context.JwtToken()
                {
                    ExpiresAt = DateTime.Now.AddDays(14),
                    Token = CreateToken(dbUser.Email),
                    UserId = dbUser.Id
                };
                ctx.JwtTokens.Add(dbToken);
                ctx.SaveChanges();

                Models.User newUser =  config.CreateMapper()
                    .Map<Models.User>(dbUser);
                
                newUser.Token = dbToken.Token;

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
