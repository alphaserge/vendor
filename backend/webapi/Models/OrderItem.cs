﻿namespace chiffon_back.Models
{
    public class OrderItem
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int? VendorOrderId { get; set; }
        public int ProductId { get; set; }
        public int? VendorId { get; set; }
        public decimal? Quantity { get; set; }
        public decimal? VendorQuantity { get; set; }
        public bool? OrderRolls { get; set; }
        public string? Details { get; set; }
        public string? ItemName { get; set; }
        public string? RefNo{ get; set; }
        public string? ArtNo { get; set; }
        public string? Design { get; set; }
        public decimal? Price { get; set; }
        public string? Composition { get; set; }
        public string? VendorName { get; set; }
        public string? imagePath { get; set; }
        public int? ColorVariantId { get; set; }
        public int? ColorNo { get; set; }
        public string? ColorNames { get; set; }
        public string? Unit { get; set; }
        public DateTime? ConfirmByVendor { get; set; }
        public DateTime? ShippedByVendor { get; set; }
        public DateTime? InStock { get; set; }
        public DateTime? ShippedToClient { get; set; }
        public DateTime? RecievedByClient { get; set; }
        public decimal? RollLength { get; set; }        

        //public string? ImagePath { get; set; }
    }

    public class ChangeDetails
    {
        public int? Id { get; set; }
        public string? Details { get; set; }
    }

    public class OrderItemAccept
    {
        public int? ItemId { get; set; }
    }

}
