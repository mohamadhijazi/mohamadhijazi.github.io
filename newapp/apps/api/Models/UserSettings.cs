namespace api.Models;

public class UserSettings
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string Theme { get; set; } = "light"; // light, dark
    public string Language { get; set; } = "en";
    public string NotificationMode { get; set; } = "all"; // all, reminders, none
    public bool ConsentGranted { get; set; }
    public string StorageProvider { get; set; } = "none"; // google, microsoft, none
    public string ConsentScope { get; set; } = "files.readwrite";
    public string FolderId { get; set; } = string.Empty;
}

public class IntegrationConfig
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string ProviderName { get; set; } = string.Empty; // Google, Microsoft
    public bool IsConnected { get; set; } = false;
    public string TokenReference { get; set; } = string.Empty;
    public string Scope { get; set; } = string.Empty;
}
