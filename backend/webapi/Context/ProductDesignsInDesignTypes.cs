namespace chiffon_back.Context
{
    public class ProductDesignsInDesignTypes
    {
        public int Id { get; set; }
        public int ProductDesignId { get; set; }
        public int DesignTypeId { get; set; }

        public virtual DesignType? DesignType { get; set; }
    }
}
