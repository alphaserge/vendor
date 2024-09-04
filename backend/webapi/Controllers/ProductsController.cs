using AutoMapper;
using chiffon_back.Code;
using chiffon_back.Context;
using chiffon_back.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Net;
using System.Net.Http;
using System.Web.Http.Cors; // пространство имен CORS
//using Microsoft.AspNetCore.Cors;

namespace chiffon_back.Controllers
{
    public class ProductsQuery
    {
        public string? foo { get; set; }
        public int[]? colors { get; set; }
    }

    [ApiController]
    [Route("[controller]")]
    [EnableCors(origins: "http://185.40.31.18:3000", headers: "*", methods: "*")]
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
        [HttpGet("Product")]
        public Models.Product? GetProduct([FromQuery] string id)
        {
            return ProductModel.Get(id);
        }

        // временно [Authorize]
        [HttpGet("Products")]
        public IEnumerable<Models.Product> Get([FromQuery] string id)
        {
            var user = ctx.Users.FirstOrDefault(x => x.Id.ToString() == id);
            int? vendorId = user != null ? user.VendorId : 1;

            if (vendorId <= 0) vendorId = 1;

            var prods = ProductModel.Get(new ProductFilter()
            {
                VendorId = vendorId,
                ItemName = HttpContext.Request.Query["name"].ToString(),
                ArtNo = HttpContext.Request.Query["artno"].ToString(),
                RefNo = HttpContext.Request.Query["refno"].ToString(),
                Design = HttpContext.Request.Query["design"].ToString(),
                Search = HttpContext.Request.Query["search"].ToString(),
                Colors = HttpContext.Request.Query["colors"].ToString(),
                Seasons = HttpContext.Request.Query["seasons"].ToString(),
                Overworks = HttpContext.Request.Query["overworks"].ToString(),
                DesignTypes = HttpContext.Request.Query["designtypes"].ToString(),
            });

            return prods;
        }

        [HttpPost("ImportFile")]
        public /*async*/ ActionResult ImportFile([FromForm] IFormFile formFile, [FromForm] string uid, [FromForm] string? productId)
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
                    string filePath = Path.Combine(dirPath, fileName);

                    // first remove all existing files in directory
                    System.IO.DirectoryInfo di = new DirectoryInfo(dirPath);
                    foreach (FileInfo file in di.EnumerateFiles())
                    {
                        file.Delete();
                    }
                    // add picture file
                    using (var stream = System.IO.File.Create(filePath))
                    {
                        //await formFile.CopyToAsync(stream);
                        formFile.CopyTo(stream);
                    }
                    var product = ctx.Products.FirstOrDefault(x => x.Id.ToString() == productId);
                    if (product != null)
                    {
                        product.PhotoUuids = 
                            String.IsNullOrEmpty(product.PhotoUuids) ? uid : product.PhotoUuids + "," + uid;
                        ctx.SaveChanges();
                    }
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

        [HttpPost("ProductAdd")]
        public ActionResult Post(Models.PostProduct product)
        {
            try
            {
                int? id = ProductModel.Post(product);
                //test: throw new Exception();
                return CreatedAtAction(nameof(Get), new { Id = id });
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpPost("ProductUpdate")]
        public ActionResult Update(Models.PostProduct product)
        {
            try
            {
                int? id = ProductModel.Update(product);
                return CreatedAtAction(nameof(Get), new { Id = id });
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpPost("ProductRemoveCV")]
        public ActionResult RemoveColorVariant(Models.PostCV c)
        {
            try
            {
                if (c.IsProduct)
                {
                    var prod = ctx.Products.FirstOrDefault(x => x.Id == c.ProductId);
                    prod.PhotoUuids = PhotoHelper.RemovePhotoUuid(prod.PhotoUuids, c.Uuid);
                    ctx.SaveChanges();
                }
                else
                {
                    var cv = ctx.ColorVariants.FirstOrDefault(x => x.Id == c.Id);// && x.Num == c.Num);
                    if (cv != null)
                    {
                        var productsInCv = ctx.ColorVariantsInColors.Where(x => x.ColorVariantId == cv.Id);
                        ctx.ColorVariantsInColors.RemoveRange(productsInCv);
                        ctx.SaveChanges();
                        if (cv != null)
                        {
                            ctx.ColorVariants.RemoveRange(cv);
                        }
                        ctx.SaveChanges();
                    }
                }

                return CreatedAtAction(nameof(Get), new { id = c.Id }, "");
            }
            catch (Exception ex)
            {
                return CreatedAtAction(nameof(Get), new { id = -1 }, null);
            }
        }

    }
}
