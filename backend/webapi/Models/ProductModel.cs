using AutoMapper;
using chiffon_back.Code;
using chiffon_back.Context;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Linq;

namespace chiffon_back.Models
{
    public class ProductFilter
    {
        public int? VendorId { get; set; }
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
        public string PrintTypes { get; set; }
        public string ProductTypes { get; set; }
        public string DesignTypes { get; set; }
        public string Seasons { get; set; }
        public string Overworks { get; set; }
        public string TextileTypes { get; set; }
        public string Search { get; set; }
        public ProductFilter()
        {
            VendorId = 0;

            ItemName = String.Empty;
            RefNo = String.Empty;
            ArtNo = String.Empty;
            Design = String.Empty;
            Colors = String.Empty;
            Seasons = String.Empty;
            Overworks = String.Empty;
            DesignTypes = String.Empty;
            TextileTypes = String.Empty;
            PrintTypes = String.Empty;
            ProductTypes = String.Empty;
            Search = String.Empty;
            Price = Array.Empty<decimal>();
            Weight = Array.Empty<int>();
            Width = Array.Empty<int>();
        }
    }

    public class CompositionItem
    {
        public int TextileTypeId { get; set; }
        public int Value { get; set; }
        public string TextileTypeName { get; set; }
    }

    public class CompositionList
    {
        public int? ProductId { get; set; }
        public List<CompositionItem> TextileTypes { get; set; }
        public string? Composition { get; set; }

        public CompositionList()
        {
            TextileTypes = new List<CompositionItem>();
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
                            Price1 = Helper.Round(p.Price * 1.05m, 2),
                            Price2 = Helper.Round(p.Price * 1.10m, 2),
                            Stock = p.Stock,
                            RollLength = p.RollLength,
                            Weight = p.Weight,
                            Width = p.Width,
                            ProductStyleId = p.ProductStyleId,
                            ProductTypeId = p.ProductTypeId,
                            PrintTypeId = p.PrintTypeId,
                            DyeStaffId = p.DyeStaffId,
                            PlainDyedTypeId = p.PlainDyedTypeId,
                            FinishingId = p.FinishingId,
                            VendorId = p.VendorId,
                            Uuid = p.Uuid,
                            PhotoUuids = p.PhotoUuids,
                            VideoUuids = p.VideoUuids,
                            Vendor = p.Vendor!.VendorName,
                            ProductStyle = p.ProductStyle!.StyleName,
                            ProductType = p.ProductType!.TypeName,
                            PrintType = p.PrintType!.TypeName,
                            DyeStaff = p.DyeStaff!.DyeStaffName,
                            Finishing = p.Finishing!.FinishingName,
                            PlainDyedType = p.PlainDyedType!.PlainDyedTypeName,
                            Findings = p.Findings,
                            GSM = p.GSM,
                            MetersInKG = p.MetersInKG,
                            FabricConstruction = p.FabricConstruction,
                            FabricYarnCount = p.FabricYarnCount,
                            ColorFastness = p.ColorFastness,
                            TextileTypes = p.ProductsInTextileTypes!.Select(x => new Models.TextileType { Id = x.TextileTypeId, TextileTypeName = x.TextileType.TextileTypeName, TextileTypeNameRu = x.TextileType.TextileTypeNameRu }).ToArray(),
                            DesignTypes = p.ProductsInDesignTypes!.Select(x => new Models.DesignType { Id = x.DesignTypeId, DesignName = x.DesignType.DesignName }).ToArray(),
                            OverWorkTypes = p.ProductsInOverWorkTypes!.Select(x => new Models.OverWorkType { Id = x.OverWorkTypeId, OverWorkName = x.OverWorkType.OverWorkName }).ToArray(),
                            Seasons = p.ProductsInSeasons!.Select(x => new Models.Season { Id = x.SeasonId, SeasonName = x.Season.SeasonName }).ToArray(),
                            Colors = new List<ProductColor>(),
                            //Composition = p.Composition
                        };

            if (filter.VendorId > 2)
            {
                query = query.Where(x => x.VendorId == filter.VendorId);
            }

            if (!String.IsNullOrEmpty(filter.Search))
            {
                query = query.Where(x => 
                    x.ItemName!.ToLower().Contains(filter.Search.ToLower()) ||
                    x.ArtNo!.ToLower().Contains(filter.Search.ToLower()) ||
                    x.RefNo!.ToLower().Contains(filter.Search.ToLower()) ||
                    x.Design!.ToLower().Contains(filter.Search.ToLower()) );
            }
            else
            {
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
                int[]? icolors = JsonConvert.DeserializeObject<int[]>(filter.Colors);
                if (icolors!=null && icolors!.Length>0)
                {
                    colorsIds = (from cv in ctx.ColorVariants
                                    join cc in ctx.ColorVariantsInColors on cv.Id equals cc.ColorVariantId
                                    where icolors.Contains(cc.ColorId)
                                    select cv.ProductId as int?).Distinct().ToList();
                    query = query.Where(x => colorsIds.Contains(x.Id));
                }

                List<int?> seasonsIds = new List<int?>();
                int[]? iseasons = JsonConvert.DeserializeObject<int[]>(filter.Seasons);
                if (iseasons != null && iseasons!.Length>0)
                {
                    seasonsIds = (from ps in ctx.ProductsInSeasons where iseasons.Contains(ps.SeasonId) select ps.ProductId as int?).Distinct().ToList();
                    query = query.Where(x => seasonsIds.Contains(x.Id));
                }

                List<int?> overworkIds = new List<int?>();
                int[]? ioverworks = JsonConvert.DeserializeObject<int[]>(filter.Overworks);
                if (ioverworks != null && ioverworks!.Length>0)
                {
                    overworkIds = (from po in ctx.ProductsInOverWorkTypes where ioverworks.Contains(po.OverWorkTypeId) select po.ProductId as int?).Distinct().ToList();
                    query = query.Where(x => overworkIds.Contains(x.Id));
                }

                List<int?> designTypesIds = new List<int?>();
                int[]? idesignTypes = JsonConvert.DeserializeObject<int[]>(filter.DesignTypes);
                if (idesignTypes != null && idesignTypes!.Length > 0)
                {
                    designTypesIds = (from ps in ctx.ProductsInDesignTypes where idesignTypes.Contains(ps.DesignTypeId) select ps.ProductId as int?).Distinct().ToList();
                    query = query.Where(x => designTypesIds.Contains(x.Id));
                }

                List<int?> textileTypesIds = new List<int?>();
                int[]? itextileTypes = JsonConvert.DeserializeObject<int[]>(filter.TextileTypes);
                if (itextileTypes != null && itextileTypes != null && itextileTypes!.Length > 0)
                {
                    //!!!??????
                    textileTypesIds = (from ps in ctx.ProductsInTextileTypes where itextileTypes!.Contains(ps.TextileTypeId) select ps.ProductId as int?).Distinct().ToList();
                    query = query.Where(x => textileTypesIds.Contains(x.Id));
                }

                List<int?> printTypesIds = new List<int?>();
                int[]? iprintTypes = JsonConvert.DeserializeObject<int[]>(filter.PrintTypes);
                if (iprintTypes != null && iprintTypes != null && iprintTypes!.Length > 0)
                {
                    query = query.Where(x => x.PrintTypeId == iprintTypes[0]);
                }

                List<int?> productTypesIds = new List<int?>();
                int[]? iproductTypes = JsonConvert.DeserializeObject<int[]>(filter.ProductTypes);
                if (iproductTypes != null && iproductTypes != null && iproductTypes!.Length > 0)
                {
                    query = query.Where(x => x.ProductTypeId == iproductTypes[0]);
                }

                //List<int?> ids = colorsIds.Union(seasonsIds).Union(overworkIds).Union(designTypesIds).Distinct().ToList();
                //if (ids.Count > 0)
                //    query = query.Where(x => ids.Contains(x.Id));

            }

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
                            ColorNames = "ALL COLORS",
                            ColorVariantId = -id,
                            ColorNo = null,
                            ImagePath = imageFiles
                        });
                        id++;
                    }
                }

                // VIDEO
                if (!String.IsNullOrEmpty(p.VideoUuids))
                {
                    foreach (string uuid in PhotoHelper.GetPhotoUuids(p.VideoUuids))
                    {
                        var imageFiles = DirectoryHelper.GetImageFiles(uuid);
                        p.Colors.Add(new ProductColor()
                        {
                            ColorNames = "VIDEO",
                            ColorVariantId = -id,
                            ColorNo = null,
                            ImagePath = imageFiles
                        });
                        id++;
                    }
                }

                // 2) COLOR VARIANTS
                foreach (var cv in ctx.ColorVariants.Where(x => x.ProductId == p.Id).ToList())
                {
                    var imageFiles = DirectoryHelper.GetImageFiles(cv.Uuid!);
                    var colorsIds = ctx.ColorVariantsInColors.Where(cvc => cvc.ColorVariantId == cv.Id).Select(x => (int?)x.ColorId).ToList();
                    var colors = ctx.Colors.Where(x => colorsIds.Contains(x.Id)).OrderBy(x => x.ColorName).ToList();
                    string colorNames = String.Join(", ", colors.Select(col => col.ColorName));

                    p.Colors.Add(new ProductColor()
                    {
                        ColorNames = colorNames,
                        ColorVariantId = cv.Id,
                        ColorNo = cv.Num,
                        Quantity = cv.Quantity,
                        ProductId = p.Id,
                        IsProduct = false,
                        IsVideo = false,
                        ColorIds = colorsIds,
                        ImagePath = imageFiles,
                        Uuid = cv.Uuid
                    });
                }

                if (p.Colors.Count == 0)
                {
                    p.Colors.Add(new ProductColor()
                    {
                        ColorNames = "ALL COLORS",
                        ColorVariantId = -id,
                        ColorNo = null,
                        ImagePath = new List<string>() { @"colors\nopicture.png" }
                    });
                }
            }

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
                            //Composition = p.Composition,
                            Price = p.Price,
                            Stock = p.Stock,
                            RollLength = p.RollLength,
                            Weight = p.Weight,
                            Width = p.Width,
                            Uuid = p.Uuid,
                            PhotoUuids = p.PhotoUuids,
                            VideoUuids = p.VideoUuids,
                            ProductStyleId = p.ProductStyleId,
                            ProductTypeId = p.ProductTypeId,
                            PrintTypeId = p.PrintTypeId,
                            DyeStaffId = p.DyeStaffId,
                            PlainDyedTypeId = p.PlainDyedTypeId,
                            FinishingId = p.FinishingId,
                            VendorId = p.VendorId,
                            Vendor = p.Vendor!.VendorName,
                            ProductStyle = ctx.ProductStyles.FirstOrDefault(x => x.Id == p.ProductStyleId).StyleName,
                            ProductType = ctx.ProductTypes.FirstOrDefault(x => x.Id == p.ProductTypeId).TypeName,
                            PrintType = ctx.PrintTypes.FirstOrDefault(x => x.Id == p.PrintTypeId).TypeName,
                            DyeStaff = ctx.DyeStaffs.FirstOrDefault(x => x.Id == p.DyeStaffId).DyeStaffName,
                            Finishing = ctx.Finishings.FirstOrDefault(x => x.Id == p.FinishingId).FinishingName,
                            PlainDyedType = ctx.PlainDyedTypes.FirstOrDefault(x => x.Id == p.PlainDyedTypeId).PlainDyedTypeName,
                            DesignTypeIds = p.ProductsInDesignTypes!.Select(x => x.DesignTypeId).ToArray(),
                            CompositionValues = p.ProductsInTextileTypes!.Select(x => new CompositionValue { TextileTypeId = x.TextileTypeId, Value = x.Value }).ToArray(),
                            OverWorkTypeIds = p.ProductsInOverWorkTypes!.Select(x => x.OverWorkTypeId).ToArray(),
                            SeasonIds = p.ProductsInSeasons!.Select(x => x.SeasonId).ToArray(),
                            Colors = new List<ProductColor>(),
                            Findings = p.Findings,
                            GSM = p.GSM,
                            MetersInKG = p.MetersInKG,
                            FabricConstruction = p.FabricConstruction,
                            FabricYarnCount = p.FabricYarnCount,
                            FabricShrinkage = p.FabricShrinkage,
                            ColorFastness = p.ColorFastness,
                            HSCode = p.HSCode,
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
                        ColorNames = "PRODUCT",
                        ColorVariantId = -colorId,
                        ColorNo = null,
                        Uuid = uuid,
                        ProductId = prod.Id,
                        Price = prod.Price,
                        IsProduct = true,
                        IsVideo = false,
                        ImagePath = imageFiles
                    });
                    colorId++;
                }

                // VIDEO
                foreach (string uuid in PhotoHelper.GetPhotoUuids(prod.VideoUuids))
                {
                    var imageFiles = DirectoryHelper.GetImageFiles(uuid);
                    prod.Colors.Add(new ProductColor()
                    {
                        ColorNames = "VIDEO",
                        ColorVariantId = -colorId,
                        ColorNo = null,
                        Uuid = uuid,
                        ProductId = prod.Id,
                        IsProduct = false,
                        IsVideo = true,
                        ImagePath = imageFiles
                    });
                    colorId++;
                }

                // 2) COLOR VARIANTS
                foreach (var cv in ctx.ColorVariants.Where(x => x.ProductId == prod.Id).ToList())
                {
                    var colorsIds = ctx.ColorVariantsInColors.Where(cvc => cvc.ColorVariantId == cv.Id).Select(x => (int?)x.ColorId).ToList();
                    var colors = ctx.Colors.Where(x=>colorsIds.Contains(x.Id)).OrderBy(x => x.ColorName).ToList();
                    string colorNames = String.Join(", ", colors.Select(col => col.ColorName));
                    prod!.Colors.Add(new ProductColor()
                    {
                        ColorNames = colorNames,
                        ColorVariantId = cv.Id,
                        ColorNo = cv.Num,
                        ColorIds = colorsIds,
                        Quantity = cv.Quantity,
                        ProductId = prod.Id,
                        Price = cv.Price,
                        IsProduct = false,
                        IsVideo = false,
                        Uuid = cv.Uuid,
                        ImagePath = DirectoryHelper.GetImageFiles(cv.Uuid!)
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
                    foreach (var item in product.ColorVariants.Where(x => x.ColorNo != null && x.Quantity != null))
                    {
                        Context.ColorVariant cv = new Context.ColorVariant()
                        {
                            ProductId = prod.Id,
                            Uuid = item.Uuid,
                            Num = item.ColorNo == null ? 0 : item.ColorNo.Value,
                            Quantity = item.Quantity,
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

        public static int? Update(Models.PostProduct product)
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
                    prod.Stock = product.Stock;
                    prod.RollLength = product.RollLength;
                    prod.ProductStyleId = product.ProductStyleId;
                    prod.ProductTypeId = product.ProductTypeId;
                    prod.VendorId = product.VendorId;
                    prod.Weight = product.Weight;
                    prod.Width = product.Width;
                    prod.RollLength = product.RollLength;
                    prod.GSM = product.GSM;
                    prod.MetersInKG = product.MetersInKG;
                    prod.ColorFastness = product.ColorFastness;
                    prod.FabricConstruction = product.FabricConstruction;
                    prod.FabricShrinkage = product.FabricShrinkage;
                    prod.FabricYarnCount = product.FabricYarnCount;
                    prod.Findings = product.Findings;
                    prod.HSCode = product.HSCode;
                    prod.PrintTypeId = product.PrintTypeId;
                    prod.PlainDyedTypeId = product.PlainDyedTypeId;
                    prod.DyeStaffId = product.DyeStaffId;
                    prod.FinishingId = product.FinishingId;
                    //prod.Composition = product.Composition != null ? product.Composition.ToLower() : null;
                    ctx.SaveChanges();

                    if (product.ColorVariants != null)
                    {
                        foreach (var item in product.ColorVariants.Where(x => x.ColorNo != null)) //&& x.Quantity != null))
                        {
                            Context.ColorVariant? cv = ctx.ColorVariants.FirstOrDefault(x => x.Id == item.ColorVariantId);
                            if (cv == null)
                            {
                                cv = new Context.ColorVariant()
                                {
                                    ProductId = prod.Id,
                                };
                                ctx.ColorVariants.Add(cv);
                            }
                            cv.Uuid = item.Uuid;
                            cv.Num = item.ColorNo == null ? 0 : item.ColorNo.Value;
                            cv.Quantity = item.Quantity;
                            ctx.SaveChanges(true);

                            ctx.ColorVariantsInColors.RemoveRange(ctx.ColorVariantsInColors.Where(x => x.ColorVariantId == cv.Id));
                            foreach (var colorId in item.ColorIds != null ? item.ColorIds : [])
                            {
                                Context.ColorVariantsInColors? colVarInColors = new Context.ColorVariantsInColors()
                                {
                                    ColorVariantId = cv.Id,
                                    ColorId = colorId,
                                };
                                ctx.ColorVariantsInColors.Add(colVarInColors);
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

                    ctx.ProductsInTextileTypes.RemoveRange(ctx.ProductsInTextileTypes.Where(x => x.ProductId == prod.Id));
                    if (product.CompositionValues != null)
                    {
                        foreach (var item in product.CompositionValues)
                        {
                            if (item.TextileTypeId != null && item.Value != null)
                            {
                                Context.ProductsInTextileTypes cv = new Context.ProductsInTextileTypes()
                                {
                                    ProductId = prod.Id,
                                    TextileTypeId = item.TextileTypeId.Value,
                                    Value = item.Value.Value
                                };

                                ctx.ProductsInTextileTypes.Add(cv);
                                ctx.SaveChanges(true);
                            }
                        }
                    }

                }

                return product.Id;
            }
            catch (Exception ex)
            {
                return null;
            }

        }



    }
}
