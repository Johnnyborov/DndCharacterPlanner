using System;
using System.Collections.Generic;
using System.Text;

namespace WebScraper.Models
{
  public class Option
  {
    public string name;
    public string description;
  }

  public class Ability
  {
    public int level;
    public string name;
    public string description;

    public List<Option> options;
  }
}
