namespace chiffon_back.Context
{
    public class Product
    {
        public int Id { get; set; }
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
        public string? Uuid { get; set; }
        public string? FileName { get; set; }
        public virtual ProductStyle? ProductStyle { get; set; }
        public virtual ProductType? ProductType { get; set; }
        public virtual Vendor? Vendor { get; set; }

        public virtual ICollection<ProductsInSeasons>? ProductsInSeasons { get; set; }
        public virtual ICollection<ProductsInOverWorkTypes>? ProductsInOverWorkTypes { get; set; }
        public virtual ICollection<ProductsInDesignTypes>? ProductsInDesignTypes { get; set; }
        public virtual ICollection<ProductsInColors>? ProductsInColors { get; set; }
    }
}
