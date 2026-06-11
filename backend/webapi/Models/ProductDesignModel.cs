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

        public static int? Update(Models.PostProductDesign productDesign)
        {
            ChiffonDbContext ctx = ContextHelper.ChiffonContext();

            try
            {
                Context.ProductDesign? prod = ctx.ProductDesigns.Where(x => x.Id == productDesign.Id).FirstOrDefault();
                if (prod != null)
                {
                    prod.ArtNo = productDesign.ArtNo;
                    prod.RefNo = productDesign.RefNo;
                    prod.Design = productDesign.Design;
                    prod.Price = productDesign.Price;
                    prod.VendorId = productDesign.VendorId != null ? productDesign.VendorId.Value : -1;
                    prod.PrintTypeId = productDesign.PrintTypeId;
                    prod.PlainDyedTypeId = productDesign.PlainDyedTypeId;
                    //prod.Composition = product.Composition != null ? product.Composition.ToLower() : null;
                    ctx.SaveChanges();

/*                    if (productDesign.ColorVariants != null)
                    {
                        foreach (var item in productDesign.ColorVariants.Where(x => x.ColorNo != null)) //&& x.Quantity != null))
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
*/
                    
               
                    ctx.ProductDesignsInDesignTypes.RemoveRange(ctx.ProductDesignsInDesignTypes.Where(x => x.ProductDesignId == prod.Id));
                    if (productDesign.DesignTypeId != null)
                    {
                        foreach (var item in productDesign.DesignTypeId)
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

                }

                return productDesign.Id;
            }
            catch (Exception ex)
            {
                return null;
            }

        }


    }
}
