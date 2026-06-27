namespace api.Models;

public class GoalItem
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = "Planned";
    public System.DateTime StartDate { get; set; }
    public System.DateTime EndDate { get; set; }
    public string WorkspaceId { get; set; } = string.Empty;
}
