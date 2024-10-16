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
        public string DesignTypes { get; set; }
        public string Seasons { get; set; }
        public string Overworks { get; set; }
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
                            Stock = p.Stock,
                            Weight = p.Weight,
                            Width = p.Width,
                            ProductStyleId = p.ProductStyleId,
                            ProductTypeId = p.ProductTypeId,
                            VendorId = p.VendorId,
                            Uuid = p.Uuid,
                            PhotoUuids = p.PhotoUuids,
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
                            DesignTypes = p.ProductsInDesignTypes!.Select(x => new Models.DesignType { Id = x.DesignTypeId, DesignName = x.DesignType.DesignName }).ToArray(),
                            OverWorkTypes = p.ProductsInOverWorkTypes!.Select(x => new Models.OverWorkType { Id = x.OverWorkTypeId, OverWorkName = x.OverWorkType.OverWorkName }).ToArray(),
                            Seasons = p.ProductsInSeasons!.Select(x => new Models.Season { Id = x.SeasonId, SeasonName = x.Season.SeasonName }).ToArray(),
                            Colors = new List<ProductColor>(),
                            TextileTypes = new List<ProductsInTextileTypes>()
                        };

            if (filter.VendorId > 0)
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

            }

            var prods = query.ToList();

            foreach (var p in prods)
            {
                if (p.RefNo=="20300")
                {
                    int a = 0;
                }
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

                // 2) COLOR VARIANTS
                foreach (var cv in ctx.ColorVariants.Where(x => x.ProductId == p.Id).ToList())
                {
                    var imageFiles = DirectoryHelper.GetImageFiles(cv.Uuid!);
                    /*string colors1 = String.Join(", ",
                                        ctx.Colors.Where(col =>
                                            ctx.ColorVariantsInColors
                                            .Where(x =>
                                                x.ColorVariantId == cv.Id)
                                            .Select(x => x.ColorId)
                                            .ToList()
                                            .Contains(col.Id))
                                        .Select(col => col.ColorName));*/

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

                // 3) TEXTILE TYPES
                string composition = "";
                foreach (var cv in ctx.ProductsInTextileTypes.Where(x => x.ProductId == p.Id).ToList())
                {
                    var tt = ctx.TextileTypes.FirstOrDefault(x => x.Id == cv.TextileTypeId);
                    string name = tt != null ? tt.TextileTypeName : "UNKNOWN";
                    p.TextileTypes.Add(new ProductsInTextileTypes()
                    {
                        Id = cv.Id,
                        ProductId = p.Id,
                        TextileTypeId = cv.TextileTypeId,
                        Value = cv.Value,
                        TextileType = name,
                    });
                    composition += name + String.Format(" {0}", cv.Value);
                }
                p.Composition = composition;
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

            //var p1 = ctx.Products.Where(x => x.Id.ToString() == id).Select(x=>x).FirstOrDefault();

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
                            Stock = p.Stock,
                            Weight = p.Weight,
                            Width = p.Width,
                            Uuid = p.Uuid,
                            PhotoUuids = p.PhotoUuids,
                            ProductStyleId = p.ProductStyleId,
                            ProductTypeId = p.ProductTypeId,
                            VendorId = p.VendorId,
                            Vendor = p.Vendor!.VendorName,
                            ProductStyle = p.ProductStyleId.ToString(),
                            ProductType = p.ProductTypeId.ToString(),
                            PrintType = p.PrintTypeId.ToString(),
                            DyeStaff = p.DyeStaffId.ToString(),
                            Finishing = p.FinishingId.ToString(),
                            PlainDyedType = p.PlainDyedTypeId.ToString(),
                            DesignTypeIds = p.ProductsInDesignTypes!.Select(x => x.DesignTypeId).ToArray(),
                            OverWorkTypeIds = p.ProductsInOverWorkTypes!.Select(x => x.OverWorkTypeId).ToArray(),
                            SeasonIds = p.ProductsInSeasons!.Select(x => x.SeasonId).ToArray(),
                            Colors = new List<ProductColor>(),
                            TextileTypes = new List<ProductsInTextileTypes>(),
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
                        IsProduct = true,
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
                        IsProduct = false,
                        Uuid = cv.Uuid,
                        ImagePath = DirectoryHelper.GetImageFiles(cv.Uuid!)
                    });
                }

                // 3) TEXTILE TYPES
                string composition = "";
                string delim = "";
                int percent = 0;
                List<CompositionItem> textileTypesIds = new List<CompositionItem>();
                List<ProductsInTextileTypes> tts = new List<ProductsInTextileTypes>();
                foreach (var cv in ctx.ProductsInTextileTypes.Where(x => x.ProductId == prod.Id).ToList())
                {
                    var tt = ctx.TextileTypes.FirstOrDefault(x => x.Id == cv.TextileTypeId);
                    string name = tt != null ? tt.TextileTypeName : "UNKNOWN";
                    tts.Add(new ProductsInTextileTypes()
                    {
                        Id = cv.Id,
                        ProductId = prod.Id,
                        TextileTypeId = cv.TextileTypeId,
                        Value = cv.Value,
                        TextileType = name,
                    });
                    textileTypesIds.Add(new CompositionItem() { TextileTypeId = cv.TextileTypeId, Value = cv.Value });
                    percent += cv.Value;
                    composition += delim + String.Format("{0}% ", cv.Value) + name;
                    delim = ", ";
                }

                prod.TextileTypes = tts.OrderByDescending(x => x.Value).ThenBy(x=>x.TextileType).ToList();
                prod.Composition = composition;

                // 4) COMPOSITION SAMPLES
                if (percent < 100)
                {
                    //var prods = ctx.ProductsInTextileTypes.Where(x => textileTypesIds.Contains(x.TextileTypeId)).Select(x => x.ProductId).Distinct();

                    prod.CompositionsSamples = new List<CompositionSample>();
                    CompositionList compositionList = new CompositionList();
                    compositionList.ProductId = -1;
                    var ptts = ctx.ProductsInTextileTypes.Where(x=>x.ProductId != prod.Id).OrderBy(x => x.ProductId).ToList();
                    ptts.Add(new Context.ProductsInTextileTypes() { Id = -2, ProductId = -2, TextileTypeId = -2 });
                    int n = 0;
                    foreach (var comp in ptts)
                    {
                        if (n == 0)
                            compositionList.ProductId = comp.ProductId;

                        if (comp.ProductId != compositionList.ProductId)
                        {
                            bool accept = true;
                            List<CompositionItem> list = new List<CompositionItem>();
                            foreach (var tt in compositionList.TextileTypes)
                            {
                                list.Add( new CompositionItem() { TextileTypeId = tt.TextileTypeId, Value = tt.Value });
                            }
                            foreach (var ttid in textileTypesIds)
                            {
                                if (list.FirstOrDefault(x=>x.TextileTypeId == ttid.TextileTypeId && x.Value == ttid.Value) == null)
                                {
                                    accept = false;
                                    break;
                                }
                            }

                            if (list.Count == textileTypesIds.Count)
                                accept = false;

                            if (accept)
                            {
                                CompositionSample sample = new CompositionSample();
                                foreach (var tt in compositionList.TextileTypes.OrderByDescending(x=>x.Value).ThenBy(x=>x.TextileTypeName))
                                {
                                    sample.Composition += String.Format("{0}% {1}; ", tt.Value, ctx.TextileTypes.FirstOrDefault(x => x.Id == tt.TextileTypeId).TextileTypeName);
                                    sample.ProductId = compositionList.ProductId;
                                    list.Add(new CompositionItem() { TextileTypeId = tt.TextileTypeId, Value = tt.Value });
                                }
                                prod.CompositionsSamples.Add(sample);
                            }
                            compositionList = new CompositionList();
                            compositionList.ProductId = comp.ProductId;
                        }

                        var textileType = ctx.TextileTypes.FirstOrDefault(x => x.Id == comp.TextileTypeId);
                        compositionList.TextileTypes.Add(new CompositionItem()
                        {
                            TextileTypeId = comp.TextileTypeId,
                            Value = comp.Value,
                            TextileTypeName = textileType != null ? textileType.TextileTypeName : "?"
                        });
                        n++;
                    }
                }

                /*if (!String.IsNullOrWhiteSpace(prod.Uuid))
                {
                    prod.Colors.Add(new ProductColor()
                    {
                        ColorNames = "COMMON",
                        ColorVariantId = 0,
                        ColorNo = 0,
                        ImagePath = DirectoryHelper.GetImageFiles(prod.Uuid)
                    });
                }*/
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
                    prod.ProductStyleId = product.ProductStyleId;
                    prod.ProductTypeId = product.ProductTypeId;
                    prod.VendorId = product.VendorId;
                    prod.Weight = product.Weight;
                    prod.Width = product.Width;
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
