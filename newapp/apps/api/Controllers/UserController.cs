namespace api.Controllers;

using Microsoft.AspNetCore.Mvc;
using Shared.Models;

[ApiController]
[Route("api/users")]
public class UserController : ControllerBase
{
    [HttpGet("me")]
    public ActionResult<UserProfile> GetCurrentUser()
    {
        return Ok(new UserProfile
        {
            Id = "u1",
            Name = "Guest User",
            Email = "guest@example.com"
        });
    }

    [HttpGet("settings")]
    public ActionResult<object> GetUserSettings()
    {
        return Ok(new
        {
            theme = "light",
            notifications = "all",
            language = "en",
            integrations = new[] { "google", "microsoft" }
        });
    }
}
