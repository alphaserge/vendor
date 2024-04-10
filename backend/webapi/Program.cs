using chiffon_back;
using chiffon_back.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

var cs = builder.Configuration.GetConnectionString("DefaultConnection");
//Microsoft.Extensions.Configuration.GetSection
builder.Services.AddDbContext<ChiffonDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

//builder.Services.AddDatabaseDeveloperPageExceptionFilter();

string CORSPolicyName = "Chiffon_AllowAllOrigins";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: CORSPolicyName,
                      builder =>
                      {
                          builder
                            //.WithOrigins("http://localhost:3000")
                            .AllowAnyOrigin()
                            .AllowAnyMethod()
                            //.WithMethods("GET")
                            .AllowAnyHeader();
                      });
});
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// builder.Services.GetRequiredService<ChiffonDbContext>();
//DbInitializer.Initialize(context);
//CreateDbIfNotExists(host);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(CORSPolicyName);

app.UseAuthorization();

app.MapControllers();

app.Run();

