namespace chiffon_back.Models
{
    public class Order
    {
        public int Id { get; set; }
        public DateTime? Created { get; set; }
        public int VendorId { get; set; }
        public string? Uuid { get; set; }
        public int Number { get; set; }
        public string? ClientName { get; set; }
        public string? ClientPhone { get; set; }
        public string? ClientEmail { get; set; }
        public OrderItem[]? Items { get; set; }
    }
}
