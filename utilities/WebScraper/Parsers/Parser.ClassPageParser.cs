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
    private static class ClassPageParser
    {
      public static Class ParseClassPage(string html)
      {
        var parser = new HtmlParser();
        var document = parser.Parse(html);

        var mainDiv = document.QuerySelector("#page-content");


        string description = mainDiv.Children[0].TextContent.Trim();
        string requirement = mainDiv.Children[1].TextContent.Trim();

        int pos = 2;
        if (mainDiv.Children[2].NodeName == "BR")
          ++pos;
        var classTable = mainDiv.Children[pos].Children[0];

        (string className, List<int> featsIncreases,
          string subclassAbilityName, List<int> subclassAbilityLevels, List<Ability> abilitiesList) = ReadClassTable(classTable);


        FillAbilitiesDescriptions(abilitiesList, mainDiv);


        return new Class { name = className, description = description, requirement = requirement, feats = featsIncreases, abilities = abilitiesList};
      }
    }


    private static (string, List<int>, string, List<int>, List<Ability>) ReadClassTable(AngleSharp.Dom.IElement table)
    {
      string className = table.Children[0].Children[0].TextContent.Trim();



      int featuresColNum = 0;
      foreach (var col in table.Children[1].Children)
      {
        if (col.TextContent.Trim() != "Features")
          ++featuresColNum;
        else
          break;
      }



      var featsIncreases = new List<int>();
      string subclassAbilityName = "";
      var subclassAbilityLevels = new List<int>();
      var abilitiesList = new List<Ability>();
      for (int rowNum = 2; rowNum < table.Children.Length; ++rowNum)
      {
        int level = rowNum - 1;

        string featureNamesString = table.Children[rowNum].Children[featuresColNum].TextContent.Trim();
        string[] featureNames = featureNamesString.Split(',');
        foreach (var initialName in featureNames)
        {
          string[] nameParts = initialName.Split('(');
          string name = nameParts[0].Trim();
          if (name == "Ability Score Improvement")
          {
            featsIncreases.Add(level);
          }
          else if (name.Contains(" feature"))
          {
            subclassAbilityName = name.Replace(" feature", "");
            subclassAbilityLevels.Add(level);
          }
          else if (name != "" && !abilitiesList.Exists(a => a.name == name))
          {
            abilitiesList.Add(new Ability { level = level, name = name });
          }
        }
      }

      return (className, featsIncreases, subclassAbilityName, subclassAbilityLevels, abilitiesList);
    }


    private static void FillAbilitiesDescriptions(List<Ability> abilitiesList, AngleSharp.Dom.IElement mainDiv)
    {
      var abilitiesHeaders = mainDiv.QuerySelectorAll("h3");

      foreach (var header in abilitiesHeaders)
      {
        string abilityName = header.TextContent.Trim();

        var ability = abilitiesList.Find(a => a.name == abilityName);
        if (ability == null) continue;

        string description = "";
        var elem = header.NextElementSibling;
        while (elem != null && elem.NodeName != "H3")
        {
          description = description + elem.TextContent.Trim();

          elem = elem.NextElementSibling;
        }

        ability.description = description;
      }
    }
  }
}