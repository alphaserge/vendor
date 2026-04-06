namespace chiffon_back.Models
{
    public class DesignType
    {
        public int Id { get; set; }
        public string? DesignName { get; set; }
    }
    public class PostDesignType
    {
        public int Id { get; set; }
        public int? ProductId { get; set; }
        public string? DesignName { get; set; }
    }
}
