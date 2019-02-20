using AngleSharp.Dom.Html;
using AngleSharp.Parser.Html;
using System;
using System.IO;
using System.Linq;
using System.Collections.Generic;
using System.Net.Http;
using Newtonsoft.Json;

namespace WebScraper
{
  public class Spell
  {
    public string name { get; set; }

    public List<string> categories { get; set; }

    public string time { get; set; }
    public string range { get; set; }
    public string components { get; set; }
    public string duration { get; set; }

    public string description { get; set; }

    public string save { get; set; }
    public bool ritual { get; set; }
    public bool concentration { get; set; }
  }

  class Program
  {
    private static string webScraperProjectDir;
    private static string downloadedPagesDir;
    private static string serverDataDir;

    static void Main(string[] args)
    {
      if (args.Length < 1) return;
      webScraperProjectDir = Directory.GetParent(AppDomain.CurrentDomain.BaseDirectory).Parent.Parent.Parent.FullName;
      downloadedPagesDir = webScraperProjectDir + "/../webscraper_downloaded_pages";
      serverDataDir = webScraperProjectDir + "/../../server/Data";

      if (args[0] == "--scrape-url")
      {
        Directory.CreateDirectory(downloadedPagesDir);

        List<Spell> spells = ScrapeHtml(false);
        SaveSpells(spells);
      }
      if (args[0] == "--scrape-files")
      {
        List<Spell> spells = ScrapeHtml(true);
        SaveSpells(spells);
      }
      else if (args[0] == "--save-pages")
      {
        SaveAllPages();
      }
      else if (args[0] == "--print")
      {
        PrintSpells();
      }
    }

    private static void SaveAllPages()
    {
      string allSpellsListUrl = "https://dnd5e.fandom.com/wiki/List_of_Spells";
      string allSpellsPageHtml = GetHtml(allSpellsListUrl);
      Directory.CreateDirectory(downloadedPagesDir + "/spell_pages");
      File.WriteAllText(downloadedPagesDir + "/SpellsList.html.txt", allSpellsPageHtml);
 
      var parser = new HtmlParser();
      var document = parser.Parse(allSpellsPageHtml);

      var tableElements = document.QuerySelectorAll("table");
      string baseUrl = "https://dnd5e.fandom.com";


      foreach (var table in tableElements)
      {
        var tbody = table.Children[0];
        var anchors = tbody.QuerySelectorAll("a");
        int anchorIndex = -1;

        foreach (var row in tbody.Children)
        {
          if (anchorIndex == -1) // head of the table
          {
            anchorIndex = 0;
            continue;
          }

          for (int i = 0; i < row.Children.Length; i++)
          {
            var item = row.Children[i];

            switch (i)
            {
              case 0: // link and name
                string url = ((IHtmlAnchorElement)anchors[anchorIndex++]).Href;
                url = System.Text.RegularExpressions.Regex.Replace(url, @"about://", "");
                url = baseUrl + url;

                Console.WriteLine("saving: " + url);
                string html = GetHtml(url);

                string fileName = item.TextContent.Trim();
                if (fileName.Contains('/')) fileName = fileName.Replace("/", "");
                if (fileName.Contains(' ')) fileName = fileName.Replace(" ", "_");

                File.WriteAllText(downloadedPagesDir + "/spell_pages/" + fileName + ".html.txt", html);
                break;           
              default:
                break;
            }
          }
        }
      }
    }

    private static List<Spell> ScrapeHtml(bool fromFiles)
    {
      string allSpellsPageHtml;
      if (fromFiles)
      {
        allSpellsPageHtml = File.ReadAllText(downloadedPagesDir + "/SpellsList.html.txt");
      }
      else
      {
        string allSpellsListUrl = "https://dnd5e.fandom.com/wiki/List_of_Spells";
        allSpellsPageHtml = GetHtml(allSpellsListUrl);
      }

      var parser = new HtmlParser();
      var document = parser.Parse(allSpellsPageHtml);

      var tableElements = document.QuerySelectorAll("table");
      string baseUrl = "https://dnd5e.fandom.com";
      List<Spell> spells = new List<Spell>();

      foreach (var table in tableElements)
      {
        var tbody = table.Children[0];
        var anchors = tbody.QuerySelectorAll("a");
        int anchorIndex = -1;

        foreach (var row in tbody.Children)
        {
          if (anchorIndex == -1) // head of the table
          {
            anchorIndex = 0;
            continue;
          }

          Spell spell = null;
          for (int i = 0; i < row.Children.Length; i++)
          {
            var item = row.Children[i];

            if (row.Children.Length == 5 && i == 4) // no ritual column for cantrips
            {
              spell.ritual = false;
              i = 5;
            }

            switch (i)
            {
              case 0: // link and name
                string url = ((IHtmlAnchorElement)anchors[anchorIndex++]).Href;
                url = System.Text.RegularExpressions.Regex.Replace(url, @"about://", "");
                url = baseUrl + url;

                Console.WriteLine("parsing: " + url);
                string html;
                if (fromFiles)
                {
                  string fileName = item.TextContent.Trim();
                  if (fileName.Contains('/')) fileName = fileName.Replace("/", "");
                  if (fileName.Contains(' ')) fileName = fileName.Replace(" ", "_");

                  html = File.ReadAllText(downloadedPagesDir + "/spell_pages/" + fileName + ".html.txt");
                }
                else
                {
                  html = GetHtml(url);
                }
                spell = ParseHtml(html);
                break;
              case 1: // school
                break;
              case 2: // time
                break;
              case 3: // save
                spell.save = item.TextContent.Trim();
                break;
              case 4: // ritual
                spell.ritual = item.TextContent.Trim() != "";
                break;
              case 5: // concentration
                spell.concentration = item.TextContent.Trim() != "";
                break;
              default:
                break;
            }
          }
          spells.Add(spell);
        }
      }

      return spells;
    }

    private static void SaveSpells(List<Spell> spells)
    {
      using (var fs = File.CreateText(serverDataDir + "/spells.json"))
      {
        var serializer = new JsonSerializer();
        serializer.Serialize(fs, spells);
      }
    }

    private static void PrintSpells()
    {
      using (var fs = File.OpenText(serverDataDir + "/spells.json"))
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

    private static string GetHtml(string url)
    {
      var httpClient = new HttpClient();
      var request = httpClient.GetAsync(url);
      var response = request.Result.Content.ReadAsStringAsync();


      return response.Result;
    }

    private static Spell ParseHtml(string html)
    {
      var parser = new HtmlParser();
      var document = parser.Parse(html);


      AngleSharp.Dom.IElement elem;
      AngleSharp.Dom.IElement currentElem;
      //===================================================
      elem = document.QuerySelector("#PageHeader");
      List<string> categories = new List<string>();

      foreach (var child in elem.Children[0].Children[0].Children[1].Children)
      {
        if (child.TagName == "A")
        {
          categories.Add(child.TextContent.Trim());
        }
        else // DIV
        {
          foreach (var liElem in child.Children[1].Children[0].Children) // child.Children[1].Children[0] = ul
          {
            categories.Add(liElem.TextContent.Trim());
          }
        }
      }

      //----------------------------------------------------


      //===================================================
      elem = document.QuerySelector(".page-header__title");
      currentElem = elem;
      string name = currentElem.TextContent.Trim();


      elem = document.QuerySelector("#mw-content-text");

      string time, range, components, duration, description = "";
      if (elem.Children[0].TagName == "ASIDE")
      {
        currentElem = elem.Children[0].Children[2].Children[1];
        time = currentElem.TextContent.Trim();


        currentElem = elem.Children[0].Children[3].Children[1];
        range = currentElem.TextContent.Trim();


        currentElem = elem.Children[0].Children[4].Children[1];
        components = currentElem.TextContent.Trim();


        currentElem = elem.Children[0].Children[5].Children[1];
        duration = currentElem.TextContent.Trim();


        description = ReadDescription(1, elem, false);
      }
      else if (elem.Children[1].TagName == "BLOCKQUOTE") // idk why n1 child aside is actually n3 and n1 is blockquote
      {
        // e.g. https://dnd5e.fandom.com/wiki/Plane_Shift
        currentElem = elem.Children[3].Children[2].Children[1];
        time = currentElem.TextContent.Trim();


        currentElem = elem.Children[3].Children[3].Children[1];
        range = currentElem.TextContent.Trim();


        currentElem = elem.Children[3].Children[4].Children[1];
        components = currentElem.TextContent.Trim();


        currentElem = elem.Children[3].Children[5].Children[1];
        duration = currentElem.TextContent.Trim();


        description = ReadDescription(4, elem, false);
      }
      else if(elem.Children[0].TagName == "TABLE")
      {
        currentElem = elem.Children[0].Children[1].Children[0].Children[1];
        time = currentElem.TextContent.Trim();


        currentElem = elem.Children[0].Children[1].Children[1].Children[1];
        range = currentElem.TextContent.Trim();


        currentElem = elem.Children[0].Children[1].Children[2].Children[1];
        components = currentElem.TextContent.Trim();


        currentElem = elem.Children[0].Children[1].Children[3].Children[1];
        duration = currentElem.TextContent.Trim();


        description = ReadDescription(1, elem, true);
      }
      else if (elem.Children[1].TagName == "TABLE")
      {
        currentElem = elem.Children[1].Children[0].Children[0].Children[1];
        time = currentElem.TextContent.Trim();


        currentElem = elem.Children[1].Children[0].Children[1].Children[1];
        range = currentElem.TextContent.Trim();


        currentElem = elem.Children[1].Children[0].Children[2].Children[1];
        components = currentElem.TextContent.Trim();


        currentElem = elem.Children[1].Children[0].Children[3].Children[1];
        duration = currentElem.TextContent.Trim();


        description = ReadDescription(2, elem, true);
      }
      else if (elem.Children[0].Children.Length > 4) // it's <p> and time, range, components and duration are children of p0
      {
        // e.g. https://dnd5e.fandom.com/wiki/Mordenkainen%27s_Sword
        // or https://dnd5e.fandom.com/wiki/Power_Word_Heal
        currentElem = elem.Children[0];
        currentElem.Children[0].Remove();

        string text = currentElem.TextContent.Trim();
        string[] attributes = text.Split(':');

        time = attributes[1];
        time = System.Text.RegularExpressions.Regex.Replace(time, @"Range", "");
        time = time.Trim();

        range = attributes[2];
        range = System.Text.RegularExpressions.Regex.Replace(range, @"Components", "");
        range = range.Trim();

        components = attributes[3];
        components = System.Text.RegularExpressions.Regex.Replace(components, @"Duration", "");
        components = components.Trim();

        duration = attributes[4].Trim();


        description = ReadDescription(1, elem, true);
      }
      else // it's <p> and time, range, components and duration are inside p1, p2, p3, p4
      {
        currentElem = elem.Children[1];
        time = currentElem.TextContent;
        time = System.Text.RegularExpressions.Regex.Replace(time, @"Casting time:", "");
        time = time.Trim();


        currentElem = elem.Children[2];
        range = currentElem.TextContent;
        range = System.Text.RegularExpressions.Regex.Replace(range, @"Range:", "");
        range = range.Trim();


        currentElem = elem.Children[3];
        components = currentElem.TextContent;
        components = System.Text.RegularExpressions.Regex.Replace(components, @"Components:", "");
        components = components.Trim();


        currentElem = elem.Children[4];
        duration = currentElem.TextContent;
        duration = System.Text.RegularExpressions.Regex.Replace(duration, @"Duration:", "");
        duration = duration.Trim();


        description = ReadDescription(5, elem, true);
      }


      description = description.Trim();
      description = System.Text.RegularExpressions.Regex.Replace(description, @"\[.\]", ""); // remove [1] e.t.c. references/links
        
      //----------------------------------------------------


      var spell = new Spell { categories = categories, name = name, time = time, range = range, components = components, duration = duration, description = description };

      return spell;
    }

    private static string ReadDescription(int start, AngleSharp.Dom.IElement root, bool isPureDescription)
    {
      string result = "";


      if (root.QuerySelectorAll("#Description").Length == 0) isPureDescription = true; // all ahead is <p>s containing description       
      
      for (int i = start; i < root.Children.Length; i++)
      {
        var currentElem = root.Children[i];


        if (currentElem.TextContent.Trim() == "Description") // skip until after Description header
        {
          isPureDescription = true;
          continue;
        }
        if (currentElem.TextContent.Trim() == "Leveling") // skip Leveling Header
        {
          continue;
        }
        if (currentElem.TextContent.Trim() == "References") // references header ends the description section
        {
          isPureDescription = false;
        }

        
        if (currentElem.ClassName == "references") continue;

        if (isPureDescription)
        {
          if (currentElem.TagName == "TABLE")
          {
            var tbody = currentElem.Children[0];
            result = result + "\n" + ReadTable(tbody);
          }
          else if (currentElem.TagName == "UL" || currentElem.TagName == "OL")
          {
            result = result + "\n" + ReadList(currentElem);
          }
          else if (currentElem.TagName == "P")
          {
            result = result + "\n" + currentElem.TextContent.Trim();
          }
          else
          {
            result = result + "\n" + currentElem.TextContent.Trim();
          }
        }
      }

      return result;
    }

    private static string ReadTable(AngleSharp.Dom.IElement tbody)
    {
      string result = "";

      foreach (var row in tbody.Children)
      {
        foreach (var item in row.Children)
        {
          string text = item.TextContent.Trim();
          if (text == "") text = "X";
          result = result + "\t\t" + text;
        }
        result = result + "\n";
      }

      return result;
    }

    private static string ReadList(AngleSharp.Dom.IElement ul)
    {
      string result = "";

      foreach (var li in ul.Children)
      {
        string text = li.TextContent.Trim();
        result = result + "\n* " + text;
      }

      return result;
    }
  }
}
