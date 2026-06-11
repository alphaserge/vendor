using AutoMapper;
using chiffon_back.Code;
using chiffon_back.Context;
using chiffon_back.Models;
using DocumentFormat.OpenXml.Wordprocessing;
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
    [EnableCors(origins: "http://185.40.31.18:3000,http://185.40.31.18:3010", headers: "*", methods: "*")]
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
                cfg.CreateMap<Models.DressGroup, Context.DressGroup>();
                cfg.CreateMap<Models.OverWorkType, Context.OverWorkType>();
                cfg.CreateMap<Models.ProductDesignsInDesignTypes, Context.ProductDesignsInDesignTypes>();
                cfg.CreateMap<Models.ProductsInDressGroups, Context.ProductsInDressGroups>();
                cfg.CreateMap<Models.ProductsInOverWorkTypes, Context.ProductsInOverWorkTypes>();
                cfg.CreateMap<Models.ProductsInSeasons, Context.ProductsInSeasons>();
                cfg.CreateMap<Models.ProductStyle, Context.ProductStyle>();
                cfg.CreateMap<Models.ProductType, Context.ProductType>();
                cfg.CreateMap<Models.Vendor, Context.Vendor>();

                cfg.CreateMap<Context.Color, Models.Color>();
                cfg.CreateMap<Context.Season, Models.Season>();
                cfg.CreateMap<Context.DesignType, Models.DesignType>();
                cfg.CreateMap<Context.DressGroup, Models.DressGroup>();
                cfg.CreateMap<Context.OverWorkType, Models.OverWorkType>();
                cfg.CreateMap<Context.ProductDesignsInDesignTypes, Models.ProductDesignsInDesignTypes>();
                cfg.CreateMap<Context.ProductsInDressGroups, Models.ProductsInDressGroups>();
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
        public Models.Product? Product([FromQuery] string id)
        {
            try
            {
                return ProductModel.Get(id);
            }
            catch (Exception ex)
            {
                Console.WriteLine();
                Console.WriteLine("-----------------------------------------------------------");
                Console.WriteLine();
                Console.WriteLine(String.Format("{0:dd.MM.yyyy HH:mm:ss} ProductsController/Product({1}): {2}", DateTime.Now, id, ex.Message));
                Console.WriteLine(String.Format("{0:dd.MM.yyyy HH:mm:ss} ProductsController/Product({1}): {2}", DateTime.Now, id, ex.InnerException != null ? ex.InnerException.Message : ""));
            }
            return null;
        }

        // временно [Authorize]
        [HttpGet("Products")]
        public IEnumerable<Models.ProductJoinDesign> Products([FromQuery] string id)
        {
            try
            {
                var user = ctx.Users.FirstOrDefault(x => x.Id.ToString() == id);
                int? vendorId = user != null ? user.VendorId : 0;

                if (vendorId < 0) vendorId = 0;

                var prods = ProductModel.ProductJoinDesign(new ProductFilter()
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
                    DressGroups = HttpContext.Request.Query["dressgroups"].ToString(),
                    PrintTypes = HttpContext.Request.Query["printypes"].ToString(),
                    ProductTypes = HttpContext.Request.Query["producttypes"].ToString(),
                    TextileTypes = HttpContext.Request.Query["textiletypes"].ToString(),
                    ShowNullPrice = HttpContext.Request.Query["shownullprice"].ToString().ToLower()=="true",
                }, true);

                return prods;
            }
            catch (Exception ex)
            {
                Console.WriteLine();
                Console.WriteLine("-----------------------------------------------------------");
                Console.WriteLine();
                Console.WriteLine(String.Format("{0:dd.MM.yyyy HH:mm:ss} ProductsController/Products: {1}", DateTime.Now, ex.Message));
                Console.WriteLine(String.Format("{0:dd.MM.yyyy HH:mm:ss} ProductsController/Products: {1}", DateTime.Now, ex.InnerException != null ? ex.InnerException.Message : ""));
            }

            return new List<Models.ProductJoinDesign>();
        }

        [HttpPost("LoadMedia")]
        public /*async*/ ActionResult LoadMedia([FromForm] IFormFile formFile, [FromForm] string? productId, [FromForm] string type)
        {
            try
            {
                string name = formFile.FileName;
                string extension = Path.GetExtension(formFile.FileName);

                if (formFile.Length > 0)
                {
                    
                    var product = ctx.Products.FirstOrDefault(x => x.Id.ToString() == productId);

                    if (product != null)
                    {
                        string? uid = product.Uuid;
                        if (uid != null)                        
                        {
                            uid = Guid.NewGuid().ToString();
                        }

                        var dirPath = Code.DirectoryHelper.ComputeDirectory(@"colors", uid!);
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
                        switch (type.ToUpper())
                        {
                            case "photo": product.PhotoUuid = uid; break;
                            case "video": product.VideoUuid = uid; break;
                        }
                    }
                }
                return Ok();

            }
            catch(Exception ex)
            {
                Console.WriteLine();
                Console.WriteLine("-----------------------------------------------------------");
                Console.WriteLine();
                Console.WriteLine(String.Format("{0:dd.MM.yyyy HH:mm:ss} ProductsController/ImportFile: {1}", DateTime.Now, ex.Message));
                Console.WriteLine(String.Format("{0:dd.MM.yyyy HH:mm:ss} ProductsController/ImportFile: {1}", DateTime.Now, ex.InnerException != null ? ex.InnerException.Message : ""));
                return BadRequest(ex);
            }
        }

        [HttpPost("ImportProducts")]
        public /*async*/ ActionResult ImportProducts([FromForm] IFormFile formFile, [FromForm] int? vendorId)
        {
            try
            {
                if (vendorId == null)
                {
                    throw new Exception("Not vendor specified");
                }

                string name = formFile.FileName;
                string extension = Path.GetExtension(formFile.FileName);

                if (formFile.Length > 0)
                {
                    var dirPath = Path.Combine(Directory.GetCurrentDirectory(), @"files\import");
                    Code.DirectoryHelper.CreateDirectoryIfMissing(dirPath);
                    var fileNumber = Directory.GetFiles(dirPath, "*.*").Count() + 1;
                    string fileName = $"{fileNumber}{extension}";
                    string filePath = Path.Combine(dirPath, fileName);

                    // first remove all existing files in directory
                    /*System.IO.DirectoryInfo di = new DirectoryInfo(dirPath);
                    foreach (FileInfo file in di.EnumerateFiles())
                    {
                        file.Delete();
                    }*/
                    // add picture file
                    using (var stream = System.IO.File.Create(filePath))
                    {
                        //await formFile.CopyToAsync(stream);
                        formFile.CopyTo(stream);
                    }

                    ProductsImport.ReadExcelFile(filePath, vendorId.Value);

                }
                return Ok();

            }
            catch (Exception ex)
            {
                Console.WriteLine();
                Console.WriteLine("-----------------------------------------------------------");
                Console.WriteLine();
                Console.WriteLine(String.Format("{0:dd.MM.yyyy HH:mm:ss} ProductsController/ImportProducts: {1}", DateTime.Now, ex.Message));
                Console.WriteLine(String.Format("{0:dd.MM.yyyy HH:mm:ss} ProductsController/ImportProducts: {1}", DateTime.Now, ex.InnerException != null ? ex.InnerException.Message : ""));
                return CreatedAtAction(nameof(Product), new { id = -1 }, false);
            }
        }

        [HttpPost("ProductAdd")]
        public ActionResult ProductAdd(Models.PostProduct product)
        {
            try
            {
                int? id = ProductModel.Post(product);
                //test: throw new Exception();
                return CreatedAtAction(nameof(Product), new { Id = id });
            }
            catch (Exception ex)
            {
                Console.WriteLine();
                Console.WriteLine("-----------------------------------------------------------");
                Console.WriteLine();
                Console.WriteLine(String.Format("{0:dd.MM.yyyy HH:mm:ss} ProductsController/ProductAdd: {1}", DateTime.Now, ex.Message));
                Console.WriteLine(String.Format("{0:dd.MM.yyyy HH:mm:ss} ProductsController/ProductAdd: {1}", DateTime.Now, ex.InnerException != null ? ex.InnerException.Message : ""));
                return BadRequest(ex);
            }
        }

        [HttpPost("ProductUpdate")]
        public ActionResult ProductUpdate(Models.PostProduct product)
        {
            try
            {
                int? id = ProductModel.Update(product);
                return CreatedAtAction(nameof(Product), new { Id = id });
            }
            catch (Exception ex)
            {
                Console.WriteLine();
                Console.WriteLine("-----------------------------------------------------------");
                Console.WriteLine();
                Console.WriteLine(String.Format("{0:dd.MM.yyyy HH:mm:ss} ProductsController/ProductUpdate: {1}", DateTime.Now, ex.Message));
                Console.WriteLine(String.Format("{0:dd.MM.yyyy HH:mm:ss} ProductsController/ProductUpdate: {1}", DateTime.Now, ex.InnerException != null ? ex.InnerException.Message : ""));
                return BadRequest(ex);
            }
        }

    }
}
