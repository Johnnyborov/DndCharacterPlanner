using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Models
{
  public class Spell
  {
    public int id { get; set; }
    
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
}