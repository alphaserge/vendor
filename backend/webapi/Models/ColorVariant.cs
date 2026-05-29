namespace chiffon_back.Models
{

    public class PostColorVariant
    {
        public int ColorNo { get; set; }
        public int ProductDesignId { get; set; }
        public string Uuid { get; set; }
        public decimal? Quantity { get; set; }
        public decimal? Price { get; set; }
        public int[] ColorIds { get; set; }

        public PostColorVariant() { 
            Uuid = String.Empty;
            ColorIds = [];
        }
    }

    public class ColorVariant
    {
        public int Id { get; set; }
        public int ColorNo { get; set; }
        public int ProductDesignId { get; set; }
        public string Uuid { get; set; }
        public decimal? Quantity { get; set; }
        public decimal? Price { get; set; }

        public ColorVariant()
        {
            Uuid = String.Empty;
        }
    }
}
