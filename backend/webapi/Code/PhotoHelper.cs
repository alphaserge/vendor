

namespace chiffon_back.Code
{
    public class PhotoHelper
    {
        public static string[] GetPhotoUuids(string? uuids)
        {
            if (String.IsNullOrWhiteSpace(uuids))
                return Array.Empty<string>();
            
             return uuids!.Split(',');
        }

        public static string RemovePhotoUuid(string? uuids, string uuid)
        {
            string[] ss = uuids!.Split(',');
            ss = ss.Where(val => val != uuid).ToArray();
            return string.Join(',', ss);
        }

        public static string AppendPhotoUuid(string? uuids, string uuid)
        {
            string? s = uuids;
            if (s == null)
                s = string.Empty;

            s = s.Trim();

            return s + (s != string.Empty ? "," : "") + uuid;
        }
    }
}
