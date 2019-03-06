using AngleSharp.Dom.Html;
using AngleSharp.Parser.Html;
using System;
using System.IO;
using System.Linq;
using System.Collections.Generic;
using WebScraper.Models;


namespace WebScraper.Parsers
{
  static partial class Parser
  {
    private static class RacePageParser
    {
      public static Race ParseRacePage(string html)
      {
        var parser = new HtmlParser();
        var document = parser.Parse(html);

        var mainDiv = document.QuerySelector("#page-content");


        string description = "";
        var elem = mainDiv.Children[0];
        while (elem.NodeName != "DIV")
        {
          description = description + elem.TextContent.Trim();

          elem = elem.NextElementSibling;
        }


        (string name, List<Ability> abilitiesList)  = GetAbilities(mainDiv);

        List<Subrace> subraces = GetSubraces(mainDiv);


        return new Race { name = name, description = description, abilities = abilitiesList, subraces = subraces };
      }


      private static List<Ability> ReadAbilities(AngleSharp.Dom.IElement header)
      {
        var abilities = new List<Ability>();


        string description = "";
        var div = header.NextElementSibling;
        foreach (var p in div.Children)
        {
          if (p.Children.Length > 0)
          {
            string abilityName = p.Children[0].TextContent.Trim();
            abilityName = abilityName.Replace(".", "");

            p.Children[0].Remove();
            description = p.TextContent.Trim();

            var ability = new Ability { name = abilityName, description = description, level = 0 };
            ability.options = new List<Option>();
            abilities.Add(ability);
          }
          else // another p continuing description
          {
            abilities.Last().description += p.TextContent.Trim();
          }
        }

        return abilities;
      }

      
      private static string ReadSubraceDescription(AngleSharp.Dom.IElement header)
      {
        string description = "";
        var div = header.NextElementSibling;
        foreach (var p in div.Children)
        {
          if (p.Children.Length > 0 && p.Children[0].TextContent.Trim() == "Ability Score Increase.")
          {
            break;
          }
          else
          {
            description = description + p.TextContent.Trim();
            p.Remove();
          }
        }

        return description;
      }


      private static (string, List<Ability>) GetAbilities(AngleSharp.Dom.IElement mainDiv)
      {
        var header = mainDiv.QuerySelector("#toc0");
        string raceName = header.TextContent.Trim();
        raceName = raceName.Replace(" Features", "");

        List<Ability> abilities = ReadAbilities(header);

        return (raceName, abilities);
      }

      private static List<Subrace> GetSubraces(AngleSharp.Dom.IElement mainDiv)
      {
        var subraces = new List<Subrace>();

        var headers = mainDiv.QuerySelectorAll("H3");

        foreach (var header in headers)
        {
          string subraceName = header.TextContent.Trim();

          if (subraceName == "Arbandi Elf Clans") break;

          string description = ReadSubraceDescription(header);
          List<Ability> abilities = ReadAbilities(header);

          var subrace = new Subrace { name = subraceName, description = description, abilities = abilities };
          subraces.Add(subrace);
        }

        return subraces;
      }
    }
  }
}