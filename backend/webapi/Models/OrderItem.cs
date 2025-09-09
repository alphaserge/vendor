namespace chiffon_back.Models
{
    public class OrderItem
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int? VendorOrderId { get; set; }
        public int ProductId { get; set; }
        public int? VendorId { get; set; }
        public int? StockId { get; set; }
        public decimal? Quantity { get; set; }
        public decimal? VendorQuantity { get; set; }
        public bool? OrderRolls { get; set; }
        public string? Details { get; set; }
        public string? ItemName { get; set; }
        public string? RefNo { get; set; }
        public string? ArtNo { get; set; }
        public string? Design { get; set; }
        public decimal? Price { get; set; }
        public string? Composition { get; set; }
        public string? VendorName { get; set; }
        public string? StockName { get; set; }
        public string? imagePath { get; set; }
        public int? ColorVariantId { get; set; }
        public int? ColorNo { get; set; }
        public string? ColorNames { get; set; }
        public string? Unit { get; set; }
        public decimal? RollLength { get; set; }
        public bool? Paid { get; set; }
        public DateTime? Shipped { get; set; }
        public DateTime? Delivered { get; set; }
        public string? DeliveryNo { get; set; }
        public string? DeliveryCompany { get; set; }
        public decimal? Total { get; set; }
    }

    public class ChangeDetails
    {
        public int? Id { get; set; }
        public string? Details { get; set; }
        public string? DeliveryNo { get; set; }
        public string? DeliveryCompany { get; set; }
    }

    public class OrderItemAccept
    {
        public int? ItemId { get; set; }
    }

    public class DeliveryInfo
    {
        public int? Id { get; set; }
        public string? DeliveryNo { get; set; }
        public string? DeliveryCompany { get; set; }
    }

    public class IdValue
    {
        public int? Id { get; set; }
    }
}