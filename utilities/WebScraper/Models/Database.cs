using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;


namespace WebScraper.Models
{
  public class Database
  {
    public List<Spell> cantrips;
    public List<Spell> spells;
    public List<Class> classes;


    [JsonIgnore]
    public List<Spell> spellsAndCantrips;


    public void DoPostParsing()
    {
      int i = 300;
      foreach (var spell in spellsAndCantrips)
      {
        spell.id = i++;
        spell.SetLevel();
        spell.SetClasses();
      }

      cantrips = (from s in spellsAndCantrips where s.level == 0 select s).ToList();
      spells = (from s in spellsAndCantrips where s.level > 0 select s).ToList();


      i = 1000;
      foreach (var cls in classes)
      {
        cls.id = i++;
        cls.FillSubclassAbilitiesLevels();
      }
    }
  }
}
