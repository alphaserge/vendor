namespace chiffon_back.Context
{
    public class ProductsInDesignTypes
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int DesignTypeId { get; set; }

        //public virtual Product? Product { get; set; }
        public virtual DesignType? DesignType { get; set; }
    }
}
