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
    List<Spell> spellList;

    public ProfilerController(ProfilesContext context)
    {
      db = context;

      spellList = new List<Spell>();
      spellList.Add(new Spell{ id = 1001, name="spell1" });
      spellList.Add(new Spell{ id = 1002, name="spell2" });
      spellList.Add(new Spell{ id = 1003, name="spell3" });
      spellList.Add(new Spell{ id = 1004, name="spell4" });
      spellList.Add(new Spell{ id = 1005, name="spell5" });
      spellList.Add(new Spell{ id = 1006, name="spell6" });
    }

    [HttpGet]
    public ActionResult<List<Spell>> SpellList()
    {
      Response.ContentType = "application/json";
      return spellList;
    }

    [HttpGet]
    public ActionResult<List<Character>> GetCharacters()
    {
      Response.ContentType = "application/json";
      return db.Characters.ToList().Select(c => (Character)c).ToList();
    }

    [HttpGet]
    public ActionResult<Character> GetCharacter(Guid guid)
    {     
      Response.ContentType = "application/json";

      var character = db.Characters.Find(guid);
      if (character == null) return NotFound("Character with this guid doesn't exits!");

      return character;
    }

    [HttpPost]
    public ActionResult<Guid> SaveCharacter(CharacterSerialized character)
    {
      db.Characters.Add(character);
      db.SaveChanges();

      Response.ContentType = "application/json";
      return character.Guid;
    }
  }
}