namespace chiffon_back.Context
{
    public class ProductsInTextileTypes
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int TextileTypeId { get; set; }
        public int Value { get; set; }

        //public virtual Product? Product { get; set; }
        public virtual TextileType? TextileType { get; set; }
    }
}
