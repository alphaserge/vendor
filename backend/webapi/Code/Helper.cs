namespace chiffon_back.Code
{
    public class Helper
    {
        public static Decimal? Round(Decimal? value, int digits)
        {
            return value != null ? Math.Round(value!.Value * 1.05m, digits) : null;
        }
    }
}
