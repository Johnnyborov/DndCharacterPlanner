using AngleSharp.Dom.Html;
using AngleSharp.Parser.Html;
using System;
using System.IO;
using System.Linq;
using System.Collections.Generic;
using System.Net.Http;
using WebScraper.Models;

namespace WebScraper.Parsers
{
  static partial class Parser
  {
    private static class WikidotMainPageParser
    {
      private enum Type : byte
      {
        Race,
        Background,
        Class,
        Subclass,
        Feat
      }


      public static List<Class> ScrapeAll(Mode mode)
      {
        string mainPageHtml = GetMainPageHtml(mode);
        
        if (mode == Mode.Download)
        {
          Directory.CreateDirectory(Config.DownloadedPagesDir + "/race_pages");
          Directory.CreateDirectory(Config.DownloadedPagesDir + "/background_pages");
          Directory.CreateDirectory(Config.DownloadedPagesDir + "/class_pages");
          Directory.CreateDirectory(Config.DownloadedPagesDir + "/subclass_pages");
          //Directory.CreateDirectory(Config.DownloadedPagesDir + "/feat_pages");
          File.WriteAllText(Config.DownloadedPagesDir + "/MainPage.html.txt", mainPageHtml);
        }


        var parser = new HtmlParser();
        var document = parser.Parse(mainPageHtml);


        DoRaces(document, mode);

        DoBackgrounds(document, mode);

        var classes = DoClassesSubclasses(document, mode);

        //DoFeats(document, mode);

        return classes;
      }


      private static void DoRaces(IHtmlDocument document, Mode mode)
      {
        //List<Class> classes = null;
        if (mode == Mode.ScrapeFiles)
        {
          //classes = new List<Class>();
        }


        int firstClassNum = 1;
        int lastClassNum = 3;
        for (int i = firstClassNum; i <= lastClassNum; ++i)
        {
          var header = document.QuerySelector("#toc" + i);
          string raceType = header.TextContent.Trim();

          header = header.NextElementSibling;
          var anchors = header.QuerySelectorAll("a");

          for (int k = 0; k < anchors.Count(); k++)
          {
            string url = ((IHtmlAnchorElement)anchors[k]).Href;
            var raceFileName = raceType + "__" + anchors[k].TextContent.Trim();

            HandleLink(url, raceFileName, mode, Type.Race);  
          }
        }


        //return classes;
      }

      private static void DoBackgrounds(IHtmlDocument document, Mode mode)
      {
        //List<Class> classes = null;
        if (mode == Mode.ScrapeFiles)
        {
          //classes = new List<Class>();
        }


        var header = document.QuerySelector("#toc" + 4);

        header = header.NextElementSibling;
        var anchors = header.QuerySelectorAll("a");

        for (int k = 0; k < anchors.Count(); k++)
        {
          string url = ((IHtmlAnchorElement)anchors[k]).Href;
          var backgroundFileName = anchors[k].TextContent.Trim();

          HandleLink(url, backgroundFileName, mode, Type.Background);  
        }


        header = header.ParentElement.NextElementSibling.Children[1];
        anchors = header.QuerySelectorAll("a");

        for (int k = 0; k < anchors.Count(); k++)
        {
          string url = ((IHtmlAnchorElement)anchors[k]).Href;
          var backgroundFileName = anchors[k].TextContent.Trim();

          HandleLink(url, backgroundFileName, mode, Type.Background);  
        }


        //return classes;
      }

      private static List<Class> DoClassesSubclasses(IHtmlDocument document, Mode mode)
      {
        List<Class> classes = null;
        if (mode == Mode.ScrapeFiles)
        {
          classes = new List<Class>();
        }


        int firstClassNum = 5;
        int lastClassNum = 18;
        for (int i = firstClassNum; i <= lastClassNum; ++i)
        {
          var header = document.QuerySelector("#toc" + i);
          var anchors = header.QuerySelectorAll("a");

          string url = ((IHtmlAnchorElement)anchors[0]).Href;
          string classFileName = anchors[0].TextContent.Trim();

          Class cls = HandleLink(url, classFileName, mode, Type.Class);

          if (mode == Mode.ScrapeFiles)
          {
            classes.Add(cls);
            cls.subclasses = new List<Subclass>();
          }

          if (i == 14) continue; // no subclasses for Rune Scribe (UA)
          header = header.NextElementSibling.NextElementSibling;
          anchors = header.QuerySelectorAll("a");

          for (int k = 0; k < anchors.Count(); k++)
          {
            url = ((IHtmlAnchorElement)anchors[k]).Href;
            string subclassName = anchors[k].TextContent.Trim();
            var subclassFileName = classFileName + "__" + subclassName;

            var Subclass = HandleLink(url, subclassFileName, mode, Type.Subclass);
            Subclass.name = subclassName;
            cls.subclasses.Add(Subclass);
          }

          if (mode == Mode.ScrapeFiles)
          {
            cls.FillSubclassAbilitiesLevels();
          }
        }


        return classes;
      }

      private static void DoFeats(IHtmlDocument document, Mode mode)
      {
        //List<Class> classes = null;
        if (mode == Mode.ScrapeFiles)
        {
          //classes = new List<Class>();
        }


        var header = document.QuerySelector("#toc" + 20);
        string featsType = header.TextContent.Trim();

        header = header.NextElementSibling;
        var anchors = header.QuerySelectorAll("a");

        for (int k = 0; k < anchors.Count(); k++)
        {
          string url = ((IHtmlAnchorElement)anchors[k]).Href;
          var backgroundFileName = featsType + "__" + anchors[k].TextContent.Trim();

          HandleLink(url, backgroundFileName, mode, Type.Feat);  
        }


        header = header.ParentElement.NextElementSibling.Children[1];
        anchors = header.QuerySelectorAll("a");

        for (int k = 0; k < anchors.Count(); k++)
        {
          string url = ((IHtmlAnchorElement)anchors[k]).Href;
          var backgroundFileName = featsType + "__" + anchors[k].TextContent.Trim();

          HandleLink(url, backgroundFileName, mode, Type.Feat);  
        }


        header = header.ParentElement.NextElementSibling.Children[1];
        anchors = header.QuerySelectorAll("a");

        for (int k = 0; k < anchors.Count(); k++)
        {
          string url = ((IHtmlAnchorElement)anchors[k]).Href;
          var backgroundFileName = featsType + "__" + anchors[k].TextContent.Trim();

          HandleLink(url, backgroundFileName, mode, Type.Feat);  
        }





        header = document.QuerySelector("#toc" + 21);
        featsType = header.TextContent.Trim();

        header = header.NextElementSibling;
        anchors = header.QuerySelectorAll("a");

        for (int k = 0; k < anchors.Count(); k++)
        {
          string url = ((IHtmlAnchorElement)anchors[k]).Href;
          var backgroundFileName = featsType + "__" + anchors[k].TextContent.Trim();

          HandleLink(url, backgroundFileName, mode, Type.Feat);  
        }


        header = header.ParentElement.NextElementSibling.Children[1];
        anchors = header.QuerySelectorAll("a");

        for (int k = 0; k < anchors.Count(); k++)
        {
          string url = ((IHtmlAnchorElement)anchors[k]).Href;
          var backgroundFileName = featsType + "__" + anchors[k].TextContent.Trim();

          HandleLink(url, backgroundFileName, mode, Type.Feat);  
        }


        //return classes;
      }


      private static dynamic HandleLink(string url, string fileName, Mode mode, Type type)
      {
        string subDirectory;
        switch (type)
        {
          case Type.Race:
            subDirectory = "race_pages";
            break;
          case Type.Background:
            subDirectory = "background_pages";
            break;
          case Type.Class:
            subDirectory = "class_pages";
            break;
          case Type.Subclass:
            subDirectory = "subclass_pages";
            break;
          case Type.Feat:
            subDirectory = "feat_pages";
            break;
          default:
            throw new Exception("Invalid Type");
        }

        if (fileName.Contains('/')) fileName = fileName.Replace("/", "");
        if (fileName.Contains(' ')) fileName = fileName.Replace(" ", "_");

        fileName = Config.DownloadedPagesDir + "/" + subDirectory + "/" + fileName + ".html.txt";


        string html;
        if (mode == Mode.ScrapeFiles)
        {
          html = File.ReadAllText(fileName);
        }
        else
        {
          html = GetHtml(url);
        }


        if (mode == Mode.ScrapeFiles)
        {
          if (!Config.Silent) Console.WriteLine("parsing: " + url);

          switch (type)
          {
            case Type.Race:
              return null;
            case Type.Background:
              return null;
            case Type.Class:
              return ClassPageParser.ParseClassPage(html);
            case Type.Subclass:
              return SubclassPageParser.ParseSubclassPage(html);
            case Type.Feat:
              return null;
            default:
              throw new Exception("Invalid Type");
          }
        }
        else
        {
          if (!Config.Silent) Console.WriteLine("downloading: " + url);
          File.WriteAllText(fileName, html);
        }


        return null;
      }


      private static string GetHtml(string url)
      {
        var httpClient = new HttpClient();
        var request = httpClient.GetAsync(url);
        var response = request.Result.Content.ReadAsStringAsync();


        return response.Result;
      }


      private static string GetMainPageHtml(Mode mode)
      {
        if (mode == Mode.ScrapeFiles)
        {
          return File.ReadAllText(Config.DownloadedPagesDir + "/MainPage.html.txt");
        }
        else
        {
          string mainPageUrl = "http://dnd5e.wikidot.com";
          return GetHtml(mainPageUrl);
        }
      }
    }
  }
}
