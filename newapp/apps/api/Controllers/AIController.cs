namespace api.Controllers;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Data;
using api.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

[ApiController]
[Route("api/ai")]
public class AIController : ControllerBase
{
    private readonly AppDbContext _db;

    public AIController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("providers")]
    public async Task<ActionResult<IEnumerable<AIProviderConfig>>> GetProviders([FromQuery] string workspaceId = "w1")
    {
        var providers = await _db.AIProviders
            .Where(p => p.WorkspaceId == workspaceId)
            .ToListAsync();
        return Ok(providers);
    }

    [HttpPost("providers")]
    public async Task<ActionResult<AIProviderConfig>> CreateProvider([FromBody] AIProviderConfig config)
    {
        _db.AIProviders.Add(config);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetProviders), new { id = config.Id }, config);
    }

    [HttpPost("chat")]
    public IActionResult Chat([FromBody] ChatRequest request)
    {
        // MVP stub — returns a simulated AI response
        var stubResponse = new
        {
            role = "assistant",
            content = $"[Stub] This is a simulated response to: \"{request.Prompt}\". " +
                      $"Provider: {request.ProviderId}. Configure a real API key to enable live AI responses.",
            providerId = request.ProviderId
        };
        return Ok(stubResponse);
    }

    [HttpPost("modules/generate")]
    public IActionResult GenerateModule([FromBody] object request)
    {
        // MVP stub for future module generation
        return Ok(new { status = "stub", message = "Module generation is not yet implemented." });
    }
}

public class ChatRequest
{
    public string Prompt { get; set; } = string.Empty;
    public int ProviderId { get; set; }
}
