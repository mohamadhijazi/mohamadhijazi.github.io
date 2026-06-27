namespace api.Models;

public class AppNotification
{
    public int Id { get; set; }
    public string Type { get; set; } = "Info"; // Info, Warning, Reminder
    public string Message { get; set; } = string.Empty;
    public string Recipient { get; set; } = string.Empty;
    public string Status { get; set; } = "Unread"; // Unread, Read
    public System.DateTime CreatedAt { get; set; } = System.DateTime.UtcNow;
}
