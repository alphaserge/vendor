namespace chiffon_back.Models
{
    public class Order
    {
        public int Id { get; set; }
        public DateTime? Created { get; set; }
        public int VendorId { get; set; }
        public string? Uuid { get; set; }
        public int Number { get; set; }
        public string? VendorName { get; set; }
        public string? ClientName { get; set; }
        public string? ClientPhone { get; set; }
        public string? ClientEmail { get; set; }
        public string? ClientAddress { get; set; }
        public string? Password { get; set; }
        public int? Hash { get; set; }
        public Decimal? PaySumm { get; set; }
        public OrderItem[]? Items { get; set; }
    }
    public class ConfirmCode
    {
        public int? Code { get; set; }
        public string? ClientName { get; set; }
        public string? Email { get; set; }
    }

    public class ClientOrderShort
    {
        public int Id { get; set; }
        public DateTime? Created { get; set; }
        public int Number { get; set; }
        public string? ClientName { get; set; }
        public decimal? Total { get; set; }
        //public string?[] Names { get; set; }
        public string?[] Images { get; set; }
        //public string?[] Uuids { get; set; }
    }

}
