using AutoMapper;
using chiffon_back.Context;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Net;
using System.Net.Http;

namespace chiffon_back.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProductsController : ControllerBase
    {
        private MapperConfiguration config = new MapperConfiguration(cfg =>
            {
                /**/
                cfg.CreateMap<Models.Product, Context.Product>();
                cfg.CreateMap<Models.PostProduct, Context.Product>();
                cfg.CreateMap<Models.Color, Context.Color>();
                cfg.CreateMap<Models.Season, Context.Season>();
                cfg.CreateMap<Models.DesignType, Context.DesignType>();
                cfg.CreateMap<Models.OverWorkType, Context.OverWorkType>();
                cfg.CreateMap<Models.ProductsInColors, Context.ProductsInColors>();
                cfg.CreateMap<Models.ProductsInDesignTypes, Context.ProductsInDesignTypes>();
                cfg.CreateMap<Models.ProductsInOverWorkTypes, Context.ProductsInOverWorkTypes>();
                cfg.CreateMap<Models.ProductsInSeasons, Context.ProductsInSeasons>();
                cfg.CreateMap<Models.ProductStyle, Context.ProductStyle>();
                cfg.CreateMap<Models.ProductType, Context.ProductType>();
                cfg.CreateMap<Models.Vendor, Context.Vendor>();

                cfg.CreateMap<Context.Color, Models.Color>();
                cfg.CreateMap<Context.Season, Models.Season>();
                cfg.CreateMap<Context.DesignType, Models.DesignType>();
                cfg.CreateMap<Context.OverWorkType, Models.OverWorkType>();
                cfg.CreateMap<Context.ProductsInColors, Models.ProductsInColors>();
                cfg.CreateMap<Context.ProductsInDesignTypes, Models.ProductsInDesignTypes>();
                cfg.CreateMap<Context.ProductsInOverWorkTypes, Models.ProductsInOverWorkTypes>();
                cfg.CreateMap<Context.ProductsInSeasons, Models.ProductsInSeasons>();
                cfg.CreateMap<Context.ProductStyle, Models.ProductStyle>();
                cfg.CreateMap<Context.ProductType, Models.ProductType>();
                cfg.CreateMap<Context.Vendor, Models.Vendor>();
                cfg.CreateMap<Context.Product, Models.Product>();

            });

        private readonly chiffon_back.Context.ChiffonDbContext ctx = Code.ContextHelper.ChiffonContext();

        private readonly ILogger<ProductsController> _logger;

        public ProductsController(ILogger<ProductsController> logger)
        {
            _logger = logger;
        }

        // временно [Authorize]
        [HttpGet(Name = "Products")]
        public IEnumerable<Models.Product> Get()
        {
            var query = from p in ctx.Products
                        select new Models.Product
                        {
                            Id = p.Id,
                            RefNo = p.RefNo,
                            ArtNo = p.ArtNo,
                            ItemName = p.ItemName,
                            Design = p.Design,
                            //ColorNo = p.ColorNo,
                            //ColorName = p.ColorName,
                            PhotoDir = p.PhotoDir,
                            Price = p.Price,
                            Weight = p.Weight,
                            Width = p.Width,
                            ProductStyleId = p.ProductStyleId,
                            ProductTypeId = p.ProductTypeId,
                            VendorId = p.VendorId,
                            Uuid = p.Uuid,
                            ImagePath = Code.DirectoryHelper.GetFirstFileUrl(ctx.ColorVariants.FirstOrDefault(x=>x.ProductId==x.Id).Uuid),// p.Uuid),  //Code.DirectoryHelper.ComputeFileUrl(p.Uuid, p.FileName),
                            Vendor = p.Vendor.VendorName,
                            ProductStyle = p.ProductStyle.StyleName,
                            ProductType = p.ProductType.TypeName,
                            //Colors = p.ProductsInColors.Select(x => new Models.Color { Id = x.ColorId, ColorName = x.Color.ColorName }).ToArray(),
                            DesignTypes = p.ProductsInDesignTypes.Select(x => new Models.DesignType { Id = x.DesignTypeId, DesignName = x.DesignType.DesignName }).ToArray(),
                            OverWorkTypes = p.ProductsInOverWorkTypes.Select(x => new Models.OverWorkType { Id = x.OverWorkTypeId, OverWorkName = x.OverWorkType.OverWorkName }).ToArray(),
                            Seasons = p.ProductsInSeasons.Select(x => new Models.Season { Id = x.SeasonId, SeasonName = x.Season.SeasonName }).ToArray(),
                        };

            return query.ToList();

            /*return ctx.Products
                .Select(x =>
                    config.CreateMapper()
                        .Map<Models.Product>(x))
                .ToList();*/


            /*return Enumerable.Range(1, 5).Select(index => new Product
            {
                Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            })
            .ToArray();*/
        }


        [HttpPost("ImportFile")]
        public /*async*/ ActionResult ImportFile([FromForm] IFormFile formFile, [FromForm] string uid)
        {
            try
            {
                string name = formFile.FileName;
                string extension = Path.GetExtension(formFile.FileName);

                if (formFile.Length > 0)
                {
                    var dirPath = Code.DirectoryHelper.ComputeDirectory(@"colors", uid);
                    Code.DirectoryHelper.CreateDirectoryIfMissing(dirPath);
                    var fileNumber = Directory.GetFiles(dirPath, "*.*").Count() + 1;
                    string fileName = $"{fileNumber}{extension}";
                    string filePath = Path.Combine(dirPath, fileName); //Code.DirectoryHelper.ComputeFilePath(uid, extension);

                    using (var stream = System.IO.File.Create(filePath))
                    {
                        //await formFile.CopyToAsync(stream);
                        formFile.CopyTo(stream);
                    }

                    /*Context.ColorVariant? prod = ctx.ColorVariants.FirstOrDefault(x => x.Uuid == uid);
                    if (prod != null)
                    {
                        prod.FileName = fileName;
                    }*/
                    ctx.SaveChanges();
                }
                return CreatedAtAction(nameof(Get), new { id = -1 }, true);

                //read the file
                using (var memoryStream = new MemoryStream())
                {
                    formFile.CopyTo(memoryStream);
                    using (FileStream file = new FileStream(uid + "." + extension, FileMode.Create, System.IO.FileAccess.Write))
                    {
                        byte[] bytes = new byte[memoryStream.Length];
                        memoryStream.Read(bytes, 0, (int)memoryStream.Length);
                        file.Write(bytes, 0, bytes.Length);
                        memoryStream.Close();
                        file.Close();
                    }
                }

                //do something with the file here
                return CreatedAtAction(nameof(Get), new { id = -1 }, true);
            }
            catch(Exception ex)
            {
                return CreatedAtAction(nameof(Get), new { id = -1 }, false);
            }
        }

        [HttpPost(Name = "Products")]
        public ActionResult Post(Models.PostProduct product)
        {
            try
            {
                Context.Product prod = config.CreateMapper()
                    .Map<Context.Product>(product);

                ctx.Products.Add(prod);
                ctx.SaveChanges();

                if (product.ColorVariants != null)
                {
                    foreach (var item in product.ColorVariants)
                    {
                        Context.ColorVariant cv = new Context.ColorVariant()
                        {
                            ProductId = prod.Id,
                            Uuid = item.Id,
                        };

                        ctx.ColorVariants.Add(cv);
                        ctx.SaveChanges(true);

                        foreach (var colorId in item.ColorIds != null ? item.ColorIds : [])
                        {
                            ctx.ColorVariantsInColors.Add(new Context.ColorVariantsInColors()
                            {
                                ColorVariantId = cv.Id,
                                ColorId = colorId,
                            });
                        }
                        ctx.SaveChanges(true);
                    }
                }

                return CreatedAtAction(nameof(Get), new { id = prod.Id }, prod);
            }
            catch (Exception ex)
            {
                return CreatedAtAction(nameof(Get), new { id = -1 }, null);
            }
        }
    }
}
