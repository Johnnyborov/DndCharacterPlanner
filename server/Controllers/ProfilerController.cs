using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using server.Models;

namespace server.Controllers
{
  [Route("api/[controller]/[action]")]
  [ApiController]
  public class ProfilerController : ControllerBase
  {
    ProfilesContext db;

    public ProfilerController(ProfilesContext context)
    {
      db = context;
    }

    [HttpGet]
    public ActionResult<List<Spell>> List()
    {
      var list = new List<Spell>();
      list.Add(new Spell{ id = 1001, name="spell1" });
      list.Add(new Spell{ id = 1002, name="spell2" });
      list.Add(new Spell{ id = 1003, name="spell3" });
      list.Add(new Spell{ id = 1004, name="spell4" });
      list.Add(new Spell{ id = 1005, name="spell5" });
      list.Add(new Spell{ id = 1006, name="spell6" });

      Response.ContentType = "application/json";
      return list;
    }

    [HttpGet]
    public ActionResult<List<CharacterNet>> GetCharacters()
    {
      Response.ContentType = "application/json";
      return db.Characters.ToList().Select(c => new CharacterNet(c)).ToList();
    }

    [HttpGet]
    public ActionResult<CharacterNet> GetCharacter(Guid guid)
    {     
      Response.ContentType = "application/json";

      var c = db.Characters.Find(guid);
      if (c == null) return NotFound("Character with this guid doesn't exits!");

      return new CharacterNet(c);
    }

    [HttpPost]
    public ActionResult<Guid> SaveCharacter(Character character)
    {
      db.Characters.Add(character);
      db.SaveChanges();

      Response.ContentType = "application/json";
      return character.Guid;
    }
  }
}