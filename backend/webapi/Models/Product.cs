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
        public decimal? FabricShrinkage { get; set; }
        public string? Uuid { get; set; }
        public string? PhotoUuid { get; set; }
        public string? VideoUuid { get; set; }
        public int? DyeStaffId { get; set; }
        public int? FinishingId { get; set; }
        public int? ProductStyleId { get; set; }
        public int? ProductTypeId { get; set; }
    }

    public class ProductJoinDesign
    {
        public int? ProductId { get; set; }
        public int? ProductDesignId { get; set; }
        public string? ArtNo { get; set; }
        public string? RefNo { get; set; }
        public string? Design { get; set; }
        public int? SampleNo { get; set; }
        public decimal? Price { get; set; }
        public decimal? Stock { get; set; }
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
        public decimal? FabricShrinkage { get; set; }
        public string? Uuid { get; set; }
        public string? PhotoUuid { get; set; }
        public string? VideoUuid { get; set; }
        public string? PhotoPath { get; set; }
        public string? VideoPath { get; set; }
        public string? DesignPhotoUuids { get; set; }
        public int? DyeStaffId { get; set; }
        public int? FinishingId { get; set; }
        public int? ProductStyleId { get; set; }
        public int? ProductTypeId { get; set; }
        public int? PlainDyedTypeId { get; set; }
        public int? PrintTypeId { get; set; }
        public int VendorId { get; set; }
    }

    public class CompositionSample
    {
        public int? ProductId { get; set; }
        public string? Composition { get; set; }
    }

    public class AddColorVariant
    {
        public int ColorNo { get; set; }
        public decimal? Price { get; set; }
        public string Uuid { get; set; }
        public int ProductDesignId { get; set; }
    }

    public class ProductPhotos
    {
        public required List<string> ImagePath { get; set; }
    }

    public class PostProduct
    {
        public Product Product { get; set; }
        public int[]? DressGroupId { get; set; }
        public int[]? OverWorkTypeId { get; set; }
        public int[]? SeasonId { get; set; }
        public CompositionValue[]? CompositionValues { get; set; }
        public PostColorVariant[]? ColorVariants { get; set; }
        public PostProduct()
        {
            Product = new Product();
        }

    }

}
