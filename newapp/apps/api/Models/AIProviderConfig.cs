namespace api.Models;

public class AIProviderConfig
{
    public int Id { get; set; }
    public string ProviderName { get; set; } = string.Empty; // e.g. "OpenAI", "Gemini"
    public string ApiKeyReference { get; set; } = string.Empty; // MVP: plain string; production: vault reference
    public string ModelName { get; set; } = string.Empty; // e.g. "gpt-4o", "gemini-pro"
    public string WorkspaceId { get; set; } = string.Empty;
}
