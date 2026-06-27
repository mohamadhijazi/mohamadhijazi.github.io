namespace api.Services;

using System.Text.Json;
using api.Models;
using Microsoft.AspNetCore.Hosting;

public interface ICloudStorageService
{
    Task<T?> LoadModuleDataAsync<T>(string userId, string moduleName, string itemName, UserSettings? settings);
    Task SaveModuleDataAsync<T>(string userId, string moduleName, string itemName, T payload, UserSettings? settings);
    bool IsConfigured(UserSettings? settings);
}

public class CloudStorageService : ICloudStorageService
{
    private readonly IWebHostEnvironment _environment;
    private static readonly JsonSerializerOptions JsonOptions = new() { WriteIndented = true };

    public CloudStorageService(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    public bool IsConfigured(UserSettings? settings)
    {
        return settings?.ConsentGranted == true && !string.IsNullOrWhiteSpace(settings.StorageProvider);
    }

    public async Task<T?> LoadModuleDataAsync<T>(string userId, string moduleName, string itemName, UserSettings? settings)
    {
        if (!IsConfigured(settings))
        {
            return default;
        }

        var filePath = BuildFilePath(userId, moduleName, itemName, settings!);
        if (!File.Exists(filePath))
        {
            return default;
        }

        var json = await File.ReadAllTextAsync(filePath);
        return JsonSerializer.Deserialize<T>(json, JsonOptions);
    }

    public async Task SaveModuleDataAsync<T>(string userId, string moduleName, string itemName, T payload, UserSettings? settings)
    {
        if (!IsConfigured(settings))
        {
            return;
        }

        var filePath = BuildFilePath(userId, moduleName, itemName, settings!);
        var directory = Path.GetDirectoryName(filePath);
        if (!string.IsNullOrWhiteSpace(directory))
        {
            Directory.CreateDirectory(directory);
        }

        var json = JsonSerializer.Serialize(payload, JsonOptions);
        await File.WriteAllTextAsync(filePath, json);
    }

    private string BuildFilePath(string userId, string moduleName, string itemName, UserSettings settings)
    {
        var root = Path.Combine(_environment.ContentRootPath, "App_Data", "cloud-storage", Sanitize(userId), Sanitize(settings.StorageProvider), Sanitize(moduleName));
        return Path.Combine(root, $"{Sanitize(itemName)}.json");
    }

    private static string Sanitize(string value)
    {
        return string.Join("-", value.Split(Path.GetInvalidFileNameChars(), StringSplitOptions.RemoveEmptyEntries));
    }
}
