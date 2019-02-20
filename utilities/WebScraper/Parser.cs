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
    private enum Mode : byte
    {
      Download,
      ScrapeUrl,
      ScrapeFiles
    }


    // walk through spell lists page and download all pages for the corresponding spells
    public static void DownloadPages()
    {
      SpellListPageParser.ScrapeAllSpells(Mode.Download);
    }


    // create List<Spell> by walking directly through all pages of spells on the site
    public static List<Spell> ScrapeUrl()
    {
      return SpellListPageParser.ScrapeAllSpells(Mode.ScrapeUrl);
    }


    // create List<Spell> by walking through downloaded pages(with Download mode)
    public static List<Spell> ScrapeFiles()
    {
      return SpellListPageParser.ScrapeAllSpells(Mode.ScrapeFiles);
    }
  }
}
