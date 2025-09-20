namespace chiffon_back.Models
{
    public class Payment
    {
        public int Id { get; set; }
        public DateTime? Date { get; set; }
        public string? Currency { get; set; }
        public int OrderId { get; set; }
        public Decimal Amount { get; set; }
        public int CurrencyId { get; set; }
    }
}
