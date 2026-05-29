namespace chiffon_back.Context
{
    public class Product
    {
        public int Id { get; set; }
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
        public virtual ProductStyle? ProductStyle { get; set; }
        public virtual ProductType? ProductType { get; set; }
        public virtual DyeStaff? DyeStaff { get; set; }
        public virtual Finishing? Finishing { get; set; }
        public virtual ICollection<ProductsInSeasons>? ProductsInSeasons { get; set; }
        public virtual ICollection<ProductsInOverWorkTypes>? ProductsInOverWorkTypes { get; set; }
        public virtual ICollection<ProductDesignsInDesignTypes>? ProductsInDesignTypes { get; set; }
        public virtual ICollection<ProductsInDressGroups>? ProductsInDressGroups { get; set; }
        public virtual ICollection<ProductsInTextileTypes>? ProductsInTextileTypes { get; set; }
    }
}
