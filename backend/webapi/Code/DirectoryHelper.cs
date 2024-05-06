using System.IO;

namespace chiffon_back.Code
{
    public class DirectoryHelper
    {
        public static void CreateDirectoryIfMissing(string path)
        {
            bool folderExists = Directory.Exists(path);
            if (!folderExists)
                Directory.CreateDirectory(path);
        }
    }
}
