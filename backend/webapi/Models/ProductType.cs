namespace chiffon_back.Models
{
    public class ProductType
    {
        public int Id { get; set; }
        public string? TypeName { get; set; }
    }
    public class PostProductType
    {
        public int Id { get; set; }
        public int? ProductId { get; set; }
        public string? TypeName { get; set; }
    }
}
