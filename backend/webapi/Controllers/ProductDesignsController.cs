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

        [HttpPost("LoadPhoto")]
        public /*async*/ ActionResult LoadPhoto([FromForm] IFormFile formFile, [FromForm] string uid, [FromForm] int? productDesignId)
        {
            try
            {
                string name = formFile.FileName;
                string extension = Path.GetExtension(formFile.FileName);

                if (formFile.Length > 0)
                {
                    var dirPath = Code.DirectoryHelper.ComputeDirectory(@"colors", uid);
                    Code.DirectoryHelper.CreateDirectoryIfMissing(dirPath);
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

                    var productDesign = ctx.ProductDesigns.FirstOrDefault(x => x.Id == productDesignId);
                    if (productDesign != null)
                    {
                        productDesign.PhotoUuids = PhotoHelper.AppendPhotoUuid(productDesign.PhotoUuids, uid);
                        ctx.SaveChanges();
                    }
                }
                return Ok();
            }
            catch (Exception ex)
            {
                Console.WriteLine();
                Console.WriteLine("-----------------------------------------------------------");
                Console.WriteLine();
                Console.WriteLine(String.Format("{0:dd.MM.yyyy HH:mm:ss} ProductDesignsController/ImportFile: {1}", DateTime.Now, ex.Message));
                Console.WriteLine(String.Format("{0:dd.MM.yyyy HH:mm:ss} ProductDesignsController/ImportFile: {1}", DateTime.Now, ex.InnerException != null ? ex.InnerException.Message : ""));
                return BadRequest(ex);
            }
        }

        [HttpPost("LoadColorPhoto")]
        public /*async*/ ActionResult LoadColorPhoto([FromForm] IFormFile formFile, [FromForm] int? colorVariantId)
        {
            try
            {
                string name = formFile.FileName;
                string extension = Path.GetExtension(formFile.FileName);

                if (formFile.Length > 0)
                {
                    var colorVariant = ctx.ColorVariants.FirstOrDefault(x => x.Id == colorVariantId);
                    if (colorVariant != null)
                    {
                        var dirPath = Code.DirectoryHelper.ComputeDirectory(@"colors", colorVariant.Uuid);
                        Code.DirectoryHelper.CreateDirectoryIfMissing(dirPath);
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
                    }
                }
                return Ok();
            }
            catch (Exception ex)
            {
                Console.WriteLine();
                Console.WriteLine("-----------------------------------------------------------");
                Console.WriteLine();
                Console.WriteLine(String.Format("{0:dd.MM.yyyy HH:mm:ss} ProductDesignsController/ImportFile: {1}", DateTime.Now, ex.Message));
                Console.WriteLine(String.Format("{0:dd.MM.yyyy HH:mm:ss} ProductDesignsController/ImportFile: {1}", DateTime.Now, ex.InnerException != null ? ex.InnerException.Message : ""));
                return BadRequest();
            }
        }

        [HttpPost("Update")]
        public ActionResult ProductDesignUpdate(Models.PostProductDesign productDesign)
        {
            try
            {
                int? id = ProductDesignModel.Update(productDesign);
                return CreatedAtAction(nameof(Models.ProductDesign), new { Id = id });
            }
            catch (Exception ex)
            {
                Console.WriteLine();
                Console.WriteLine("-----------------------------------------------------------");
                Console.WriteLine();
                Console.WriteLine(String.Format("{0:dd.MM.yyyy HH:mm:ss} ProductDesignsController/Update: {1}", DateTime.Now, ex.Message));
                Console.WriteLine(String.Format("{0:dd.MM.yyyy HH:mm:ss} ProductDesignsController/Update: {1}", DateTime.Now, ex.InnerException != null ? ex.InnerException.Message : ""));
                return BadRequest(ex);
            }
        }

        [HttpPost("RemovePhoto")]
        public ActionResult RemovePhoto(int? productDesignId, string uuid)
        {
            try
            {
                var productDesign = ctx.ProductDesigns.FirstOrDefault(x => x.Id == productDesignId);
                if (productDesign != null) { 
                    productDesign.PhotoUuids = PhotoHelper.RemovePhotoUuid(productDesign.PhotoUuids, uuid);
                    ctx.SaveChanges();
                    //todo: need delete file
                }
                return Ok();
            }
            catch (Exception ex)
            {
                Console.WriteLine();
                Console.WriteLine("-----------------------------------------------------------");
                Console.WriteLine();
                Console.WriteLine(String.Format("{0:dd.MM.yyyy HH:mm:ss} ProductDesignsController/RemovePhoto: {1}", DateTime.Now, ex.Message));
                Console.WriteLine(String.Format("{0:dd.MM.yyyy HH:mm:ss} ProductDesignsController/RemovePhoto: {1}", DateTime.Now, ex.InnerException != null ? ex.InnerException.Message : ""));
                return BadRequest(ex);
            }
        }

        [HttpPost("AddColorVariant")]
        public ActionResult AddColorVariant(Models.AddColorVariant c)
        {
            try
            {
                Context.ColorVariant cv = new Context.ColorVariant()
                {
                    ColorNo = c.ColorNo,
                    Price = c.Price,
                    Uuid = c.Uuid,
                    ProductDesignId = c.ProductDesignId,
                };

                ctx.ColorVariants.Add(cv);
                ctx.SaveChanges();

                return Ok(cv.Id);
            }
            catch (Exception ex)
            {
                Console.WriteLine();
                Console.WriteLine("-----------------------------------------------------------");
                Console.WriteLine();
                Console.WriteLine(String.Format("{0:dd.MM.yyyy HH:mm:ss} ProductDesignsController/AddColorVariant: {1}", DateTime.Now, ex.Message));
                Console.WriteLine(String.Format("{0:dd.MM.yyyy HH:mm:ss} ProductDesignsController/AddColorVariant: {1}", DateTime.Now, ex.InnerException != null ? ex.InnerException.Message : ""));
                return BadRequest(ex);
            }
        }


    }
}
