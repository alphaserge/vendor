using AutoMapper;
using chiffon_back.Code;
using chiffon_back.Context;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;

namespace chiffon_back.Models
{
    public class ProductFilter
    {
        public int? Id { get; set; }
        public string ItemName { get; set; }
        public string RefNo { get; set; }
        public string ArtNo { get; set; }
        public string Design { get; set; }
        public decimal[] Price { get; set; }
        public int[] Weight { get; set; }
        public int[] Width { get; set; }
        public int? ProductStyleId { get; set; }
        public int? ProductTypeId { get; set; }
        public string Colors { get; set; }
        public string DesignTypes { get; set; }
        public string Seasons { get; set; }
        public string Overworks { get; set; }
        public ProductFilter()
        {
            ItemName = String.Empty;
            RefNo = String.Empty;
            ArtNo = String.Empty;
            Design = String.Empty;
            Colors = String.Empty;
            Seasons = String.Empty;
            Overworks = String.Empty;
            DesignTypes = String.Empty;
            Price = Array.Empty<decimal>();
            Weight = Array.Empty<int>();
            Width = Array.Empty<int>();
        }
    }

    public class ProductModel
    {
        private static MapperConfiguration config = new MapperConfiguration(cfg =>
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


        public static IEnumerable<Models.Product> Get(ProductFilter filter)
        {
            ChiffonDbContext ctx = ContextHelper.ChiffonContext();
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
                            PhotoUuids = p.PhotoUuids,
                            //Uuid = p.Uuid,
                            //ImagePath = Code.DirectoryHelper.GetFirstFileUrl(ctx.ColorVariants.FirstOrDefault(x=>x.ProductId==x.Id).Uuid),// p.Uuid),  //Code.DirectoryHelper.ComputeFileUrl(p.Uuid, p.FileName),
                            Vendor = p.Vendor!.VendorName,
                            ProductStyle = p.ProductStyle!.StyleName,
                            ProductType = p.ProductType!.TypeName,
                            //Colors = p.ProductsInColors.Select(x => new Models.Color { Id = x.ColorId, ColorName = x.Color.ColorName }).ToArray(),
                            DesignTypes = p.ProductsInDesignTypes!.Select(x => new Models.DesignType { Id = x.DesignTypeId, DesignName = x.DesignType.DesignName }).ToArray(),
                            OverWorkTypes = p.ProductsInOverWorkTypes!.Select(x => new Models.OverWorkType { Id = x.OverWorkTypeId, OverWorkName = x.OverWorkType.OverWorkName }).ToArray(),
                            Seasons = p.ProductsInSeasons!.Select(x => new Models.Season { Id = x.SeasonId, SeasonName = x.Season.SeasonName }).ToArray(),
                            Colors = new List<ProductColor>(),
                        };

            if (!String.IsNullOrEmpty(filter.ItemName))
            {
                query = query.Where(x => x.ItemName!.ToLower().Contains(filter.ItemName.ToLower()));
            }
            if (!String.IsNullOrEmpty(filter.ArtNo))
            {
                query = query.Where(x => x.ArtNo!.ToLower().Contains(filter.ArtNo.ToLower()));
            }
            if (!String.IsNullOrEmpty(filter.RefNo))
            {
                query = query.Where(x => x.RefNo!.ToLower().Contains(filter.RefNo.ToLower()));
            }
            if (!String.IsNullOrEmpty(filter.Design))
            {
                query = query.Where(x => x.Design!.ToLower().Contains(filter.Design.ToLower()));
            }

            List<int?> colorsIds = new List<int?>();
            if (!String.IsNullOrWhiteSpace(filter.Colors))
            {
                int[]? icolors = JsonConvert.DeserializeObject<int[]>(filter.Colors);
                if (icolors!.Length > 0)
                    colorsIds = (from cv in ctx.ColorVariants
                                 join cc in ctx.ColorVariantsInColors on cv.Id equals cc.ColorVariantId
                                 where icolors.Contains(cc.ColorId)
                                 select cv.ProductId as int?).Distinct().ToList();
                int a = 0;
            }

            List<int?> seasonsIds = new List<int?>();
            if (!String.IsNullOrWhiteSpace(filter.Seasons))
            {
                int[]? iseasons = JsonConvert.DeserializeObject<int[]>(filter.Seasons);
                if (iseasons!.Length > 0)
                    seasonsIds = (from ps in ctx.ProductsInSeasons where iseasons.Contains(ps.SeasonId) select ps.ProductId as int?).Distinct().ToList();
            }

            List<int?> overworkIds = new List<int?>();
            if (!String.IsNullOrWhiteSpace(filter.Overworks))
            {
                int[]? ioverworks = JsonConvert.DeserializeObject<int[]>(filter.Overworks);
                if (ioverworks!.Length > 0)
                    overworkIds = (from po in ctx.ProductsInOverWorkTypes where ioverworks.Contains(po.OverWorkTypeId) select po.ProductId as int?).Distinct().ToList();
            }

            List<int?> designTypesIds = new List<int?>();
            if (!String.IsNullOrWhiteSpace(filter.DesignTypes))
            {
                int[]? idesignTypes = JsonConvert.DeserializeObject<int[]>(filter.DesignTypes);
                if (idesignTypes!.Length > 0)
                    designTypesIds = (from ps in ctx.ProductsInDesignTypes where idesignTypes.Contains(ps.DesignTypeId) select ps.ProductId as int?).Distinct().ToList();
            }

            List<int?> ids = colorsIds.Union(seasonsIds).Union(overworkIds).Union(designTypesIds).Distinct().ToList();

            if (ids.Count > 0)
                query = query.Where(x => ids.Contains(x.Id));

            var prods = query.ToList();

            foreach (var p in prods)
            {
                // 1) ALL COLORS
                int id = 1;
                if (!String.IsNullOrEmpty(p.PhotoUuids))
                {
                    foreach (string uuid in PhotoHelper.GetPhotoUuids(p.PhotoUuids))
                    {
                        var imageFiles = DirectoryHelper.GetImageFiles(uuid);
                        p.Colors.Add(new ProductColor()
                        {
                            Color = "ALL COLORS",
                            CvId = -id,
                            CvNum = null,
                            ImagePath = imageFiles
                        });
                        id++;
                    }
                }

                // 2) COLOR VARIANTS
                foreach (var cv in ctx.ColorVariants.Where(x => x.ProductId == p.Id).ToList())
                {
                    var imageFiles = DirectoryHelper.GetImageFiles(cv.Uuid!);
                    string colors1 = String.Join(", ",
                                        ctx.Colors.Where(col =>
                                            ctx.ColorVariantsInColors
                                            .Where(x =>
                                                x.ColorVariantId == cv.Id)
                                            .Select(x => x.ColorId)
                                            .ToList()
                                            .Contains(col.Id))
                                        .Select(col => col.ColorName));
                    p.Colors.Add(new ProductColor()
                    {
                        Color = colors1,
                        CvId = cv.Id,
                        CvNum = cv.Num,
                        ImagePath = imageFiles
                    });
                }
            }

            /*prods.AddRange(prods);
            prods.AddRange(prods);
            prods.AddRange(prods);
            prods.AddRange(prods);*/

            return prods;
        }

        public static Models.Product? Get(string id)
        {
            ChiffonDbContext ctx = ContextHelper.ChiffonContext();
            var query = from p in ctx.Products
                        where p.Id.ToString() == id
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
                            PhotoUuids = p.PhotoUuids,
                            ProductStyleId = p.ProductStyleId,
                            ProductTypeId = p.ProductTypeId,
                            VendorId = p.VendorId,
                            Vendor = p.Vendor!.VendorName,
                            ProductStyle = p.ProductStyleId.ToString(),
                            ProductType = p.ProductTypeId.ToString(),
                            DesignTypeIds = p.ProductsInDesignTypes!.Select(x => x.DesignTypeId).ToArray(),
                            OverWorkTypeIds = p.ProductsInOverWorkTypes!.Select(x => x.OverWorkTypeId).ToArray(),
                            SeasonIds = p.ProductsInSeasons!.Select(x => x.SeasonId).ToArray(),
                            Colors = new List<ProductColor>(),
                        };

            var prod = query.FirstOrDefault();

            if (prod != null)
            {
                // 1) ALL COLORS
                int colorId = 1;
                foreach (string uuid in PhotoHelper.GetPhotoUuids(prod.PhotoUuids))
                {
                    var imageFiles = DirectoryHelper.GetImageFiles(uuid);
                    prod.Colors.Add(new ProductColor()
                    {
                        Color = "PRODUCT",
                        CvId = -colorId,
                        CvNum = null,
                        Uuid = uuid,
                        ProductId = prod.Id,
                        IsProduct = true,
                        ImagePath = imageFiles
                    });
                    colorId++;
                }

                // 2) COLOR VARIANTS
                foreach (var cv in ctx.ColorVariants.Where(x => x.ProductId == prod.Id).ToList())
                {
                    string colors = String.Join(", ",
                        ctx.Colors.Where(col =>
                            ctx.ColorVariantsInColors
                            .Where(x =>
                                x.ColorVariantId == cv.Id)
                            .Select(x => x.ColorId)
                            .ToList()
                            .Contains(col.Id))
                        .Select(col => col.ColorName));
                    prod!.Colors.Add(new ProductColor()
                    {
                        Color = colors,
                        CvId = cv.Id,
                        CvNum = cv.Num,
                        IsProduct = false,
                        ImagePath = DirectoryHelper.GetImageFiles(cv.Uuid!)
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
            }

            return prod;
        }
   
        public static int? Post(Models.PostProduct product)
        {
            ChiffonDbContext ctx = ContextHelper.ChiffonContext();

            try
            {
                Context.Product prod = config.CreateMapper()
                    .Map<Context.Product>(product);

                prod.Created = DateTime.Now;
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
                return prod.Id;
            }
            catch (Exception ex)
            {
                return null;
            }

        }

        public static bool Update(Models.PostProduct product)
        {
            ChiffonDbContext ctx = ContextHelper.ChiffonContext();

            try
            {
                Context.Product? prod = ctx.Products.Where(x => x.Id == product.Id).FirstOrDefault();
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

                    ctx.ProductsInDesignTypes.RemoveRange(ctx.ProductsInDesignTypes.Where(x => x.ProductId == prod.Id));
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
                }

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }

        }

    }
}
