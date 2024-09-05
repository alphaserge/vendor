namespace chiffon_back.Models
{
    public class TextileType
    {
        public int Id { get; set; }
        public string? TextileTypeName { get; set; }
        public string? TextileTypeNameRu { get; set; }
    }

    public class ProductAddTextileType
    {
        public int ProductId { get; set; }
        public int TextileTypeId { get; set; }
        public int Value { get; set; }
    }

    public class ProductRemoveTextileType
    {
        public int ProductsInTextileTypeId { get; set; }
    }
}
