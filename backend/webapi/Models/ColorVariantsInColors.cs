using Microsoft.AspNetCore.Http.HttpResults;

namespace chiffon_back.Models
{
    public class ColorVariantsInColors
    {
        public int Id { get; set; }
        public int ColorVariantId { get; set; }
        public int ColorId { get; set; }
    }
}