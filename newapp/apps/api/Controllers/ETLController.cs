namespace api.Controllers;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Data;
using api.Models;

[ApiController]
[Route("api/etl")]
public class ETLController : ControllerBase
{
    private readonly AppDbContext _db;

    public ETLController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("sources")]
    public async Task<ActionResult<IEnumerable<DataSource>>> GetSources([FromQuery] string workspaceId = "w1")
    {
        var sources = await _db.DataSources
            .Where(s => s.WorkspaceId == workspaceId)
            .ToListAsync();
        return Ok(sources);
    }

    [HttpPost("sources")]
    public async Task<ActionResult<DataSource>> CreateSource([FromBody] DataSource source)
    {
        _db.DataSources.Add(source);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetSources), new { workspaceId = source.WorkspaceId }, source);
    }

    [HttpPost("import")]
    public IActionResult Import([FromBody] object payload)
    {
        return Ok(new { status = "queued", message = "Import job queued", payload });
    }

    [HttpPost("transform")]
    public IActionResult Transform([FromBody] object payload)
    {
        return Ok(new { status = "ready", message = "Transformation prepared", payload });
    }
}
