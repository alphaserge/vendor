using chiffon_back;
using chiffon_back.Context;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using System.Text;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OAuth;
using System.Security.Cryptography;
using Microsoft.Extensions.FileProviders;
using System;

//MD5 hash = MD5.Create();
string result;
using (MD5 hash = MD5.Create())
{
    result = String.Join
    (
        "",
        from ba in hash.ComputeHash
        (
            Encoding.UTF8.GetBytes(new DateTime().ToString("yyyy-MM-dd_T_HH::mm::ss.fffffffK"))
        )
        select ba.ToString("x2")
    );
}
//string? h = hash.ToString();
int a = result.Length;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

var cs = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ChiffonDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

//builder.Services.AddDatabaseDeveloperPageExceptionFilter();

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            // указывает, будет ли валидироваться издатель при валидации токена
            ValidateIssuer = true,
            // строка, представляющая издателя
            ValidIssuer = AuthOptions.ISSUER,
            // будет ли валидироваться потребитель токена
            ValidateAudience = true,
            // установка потребителя токена
            ValidAudience = AuthOptions.AUDIENCE,
            // будет ли валидироваться время существования
            ValidateLifetime = true,
            // установка ключа безопасности
            IssuerSigningKey = AuthOptions.GetSymmetricSecurityKey(),
            // валидация ключа безопасности
            ValidateIssuerSigningKey = true,
        };
    });

string CORSPolicyName = "Chiffon_AllowAllOrigins";

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(//name: CORSPolicyName,
                      builder =>
                      {
                          // builder.WithOrigins("http://localhost:3000")
                          builder
                          .AllowAnyOrigin() 
                          .AllowAnyMethod() //.WithMethods("GET")
                          .AllowAnyHeader()
                          .Build();
                      });
    });

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

string dir = Path.Combine(Directory.GetCurrentDirectory(), @"images");
chiffon_back.Code.DirectoryHelper.CreateDirectoryIfMissing(dir);

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseStaticFiles(new StaticFileOptions()
{
    
    FileProvider = new PhysicalFileProvider(
    dir), //Path.Combine(Directory.GetCurrentDirectory(), @"images")),
    RequestPath = new PathString("/images")
}); ; ;

app.UseDirectoryBrowser(new DirectoryBrowserOptions()
{
    FileProvider = new PhysicalFileProvider(
    dir), //Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot\images")),
    RequestPath = new PathString("/images")
});
//app.UseRouting();
app.UseCors();// CORSPolicyName);
app.UseAuthorization();

app.Use(async (context, next) =>
{
    context.Response.Headers.Add("Access-Control-Allow-Origin", "*");
    context.Response.Headers.Add("Access-Control-Allow-Methods", "*");
    context.Response.Headers.Add("Access-Control-Allow-Headers", "*");
    context.Response.Headers.Add("Access-Control-Max-Age", "86400");

    /*context.Response.Headers.Add("Access-Control-Allow-Headers", "X-PINGOTHER, Host, User-Agent, Accept, Accept: application/json, application/json, Accept-Language, Accept-Encoding, Access-Control-Request-Method, Access-Control-Request-Headers, Origin, Connection, Content-Type, Content-Type: application/json, Authorization, Connection, Origin, Referer");
    context.Response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    //context.Response.Headers.Add("Access-Control-Allow-Headers", "content-type, accept, X-PINGOTHER");*/

    await next.Invoke();
});

app.MapControllers();

app.Run();

public class AuthOptions
{
    public const string ISSUER = "AngelikaJSC"; // издатель токена
    public const string AUDIENCE = "AngelikaClient"; // потребитель токена
    const string KEY = "angelicakey4a_vendor_angelikacvbgh!!766";   // ключ для шифрации
    public const int LIFETIME = 60*24*14; // время жизни токена - 14 дней
    public static SymmetricSecurityKey GetSymmetricSecurityKey() =>
        new SymmetricSecurityKey(Encoding.UTF8.GetBytes(KEY));
}






