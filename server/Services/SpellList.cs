using System;
using System.Collections.Generic;
using System.Linq;
using server.Models;

namespace server.Services
{
  public class SpellList
  {
    public SpellList()
    {   
      string appDir = System.IO.Directory.GetParent(AppDomain.CurrentDomain.BaseDirectory).FullName;
      string dataDir;
      if (System.IO.Directory.Exists(appDir + "/Data")) // published
      {
        dataDir = appDir + "/Data";
      }
      else // build
      {
        dataDir = appDir + "/../../../Data";
      }


      using (var file = System.IO.File.OpenText(dataDir + "/spells.json"))
      {
        var serializer = new Newtonsoft.Json.JsonSerializer();

        list = (List<Spell>)serializer.Deserialize(file, typeof(List<Spell>));

        int i = 300;
        foreach (var spell in list)
        {
          spell.id = i++;
          spell.level = GetLevel(spell);
          spell.classes = GetClasses(spell);
        }
      }
    }

    private int GetLevel(Spell spell)
    {
      int level;
      string levelStr = spell.categories.Find(s => s.Contains("Level "));

      if (levelStr != null) {
        string subString = levelStr.Substring(6,1);
        Int32.TryParse(subString, out level);
      }
      else // cantrip
      {
        level = 0;
      }

      return level;
    }

    private List<string> GetClasses(Spell spell)
    {
      List<string> classes = new List<string>();

      List<string> strings = spell.categories.FindAll(s => s.Contains(" Spells"));
      foreach (var str in strings)
      {
        if (str != null) {
          string cls = str.Substring(0, str.Length - 7);
          classes.Add(cls);
        }
      }

      return classes;
    }

    private List<Spell> list;

    public List<Spell> GetCantripsList => (from s in list where s.level == 0 select s).ToList();
    public List<Spell> GetSpellsList => (from s in list where s.level > 0 select s).ToList();
  }
}