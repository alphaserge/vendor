namespace chiffon_back.Context
{
    public class ProductsInDressGroups
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int DressGroupId { get; set; }
        public virtual DressGroup? DressGroup { get; set; }
    }
}
