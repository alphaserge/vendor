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
    public class PostItemName
    {
        public int ProductId { get; set; }
        public string? ItemName { get; set; }
    }

    public class ProductItemName
    {
        public int ProductId { get; set; }
        public string? ItemName { get; set; }
        public int? Weight { get; set; }
        public int? Width { get; set; }
        public int? GSM { get; set; }
        public string? ProductStyle { get; set; }
        public string? ProductType { get; set; }
        public string? PlainDyedType { get; set; }
        public string? Season { get; set; }
        public string? DressGroup { get; set; }
        public string? DyeStaff { get; set; }
        public int? ColorFastness { get; set; }
        public decimal? FabricShrinkage { get; set; }
        public string? FabricConstruction { get; set; }
        public string? FabricYarnCount { get; set; }
        public string? Findings { get; set; }
        public string? HSCode { get; set; }
        public int? DyeStaffId { get; set; }
        public int? FinishingId { get; set; }
        public int? PlainDyedTypeId { get; set; }
        public int? PrintTypeId { get; set; }
        public int? ProductStyleId { get; set; }
        public int? ProductTypeId { get; set; }
        public int[]? SeasonsId { get; set; }
        public int[]? DressGroupsId { get; set; }
        

        public required CompositionValue[] Composition { get; set; }
    }

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
        public string DressGroups { get; set; }
        public string Seasons { get; set; }
        public string Overworks { get; set; }
        public string TextileTypes { get; set; }
        public string Search { get; set; }
        public bool? ShowNullPrice { get; set; }
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
            DressGroups = String.Empty;
            TextileTypes = String.Empty;
            PrintTypes = String.Empty;
            ProductTypes = String.Empty;
            Search = String.Empty;
            Price = Array.Empty<decimal>();
            Weight = Array.Empty<int>();
            Width = Array.Empty<int>();
            ShowNullPrice = true;
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


        public static IEnumerable<Models.ProductJoinDesign> GetProductsJoinedDesigns(ProductFilter filter, bool shortFiltered)
        {
            ChiffonDbContext ctx = ContextHelper.ChiffonContext();

            var query = ctx.Products.Join(
                ctx.ProductDesigns,
                prod => prod.Id,
                des => des.ProductId,
                (prod, des) => new Models.ProductJoinDesign
                {
                    ProductId = prod.Id,
                    ItemName = prod.ItemName,
                    RollLength = prod.RollLength,
                    Weight = prod.Weight,
                    Width = prod.Width,
                    ProductStyleId = prod.ProductStyleId,
                    ProductTypeId = prod.ProductTypeId,
                    DyeStaffId = prod.DyeStaffId,
                    FinishingId = prod.FinishingId,
                    Uuid = prod.Uuid,
                    GSM = prod.GSM,
                    MetersInKG = prod.MetersInKG,
                    FabricConstruction = prod.FabricConstruction,
                    FabricYarnCount = prod.FabricYarnCount,
                    ColorFastness = prod.ColorFastness,
                    ProductDesignId = des.Id,
                    SampleNo = des.SampleNo,
                    ArtNo = des.ArtNo,
                    RefNo = des.RefNo,
                    Price = des.Price,
                    PrintTypeId = des.PrintTypeId,
                    PlainDyedTypeId = des.PlainDyedTypeId,
                });

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

                if (!shortFiltered)
                {
                    int[]? icolors = JsonConvert.DeserializeObject<int[]>(filter.Colors);
                    if (icolors != null && icolors!.Length > 0)
                    {
                        List<int?> productDesignIds = (from cv in ctx.ColorVariants
                                                       join cc in ctx.ColorVariantsInColors on cv.Id equals cc.ColorVariantId
                                                       where icolors.Contains(cc.ColorId)
                                                       select cv.ProductDesignId as int?).Distinct().ToList();
                        query = query.Where(x => productDesignIds.Contains(x.ProductDesignId));
                    }

                    int[]? iseasons = JsonConvert.DeserializeObject<int[]>(filter.Seasons);
                    if (iseasons != null && iseasons!.Length > 0)
                    {
                        List<int?> productIds = (from ps in ctx.ProductsInSeasons where iseasons.Contains(ps.SeasonId) select ps.ProductId as int?).Distinct().ToList();
                        query = query.Where(x => productIds.Contains(x.ProductId));
                    }

                    int[]? ioverworks = JsonConvert.DeserializeObject<int[]>(filter.Overworks);
                    if (ioverworks != null && ioverworks!.Length > 0)
                    {
                        List<int?> productIds = (from po in ctx.ProductsInOverWorkTypes where ioverworks.Contains(po.OverWorkTypeId) select po.ProductId as int?).Distinct().ToList();
                        query = query.Where(x => productIds.Contains(x.ProductId));
                    }

                    int[]? idesignTypes = JsonConvert.DeserializeObject<int[]>(filter.DesignTypes);
                    if (idesignTypes != null && idesignTypes!.Length > 0)
                    {
                        List<int?> designIds = (from ps in ctx.ProductDesignsInDesignTypes where idesignTypes.Contains(ps.DesignTypeId) select ps.ProductDesignId as int?).Distinct().ToList();
                        query = query.Where(x => designIds.Contains(x.ProductDesignId));
                    }

                    int[]? idressGroups = JsonConvert.DeserializeObject<int[]>(filter.DressGroups);
                    if (idesignTypes != null && idesignTypes!.Length > 0)
                    {
                        List<int?> productIds = (from ps in ctx.ProductsInDressGroups where idressGroups.Contains(ps.DressGroupId) select ps.ProductId as int?).Distinct().ToList();
                        query = query.Where(x => productIds.Contains(x.ProductId));
                    }

                    int[]? itextileTypes = JsonConvert.DeserializeObject<int[]>(filter.TextileTypes);
                    if (itextileTypes != null && itextileTypes != null && itextileTypes!.Length > 0)
                    {
                        List<int?> productIds = (from ps in ctx.ProductsInTextileTypes where itextileTypes!.Contains(ps.TextileTypeId) select ps.ProductId as int?).Distinct().ToList();
                        query = query.Where(x => productIds.Contains(x.ProductId));
                    }

                    int[]? iprintTypes = JsonConvert.DeserializeObject<int[]>(filter.PrintTypes);
                    if (iprintTypes != null && iprintTypes != null && iprintTypes!.Length > 0)
                    {
                        query = query.Where(x => x.PrintTypeId == iprintTypes[0]);
                    }

                    int[]? iproductTypes = JsonConvert.DeserializeObject<int[]>(filter.ProductTypes);
                    if (iproductTypes != null && iproductTypes != null && iproductTypes!.Length > 0)
                    {
                        query = query.Where(x => x.ProductTypeId == iproductTypes[0]);
                    }
                }
            }

            var prods = query.ToList();

            foreach (var p in prods)
            {
                p.VideoPath = DirectoryHelper.GetImageFile(p.VideoUuid);
                p.PhotoPath = DirectoryHelper.GetImageFile(p.PhotoUuid);
            }

            return prods;
        }

        public static Models.Product? Get(int id)
        {
            ChiffonDbContext ctx = ContextHelper.ChiffonContext();

            Models.Product prod = new Models.Product();
            var product = ctx.Products.FirstOrDefault(x => x.Id == id);
            if (product != null)
            {
                prod = config.CreateMapper().Map<Models.Product>(product);
            }

            return prod;
        }

        public static int? Post(Models.PostProduct post)
        {
            return SaveProduct(post);
        }

        public static int? Update(Models.PostProduct post)
        {
            if (post.Product.Id != null)
            {
                return SaveProduct(post);
            }
            return -1;
        }
        
        public static int SaveProduct(Models.PostProduct post)
        {
            ChiffonDbContext ctx = ContextHelper.ChiffonContext();

            try
            {
                Context.Product? prod = null;

                if (post.Product.Id != null)
                {
                    prod = ctx.Products.FirstOrDefault(x => x.Id == post.Product.Id);
                }
                else
                {
                    prod = config.CreateMapper().Map<Context.Product>(post.Product);
                    ctx.Products.Add(prod);
                }

                if (prod != null)
                {
                    prod.Weight = post.Product.Weight;
                    prod.Width = post.Product.Width;
                    prod.MetersInKG = post.Product.MetersInKG;
                    prod.ProductTypeId = post.Product.ProductTypeId;
                    prod.ColorFastness = post.Product.ColorFastness;
                    prod.FabricConstruction = post.Product.FabricConstruction;
                    prod.FabricShrinkage = post.Product.FabricShrinkage;
                    prod.FabricYarnCount = post.Product.FabricYarnCount;
                    prod.HSCode = post.Product.HSCode;
                    prod.DyeStaffId = post.Product.DyeStaffId;
                    prod.ProductStyleId = post.Product.ProductStyleId;
                    prod.RollLength = post.Product.RollLength;
                    prod.GSM = post.Product.GSM;
                    prod.FinishingId = post.Product.FinishingId;
                    ctx.Products.Add(prod);
                    ctx.SaveChanges();

                    ctx.ProductsInDressGroups.RemoveRange(ctx.ProductsInDressGroups.Where(x => x.ProductId == prod.Id));
                    if (post.DressGroupId != null)
                    {
                        foreach (var item in post.DressGroupId)
                        {
                            Context.ProductsInDressGroups cv = new Context.ProductsInDressGroups()
                            {
                                ProductId = prod.Id,
                                DressGroupId = item
                            };

                            ctx.ProductsInDressGroups.Add(cv);
                            ctx.SaveChanges(true);
                        }
                    }

                    ctx.ProductsInSeasons.RemoveRange(ctx.ProductsInSeasons.Where(x => x.ProductId == prod.Id));
                    if (post.SeasonId != null)
                    {
                        foreach (var item in post.SeasonId)
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
                    if (post.OverWorkTypeId != null)
                    {
                        foreach (var item in post.OverWorkTypeId)
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
                    if (post.CompositionValues != null)
                    {
                        var values = post.CompositionValues.Where(x => x.TextileTypeId != null && x.Value != null);
                        foreach (var item in values)
                        {
                            Context.ProductsInTextileTypes pt = new Context.ProductsInTextileTypes()
                            {
                                ProductId = prod.Id,
                                TextileTypeId = item.TextileTypeId!.Value,
                                Value = item.Value!.Value
                            };

                            ctx.ProductsInTextileTypes.Add(pt);
                            ctx.SaveChanges(true);
                        }
                    }
                    return prod.Id;
                }
                return -1;
            }
            catch (Exception ex)
            {
                return -1;
            }

        }
    }
}
