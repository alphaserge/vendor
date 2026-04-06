namespace chiffon_back.Models
{
    public class OverWorkType
    {
        public int Id { get; set; }
        public string? OverWorkName { get; set; }
    }
    public class PostOverWorkType
    {
        public int Id { get; set; }
        public int? ProductId { get; set; }
        public string? OverWorkName { get; set; }
    }
}
