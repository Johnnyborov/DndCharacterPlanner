using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using server.Models;
using Microsoft.EntityFrameworkCore;

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


      string appDir = System.IO.Directory.GetParent(AppDomain.CurrentDomain.BaseDirectory).FullName;
      string dataDir;
      if (System.IO.Directory.Exists(appDir + "/Data")) // published
      {
        dataDir = appDir + "/Data";
      }
      else // build
      {
        dataDir = appDir + "/../../../Data";
      }


      using (var file = System.IO.File.OpenText(dataDir + "/spells.json"))
      {
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
      return db.Characters.Select(c => new Character(c)).ToList();
    }


    [HttpGet]
    public ActionResult<Character> GetCharacter(long id)
    {     
      Response.ContentType = "application/json";

      var cs = db.Characters.FirstOrDefault(c => c.Id == id);
      if (cs == null) return NotFound("Character with this guid doesn't exits!");

      return new Character(cs);
    }


    [HttpPost]
    public ActionResult<long> SaveCharacter(Character character)
    {
      var cs = new CharacterSerialized(character);
      db.Characters.Add(cs);
      db.SaveChanges();

      Response.ContentType = "application/json";
      return cs.Id;
    }
  }
}