using System;
using System.Collections.Generic;

public class Spell
  {
    public string name { get; set; }

    public List<string> categories { get; set; }

    public string time { get; set; }
    public string range { get; set; }
    public string components { get; set; }
    public string duration { get; set; }

    public string description { get; set; }

    public string save { get; set; }
    public bool ritual { get; set; }
    public bool concentration { get; set; }
  }