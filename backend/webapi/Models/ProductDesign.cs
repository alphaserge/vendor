namespace chiffon_back.Models
{
    public class ProductDesign
    {
        public int Id { get; set; }
        public int? ProductId { get; set; }
        public int? VendorId { get; set; }
        public int? SampleNo { get; set; }
        public string? ArtNo { get; set; }
        public string? Design { get; set; }
        public string? RefNo { get; set; }
        public string? Uuid { get; set; }
        public string? PhotoUuids { get; set; }
        public decimal? Price { get; set; }
        public decimal? Stock { get; set; }
        public ICollection<string>? PhotoImagePath { get; set; }
        public ICollection<string>? VideoImagePath { get; set; }
        public int? PlainDyedTypeId { get; set; }
        public int? PrintTypeId { get; set; }
        public int[]? DesignTypeId { get; set; }
        public string? VendorName { get; set; }
        public string? PrintType { get; set; }
        public string? PlainDyedType { get; set; }
        public virtual ICollection<string> Photos { get; set; }
        public virtual ICollection<ProductDesignType> DesignTypes { get; set; }
        public virtual ICollection<ProductDesignColor> Colors { get; set; }
        public ProductDesign()
        {
            Photos = [];
            DesignTypes = [];
            Colors = [];
        }
    }

    public class ProductDesignColor
    {
        public int ColorVariantId { get; set; }
        public int ProductDesignId { get; set; }
        public int ColorNo { get; set; }
        public string ImagePath { get; set; }
        public string Uuid { get; set; }
        public string ColorNames { get; set; }
        public decimal? Quantity { get; set; }
        public decimal? Price { get; set; }
        public List<int?> ColorIds { get; set; }
        public ProductDesignColor()
        {
            ColorNo = 0;
            ColorVariantId = 0;
            ImagePath = "";
            Uuid = "";
            ColorNames = "";
            ColorIds = [];
        }
    }

    public class ProductDesignType
    {
        public int ProductDesignTypeId { get; set; }
        public int ProductDesignId { get; set; }
        public string DesignName { get; set; }
        public ProductDesignType()
        {
            DesignName = "";
        }
    }

    public class PostProductDesign
    {
        public int? Id { get; set; }
        public int? ProductId { get; set; }
        public int? VendorId { get; set; }
        public int? SampleNo { get; set; }
        public string? Uuid { get; set; }
        public string? ArtNo { get; set; }
        public string? Design { get; set; }
        public string? RefNo { get; set; }
        public decimal? Price { get; set; }
        public decimal? Stock { get; set; }
        public int? PlainDyedTypeId { get; set; }
        public int? PrintTypeId { get; set; }
        public int[]? DesignTypeId { get; set; }
    }

}
