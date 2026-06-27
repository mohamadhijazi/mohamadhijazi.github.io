namespace Shared.Contracts;

public interface IPluginManifest
{
    string Id { get; }
    string Name { get; }
    string Description { get; }
    string Version { get; }
    string EntryPointUrl { get; }
}
