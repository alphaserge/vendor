﻿using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace chiffon_back.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class VendorsController : ControllerBase
    {
        private MapperConfiguration config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<Models.Vendor, Context.Vendor>();
                cfg.CreateMap<Context.Vendor, Models.Vendor>();
            });

        private readonly chiffon_back.Context.ChiffonDbContext ctx = Code.ContextHelper.ChiffonContext();

        private readonly ILogger<VendorsController> _logger;

        public VendorsController(ILogger<VendorsController> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name = "Vendors")]
        public IEnumerable<Models.Vendor> Get()
        {
            return ctx.Vendors.OrderBy(x => x.VendorName)
                .Select(x =>
                    config.CreateMapper()
                        .Map<Models.Vendor>(x))
                .ToList();

            /*return Enumerable.Range(1, 5).Select(index => new Vendor
            {
                Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            })
            .ToArray();*/
        }


        [HttpPost(Name = "Vendors")]
        public ActionResult<Models.Vendor> Post1(Models.Vendor Vendor)
        {
            try
            {
                Context.Vendor vendor = config.CreateMapper()
                    .Map<Context.Vendor>(Vendor);

                ctx.Vendors.Add(vendor);
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
