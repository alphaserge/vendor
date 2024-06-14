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

namespace chiffon_back.Controllers
{
    public class ProductsQuery
    {
        public string? foo { get; set; }
        public int[]? colors { get; set; }
    }

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
        [HttpGet("Product")]
        public Models.Product GetProduct([FromQuery] string id)
        {
            var id1 = HttpContext.Request.Query["id"];

            var query = from p in ctx.Products where p.Id.ToString() == id
                        select new Models.Product
                        {
                            Id = p.Id,
                            RefNo = p.RefNo,
                            ArtNo = p.ArtNo,
                            ItemName = p.ItemName,
                            Design = p.Design,
                            Price = p.Price,
                            Weight = p.Weight,
                            Width = p.Width,
                            ProductStyleId = p.ProductStyleId,
                            ProductTypeId = p.ProductTypeId,
                            VendorId = p.VendorId,
                            Vendor = p.Vendor.VendorName,
                            ProductStyle = p.ProductStyleId.ToString(),
                            ProductType = p.ProductTypeId.ToString(),
                            DesignTypeIds = p.ProductsInDesignTypes.Select(x => x.DesignTypeId).ToArray(),
                            OverWorkTypeIds = p.ProductsInOverWorkTypes.Select(x => x.OverWorkTypeId).ToArray(),
                            SeasonIds = p.ProductsInSeasons.Select(x => x.SeasonId).ToArray(),
                            Colors = new List<ProductColor>(),
                            //ImagePaths = new List<string>().ToArray(),
                            //Colors = new List<string>().ToArray()
                        };

            var prod = query.FirstOrDefault();

            //List<string> images = new List<string>();
            //List<string> colors = new List<string>();
            //List<int> nums = new List<int>();
            //List<int> cvIds = new List<int>();
            foreach (var cv in ctx.ColorVariants.Where(x => x.ProductId == prod.Id).ToList())
            {
                //images.AddRange(DirectoryHelper.GetImageFiles(cv.Uuid));
                //colors.Add( );
                //nums.Add(cv.Num);
                //cvIds.Add(cv.Id);
                string colors = String.Join(", ", 
                    ctx.Colors.Where(col => 
                        ctx.ColorVariantsInColors
                        .Where(x => 
                            x.ColorVariantId == cv.Id)
                        .Select(x => x.ColorId)
                        .ToList()
                        .Contains(col.Id))
                    .Select(col => col.ColorName));
                prod.Colors.Add(new ProductColor()
                {
                    Color = colors,
                    CvId = cv.Id,
                    CvNum = cv.Num,
                    ImagePath = DirectoryHelper.GetImageFiles(cv.Uuid)
                });
            }
            if (!String.IsNullOrWhiteSpace(prod.Uuid))
            {
                prod.Colors.Add(new ProductColor()
                {
                    Color = "COMMON",
                    CvId = 0,
                    CvNum = 0,
                    ImagePath = DirectoryHelper.GetImageFiles(prod.Uuid)
                });
            }
            //prod.ImagePaths = images.ToArray();
            //prod.Colors = colors.ToArray();
            //prod.CvNums = nums.ToArray();
            //prod.CvIds = cvIds.ToArray();

            return prod;
        }


        // временно [Authorize]
        [HttpGet("Products")]
        public IEnumerable<Models.Product> Get()//[FromQuery] string colors, [FromQuery] string name) //ProductsQuery query1)
        {
            var name = HttpContext.Request.Query["name"].ToString();
            var artNo = HttpContext.Request.Query["artno"].ToString();
            var refNo = HttpContext.Request.Query["refno"].ToString();
            var design = HttpContext.Request.Query["design"].ToString();
            string colors = HttpContext.Request.Query["colors"].ToString();
            string seasons = HttpContext.Request.Query["seasons"].ToString();
            string overworks = HttpContext.Request.Query["overworks"].ToString();
            string designTypes = HttpContext.Request.Query["designtypes"].ToString();

            return new List<Models.Product>();
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

        [HttpPost("ProductAdd")]
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
                            Num = item.No
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

                if (product.DesignTypes!= null)
                {
                    foreach (var item in product.DesignTypes)
                    {
                        Context.ProductsInDesignTypes cv = new Context.ProductsInDesignTypes()
                        {
                            ProductId = prod.Id,
                            DesignTypeId = item
                        };

                        ctx.ProductsInDesignTypes.Add(cv);
                        ctx.SaveChanges(true);
                    }
                }

                if (product.Seasons != null)
                {
                    foreach (var item in product.Seasons)
                    {
                        Context.ProductsInSeasons cv = new Context.ProductsInSeasons()
                        {
                            ProductId = prod.Id,
                            SeasonId = item
                        };

                        ctx.ProductsInSeasons.Add(cv);
                        ctx.SaveChanges(true);
                    }
                }

                if (product.OverWorkTypes != null)
                {
                    foreach (var item in product.OverWorkTypes)
                    {
                        Context.ProductsInOverWorkTypes cv = new Context.ProductsInOverWorkTypes()
                        {
                            ProductId = prod.Id,
                            OverWorkTypeId = item
                        };

                        ctx.ProductsInOverWorkTypes.Add(cv);
                        ctx.SaveChanges(true);
                    }
                }

                return CreatedAtAction(nameof(Get), new { id = prod.Id }, "");
            }
            catch (Exception ex)
            {
                return CreatedAtAction(nameof(Get), new { id = -1 }, null);
            }
        }

        [HttpPost("ProductUpdate")]
        public ActionResult Update(Models.PostProduct product)
        {
            try
            {
                Context.Product prod = ctx.Products.Where(x => x.Id == product.Id).FirstOrDefault();
                if (prod != null)
                {
                    prod.ArtNo = product.ArtNo;
                    prod.RefNo = product.RefNo;
                    prod.Design = product.Design;
                    prod.ItemName = product.ItemName;
                    prod.Price = product.Price;
                    prod.ProductStyleId = product.ProductStyleId;
                    prod.ProductTypeId = product.ProductTypeId;
                    prod.VendorId = product.VendorId;
                    prod.Weight = product.Weight;
                    prod.Width = product.Width;
                    ctx.SaveChanges();
                }

                if (product.ColorVariants != null)
                {
                    foreach (var item in product.ColorVariants)
                    {
                        Context.ColorVariant cv = new Context.ColorVariant()
                        {
                            ProductId = prod.Id,
                            Uuid = item.Id,
                            Num = item.No
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

                ctx.ProductsInDesignTypes.RemoveRange(ctx.ProductsInDesignTypes.Where(x=>x.ProductId==prod.Id));
                if (product.DesignTypes != null)
                {
                    foreach (var item in product.DesignTypes)
                    {
                        Context.ProductsInDesignTypes cv = new Context.ProductsInDesignTypes()
                        {
                            ProductId = prod.Id,
                            DesignTypeId = item
                        };

                        ctx.ProductsInDesignTypes.Add(cv);
                        ctx.SaveChanges(true);
                    }
                }

                ctx.ProductsInSeasons.RemoveRange(ctx.ProductsInSeasons.Where(x => x.ProductId == prod.Id));
                if (product.Seasons != null)
                {
                    foreach (var item in product.Seasons)
                    {
                        Context.ProductsInSeasons cv = new Context.ProductsInSeasons()
                        {
                            ProductId = prod.Id,
                            SeasonId = item
                        };

                        ctx.ProductsInSeasons.Add(cv);
                        ctx.SaveChanges(true);
                    }
                }

                ctx.ProductsInOverWorkTypes.RemoveRange(ctx.ProductsInOverWorkTypes.Where(x => x.ProductId == prod.Id));
                if (product.OverWorkTypes != null)
                {
                    foreach (var item in product.OverWorkTypes)
                    {
                        Context.ProductsInOverWorkTypes cv = new Context.ProductsInOverWorkTypes()
                        {
                            ProductId = prod.Id,
                            OverWorkTypeId = item
                        };

                        ctx.ProductsInOverWorkTypes.Add(cv);
                        ctx.SaveChanges(true);
                    }
                }

                return CreatedAtAction(nameof(Get), new { id = prod.Id }, "");
            }
            catch (Exception ex)
            {
                return CreatedAtAction(nameof(Get), new { id = -1 }, null);
            }
        }

        [HttpPost("ProductRemoveCV")]
        public ActionResult RemoveColorVariant(Models.PostCV c)
        {
            try
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
                        ctx.SaveChanges();
                        
                    }
                }

                return CreatedAtAction(nameof(Get), new { id = cv.Id }, "");
            }
            catch (Exception ex)
            {
                return CreatedAtAction(nameof(Get), new { id = -1 }, null);
            }
        }

    }
}
