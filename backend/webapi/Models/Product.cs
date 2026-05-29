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
        public string? ItemName { get; set; }
        public string? HSCode { get; set; }
        public int? Weight { get; set; }
        public int? Width { get; set; }
        public int? GSM { get; set; }
        public decimal? MetersInKG { get; set; }
        public decimal? RollLength { get; set; }
        public int? ColorFastness { get; set; }
        public string? FabricConstruction { get; set; }
        public string? FabricYarnCount { get; set; }
        public string? Composition { get; set; }
        public decimal? FabricShrinkage { get; set; }
        public string? Uuid { get; set; }
        public string? PhotoUuid { get; set; }
        public string? VideoUuid { get; set; }
        public int? DyeStaffId { get; set; }
        public int? FinishingId { get; set; }
        public int? ProductStyleId { get; set; }
        public int? ProductTypeId { get; set; }
        public string? ProductStyle { get; set; }
        public string? ProductType { get; set; }
        public string? DyeStaff { get; set; }
        public string? Finishing { get; set; }

        public required List<string> Photos { get; set; }
        public required List<string> Videos { get; set; }
        public required List<ProductDesign> Designs { get; set; }

        public CompositionValue[]? CompositionValues { get; set; }

        public TextileType[]? TextileTypes { get; set; }
        public DesignType[]? DesignTypes { get; set; }
        public DressGroup[]? DressGroups { get; set; }
        public OverWorkType[]? OverWorkTypes { get; set; }
        public Season[]? Seasons { get; set; }
    }

    public class CompositionSample
    {
        public int? ProductId { get; set; }
        public string? Composition { get; set; }
    }

    public class PostCV
    {
        public int? Num { get; set; }
        public int? Id { get; set; }
        public string? Uuid { get; set; }
        public int? ProductId { get; set; }
        public bool IsProduct { get; set; }
        public bool IsVideo { get; set; }
    }

    public class ProductPhotos
    {
        public required List<string> ImagePath { get; set; }
    }

    public class PostProduct
    {
        public int? Id { get; set; }
        public string? ItemName { get; set; }
        public string? FabricConstruction { get; set; }
        public string? FabricYarnCount { get; set; }
        public decimal? FabricShrinkage { get; set; }
        public string? HSCode { get; set; }

        public int? Weight { get; set; }
        public int? Width { get; set; }
        public int? GSM { get; set; }
        public int? ColorFastness { get; set; }
        public decimal? MetersInKG { get; set; }
        public decimal? RollLength { get; set; }

        public int? DyeStaffId { get; set; }
        public int? FinishingId { get; set; }
        public int? ProductStyleId { get; set; }
        public int? ProductTypeId { get; set; }

        public string? Uuid { get; set; }
        public int[]? DressGroupId { get; set; }
        public int[]? OverWorkTypeId { get; set; }
        public int[]? SeasonId { get; set; }
        public CompositionValue[]? CompositionValues { get; set; }
        public PostColorVariant[]? ColorVariants { get; set; }
        public string? PhotoUuids { get; set; }
        public string? VideoUuids { get; set; }

    }

}
