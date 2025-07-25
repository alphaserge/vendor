﻿using Microsoft.AspNetCore.Identity;
using System.Security.Cryptography;
using System.Text;

namespace chiffon_back.Code
{
    public class Helper
    {
        public static Decimal? Round(Decimal? value, int digits)
        {
            return value != null ? Math.Round(value!.Value * 1.05m, digits) : null;
        }

        public static string CreatePassword(int length)
        {
            const string valid = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
            StringBuilder res = new StringBuilder();
            Random rnd = new Random();
            while (0 < length--)
            {
                res.Append(valid[rnd.Next(valid.Length)]);
            }
            return res.ToString();
        }

        public static string CreateHash()
        {
            // создаем hash для регистрации
            string hash;
            using (MD5 hashMD5 = MD5.Create())
            {
                hash = String.Join
                (
                    "",
                    from ba in hashMD5.ComputeHash
                    (
                        Encoding.UTF8.GetBytes(DateTime.Now.ToString("yyyy-MM-dd_T_HH::mm::ss..fffffffK"))
                    )
                    select ba.ToString("x2")
                );
            }
            return hash;
        }

    }
}
