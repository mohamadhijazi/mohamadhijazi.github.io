namespace Shared.Contracts;

using Shared.Models;

public interface IUserContext
{
    UserProfile GetCurrentUser();
    bool IsAuthenticated();
}
