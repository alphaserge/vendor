namespace chiffon_back.Context
{
    public class Payment
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public string What { get; set; }
        public int WhatId { get; set; }
        public int OrderId { get; set; }
        public Decimal Amount { get; set; }
        public string Currency { get; set; }
    }
}
