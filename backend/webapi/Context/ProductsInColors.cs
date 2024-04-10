namespace chiffon_back.Context
{
    public class ProductsInColors
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int ColorId { get; set; }

        //public virtual ICollection<Product>? Products { get; set; }
        public virtual Color? Color { get; set; }
    }
}
