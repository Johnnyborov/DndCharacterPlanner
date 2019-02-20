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
  public class PlannerController : ControllerBase
  {
    CharactersContext db;
    List<Spell> spellList;

    public PlannerController(CharactersContext context)
    {
      db = context;

      using (var file = System.IO.File.OpenText(@"Data/spells.json")) {
        var serializer = new Newtonsoft.Json.JsonSerializer();

        spellList = (List<Spell>)serializer.Deserialize(file, typeof(List<Spell>));

        int i = 1000;
        foreach (var spell in spellList)
        {
          spell.id = i++;
        }
      }
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