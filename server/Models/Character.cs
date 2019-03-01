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
    public Character() {}
    public Character(Character c)
    {
      RaceId = c.RaceId;
      Stats = c.Stats;
      Feats = c.Feats;

      Classes = c.Classes;
    }

    public int RaceId { get; set; }

    [NotMapped]
    public List<int> Stats { get; set; }

    [NotMapped]
    public List<int> Feats { get; set; }

    [NotMapped]
    public List<Class> Classes { get; set; }
  }

  public class CharacterSerialized: Character
  {
    public CharacterSerialized() {}
    public CharacterSerialized(Character c) : base(c) {}

    [Key]
    public long Id { get; set; } 


    [Column("Stats")]
    public string StatsSerialized
    {
      get
      {
        return JsonConvert.SerializeObject(Stats);
      }
      set
      {
        Stats = string.IsNullOrEmpty(value) ? new List<int>() : JsonConvert.DeserializeObject<List<int>>(value);
      }
    }

    [Column("Feats")]
    public string FeatsSerialized
    {
      get
      {
        return JsonConvert.SerializeObject(Feats);
      }
      set
      {
        Feats = string.IsNullOrEmpty(value) ? new List<int>() : JsonConvert.DeserializeObject<List<int>>(value);
      }
    }

    [Column("Classes")]
    public string SpellsSerialized
    {
      get
      {
        return JsonConvert.SerializeObject(Classes);
      }
      set
      {
        Classes = string.IsNullOrEmpty(value) ? new List<Class>() : JsonConvert.DeserializeObject<List<Class>>(value);
      }
    }
  }
}