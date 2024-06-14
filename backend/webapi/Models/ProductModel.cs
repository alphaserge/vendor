namespace chiffon_back.Models
{
    public class ProductFilter
    {
        public int? Id { get; set; }
    }

    public class ProductModel
    {
        private static readonly chiffon_back.Context.ChiffonDbContext ctx = Code.ContextHelper.ChiffonContext();
        public static void Get()
        {
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
                            Colors = new List<ProductColor>(),
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
                    var imageFiles = DirectoryHelper.GetImageFiles(cv.Uuid);
                    images.AddRange(imageFiles); //p.ImagePaths = images.ToArray();
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
                if (!String.IsNullOrWhiteSpace(p.Uuid))
                {
                    p.Colors.Add(new ProductColor()
                    {
                        Color = "COMMON",
                        CvId = 0,
                        CvNum = 0,
                        ImagePath = DirectoryHelper.GetImageFiles(p.Uuid)
                    });
                }
            }

            prods.AddRange(prods);
            prods.AddRange(prods);
            prods.AddRange(prods);
            prods.AddRange(prods);

            return prods;
        }
    }
}
