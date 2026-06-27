namespace api.Controllers;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Data;
using api.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

[ApiController]
[Route("api/risk")]
public class RiskController : ControllerBase
{
    private readonly AppDbContext _db;

    public RiskController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("items")]
    public async Task<ActionResult<IEnumerable<RiskItem>>> GetRiskItems()
    {
        return Ok(await _db.Risks.ToListAsync());
    }

    [HttpPost("items")]
    public async Task<ActionResult<RiskItem>> CreateRiskItem([FromBody] RiskItem newRisk)
    {
        _db.Risks.Add(newRisk);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetRiskItems), new { id = newRisk.Id }, newRisk);
    }

    [HttpGet("scenarios")]
    public IActionResult GetScenarios()
    {
        return Ok(new[]
        {
            new { id = 1, name = "Market Drop", impact = "Cash buffers may be reduced", severity = 4 },
            new { id = 2, name = "Schedule Slip", impact = "Milestones may shift", severity = 3 }
        });
    }

    [HttpPost("scenarios")]
    public IActionResult CreateScenario([FromBody] object scenario)
    {
        return Ok(scenario);
    }
}
