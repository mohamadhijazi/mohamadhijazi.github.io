namespace api.Models;

public class WorkspaceMember
{
    public int Id { get; set; }
    public string WorkspaceId { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string Role { get; set; } = "Viewer"; // Owner, Editor, Viewer
    public string PermissionSet { get; set; } = string.Empty;
}
