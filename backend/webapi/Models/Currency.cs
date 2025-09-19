namespace chiffon_back.Models
{
    public class Currency
    {
        public int Id { get; set; }
        public string? CurrencyName { get; set; }
        public string? ShortName { get; set; }
        public decimal? Rate { get; set; }

    }
}
