using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace server.Controllers
{
  [Route("api/[controller]/[action]")]
  [ApiController]
  public class ProfilerController : ControllerBase
  {
    public struct Spell {
      public string name;
    }

    [HttpGet]
    public ActionResult<List<Spell>> List()
    {
      var list = new List<Spell>();
      list.Add(new Spell{ name="spell1" });
      list.Add(new Spell{ name="spell2" });
      list.Add(new Spell{ name="spell3" });
      list.Add(new Spell{ name="spell4" });

      Response.ContentType = "application/json";
      return list;
    }
  }
}