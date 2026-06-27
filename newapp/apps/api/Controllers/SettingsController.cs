namespace api.Controllers;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Data;
using api.Models;

[ApiController]
[Route("api/settings")]
public class SettingsController : ControllerBase
{
    private readonly AppDbContext _db;

    public SettingsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<object>> GetSettings([FromQuery] string userId = "u1")
    {
        var settings = await _db.UserSettings
            .Where(s => s.UserId == userId)
            .FirstOrDefaultAsync();

        if (settings == null)
        {
            settings = new UserSettings { UserId = userId };
            _db.UserSettings.Add(settings);
            await _db.SaveChangesAsync();
        }

        return Ok(new
        {
            id = settings.Id,
            userId = settings.UserId,
            theme = settings.Theme,
            language = settings.Language,
            notificationMode = settings.NotificationMode,
            consentGranted = settings.ConsentGranted,
            storageProvider = settings.StorageProvider,
            consentScope = settings.ConsentScope,
            folderId = settings.FolderId
        });
    }

    [HttpPut]
    public async Task<IActionResult> UpdateSettings([FromBody] UserSettings settings)
    {
        var existing = await _db.UserSettings.FirstOrDefaultAsync(s => s.UserId == settings.UserId);
        if (existing == null)
        {
            _db.UserSettings.Add(settings);
        }
        else
        {
            existing.Theme = settings.Theme;
            existing.Language = settings.Language;
            existing.NotificationMode = settings.NotificationMode;
            existing.ConsentGranted = settings.ConsentGranted;
            existing.StorageProvider = settings.StorageProvider;
            existing.ConsentScope = settings.ConsentScope;
            existing.FolderId = settings.FolderId;
        }

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("integrations")]
    public async Task<ActionResult<IEnumerable<IntegrationConfig>>> GetIntegrations([FromQuery] string userId = "u1")
    {
        var integrations = await _db.IntegrationConfigs
            .Where(i => i.UserId == userId)
            .ToListAsync();
        return Ok(integrations);
    }

    [HttpPost("integrations/google/connect")]
    public IActionResult ConnectGoogle()
    {
        return Ok(new { provider = "google", connected = true, scope = "drive.file", consentRequired = true, consentUrl = "/api/settings/integrations/google/consent" });
    }

    [HttpPost("integrations/microsoft/connect")]
    public IActionResult ConnectMicrosoft()
    {
        return Ok(new { provider = "microsoft", connected = true, scope = "Files.ReadWrite", consentRequired = true, consentUrl = "/api/settings/integrations/microsoft/consent" });
    }

    [HttpPost("integrations/google/consent")]
    public IActionResult GoogleConsent([FromBody] object consent)
    {
        return Ok(new { provider = "google", consentGranted = true, consent });
    }

    [HttpPost("integrations/microsoft/consent")]
    public IActionResult MicrosoftConsent([FromBody] object consent)
    {
        return Ok(new { provider = "microsoft", consentGranted = true, consent });
    }
}
