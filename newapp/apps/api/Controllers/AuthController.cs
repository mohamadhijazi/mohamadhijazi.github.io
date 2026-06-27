namespace api.Controllers;

using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    [HttpPost("login")]
    public IActionResult Login()
    {
        return Ok(new { message = "Mock login successful" });
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        return Ok(new { message = "Mock logout successful" });
    }

    [HttpGet("google/login")]
    public IActionResult GoogleLogin()
    {
        return Redirect("/api/auth/google/callback");
    }

    [HttpGet("microsoft/login")]
    public IActionResult MicrosoftLogin()
    {
        return Redirect("/api/auth/microsoft/callback");
    }

    [HttpGet("google/callback")]
    public IActionResult GoogleCallback()
    {
        return Redirect("/?token=mock_google_token");
    }

    [HttpGet("microsoft/callback")]
    public IActionResult MicrosoftCallback()
    {
        return Redirect("/?token=mock_microsoft_token");
    }
}
