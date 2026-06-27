namespace api.Controllers;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Data;
using api.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

[ApiController]
[Route("api/planning")]
public class PlanningController : ControllerBase
{
    private readonly AppDbContext _db;

    public PlanningController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("goals")]
    public async Task<ActionResult<IEnumerable<GoalItem>>> GetGoals()
    {
        return Ok(await _db.Goals.ToListAsync());
    }

    [HttpPost("goals")]
    public async Task<ActionResult<GoalItem>> CreateGoal([FromBody] GoalItem newGoal)
    {
        _db.Goals.Add(newGoal);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetGoals), new { id = newGoal.Id }, newGoal);
    }

    [HttpPut("goals/{id}")]
    public async Task<IActionResult> UpdateGoal(int id, [FromBody] GoalItem updatedGoal)
    {
        if (id != updatedGoal.Id) return BadRequest();
        _db.Entry(updatedGoal).State = EntityState.Modified;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("goals/{id}")]
    public async Task<IActionResult> DeleteGoal(int id)
    {
        var g = await _db.Goals.FindAsync(id);
        if (g == null) return NotFound();
        _db.Goals.Remove(g);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
