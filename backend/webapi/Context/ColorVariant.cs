using Microsoft.AspNetCore.Http.HttpResults;
using System;

namespace chiffon_back.Context
{
    public class ColorVariant
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string? Uuid { get; set; }
        public int Num { get; set; }
        public decimal? Quantity { get; set; }
        public decimal? Price { get; set; }

    }
}
