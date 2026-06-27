namespace api.Models;

public class LocationItem
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public string Category { get; set; } = string.Empty;
    public string WorkspaceId { get; set; } = string.Empty;
}
