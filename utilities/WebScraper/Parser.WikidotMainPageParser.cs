using AngleSharp.Dom.Html;
using AngleSharp.Parser.Html;
using System;
using System.IO;
using System.Linq;
using System.Collections.Generic;
using System.Net.Http;

namespace WebScraper
{
  static partial class Parser
  {
    private static class WikidotMainPageParser
    {
      public static void ScrapeAll(Mode mode)
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



        doRaces(document, mode);

        doBackgrounds(document, mode);

        doClassesSubclasses(document, mode);  

        //doFeats(document, mode);     
      }


      private static void doRaces(IHtmlDocument document, Mode mode)
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

            handleLink(url, raceFileName, mode, "race_pages");  
          }
        }


        //return classes;
      }

      private static void doBackgrounds(IHtmlDocument document, Mode mode)
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

          handleLink(url, backgroundFileName, mode, "background_pages");  
        }


        header = header.ParentElement.NextElementSibling.Children[1];
        anchors = header.QuerySelectorAll("a");

        for (int k = 0; k < anchors.Count(); k++)
        {
          string url = ((IHtmlAnchorElement)anchors[k]).Href;
          var backgroundFileName = anchors[k].TextContent.Trim();

          handleLink(url, backgroundFileName, mode, "background_pages");  
        }


        //return classes;
      }

      private static void doClassesSubclasses(IHtmlDocument document, Mode mode)
      {
        //List<Class> classes = null;
        if (mode == Mode.ScrapeFiles)
        {
          //classes = new List<Class>();
        }


        int firstClassNum = 5;
        int lastClassNum = 18;
        for (int i = firstClassNum; i <= lastClassNum; ++i)
        {
          var header = document.QuerySelector("#toc" + i);
          var anchors = header.QuerySelectorAll("a");

          string url = ((IHtmlAnchorElement)anchors[0]).Href;
          string classFileName = anchors[0].TextContent.Trim();

          handleLink(url, classFileName, mode, "class_pages");

          if (i == 14) continue; // no subclasses for Rune Scribe (UA)
          header = header.NextElementSibling.NextElementSibling;
          anchors = header.QuerySelectorAll("a");

          for (int k = 0; k < anchors.Count(); k++)
          {
            url = ((IHtmlAnchorElement)anchors[k]).Href;
            var subclassFileName = classFileName + "__" + anchors[k].TextContent.Trim();

            handleLink(url, subclassFileName, mode, "subclass_pages");  
          }
        }


        //return classes;
      }

      private static void doFeats(IHtmlDocument document, Mode mode)
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

          handleLink(url, backgroundFileName, mode, "feat_pages");  
        }


        header = header.ParentElement.NextElementSibling.Children[1];
        anchors = header.QuerySelectorAll("a");

        for (int k = 0; k < anchors.Count(); k++)
        {
          string url = ((IHtmlAnchorElement)anchors[k]).Href;
          var backgroundFileName = featsType + "__" + anchors[k].TextContent.Trim();

          handleLink(url, backgroundFileName, mode, "feat_pages");  
        }


        header = header.ParentElement.NextElementSibling.Children[1];
        anchors = header.QuerySelectorAll("a");

        for (int k = 0; k < anchors.Count(); k++)
        {
          string url = ((IHtmlAnchorElement)anchors[k]).Href;
          var backgroundFileName = featsType + "__" + anchors[k].TextContent.Trim();

          handleLink(url, backgroundFileName, mode, "feat_pages");  
        }





        header = document.QuerySelector("#toc" + 21);
        featsType = header.TextContent.Trim();

        header = header.NextElementSibling;
        anchors = header.QuerySelectorAll("a");

        for (int k = 0; k < anchors.Count(); k++)
        {
          string url = ((IHtmlAnchorElement)anchors[k]).Href;
          var backgroundFileName = featsType + "__" + anchors[k].TextContent.Trim();

          handleLink(url, backgroundFileName, mode, "feat_pages");  
        }


        header = header.ParentElement.NextElementSibling.Children[1];
        anchors = header.QuerySelectorAll("a");

        for (int k = 0; k < anchors.Count(); k++)
        {
          string url = ((IHtmlAnchorElement)anchors[k]).Href;
          var backgroundFileName = featsType + "__" + anchors[k].TextContent.Trim();

          handleLink(url, backgroundFileName, mode, "feat_pages");  
        }


        //return classes;
      }


      private static void handleLink(string url, string fileName, Mode mode, string subDirectory)
      {
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
          //if (!Config.Silent) Console.WriteLine("parsing: " + url);
          //class = RacePageParser.ParseRacePage(html);
        }
        else
        {
          if (!Config.Silent) Console.WriteLine("downloading: " + url);
          File.WriteAllText(fileName, html);
        }


        if (mode == Mode.ScrapeFiles)
        {
          //races.Add(race);
        }
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
