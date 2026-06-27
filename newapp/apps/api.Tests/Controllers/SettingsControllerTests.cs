using api.Controllers;
using api.Data;
using api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace api.Tests.Controllers;

public class SettingsControllerTests
{
    [Fact]
    public async Task GetSettings_IncludesConsentMetadata_WhenSettingsExist()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        await using var db = new AppDbContext(options);
        db.UserSettings.Add(new UserSettings
        {
            UserId = "u1",
            ConsentGranted = true,
            StorageProvider = "google",
            ConsentScope = "drive.file",
            FolderId = "folder-123"
        });
        await db.SaveChangesAsync();

        var controller = new SettingsController(db);

        var result = await controller.GetSettings("u1");

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var payload = okResult.Value!;
        Assert.Equal(true, payload.GetType().GetProperty("consentGranted")?.GetValue(payload));
        Assert.Equal("google", payload.GetType().GetProperty("storageProvider")?.GetValue(payload));
        Assert.Equal("drive.file", payload.GetType().GetProperty("consentScope")?.GetValue(payload));
        Assert.Equal("folder-123", payload.GetType().GetProperty("folderId")?.GetValue(payload));
    }
}
