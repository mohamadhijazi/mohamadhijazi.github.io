namespace Shared.Contracts;

public interface IIntegrationConfig
{
    string ProviderName { get; }
    bool IsConfigured { get; }
    string? AccessToken { get; }
}
