using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace server.Models
{
  public class ProfilesContext : DbContext
  {
    public DbSet<CharacterSerialized> Characters { get; set; }

    public ProfilesContext(DbContextOptions<ProfilesContext> options) : base(options)
    {
      Database.EnsureCreated();
    }
  }
}