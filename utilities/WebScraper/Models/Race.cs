using System;
using System.Collections.Generic;
using Newtonsoft.Json;


namespace WebScraper.Models
{
  public class Race
  {
    public int id;

    public string name;
    public string description;

    public List<Ability> abilities;
    public List<Subrace> subraces;


    public void FillSubracesDescriptions()
    {
      foreach (var sub in subraces)
      {
        string desc = "";
        foreach (var a in sub.abilities)
        {
          desc = desc + a.name + ":" + a.description + "\n";
        }

        sub.description = desc;
      }
    }
  }
}