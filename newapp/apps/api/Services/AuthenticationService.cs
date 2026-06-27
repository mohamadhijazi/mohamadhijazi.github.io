namespace api.Services;

using Shared.Models;

public class AuthenticationService
{
    public bool ValidateToken(string token)
    {
        return !string.IsNullOrEmpty(token);
    }

    public UserProfile GetUserFromToken(string token)
    {
        return new UserProfile
        {
            Id = "u1",
            Name = "Guest User",
            Email = "guest@example.com"
        };
    }
}
