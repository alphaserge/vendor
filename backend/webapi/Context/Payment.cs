namespace chiffon_back.Context
{
    public class Payment
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public int OrderId { get; set; }
        public Decimal Amount { get; set; }
        public Decimal CurrencyAmount { get; set; }
        public int CurrencyId { get; set; }
    }
}
