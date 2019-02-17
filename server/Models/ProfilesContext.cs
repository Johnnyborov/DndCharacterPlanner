using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace server.Models
{
  public class ProfilesContext : DbContext
  {
    public DbSet<Character> Characters { get; set; }

    public ProfilesContext(DbContextOptions<ProfilesContext> options) : base(options)
    {
      Database.EnsureCreated();
    }

    // protected override void OnModelCreating(ModelBuilder modelBuilder)
    // {
    //     modelBuilder.Entity<Character>().HasKey(u => new { u.Guid });
    // }
  }
}