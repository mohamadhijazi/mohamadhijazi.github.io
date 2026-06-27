namespace api.Models;

public class RiskItem
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public int Severity { get; set; } = 1;
    public int Probability { get; set; } = 1;
    public string Description { get; set; } = string.Empty;
    public string WorkspaceId { get; set; } = string.Empty;
}
