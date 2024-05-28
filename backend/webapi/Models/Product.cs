using chiffon_back.Context;

namespace chiffon_back.Models
{
    public class Product
    {
        public int? Id { get; set; }
        public string? ItemName { get; set; }
        public string? RefNo { get; set; }
        public string? ArtNo { get; set; }
        public string? Design { get; set; }
        public int? ColorNo { get; set; }
        public string? ColorName { get; set; }
        public string? PhotoDir { get; set; }
        public decimal? Price { get; set; }
        public int? Weight { get; set; }
        public int? Width { get; set; }

        public int? ProductStyleId { get; set; }
        public int? ProductTypeId { get; set; }
        public int? VendorId { get; set; }

        public string? Vendor { get; set; }
        public string? ProductStyle { get; set; }
        public string? ProductType { get; set; }
        public string? Uuid { get; set; }
        public string? FileName { get; set; }
        public string? ImagePath { get; set; }
        public Color[]? Colors { get; set; }
        public DesignType[]? DesignTypes { get; set; }
        public OverWorkType[]? OverWorkTypes { get; set; }
        public Season[]? Seasons { get; set; }

        /*public virtual ProductStyle? ProductStyle { get; set; }
        public virtual ProductType? ProductType { get; set; }
        public virtual Vendor? Vendor { get; set; }*/

        /*public virtual ICollection<ProductsInSeasons>? ProductsInSeasons { get; set; }
        public virtual ICollection<ProductsInOverWorkTypes>? ProductsInOverWorkTypes { get; set; }
        public virtual ICollection<ProductsInDesignTypes>? ProductsInDesignTypes { get; set; }
        public virtual ICollection<ProductsInColors>? ProductsInColors { get; set; }*/
    }

    public class PostProduct
    {
        public int? Id { get; set; }
        public string? ItemName { get; set; }
        public string? RefNo { get; set; }
        public string? ArtNo { get; set; }
        public string? Design { get; set; }
        //public int? ColorNo { get; set; }
        public decimal? Price { get; set; }
        public int? Weight { get; set; }
        public int? Width { get; set; }

        public int? ProductStyleId { get; set; }
        public int? ProductTypeId { get; set; }
        public int? VendorId { get; set; }

        public string? ProductStyle { get; set; }
        public string? ProductType { get; set; }
        public string? Uuid { get; set; }
        //public int[]? Colors { get; set; }
        public int[]? DesignTypes { get; set; }
        public int[]? OverWorkTypes { get; set; }
        public int []? Seasons { get; set; }
        public PostColorVariant[]? ColorVariants { get; set; }

    }

}
