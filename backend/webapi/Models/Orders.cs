namespace chiffon_back.Models
{
    public class Order
    {
        public int Id { get; set; }
        public int VendorId { get; set; }
        public string? Uuid { get; set; }
        public int Num { get; set; }
        public decimal? Quantity { get; set; }
    }
}
