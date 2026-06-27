namespace api.Controllers;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Data;
using api.Models;
using api.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

[ApiController]
[Route("api/calendar")]
public class CalendarController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly ICloudStorageService _cloudStorage;

    public CalendarController(AppDbContext db, ICloudStorageService cloudStorage)
    {
        _db = db;
        _cloudStorage = cloudStorage;
    }

    [HttpGet("events")]
    public async Task<ActionResult<IEnumerable<EventItem>>> GetEvents([FromQuery] string userId = "u1", [FromQuery] string workspaceId = "w1")
    {
        var userSettings = await _db.UserSettings.FirstOrDefaultAsync(s => s.UserId == userId);
        var cloudEvents = await _cloudStorage.LoadModuleDataAsync<List<EventItem>>(userId, "calendar", "events", userSettings);
        if (cloudEvents is not null)
        {
            return Ok(cloudEvents);
        }

        var events = await _db.Events.Where(e => e.WorkspaceId == workspaceId).ToListAsync();
        return Ok(events);
    }

    [HttpPost("events")]
    public async Task<ActionResult<EventItem>> CreateEvent([FromBody] EventItem newEvent)
    {
        _db.Events.Add(newEvent);
        await _db.SaveChangesAsync();

        var userSettings = await _db.UserSettings.FirstOrDefaultAsync(s => s.UserId == newEvent.UserId);
        if (_cloudStorage.IsConfigured(userSettings))
        {
            var currentEvents = await _cloudStorage.LoadModuleDataAsync<List<EventItem>>(newEvent.UserId, "calendar", "events", userSettings) ?? new List<EventItem>();
            currentEvents.Add(newEvent);
            await _cloudStorage.SaveModuleDataAsync(newEvent.UserId, "calendar", "events", currentEvents, userSettings);
        }

        return CreatedAtAction(nameof(GetEvents), new { id = newEvent.Id }, newEvent);
    }

    [HttpPut("events/{id}")]
    public async Task<IActionResult> UpdateEvent(int id, [FromBody] EventItem updatedEvent)
    {
        if (id != updatedEvent.Id) return BadRequest();
        _db.Entry(updatedEvent).State = EntityState.Modified;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("events/{id}")]
    public async Task<IActionResult> DeleteEvent(int id)
    {
        var e = await _db.Events.FindAsync(id);
        if (e == null) return NotFound();
        _db.Events.Remove(e);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("reminders")]
    public async Task<IActionResult> GetReminders()
    {
        var upcoming = await _db.Events
            .OrderBy(e => e.StartDate)
            .Take(5)
            .ToListAsync();

        var reminders = upcoming.Select(e => new
        {
            id = e.Id,
            title = e.Title,
            message = $"Reminder: {e.Title} starts at {e.StartDate:MMM d, yyyy h:mm tt}",
            dueAt = e.StartDate.AddMinutes(-30)
        });

        return Ok(reminders);
    }
}
