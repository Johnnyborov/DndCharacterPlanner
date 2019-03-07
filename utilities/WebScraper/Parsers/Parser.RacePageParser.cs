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


      private static (string, List<Ability>) GetAbilities(AngleSharp.Dom.IElement mainDiv)
      {
        var header = mainDiv.QuerySelector("#toc0");
        string raceName = header.TextContent.Trim();
        raceName = raceName.Replace(" Features", "");

        List<Ability> abilities = ReadAbilities(header);

        return (raceName, abilities);
      }

      private static List<Ability> ReadAbilities(AngleSharp.Dom.IElement header)
      {
        var abilities = new List<Ability>();


        string description = "";
        var div = header.NextElementSibling;
        foreach (var elem in div.Children)
        {
          if (elem.Children.Length > 0 && elem.TagName == "P")
          {
            string abilityName = elem.Children[0].TextContent.Trim();
            abilityName = abilityName.Replace(".", "");

            elem.Children[0].Remove();
            description = elem.TextContent.Trim();

            var ability = new Ability { name = abilityName, description = description, level = 0 };
            ability.options = new List<Option>();
            abilities.Add(ability);
          }
          else // another p (or maybe table) continuing description
          {
            abilities.Last().description += HelperFunctions.ReadArbitraryElement(elem);
          }
        }

        return abilities;
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


      private static string ReadSubraceDescription(AngleSharp.Dom.IElement header)
      {
        string description = "";
        var div = header.NextElementSibling;
        foreach (var elem in div.Children)
        {
          if (elem.Children.Length > 0 && elem.Children[0].TextContent.Trim() == "Ability Score Increase.")
          {
            break;
          }
          else
          {
            description = description + HelperFunctions.ReadArbitraryElement(elem);
            elem.Remove();
          }
        }

        return description;
      }
    }
  }
}