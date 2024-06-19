

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
    }
}
