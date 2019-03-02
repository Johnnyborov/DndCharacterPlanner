using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace server.Models
{
  public class Class
  {
    public int ClassId { get; set; }
    public int SubclassId { get; set; }
    public int Level { get; set; }

    public List<int> Cantrips { get; set; }
    public List<int> Spells { get; set; }
  }

  public class Character
  {
    public int RaceId { get; set; }
    public List<int> Stats { get; set; }
    public List<int> Feats { get; set; }
    public Dictionary<int, List<int>> Options { get; set; }
    public List<Class> Classes { get; set; }
  }

  public class CharacterDbRepresentation
  {
    [Key]
    public long Id { get; set; }

    [NotMapped]
    public Character Character { get; set; }

    [Column("Character")]
    public string StatsSerialized
    {
      get
      {
        return JsonConvert.SerializeObject(Character);
      }
      set
      {
        Character = string.IsNullOrEmpty(value) ? new Character() : JsonConvert.DeserializeObject<Character>(value);
      }
    }
  }
}