using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace server.Models
{
  public class Character
  {
    [NotMapped]
    public List<int> Stats { get; set; }

    [NotMapped]
    public List<int> Abilities { get; set; }

    [NotMapped]
    public List<int> Feats { get; set; }

    [NotMapped]
    public List<int> Spells { get; set; }
  }

  public class CharacterSerialized: Character
  {
    [Key]
    public Guid Guid { get; set; } 


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

    [Column("Abilities")]
    public string AbilitiesSerialized
    {
      get
      {
        return JsonConvert.SerializeObject(Abilities);
      }
      set
      {
        Abilities = string.IsNullOrEmpty(value) ? new List<int>() : JsonConvert.DeserializeObject<List<int>>(value);
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

    [Column("Spells")]
    public string SpellsSerialized
    {
      get
      {
        return JsonConvert.SerializeObject(Spells);
      }
      set
      {
        Spells = string.IsNullOrEmpty(value) ? new List<int>() : JsonConvert.DeserializeObject<List<int>>(value);
      }
    }
  }
}