namespace chiffon_back.Models
{
    public class VendorOrder
    {
        public int Id { get; set; }
        public DateTime? Created { get; set; }
        public DateTime? Sent { get; set; }
        public DateTime? Received { get; set; }
        public int VendorId { get; set; }
        public string? Uuid { get; set; }
        public int Number { get; set; }
        public string? VendorName { get; set; }
        public OrderItem[]? Items { get; set; }
    }
}
