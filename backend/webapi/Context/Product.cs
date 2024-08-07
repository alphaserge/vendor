namespace chiffon_back.Context
{
    public class Product
    {
        public int Id { get; set; }
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


        public virtual ProductStyle? ProductStyle { get; set; }
        public virtual ProductType? ProductType { get; set; }
        public virtual Vendor? Vendor { get; set; }
        public virtual PrintType? PrintType { get; set; }
        public virtual DyeStaff? DyeStaff { get; set; }
        public virtual PlainDyedType? PlainDyedType { get; set; }

        public virtual ICollection<ProductsInSeasons>? ProductsInSeasons { get; set; }
        public virtual ICollection<ProductsInOverWorkTypes>? ProductsInOverWorkTypes { get; set; }
        public virtual ICollection<ProductsInDesignTypes>? ProductsInDesignTypes { get; set; }
        public virtual ICollection<ProductsInColors>? ProductsInColors { get; set; }
    }
}
