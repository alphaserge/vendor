using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Proxies;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace chiffon_back.Context
{
    public class ChiffonDbContext : DbContext
    {
        public ChiffonDbContext(DbContextOptions<ChiffonDbContext> options) : base(options)
        {
            int a = 0;
            //this.Configuration.ProxyCreationEnabled = true;
            //LazyLoadingEnabled = true;
        }

        public DbSet<Color> Colors { get; set; }
        public DbSet<ColorVariant> ColorVariants { get; set; }
        public DbSet<ColorVariantsInColors> ColorVariantsInColors { get; set; }
        public DbSet<DesignType> DesignTypes { get; set; }
        public DbSet<DyeStaff> DyeStaffs { get; set; }
        public DbSet<OverWorkType> OverWorkTypes { get; set; }
        public DbSet<PlainDyedType> PlainDyedTypes { get; set; }
        public DbSet<PrintType> PrintTypes { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductsInColors> ProductsInColors { get; set; }
        public DbSet<ProductsInDesignTypes> ProductsInDesignTypes { get; set; }
        public DbSet<ProductsInOverWorkTypes> ProductsInOverWorkTypes { get; set; }
        public DbSet<ProductsInSeasons> ProductsInSeasons { get; set; }
        public DbSet<ProductStyle> ProductStyles { get; set; }
        public DbSet<ProductType> ProductTypes { get; set; }
        public DbSet<Season> Seasons { get; set; }
        public DbSet<Vendor> Vendors { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Color>().ToTable("Colors");
            modelBuilder.Entity<ColorVariant>().ToTable("ColorVariants");
            modelBuilder.Entity<ColorVariantsInColors>().ToTable("ColorVariantsInColors");
            modelBuilder.Entity<DesignType>().ToTable("DesignTypes");
            modelBuilder.Entity<DyeStaff>().ToTable("DyeStaffs");
            modelBuilder.Entity<OverWorkType>().ToTable("OverWorkTypes");
            modelBuilder.Entity<PlainDyedType>().ToTable("PlainDyedTypes");
            modelBuilder.Entity<PrintType>().ToTable("PrintTypes");
            modelBuilder.Entity<Product>().ToTable("Products");
            modelBuilder.Entity<ProductsInColors>().ToTable("ProductsInColors");
            modelBuilder.Entity<ProductsInDesignTypes>().ToTable("ProductsInDesignTypes");
            modelBuilder.Entity<ProductsInOverWorkTypes>().ToTable("ProductsInOverWorkTypes");
            modelBuilder.Entity<ProductsInSeasons>().ToTable("ProductsInSeasons");
            modelBuilder.Entity<ProductStyle>().ToTable("ProductStyles");
            modelBuilder.Entity<ProductType>().ToTable("ProductTypes");
            modelBuilder.Entity<Season>().ToTable("Seasons");
            modelBuilder.Entity<Vendor>().ToTable("Vendors");
            modelBuilder.Entity<User>().ToTable("Users");
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                IConfigurationRoot configuration = new ConfigurationBuilder()
                    .SetBasePath(Directory.GetCurrentDirectory())
                    .AddJsonFile("appsettings.json")
                    .Build();
                var connectionString = configuration.GetConnectionString("DefaultConnection");
                optionsBuilder.UseSqlServer(connectionString);
                optionsBuilder.UseLazyLoadingProxies();
            }
        }
    }
}
