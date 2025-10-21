namespace chiffon_back.Models
{

    public class PostColorVariant
    {
        public int? ColorNo { get; set; }
        public int[]? ColorIds { get; set; }
        public int? ProductId { get; set; }
        public int? ColorVariantId { get; set; }
        public string? Uuid { get; set; }
        public decimal? Quantity { get; set; }
        public decimal? Price { get; set; }

    }

    public class ColorVariant
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string? Uuid { get; set; }
        public int Num { get; set; }
        public decimal? Quantity { get; set; }
    }
}
