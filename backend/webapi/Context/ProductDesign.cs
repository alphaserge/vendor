using System;

namespace chiffon_back.Context
{
    public class ProductDesign
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int? SampleNo { get; set; }
        public string? ArtNo { get; set; }
        public string? Design { get; set; }
        public string? RefNo { get; set; }
        public decimal? Price { get; set; }
        public string? Uuid { get; set; }
        public string? PhotoUuids { get; set; }
        public int? PlainDyedTypeId { get; set; }
        public int? PrintTypeId { get; set; }
        public int VendorId { get; set; }
        public string? VendorName { get; set; }
        public string? PrintType { get; set; }
        public string? PlainDyedType { get; set; }
    }
}
