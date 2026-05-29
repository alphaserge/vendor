using AutoMapper;
using chiffon_back.Code;
using chiffon_back.Context;
using chiffon_back.Models;
using DocumentFormat.OpenXml.Office2010.Excel;
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
    [ApiController]
    [Route("[controller]")]
    [EnableCors(origins: "http://185.40.31.18:3000,http://185.40.31.18:3010", headers: "*", methods: "*")]
    public class ProductDesignsController : ControllerBase
    {
        private MapperConfiguration config = new MapperConfiguration(cfg =>
            {
                /**/
                cfg.CreateMap<Models.Product, Context.Product>();
                cfg.CreateMap<Models.ProductDesign, Context.ProductDesign>();
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
                cfg.CreateMap<Context.ProductDesign, Models.ProductDesign>();
            });

        private readonly chiffon_back.Context.ChiffonDbContext ctx = Code.ContextHelper.ChiffonContext();

        private readonly ILogger<ProductDesignsController> _logger;

        public ProductDesignsController(ILogger<ProductDesignsController> logger)
        {
            _logger = logger;
        }

        // временно [Authorize]
        [HttpGet("ProductDesign")]
        public Models.Product? Get([FromQuery] string id)
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
                Console.WriteLine(String.Format("{0:dd.MM.yyyy HH:mm:ss} ProductDesignsController/Product({1}): {2}", DateTime.Now, id, ex.Message));
                Console.WriteLine(String.Format("{0:dd.MM.yyyy HH:mm:ss} ProductDesignsController/Product({1}): {2}", DateTime.Now, id, ex.InnerException != null ? ex.InnerException.Message : ""));
                return null;
            }
        }

        [HttpPost("ProductDesign")]
        public IActionResult Post(Models.PostProductDesign productDesign)
        {
            int? id = ProductDesignModel.Post(productDesign);

            if (id != null)
            {
                return CreatedAtAction(nameof(Models.ProductDesign), new { Id = id }); ;
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpPost("ImportFile")]
        public /*async*/ ActionResult ImportFile([FromForm] IFormFile formFile, [FromForm] string uid, [FromForm] int? productDesinId)
        {
            int id = -1;
            try
            {
                string name = formFile.FileName;
                string extension = Path.GetExtension(formFile.FileName);

                if (formFile.Length > 0)
                {
                    var dirPath = Code.DirectoryHelper.ComputeDirectory(@"colors", uid);
                    Code.DirectoryHelper.CreateDirectoryIfMissing(dirPath);
                    //var fileNumber = Directory.GetFiles(dirPath, "*.*").Count() + 1;
                    string fileName = $"{formFile.FileName}{extension}"; //$"{fileNumber}{extension}";
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

                    var productDesign = ctx.ProductDesigns.FirstOrDefault(x => x.Id == productDesinId);
                    if (productDesign != null)
                    {
                        id = productDesign.Id;
                        productDesign.PhotoUuids = PhotoHelper.AppendPhotoUuid(productDesign.PhotoUuids, uid);
                        ctx.SaveChanges();
                    }
                }
                return CreatedAtAction(nameof(Models.ProductDesign), new { Id = id }); ;
            }
            catch (Exception ex)
            {
                Console.WriteLine();
                Console.WriteLine("-----------------------------------------------------------");
                Console.WriteLine();
                Console.WriteLine(String.Format("{0:dd.MM.yyyy HH:mm:ss} ProductDesignsController/ImportFile: {1}", DateTime.Now, ex.Message));
                Console.WriteLine(String.Format("{0:dd.MM.yyyy HH:mm:ss} ProductDesignsController/ImportFile: {1}", DateTime.Now, ex.InnerException != null ? ex.InnerException.Message : ""));
                return CreatedAtAction(nameof(Models.ProductDesign), new { id = id }, false);
            }
        }

        [HttpPost("Update")]
        public ActionResult ProductUpdate(Models.PostProductDesign product)
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
                Console.WriteLine(String.Format("{0:dd.MM.yyyy HH:mm:ss} ProductDesignsController/ProductUpdate: {1}", DateTime.Now, ex.Message));
                Console.WriteLine(String.Format("{0:dd.MM.yyyy HH:mm:ss} ProductDesignsController/ProductUpdate: {1}", DateTime.Now, ex.InnerException != null ? ex.InnerException.Message : ""));
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
                else if (c.IsVideo)
                {
                    var prod = ctx.Products.FirstOrDefault(x => x.Id == c.ProductId);
                    prod.VideoUuids = PhotoHelper.RemovePhotoUuid(prod.VideoUuids, c.Uuid);
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

                return CreatedAtAction(nameof(Product), new { id = c.Id }, "");
            }
            catch (Exception ex)
            {
                Console.WriteLine();
                Console.WriteLine("-----------------------------------------------------------");
                Console.WriteLine();
                Console.WriteLine(String.Format("{0:dd.MM.yyyy HH:mm:ss} ProductDesignsController/RemoveColorVariant: {1}", DateTime.Now, ex.Message));
                Console.WriteLine(String.Format("{0:dd.MM.yyyy HH:mm:ss} ProductDesignsController/RemoveColorVariant: {1}", DateTime.Now, ex.InnerException != null ? ex.InnerException.Message : ""));
                return CreatedAtAction(nameof(Product), new { id = -1 }, null);
            }
        }

        [HttpPost("ProductAddCV")]
        public ActionResult AddColorVariant(Models.PostCV c)
        {
            try
            {
                Context.ColorVariant cv = new Context.ColorVariant()
                {
                    Num = c.Num.Value,
                    ProductId = c.ProductId.Value,
                    Uuid = c.Uuid
                };

                ctx.ColorVariants.Add(cv);
                ctx.SaveChanges();

                return CreatedAtAction(nameof(Product), new { id = cv.Id }, "");
            }
            catch (Exception ex)
            {
                Console.WriteLine();
                Console.WriteLine("-----------------------------------------------------------");
                Console.WriteLine();
                Console.WriteLine(String.Format("{0:dd.MM.yyyy HH:mm:ss} ProductDesignsController/AddColorVariant: {1}", DateTime.Now, ex.Message));
                Console.WriteLine(String.Format("{0:dd.MM.yyyy HH:mm:ss} ProductDesignsController/AddColorVariant: {1}", DateTime.Now, ex.InnerException != null ? ex.InnerException.Message : ""));
                return CreatedAtAction(nameof(Product), new { id = -1 }, null);
            }
        }

        // временно [Authorize]
        [HttpGet("ItemNames")]
        public IEnumerable<ProductItemName> ItemNames()
        {
            try
            {
                return ProductModel.ItemNames();
            }
            catch (Exception ex)
            {
                Console.WriteLine();
                Console.WriteLine("-----------------------------------------------------------");
                Console.WriteLine();
                Console.WriteLine(String.Format("{0:dd.MM.yyyy HH:mm:ss} ProductDesignsController/ItemNames: {1}", DateTime.Now, ex.Message));
                Console.WriteLine(String.Format("{0:dd.MM.yyyy HH:mm:ss} ProductDesignsController/ItemNames: {1}", DateTime.Now, ex.InnerException != null ? ex.InnerException.Message : ""));
            }
            return new List<ProductItemName>();
        }

        [HttpPost("ItemName")]
        public ActionResult<int> SetItemName([FromBody] Models.PostItemName data)
        {
            try
            {
                var prod = ctx.Products.FirstOrDefault(x => x.Id == data.ProductId);
                if (prod != null)
                {
                    prod.ItemName = data.ItemName;
                    ctx.SaveChanges();
                }

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
