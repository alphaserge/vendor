namespace chiffon_back.Models
{

    public class PostColorVariant
    {
        public int colorNo { get; set; }
        //public int[]? colorIds { get; set; }
        public string? colorIds { get; set; }
        public string? id { get; set; }
    }

    public class ColorVariant
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string? Uuid { get; set; }
    }
}
