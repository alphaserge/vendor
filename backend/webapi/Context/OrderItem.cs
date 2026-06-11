namespace chiffon_back.Context
{
    public class OrderItem
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int ProductDesignId { get; set; }
        public int? StockId { get; set; }
        public decimal Quantity { get; set; }
        public string? Details { get; set; }
        public decimal Price { get; set; }
        public int? ColorVariantId { get; set; }
        public int? ColorNo { get; set; }
        public string? ColorNames { get; set; }
        public string? Unit { get; set; }
        public DateTime? Shipped { get; set; }
        public DateTime? Delivered { get; set; }
        public string? VendorDeliveryNo { get; set; }
        public string? ClientDeliveryNo { get; set; }
        public int? VendorDeliveryCompanyId { get; set; }
        public int? ClientDeliveryCompanyId { get; set; }
    }
}
