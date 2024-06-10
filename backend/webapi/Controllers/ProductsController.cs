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
                            ImagePaths = new List<string>().ToArray(),
                            Colors = new List<string>().ToArray()
                        };

            var prod = query.FirstOrDefault();

            List<string> images = new List<string>();
            List<string> colors = new List<string>();
            List<int> nums = new List<int>();
            List<int> cvIds = new List<int>();
            foreach (var cv in ctx.ColorVariants.Where(x => x.ProductId == prod.Id).ToList())
            {
                images.AddRange(DirectoryHelper.GetImageFiles(cv.Uuid));
                colors.Add( String.Join(", ", ctx.Colors.Where(col => ctx.ColorVariantsInColors.Where(x => x.ColorVariantId == cv.Id).Select(x => x.ColorId).ToList().Contains(col.Id)).Select(col=>col.ColorName)));
                nums.Add(cv.Num);
                cvIds.Add(cv.Id);
            }
            prod.ImagePaths = images.ToArray();
            prod.Colors = colors.ToArray();
            prod.CvNums = nums.ToArray();
            prod.CvIds = cvIds.ToArray();

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

            //var query = from p in ctx.Products select p;
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
                            //Uuid = p.Uuid,
                            //ImagePath = Code.DirectoryHelper.GetFirstFileUrl(ctx.ColorVariants.FirstOrDefault(x=>x.ProductId==x.Id).Uuid),// p.Uuid),  //Code.DirectoryHelper.ComputeFileUrl(p.Uuid, p.FileName),
                            Vendor = p.Vendor.VendorName,
                            ProductStyle = p.ProductStyle.StyleName,
                            ProductType = p.ProductType.TypeName,
                            //Colors = p.ProductsInColors.Select(x => new Models.Color { Id = x.ColorId, ColorName = x.Color.ColorName }).ToArray(),
                            DesignTypes = p.ProductsInDesignTypes.Select(x => new Models.DesignType { Id = x.DesignTypeId, DesignName = x.DesignType.DesignName }).ToArray(),
                            OverWorkTypes = p.ProductsInOverWorkTypes.Select(x => new Models.OverWorkType { Id = x.OverWorkTypeId, OverWorkName = x.OverWorkType.OverWorkName }).ToArray(),
                            Seasons = p.ProductsInSeasons.Select(x => new Models.Season { Id = x.SeasonId, SeasonName = x.Season.SeasonName }).ToArray(),
                        };

            if (!String.IsNullOrEmpty(name))
            {
                query = query.Where(x => x.ItemName.ToLower().Contains(name.ToLower()));
            }
            if (!String.IsNullOrEmpty(artNo))
            {
                query = query.Where(x => x.ArtNo.ToLower().Contains(artNo.ToLower()));
            }
            if (!String.IsNullOrEmpty(refNo))
            {
                query = query.Where(x => x.RefNo.ToLower().Contains(refNo.ToLower()));
            }
            if (!String.IsNullOrEmpty(design))
            {
                query = query.Where(x => x.Design.ToLower().Contains(design.ToLower()));
            }

            List<int?> colorsIds = new List<int?>();
            if (!String.IsNullOrWhiteSpace(colors))
            {
                int?[] icolors = JsonConvert.DeserializeObject<int?[]>(colors);
                if (icolors.Length > 0)
                    colorsIds = (from cv in ctx.ColorVariants
                                 join cc in ctx.ColorVariantsInColors on cv.Id equals cc.ColorVariantId
                                 where icolors.Contains(cc.ColorId)
                                 select cv.ProductId as int?).Distinct().ToList();
                int a = 0;
            }

            List<int?> seasonsIds = new List<int?>();
            if (!String.IsNullOrWhiteSpace(seasons))
            {
                int[] iseasons = JsonConvert.DeserializeObject<int[]>(seasons);
                if (iseasons.Length > 0)
                    seasonsIds = (from ps in ctx.ProductsInSeasons where iseasons.Contains(ps.SeasonId) select ps.ProductId as int?).Distinct().ToList();
            }

            List<int?> overworkIds = new List<int?>();
            if (!String.IsNullOrWhiteSpace(overworks))
            {
                int[] ioverworks = JsonConvert.DeserializeObject<int[]>(overworks);
                if (ioverworks.Length > 0)
                    overworkIds = (from po in ctx.ProductsInOverWorkTypes where ioverworks.Contains(po.OverWorkTypeId) select po.ProductId as int?).Distinct().ToList();
            }

            List<int?> designTypesIds = new List<int?>();
            if (!String.IsNullOrWhiteSpace(designTypes))
            {
                int[] idesignTypes = JsonConvert.DeserializeObject<int[]>(designTypes);
                if (idesignTypes.Length > 0)
                    designTypesIds = (from ps in ctx.ProductsInDesignTypes where idesignTypes.Contains(ps.DesignTypeId) select ps.ProductId as int?).Distinct().ToList();
            }

            List<int?> ids = colorsIds.Union(seasonsIds).Union(overworkIds).Union(designTypesIds).Distinct().ToList();

            if (ids.Count > 0)
                query = query.Where(x => ids.Contains(x.Id));

            var prods = query.ToList();

            foreach (var p in prods)
            {
                List<string> images = new List<string>();
                foreach (var cv in ctx.ColorVariants.Where(x => x.ProductId == p.Id).ToList())
                {
                    images.AddRange(DirectoryHelper.GetImageFiles(cv.Uuid));
                }
                p.ImagePaths = images.ToArray();
            }

            return prods;
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
