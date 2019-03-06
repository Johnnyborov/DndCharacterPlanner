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
      int spellIdCounter = 400;
      foreach (var spell in spellsAndCantrips)
      {
        spell.id = spellIdCounter++;
        spell.SetLevel();
        spell.SetClasses();
      }

      cantrips = (from s in spellsAndCantrips where s.level == 0 select s).ToList();
      spells = (from s in spellsAndCantrips where s.level > 0 select s).ToList();


      int classIdCounter = 1500;
      int subclassIdCounter = 1600;
      int abilityIdCounter = 2000;
      int optionIdCounter = 5000;
      foreach (var cls in classes)
      {
        cls.id = classIdCounter++;
        cls.FillSubclassAbilitiesLevels();


        foreach (var a in cls.abilities)
        {
          a.id = abilityIdCounter++;

          a.increases = new List<int>();
          switch (a.name)
          {
            case "Metamagic":
              a.increases.AddRange(new int[] { 0, 0, 10, 17 });
              break;
            case "Fighting Style":
              a.increases.AddRange(new int[] { 0 });
              break;
            case "Eldritch Invocations":
              a.increases.AddRange(new int[] { 0, 0, 5, 7, 9, 12, 15, 18 });
              break;
            default:
              break;
          }

          foreach (var o in a.options)
          {
            o.id = optionIdCounter++;
          }
        }


        foreach (var sub in cls.subclasses)
        {
          sub.id = subclassIdCounter++;

          var subAbility = cls.abilities.Find(a => a.name == cls.subclassAbilityName);
          sub.level = subAbility.level;

          foreach (var a in sub.abilities)
          {
            a.id = abilityIdCounter++;

            a.increases = new List<int>();
            switch (a.name)
            {
              case "Divine Magic":
                a.increases.AddRange(new int[] { 0 });
                break;
              case "Fighting Style":
                a.increases.AddRange(new int[] { 0 });
                break;
              case "Additional Fighting Style":
                a.increases.AddRange(new int[] { 0 });
                break;
              default:
                break;
            }

            foreach (var o in a.options)
            {
              o.id = optionIdCounter++;
            }
          }
        }
      }
    }
  }
}
