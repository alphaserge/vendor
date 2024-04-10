namespace chiffon_back.Context
{
    public class ProductsInSeasons
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int SeasonId { get; set; }

        //public virtual Product? Product { get; set; }
        public virtual Season? Season { get; set; }
    }
}
