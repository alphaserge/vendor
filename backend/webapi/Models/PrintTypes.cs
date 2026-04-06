namespace chiffon_back.Models
{
    public class PrintType
    {
        public int Id { get; set; }
        public string? TypeName { get; set; }
    }
    public class PostPrintType
    {
        public int Id { get; set; }
        public int? ProductId { get; set; }
        public string? TypeName { get; set; }
    }
}
