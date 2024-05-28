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
        public static string ComputeDirectory(string folder, string uid)
        {
            string baseDir = Path.Combine(Directory.GetCurrentDirectory(), folder);
            string dir = uid.Replace("-", "").Insert(6, "\\").Insert(4, "\\").Insert(2, "\\");
            return Path.Combine(baseDir, dir);
        }
        public static string ComputeFilePath(string folder, string uid, string extension)
        {
            var dirPath = ComputeDirectory(folder, uid);
            return Path.Combine(dirPath, uid + extension);
        }
        public static string ComputeFileUrl(string uid, string fileName)
        {
            string dir = uid.Replace("-", "").Insert(6, "\\").Insert(4, "\\").Insert(2, "\\");
            string fileUrl = Path.Combine(@"images", dir, fileName);
            return Path.Combine(fileUrl);
        }
    }
}
