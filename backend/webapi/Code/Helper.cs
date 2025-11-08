using Microsoft.AspNetCore.Identity;
using System.Security.Cryptography;
using System.Text;
using System.Xml.Linq;

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

        public static string[] ParseFirstLastName(string name)
        {
            string firstName = "";
            string lastName = "";
            string[] parts = name.Split(' ');
            if (parts.Length == 1)
            {
                firstName = name;
            }
            if (parts.Length == 2)
            {
                firstName = parts[0];
                lastName = parts[1];
            }
            if (parts.Length > 2)
            {
                firstName = parts[0];
                List<string> partsList = parts.ToList();
                partsList.RemoveAt(0);
                lastName = string.Join(' ', partsList);
            }
            return [firstName, lastName];
        }

        public static decimal GetCurrencyCourse(string currShort, DateTime date)
        {
            decimal crs = 0m;

            try
            {
                XElement xelement = XElement.Load("http://www.cbr.ru/scripts/XML_daily.asp?date_req=" + date.ToString("dd/MM/yyyy"));
                IEnumerable<XElement> employees = xelement.Elements();
                XElement? value = (from nm in xelement.Elements("Valute")
                                   where (string)nm.Element("CharCode") == currShort.ToUpper()
                                   select nm).FirstOrDefault();

                if (value != null)
                {
                    string sCrs = value.Element("Value").Value;
                    decimal c = 0;
                    if (Decimal.TryParse(sCrs, out c))
                        crs = c;
                }
                return crs;
            }
            catch (Exception ex) 
            {
                return -1m;
            }
        }

        public static decimal ZeroWhenNull(decimal? value)
        {
            if (value == null)
                return 0;

            return value.Value;
        }
    }
}
