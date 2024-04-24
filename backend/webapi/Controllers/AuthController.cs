using AutoMapper;
using chiffon_back.Context;
using chiffon_back.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Mail;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Security.Principal;
using System.Text;

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

        private ClaimsIdentity GetIdentity(Models.SignIn signIn, out Models.User user)
        {
            Context.User? ctxUser = ctx.Users.FirstOrDefault(x =>
                               x.Email == signIn.Email &&
                               x.PasswordHash == signIn.PasswordHash);

            if (ctxUser != null)
            {
                string[] roles = new string[] { "user" };
                if (ctxUser.Roles != null)
                {
                    roles = ctxUser.Roles.Split(new char[] { ',' });
                }
                var claims = new List<Claim>
                {
                    new Claim(ClaimsIdentity.DefaultNameClaimType, ctxUser.FirstName),
                    new Claim(ClaimsIdentity.DefaultRoleClaimType, roles.FirstOrDefault())
                };
                ClaimsIdentity claimsIdentity =
                new ClaimsIdentity(claims, "Token", ClaimsIdentity.DefaultNameClaimType, ClaimsIdentity.DefaultRoleClaimType);

                user = config.CreateMapper().Map<Models.User>(ctxUser);
                return claimsIdentity;
            }

            // если пользователь не найден
            user = new Models.User();
            return null;
        }

        [HttpPost("auth")]
        public ActionResult<Models.User> SignIn(Models.SignIn signIn)
        {
            try
            {
                Models.User mdUser = new Models.User();
                ClaimsIdentity identity = GetIdentity(signIn, out mdUser);

                if (identity == null)
                {
                    return BadRequest(new { errorText = "Invalid username or password." });
                }

                var now = DateTime.UtcNow;
                // создаем JWT-токен
                var jwt = new JwtSecurityToken(
                        issuer: AuthOptions.ISSUER,
                        audience: AuthOptions.AUDIENCE,
                        notBefore: now,
                        claims: identity.Claims,
                        expires: now.Add(TimeSpan.FromMinutes(AuthOptions.LIFETIME)),
                        signingCredentials: new SigningCredentials(AuthOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256));
                var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

                mdUser.Token = encodedJwt;

                return Ok(mdUser);

                /*if (us!=null)
                {
                    Models.User mdUser = config.CreateMapper()
                        .Map<Models.User>(us);

                    return Ok(mdUser);
                }*/
            }
            catch (Exception ex) {}

            return NotFound(new Models.JwtToken());
        }

        [HttpPost("signup")]
        public ActionResult<Models.User> SignUp(Models.User mdUser)
        {
            try
            {
                // создаем hash для регистрации
                string hash;
                using (MD5 hashMD5 = MD5.Create())
                {
                    hash = String.Join
                    (
                        "",
                        from ba in hashMD5.ComputeHash
                        (
                            Encoding.UTF8.GetBytes(new DateTime().ToString("yyyy-MM-dd_T_HH::mm::ss..fffffffK"))
                        )
                        select ba.ToString("x2")
                    );
                }

                Context.User dbUser = config.CreateMapper()
                    .Map<Context.User>(mdUser);

                dbUser.Created = DateTime.Now;
                //dbUser.VendorId = 1;
                dbUser.RegistrationHash = hash;
                dbUser.IsLocked = true; // разблокируем на confirm
                ctx.Users.Add(dbUser);
                ctx.SaveChanges();

                Models.User newUser =  config.CreateMapper()
                    .Map<Models.User>(dbUser);

                using (MailMessage mess = new MailMessage())
                {
                    //SmtpClient client = new SmtpClient("smtp.mail.ru", Convert.ToInt32(587))
                    
                    SmtpClient client = new SmtpClient("smtp.go1.unisender.ru", Convert.ToInt32(587))
                    {
                        //Credentials = new NetworkCredential("elizarov.sa@mail.ru", "tg95r9xnYiE7wqhdhjSk"),
                        Credentials = new NetworkCredential("6697678", "tg95r9xnYiE7wqhdhjSk"),
                        EnableSsl = true,
                        DeliveryMethod = SmtpDeliveryMethod.Network
                    };
                    mess.From = new MailAddress("elizarov.sa@mail.ru");
                    mess.To.Add(new MailAddress(mdUser.Email));
                    mess.Subject = "Confirm your registration";
                    mess.SubjectEncoding = Encoding.UTF8;
                    mess.Body = $"<h2>Hello, {mdUser.Email}!</h2><p> Please confirm your registration: <a href='https://localhost:3080/Auth/confirm?token={hash}'></a></p>";
                    mess.IsBodyHtml = true;
                    #region Add Files
                    try
                    {
                        //mess.Attachments.Add(new Attachment(какой файл добавлять для отправки));
                    }
                    catch { }
                    #endregion Add Files
                    client.Send(mess);
                    mess.Dispose();
                    client.Dispose();
                }

                /*
                MailAddress from = new MailAddress("sdevmoscow@gmail.com", "Sergie");
                MailAddress to = new MailAddress(mdUser.Email);
                MailMessage m = new MailMessage(from, to);
                m.Subject = "Confirm your registration";
                m.Body = $"<h2>Hello, {mdUser.Email}!</h2><p> Please confirm your registration: <a href='https://localhost:3080/Auth/confirm?token={hash}'></a></p>";
                m.IsBodyHtml = true;
                SmtpClient smtp = new SmtpClient("smtp.gmail.com", 587);
                smtp.Credentials = new NetworkCredential("sdevmoscow@gmail.com", "JH506cvX");
                smtp.EnableSsl = true;
                smtp.UseDefaultCredentials = false;
                smtp.Send(m); */
                Console.Read();

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

        [HttpPost("verify")]
        public ActionResult<Models.User> Verify(Models.User mdUser)
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
