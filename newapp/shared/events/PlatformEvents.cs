namespace Shared.Events;

public record WorkspaceChangedEvent(string UserId, string WorkspaceId);
public record UserLoggedInEvent(string UserId);
public record NotificationTriggeredEvent(string UserId, string Message);
