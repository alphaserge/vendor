namespace chiffon_back.Models
{
    public class ProductsInTextileTypes
    {
        public int? Id { get; set; }
        public int? ProductId { get; set; }
        public int? TextileTypeId { get; set; }
        public int? Value { get; set; }

        public string? TextileType { get; set;}

        //public virtual Product? Product { get; set; }
        //public virtual TextileType? TextileType { get; set; }
    }

    public class FinishTextileTypes
    {
        public int? ProductId { get; set; }
        public int? TextileTypeId { get; set; }
    }

    public class RemoveTextileTypes
    {
        public int? Id { get; set; }
    }

}
