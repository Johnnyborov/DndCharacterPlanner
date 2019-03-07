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
    private static class SubclassPageParser
    {
      public static Subclass ParseSubclassPage(string html)
      {
        var parser = new HtmlParser();
        var document = parser.Parse(html);

        var mainDiv = document.QuerySelector("#page-content");


        string description = "";
        var elem = mainDiv.Children[0];
        while (elem.NodeName != "DIV")
        {
          description = description + "\n" + elem.TextContent.Trim();

          elem = elem.NextElementSibling;
        }


       var abilitiesList = GetAbilitiesList(mainDiv);


        return new Subclass {description = description, abilities = abilitiesList };
      }


      private static List<Ability> GetAbilitiesList(AngleSharp.Dom.IElement mainDiv)
      {
        var abilitiesList = new List<Ability>();

        var abilitiesHeaders = mainDiv.QuerySelectorAll("h3");

        foreach (var header in abilitiesHeaders)
        {
          string abilityName = header.TextContent.Trim();

          var ability = new Ability { name = abilityName };

          string description = "";
          var elem = header.NextElementSibling;
          while (elem != null && elem.NodeName != "H3")
          {
            description = description + "\n" + HelperFunctions.ReadArbitraryElement(elem);

            elem = elem.NextElementSibling;
          }

          ability.description = description;

          ClassPageParser.FillOptions(ability, header);

          abilitiesList.Add(ability);
        }


        return abilitiesList;
      }
    }
  }
}