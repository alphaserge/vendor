namespace chiffon_back.Context
{
    public class Vendor
    {
        public int Id { get; set; }
        public string? VendorName { get; set; }
        public string? Contacts { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }

        //public virtual ICollection<Product>? Products { get; set; }
    }
}
