﻿namespace chiffon_back.Models
{
    public class User
    {
        public int Id { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? Phones { get; set; }
        public string? PasswordHash { get; set; }
        public int? PasswordSalt { get; set; }
        public bool IsLocked { get; set; }
        public int? VendorId { get; set; }
        public DateTime? Created { get; set; }
        public string? Token { get; set; }
        public string? Roles { get; set; }
        public string? RegistrationHash { get; set; }
        public string? VendorName { get; set; }

        //public virtual Vendor? Vendor { get; set; }
    }
}
