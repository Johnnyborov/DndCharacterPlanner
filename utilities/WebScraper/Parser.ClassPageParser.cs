using AngleSharp.Dom.Html;
using AngleSharp.Parser.Html;
using System;
using System.IO;
using System.Linq;
using System.Collections.Generic;


namespace WebScraper
{
  static partial class Parser
  {
    private static class ClassPageParser
    {
      public static void ParseClassPage(string html)
      {
        var parser = new HtmlParser();
        var document = parser.Parse(html);


        var elem = document.QuerySelector(".page-header__title");         
        
      }
    }
  }
}