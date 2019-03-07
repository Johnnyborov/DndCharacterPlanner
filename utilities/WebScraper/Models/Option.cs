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

    public Dictionary<string, int> stats;


    public void FillStats()
    {
      stats = new Dictionary<string, int>();
    }
  }
}
