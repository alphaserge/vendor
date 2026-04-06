namespace chiffon_back.Models
{
    public class PlainDyedType
    {
        public int Id { get; set; }
        public string? PlainDyedTypeName { get; set; }
    }
    public class PostPlainDyedType
    {
        public int Id { get; set; }
        public int? ProductId { get; set; }
        public string? PlainDyedTypeName { get; set; }
    }
}
