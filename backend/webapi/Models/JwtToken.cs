﻿namespace chiffon_back.Models
{
    public class JwtToken
    {
        public int Id { get; set; }
        public string Token { get; set; }
        public int UserId { get; set; }
        public DateTime ExpiresAt { get; set; }
    }
}
