namespace chiffon_back.Context
{
    public class ProductsInOverWorkTypes
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int OverWorkTypeId { get; set; }

        //public virtual Product? Product { get; set; }
        public virtual OverWorkType? OverWorkType { get; set; }
    }
}
