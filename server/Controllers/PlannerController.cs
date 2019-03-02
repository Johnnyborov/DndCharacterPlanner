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

      var dbChar = db.Characters.FirstOrDefault(c => c.Id == id);
      if (dbChar == null) return NotFound("Character with this guid doesn't exits!");

      return dbChar.Character;
    }


    [HttpPost]
    public ActionResult<long> SaveCharacter(Character character)
    {
      var dbChar = new CharacterDbRepresentation();
      dbChar.Character = character;
      db.Characters.Add(dbChar);
      db.SaveChanges();

      Response.ContentType = "application/json";
      return dbChar.Id;
    }
  }
}