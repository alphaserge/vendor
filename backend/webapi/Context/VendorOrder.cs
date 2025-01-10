namespace chiffon_back.Context
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
    }
}
