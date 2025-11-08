namespace chiffon_back.Models
{
    public class ClientOrder
    {
        public int Id { get; set; }
        public DateTime? Created { get; set; }
        public string? Uuid { get; set; }
        public int Number { get; set; }
        public string? ClientName { get; set; }
        public string? ClientPhone { get; set; }
        public string? ClientEmail { get; set; }
        public string? ClientAddress { get; set; }
        public bool IsSamples { get; set; }
        public decimal TotalCost { get; set; }
        public List<ClientOrderItem> Items { get; set; }
    }


    public class ClientOrderItem
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public decimal Quantity { get; set; }
        public decimal Price { get; set; }
        public string? Details{ get; set; }
        public int? VendorId { get; set; }
        public int? StockId { get; set; }
        public string? ItemName { get; set; }
        public string? RefNo { get; set; }
        public string? ArtNo { get; set; }
        public string? Design { get; set; }
        public string? Composition { get; set; }
        public string? VendorName { get; set; }
        public string? StockName { get; set; }
        public string? imagePath { get; set; }
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
        public decimal? TotalCost { get; set; }
    }
}
