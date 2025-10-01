namespace chiffon_back.Models
{
    public class Payment
    {
        public int Id { get; set; }
        public DateTime? Date { get; set; }
        public string? Currency { get; set; }
        public int OrderId { get; set; }
        public Decimal? Amount { get; set; }
        public Decimal? CurrencyAmount { get; set; }
        public int CurrencyId { get; set; }
    }

    public class OrderPayments
    {
        public Payment[]? Payments { get; set; }
        public Decimal? Total { get; set; }
    }
}
