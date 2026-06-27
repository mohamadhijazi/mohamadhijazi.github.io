namespace api.Controllers;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Data;
using api.Models;

[ApiController]
[Route("api/notifications")]
public class NotificationsController : ControllerBase
{
    private readonly AppDbContext _db;

    public NotificationsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AppNotification>>> GetNotifications([FromQuery] string recipient = "u1")
    {
        var items = await _db.Notifications
            .Where(n => n.Recipient == recipient)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync();
        return Ok(items);
    }

    [HttpPost("send")]
    public async Task<ActionResult<AppNotification>> SendNotification([FromBody] AppNotification notification)
    {
        _db.Notifications.Add(notification);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetNotifications), new { recipient = notification.Recipient }, notification);
    }

    [HttpGet("preferences")]
    public IActionResult GetPreferences()
    {
        return Ok(new { mode = "all", email = true, inApp = true });
    }
}
