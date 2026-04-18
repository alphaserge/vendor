namespace chiffon_back.Context
{
    public class DressGroup
    {
        public int Id { get; set; }
        public int? ParentDressGroupId { get; set; }
        public string? DressGroupName { get; set; }

        //public virtual ICollection<Product>? Products { get; set; }
    }
}
