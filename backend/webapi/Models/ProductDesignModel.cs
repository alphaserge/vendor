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
    public class ProductDesignModel
    {
        private static MapperConfiguration config = new MapperConfiguration(cfg =>
        {
            cfg.CreateMap<Models.ProductDesign, Context.ProductDesign>();
            cfg.CreateMap<Models.PostProductDesign, Context.ProductDesign>();
            cfg.CreateMap<Models.ProductDesignsInDesignTypes, Context.ProductDesignsInDesignTypes>();

            cfg.CreateMap<Context.ProductDesign, Models.ProductDesign>();
            cfg.CreateMap<Context.ProductDesign, Models.PostProductDesign>();
            cfg.CreateMap<Context.ProductDesignsInDesignTypes, Models.ProductDesignsInDesignTypes>();
        });


        public static IEnumerable<Models.ProductDesign> Get(int productId)
        {
            ChiffonDbContext ctx = ContextHelper.ChiffonContext();

            Dictionary<int, string?> vendors = ctx.Vendors.ToDictionary(s => s.Id, s => s.VendorName);
            Dictionary<int, string?> printTypes = ctx.PrintTypes.ToDictionary(s => s.Id, s => s.TypeName);
            Dictionary<int, string?> plainDyedTypes = ctx.PlainDyedTypes.ToDictionary(s => s.Id, s => s.PlainDyedTypeName);
            Dictionary<int, string?> designTypes = ctx.DesignTypes.ToDictionary(s => s.Id, s => s.DesignName);

            var query = from p in ctx.ProductDesigns.Where(x => x.ProductId == productId)
                select new Models.ProductDesign
                {
                    Id = p.Id,
                    VendorId = p.VendorId,
                    ProductId = p.ProductId,
                    SampleNo = p.SampleNo,
                    RefNo = p.RefNo,
                    ArtNo = p.ArtNo,
                    Design = p.Design,
                    Price = p.Price,
                    PrintTypeId = p.PrintTypeId,
                    PlainDyedTypeId = p.PlainDyedTypeId,
                    Uuid = p.Uuid,
                    PhotoUuids = p.PhotoUuids,
                    VendorName = vendors[p.VendorId],
                    PrintType  = p.PrintTypeId != null ? printTypes[p.PrintTypeId.Value] : "",
                    PlainDyedType = p.PlainDyedTypeId != null ? plainDyedTypes[p.PlainDyedTypeId.Value] : "",
                };

            var designs = query.ToList();

            foreach (var pdes in designs)
            {
                pdes.Photos = PhotoHelper.GetPhotoUuids(pdes.PhotoUuids);

                var colVars = ctx.ColorVariants.Where(x => x.ProductDesignId == pdes.Id).ToList();
                foreach (var cv in colVars)
                {
                    string imageFiles = DirectoryHelper.GetImageFile(cv.Uuid!);
                    var colorsIds = ctx.ColorVariantsInColors.Where(cvc => cvc.ColorVariantId == cv.Id).Select(x => (int?)x.ColorId).ToList();
                    var colors = ctx.Colors.Where(x => colorsIds.Contains(x.Id)).OrderBy(x => x.ColorName).ToList();
                    string colorNames = String.Join(", ", colors.Select(col => col.ColorName));
                    pdes.Colors.Add(new ProductDesignColor()
                    {
                        ColorNames = colorNames,
                        ColorVariantId = cv.Id,
                        ColorNo = cv.ColorNo,
                        Quantity = cv.Quantity,
                        ProductDesignId = pdes.Id,
                        ColorIds = colorsIds,
                        ImagePath = imageFiles,
                        Uuid = cv.Uuid,
                    });
                }

                var designTypesId = ctx.ProductDesignsInDesignTypes.Where(x => x.ProductDesignId == pdes.Id).Select(x => x.Id).ToList();
                foreach (var id in designTypesId)
                {
                    string? name = designTypes[id];
                    string designName = name != null ? name : string.Empty;
                    pdes.DesignTypes.Add(new ProductDesignType()
                    {
                        DesignName = designName,
                        ProductDesignId = pdes.Id,
                        ProductDesignTypeId = id,
                    });
                }
            }

            return designs;
        }

        public static int? Post(Models.PostProductDesign postProductDesign)
        {
            ChiffonDbContext ctx = ContextHelper.ChiffonContext();

            try
            {
                int? sampleNo = ctx.ProductDesigns.Max(x => x.SampleNo);
                if (sampleNo == null)
                    sampleNo = 2600000;
                
                Context.ProductDesign productDesign = config.CreateMapper()
                    .Map<Context.ProductDesign>(postProductDesign);

                productDesign.SampleNo = sampleNo+1;
                ctx.ProductDesigns.Add(productDesign);
                ctx.SaveChanges();

                if (postProductDesign.DesignTypeId != null)
                {
                    foreach (var id in postProductDesign.DesignTypeId)
                    {
                        Context.ProductDesignsInDesignTypes pddt = new Context.ProductDesignsInDesignTypes()
                        {
                            ProductDesignId = productDesign.Id,
                            DesignTypeId = id
                        };

                        ctx.ProductDesignsInDesignTypes.Add(pddt);
                        ctx.SaveChanges(true);
                    }
                }


                return productDesign.Id;
            }
            catch (Exception ex)
            {
                return null;
            }

        }
/*
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
                    prod.VendorId = product.VendorId != null ? product.VendorId.Value : -1;
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
                            cv.Price = item.Price;
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

                    ctx.ProductDesignsInDesignTypes.RemoveRange(ctx.ProductDesignsInDesignTypes.Where(x => x.ProductDesignId == prod.Id));
                    if (product.DesignTypeId != null)
                    {
                        foreach (var item in product.DesignTypeId)
                        {
                            Context.ProductDesignsInDesignTypes pdt = new Context.ProductDesignsInDesignTypes()
                            {
                                ProductDesignId = prod.Id,
                                DesignTypeId = item
                            };

                            ctx.ProductDesignsInDesignTypes.Add(pdt);
                            ctx.SaveChanges(true);
                        }
                    }

                    ctx.ProductsInDressGroups.RemoveRange(ctx.ProductsInDressGroups.Where(x => x.ProductId == prod.Id));
                    if (product.DressGroupId != null)
                    {
                        foreach (var item in product.DressGroupId)
                        {
                            Context.ProductsInDressGroups pdg = new Context.ProductsInDressGroups()
                            {
                                ProductId = prod.Id,
                                DressGroupId = item
                            };

                            ctx.ProductsInDressGroups.Add(pdg);
                            ctx.SaveChanges(true);
                        }
                    }

                    ctx.ProductsInSeasons.RemoveRange(ctx.ProductsInSeasons.Where(x => x.ProductId == prod.Id));
                    if (product.SeasonId != null)
                    {
                        foreach (var item in product.SeasonId)
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
                    if (product.OverWorkTypeId != null)
                    {
                        foreach (var item in product.OverWorkTypeId)
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

        }*/


    }
}
