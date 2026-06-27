namespace Shared.Contracts;

public interface INotificationMessage
{
    string Id { get; }
    string UserId { get; }
    string Message { get; }
    System.DateTime CreatedAt { get; }
    bool IsRead { get; }
}
