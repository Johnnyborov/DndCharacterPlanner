using System;
using System.Collections.Generic;
using System.Text;

namespace WebScraper.Models
{
  public class Option
  {
    public int id;

    public string name;
    public string description;

    public Dictionary<string, int> bonusStats;


    public void FillStats()
    {
      bonusStats = new Dictionary<string, int>();
    }
  }
}
