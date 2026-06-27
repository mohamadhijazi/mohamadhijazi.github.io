namespace api.Controllers;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Data;
using api.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

[ApiController]
[Route("api/finance")]
public class FinanceController : ControllerBase
{
    private readonly AppDbContext _db;

    public FinanceController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("entries")]
    public async Task<ActionResult<IEnumerable<FinancialEntry>>> GetEntries()
    {
        return Ok(await _db.FinancialEntries.ToListAsync());
    }

    [HttpPost("entries")]
    public async Task<ActionResult<FinancialEntry>> CreateEntry([FromBody] FinancialEntry entry)
    {
        _db.FinancialEntries.Add(entry);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetEntries), new { id = entry.Id }, entry);
    }

    [HttpGet("obligations")]
    public IActionResult GetObligations()
    {
        return Ok(new[]
        {
            new { id = 1, title = "Rent", amount = 1800m, dueDate = "2026-07-01", category = "Housing" },
            new { id = 2, title = "Insurance", amount = 240m, dueDate = "2026-07-10", category = "Protection" }
        });
    }

    [HttpGet("scenarios")]
    public IActionResult GetScenarios()
    {
        return Ok(new[]
        {
            new { id = 1, name = "Baseline", description = "Maintain current spending pace", confidence = 0.82 },
            new { id = 2, name = "Optimistic", description = "Increase savings by 20%", confidence = 0.64 }
        });
    }
}
