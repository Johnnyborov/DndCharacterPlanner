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
    private enum Mode : byte
    {
      Download,
      ScrapeFiles
    }


    // walk through spell lists page and download all pages for the corresponding spells
    public static void DownloadPages()
    {
      //SpellListPageParser.ScrapeAllSpells(Mode.Download);
      //WikidotMainPageParser.ScrapeAll(Mode.Download);


 

      // var httpClient = new HttpClient();
      // var request = httpClient.GetAsync("http://gdnd.wikidot.com/feats");
      // var response = request.Result.Content.ReadAsStringAsync();

      // string html = response.Result;
      // File.WriteAllText(Config.DownloadedPagesDir + "/FeatsPage.html.txt", html);
    }


    // create List<Spell> by walking directly through all pages of spells on the site
    // public static List<Spell> ScrapeUrl()
    // {
    //   return SpellListPageParser.ScrapeAllSpells(Mode.ScrapeUrl);
    // }


    // create List<Spell> by walking through downloaded pages(with Download mode)
    public static Database ScrapeFiles()
    {
      var spellsAndCantrips = SpellListPageParser.ScrapeAllSpells(Mode.ScrapeFiles);
      var classes = WikidotMainPageParser.ScrapeAll(Mode.ScrapeFiles);

      var db = new Database { spellsAndCantrips = spellsAndCantrips, classes = classes };
      db.DoPostParsing();

      return db;
    }
  }
}
