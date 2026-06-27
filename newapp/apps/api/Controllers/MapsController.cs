namespace api.Controllers;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Data;
using api.Models;

[ApiController]
[Route("api/maps")]
public class MapsController : ControllerBase
{
    private readonly AppDbContext _db;

    public MapsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("locations")]
    public async Task<ActionResult<IEnumerable<LocationItem>>> GetLocations([FromQuery] string workspaceId = "w1")
    {
        var locations = await _db.Locations
            .Where(l => l.WorkspaceId == workspaceId)
            .ToListAsync();
        return Ok(locations);
    }

    [HttpPost("locations")]
    public async Task<ActionResult<LocationItem>> CreateLocation([FromBody] LocationItem location)
    {
        _db.Locations.Add(location);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetLocations), new { workspaceId = location.WorkspaceId }, location);
    }

    [HttpPut("locations/{id}")]
    public async Task<IActionResult> UpdateLocation(int id, [FromBody] LocationItem updated)
    {
        if (id != updated.Id) return BadRequest();
        _db.Entry(updated).State = EntityState.Modified;
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
