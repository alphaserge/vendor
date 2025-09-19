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
        public DbSet<Currency> Currencies { get; set; }
        public DbSet<ColorVariantsInColors> ColorVariantsInColors { get; set; }
        public DbSet<DesignType> DesignTypes { get; set; }
        public DbSet<DyeStaff> DyeStaffs { get; set; }
        public DbSet<Finishing> Finishings { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<OverWorkType> OverWorkTypes { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<PlainDyedType> PlainDyedTypes { get; set; }
        public DbSet<PrintType> PrintTypes { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductsInColors> ProductsInColors { get; set; }
        public DbSet<ProductsInDesignTypes> ProductsInDesignTypes { get; set; }
        public DbSet<ProductsInTextileTypes> ProductsInTextileTypes { get; set; }
        public DbSet<ProductsInOverWorkTypes> ProductsInOverWorkTypes { get; set; }
        public DbSet<ProductsInSeasons> ProductsInSeasons { get; set; }
        public DbSet<ProductStyle> ProductStyles { get; set; }
        public DbSet<ProductType> ProductTypes { get; set; }
        public DbSet<TextileType> TextileTypes { get; set; }
        public DbSet<Season> Seasons { get; set; }
        public DbSet<Stock> Stocks { get; set; }
        public DbSet<VendorOrder> VendorOrders { get; set; }
        public DbSet<Vendor> Vendors { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Color>().ToTable("Colors");
            modelBuilder.Entity<ColorVariant>().ToTable("ColorVariants");
            modelBuilder.Entity<ColorVariantsInColors>().ToTable("ColorVariantsInColors");
            modelBuilder.Entity<DesignType>().ToTable("DesignTypes");
            modelBuilder.Entity<TextileType>().ToTable("TextileTypes");
            modelBuilder.Entity<DyeStaff>().ToTable("DyeStaffs");
            modelBuilder.Entity<Finishing>().ToTable("Finishings");
            modelBuilder.Entity<Order>().ToTable("Orders");
            modelBuilder.Entity<OrderItem>().ToTable("OrderItems");
            modelBuilder.Entity<OverWorkType>().ToTable("OverWorkTypes");
            modelBuilder.Entity<Payment>().ToTable("Payments");
            modelBuilder.Entity<PlainDyedType>().ToTable("PlainDyedTypes");
            modelBuilder.Entity<PrintType>().ToTable("PrintTypes");
            modelBuilder.Entity<Product>().ToTable("Products");
            modelBuilder.Entity<ProductsInColors>().ToTable("ProductsInColors");
            modelBuilder.Entity<ProductsInDesignTypes>().ToTable("ProductsInDesignTypes");
            modelBuilder.Entity<ProductsInTextileTypes>().ToTable("ProductsInTextileTypes");
            modelBuilder.Entity<ProductsInOverWorkTypes>().ToTable("ProductsInOverWorkTypes");
            modelBuilder.Entity<ProductsInSeasons>().ToTable("ProductsInSeasons");
            modelBuilder.Entity<ProductStyle>().ToTable("ProductStyles");
            modelBuilder.Entity<ProductType>().ToTable("ProductTypes");
            modelBuilder.Entity<Season>().ToTable("Seasons");
            modelBuilder.Entity<Stock>().ToTable("Stocks");
            modelBuilder.Entity<VendorOrder>().ToTable("VendorOrders");
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
                //!!??optionsBuilder.UseLazyLoadingProxies();
            }
        }
    }
}
