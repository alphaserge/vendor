using chiffon_back.Context;
using Microsoft.EntityFrameworkCore;

namespace chiffon_back.Code
{
    public class ContextHelper
    {
        public static ChiffonDbContext ChiffonContext()
        {
            return new ChiffonDbContext(new DbContextOptions<ChiffonDbContext>());
        }
    }
}
