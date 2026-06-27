namespace api.Models;

public class DataSource
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = "REST"; // REST, JSON, Excel
    public string ConnectionConfig { get; set; } = "{}"; // JSON config string
    public string WorkspaceId { get; set; } = string.Empty;
}
