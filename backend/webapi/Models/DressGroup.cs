namespace chiffon_back.Models
{
    public class DressGroup
    {
        public int Id { get; set; }
        public int? ParentDressGroupId { get; set; }
        public string? DressGroupName { get; set; }
    }
}
