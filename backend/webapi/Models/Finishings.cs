namespace chiffon_back.Models
{
    public class Finishings
    {
        public int Id { get; set; }
        public string? FinishingName { get; set; }
    }
    public class PostFinishings
    {
        public int Id { get; set; }
        public int? ProductId { get; set; }
        public string? FinishingName { get; set; }
    }
}
