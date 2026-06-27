namespace api.Models;

public class EventItem
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public System.DateTime StartDate { get; set; }
    public System.DateTime EndDate { get; set; }
    public bool IsRecurring { get; set; }
    public string WorkspaceId { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
}
