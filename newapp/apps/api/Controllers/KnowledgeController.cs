namespace api.Controllers;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Data;
using api.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

[ApiController]
[Route("api/knowledge")]
public class KnowledgeController : ControllerBase
{
    private readonly AppDbContext _db;

    public KnowledgeController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("items")]
    public async Task<ActionResult<IEnumerable<KnowledgeItem>>> GetItems()
    {
        return Ok(await _db.KnowledgeItems.ToListAsync());
    }

    [HttpPost("items")]
    public async Task<ActionResult<KnowledgeItem>> CreateItem([FromBody] KnowledgeItem item)
    {
        _db.KnowledgeItems.Add(item);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetItems), new { id = item.Id }, item);
    }

    [HttpPut("items/{id}")]
    public async Task<IActionResult> UpdateItem(int id, [FromBody] KnowledgeItem updatedItem)
    {
        if (id != updatedItem.Id) return BadRequest();
        _db.Entry(updatedItem).State = EntityState.Modified;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("items/{id}")]
    public async Task<IActionResult> DeleteItem(int id)
    {
        var item = await _db.KnowledgeItems.FindAsync(id);
        if (item == null) return NotFound();
        _db.KnowledgeItems.Remove(item);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("biography")]
    public IActionResult GetBiography()
    {
        return Ok(new[]
        {
            new { id = 1, title = "Early Years", summary = "Family values and formative experiences", year = 1998 },
            new { id = 2, title = "Career Transition", summary = "Moved from operations into product leadership", year = 2016 }
        });
    }
}
