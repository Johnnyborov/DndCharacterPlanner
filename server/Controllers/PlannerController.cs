using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using server.Models;
using Microsoft.EntityFrameworkCore;
using server.Services;

namespace server.Controllers
{
  [Route("api/[controller]/[action]")]
  [ApiController]
  public class PlannerController : ControllerBase
  {
    CharactersContext db;
    List<Spell> cantripsList;
    List<Spell> spellList;

    public PlannerController(CharactersContext context, SpellList list)
    {
      db = context;
      
      cantripsList = list.GetCantripsList;
      spellList = list.GetSpellsList;
    }


    [HttpGet]
    public ActionResult<List<Spell>> CantripsList()
    {
      Response.ContentType = "application/json";
      return cantripsList;
    }

    [HttpGet]
    public ActionResult<List<Spell>> SpellsList()
    {
      Response.ContentType = "application/json";
      return spellList;
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