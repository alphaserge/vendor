using chiffon_back.Code;
using chiffon_back.Context;
using chiffon_back.Models;
using Newtonsoft.Json;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace chiffon_back.Models
{
    public class Product
    {
        public int? Id { get; set; }
        public DateTime? Created { get; set; }
        public string? ArtNo { get; set; }
        public string? Design { get; set; }
        public string? FabricConstruction { get; set; }
        public string? FabricYarnCount { get; set; }
        public string? Findings { get; set; }
        public string? HSCode { get; set; }
        public string? ItemName { get; set; }
        public string? RefNo { get; set; }

        public int? Weight { get; set; }
        public int? Width { get; set; }
        public int? GSM { get; set; }
        public int? ColorFastness { get; set; }
        public decimal? FabricShrinkage { get; set; }
        public decimal? MetersInKG { get; set; }
        public decimal? Price { get; set; }
        public decimal? Stock { get; set; }


        public string? PhotoDir { get; set; }
        public string? Uuid { get; set; }
        public string? PhotoUuids { get; set; }
        public string? FileName { get; set; }

        public int? DyeStaffId { get; set; }
        public int? FinishingId { get; set; }
        public int? PlainDyedTypeId { get; set; }
        public int? PrintTypeId { get; set; }
        public int? ProductStyleId { get; set; }
        public int? ProductTypeId { get; set; }
        public int? VendorId { get; set; }

        public string? DyeStaff { get; set; }
        public string? Finishing { get; set; }
        public string? PlainDyedType { get; set; }
        public string? PrintType { get; set; }
        public string? ProductStyle { get; set; }
        public string? ProductType { get; set; }
        public string? Vendor { get; set; }

        public List<ProductColor> Colors { get; set; }

        public int[]? DesignTypeIds { get; set; }
        public int[]? OverWorkTypeIds { get; set; }
        public int[]? SeasonIds { get; set; }

        public DesignType[]? DesignTypes { get; set; }
        public OverWorkType[]? OverWorkTypes { get; set; }
        public Season[]? Seasons { get; set; }
    }

    public class PostCV
    {
        public int? Num { get; set; }
        public int? Id { get; set; }
        public string? Uuid { get; set; }
        public int? ProductId { get; set; }
        public bool IsProduct { get; set; }
    }

    public class ProductColor
    {
        public List<string>   ImagePath { get; set; }
        public List<int?>?    ColorIds { get; set; }
        public string?        Uuid { get; set; }
        public string?        ColorNames { get; set; }
        public int?           ColorNo { get; set; }
        public int?           ColorVariantId { get; set; }
        public decimal?       Quantity { get; set; }
        public int?           ProductId { get; set; }
        public bool           IsProduct { get; set; }
        public bool           Existing { get; set; }
    }

    public class PostProduct
    {
        public int? Id { get; set; }
        public string? ArtNo { get; set; }
        public string? Design { get; set; }
        public string? FabricConstruction { get; set; }
        public string? FabricYarnCount { get; set; }
        public string? Findings { get; set; }
        public string? ItemName { get; set; }
        public string? HSCode { get; set; }
        public string? RefNo { get; set; }

        public int? Weight { get; set; }
        public int? Width { get; set; }
        public int? GSM { get; set; }
        public int? ColorFastness { get; set; }
        public decimal? FabricShrinkage { get; set; }
        public decimal? MetersInKG { get; set; }
        public decimal? Price { get; set; }
        public decimal? Stock { get; set; }

        public int? DyeStaffId { get; set; }
        public int? FinishingId { get; set; }
        public int? PlainDyedTypeId { get; set; }
        public int? PrintTypeId { get; set; }
        public int? ProductStyleId { get; set; }
        public int? ProductTypeId { get; set; }
        public int? VendorId { get; set; }

        public string? ProductStyle { get; set; }
        public string? ProductType { get; set; }
        public string? Uuid { get; set; }
        public int[]? DesignTypes { get; set; }
        public int[]? OverWorkTypes { get; set; }
        public int []? Seasons { get; set; }
        public PostColorVariant[]? ColorVariants { get; set; }
        public PostColorVariant[]? Quantities { get; set; }
        public string? PhotoUuids { get; set; }

    }

}
