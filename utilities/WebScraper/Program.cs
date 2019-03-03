using AngleSharp.Dom.Html;
using AngleSharp.Parser.Html;
using System;
using System.IO;
using System.Linq;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace WebScraper
{
  class Program
  {
    static void Main(string[] args)
    {
      if (args.Length < 1) return;
      if (args.Length > 1 && args[1] == "--silent") Config.Silent = true;


      string webScraperProjectDir = Directory.GetParent(AppDomain.CurrentDomain.BaseDirectory).Parent.Parent.Parent.FullName;

      Config.DownloadedPagesDir = webScraperProjectDir + "/../webscraper_downloaded_pages";
      Config.ServerDataDir = webScraperProjectDir + "/../../server/Data";




      if (args[0] == "--scrape-url") // fandom site ist kaput
      {
        //List<Spell> spells = Parser.ScrapeUrl();
        //SaveSpells(spells);
      }
      if (args[0] == "--scrape-files")
      {
        List<Spell> spells = Parser.ScrapeFiles();
        SaveSpells(spells);
      }
      else if (args[0] == "--download-pages")
      {
        Parser.DownloadPages();
      }
      else if (args[0] == "--print")
      {
        PrintSpells();
      }
    }


    private static void SaveSpells(List<Spell> spells)
    {
      using (var fs = File.CreateText(Config.ServerDataDir + "/spells.json"))
      {
        var serializer = new JsonSerializer();
        serializer.Serialize(fs, spells);
      }
    }


    private static void PrintSpells()
    {
      using (var fs = File.OpenText(Config.ServerDataDir + "/spells.json"))
      {
        var serializer = new JsonSerializer();
        var spellList = (List<Spell>)serializer.Deserialize(fs, typeof(List<Spell>));


        foreach (var spell in spellList)
        {
          Console.WriteLine("Name: " + spell.name);

          foreach (var category in spell.categories)
          {
            Console.WriteLine("Category: " + category);
          }

          Console.WriteLine("Time: " + spell.time);
          Console.WriteLine("Range: " + spell.range);
          Console.WriteLine("Components: " + spell.components);
          Console.WriteLine("Duration: " + spell.duration);

          Console.WriteLine("Description: " + spell.description);

          Console.WriteLine("Save: " + spell.save);
          Console.WriteLine("Ritual: " + spell.ritual);
          Console.WriteLine("Concentration: " + spell.concentration);

          Console.WriteLine();
        }
      }


      Console.WriteLine("END");
    }
  }
}
