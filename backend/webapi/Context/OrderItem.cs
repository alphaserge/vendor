namespace chiffon_back.Context
{
    public class OrderItem
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int? VendorOrderId { get; set; }
        public int ProductId { get; set; }
        public int? StockId { get; set; }
        public decimal? Quantity { get; set; }
        public bool? Paid { get; set; }
        public string? Details { get; set; }
        public decimal? Price { get; set; }
        public int? ColorVariantId { get; set; }
        public int? ColorNo { get; set; }
        public string? ColorNames { get; set; }
        public string? Unit { get; set; }
        public DateTime? Shipped { get; set; }
        public DateTime? Delivered { get; set; }
        public string? DeliveryNo { get; set; }
        public string? DeliveryCompany { get; set; }
        public string? ClientDeliveryNo { get; set; }
        public string? ClientDeliveryCompany { get; set; }
    }
}
