using FlashCards.Api.Models;
using FlashCards.Models.Models;
using Microsoft.EntityFrameworkCore;


namespace FlashCards.Database
{
    public class ApplicationDBContext: DbContext
    {
        public ApplicationDBContext(DbContextOptions dbContextOptions) : base(dbContextOptions)
        {
            
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AppUser>()
                .HasIndex(a => a.Email)
                .IsUnique(true);
        }

        public DbSet<WordPack> WordPacks{ get; set; }
        public DbSet<AppUser> AppUsers{ get; set; }
        public DbSet<WordPackDetail> WordPackDetails { get; set; }
    }
}
