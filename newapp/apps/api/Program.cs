using Microsoft.EntityFrameworkCore;
using api.Data;
using api.Models;

// Get absolute paths correctly
var currentDirectory = Directory.GetCurrentDirectory();
// currentDirectory is /.../newapp/apps/api
var solutionRoot = Path.GetFullPath(Path.Combine(currentDirectory, "..", ".."));
var webRootPath = Path.GetFullPath(Path.Combine(solutionRoot, "apps", "web"));
var modulesPath = Path.GetFullPath(Path.Combine(solutionRoot, "modules"));

Console.WriteLine($"=== Static File Paths ===");
Console.WriteLine($"Solution Root: {solutionRoot}");
Console.WriteLine($"Web Root: {webRootPath}");
Console.WriteLine($"Modules Root: {modulesPath}");

var builder = WebApplication.CreateBuilder(new WebApplicationOptions
{
    WebRootPath = webRootPath
});

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
{
    if (!string.IsNullOrWhiteSpace(connectionString))
    {
        try
        {
            options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
        }
        catch
        {
            options.UseInMemoryDatabase("newapp-dev");
        }
    }
    else
    {
        options.UseInMemoryDatabase("newapp-dev");
    }
});

builder.Services.AddControllers();
builder.Services.AddScoped<api.Services.AuthenticationService>();
builder.Services.AddScoped<api.Services.ICloudStorageService, api.Services.CloudStorageService>();
builder.Services.AddOpenApi();

var app = builder.Build();

// Seed some test data
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
    
    // Seed sample data if empty
    if (!db.Locations.Any())
    {
        db.Locations.Add(new LocationItem
        {
            Name = "Central Park",
            Category = "Nature",
            Latitude = 40.7829,
            Longitude = -73.9654,
            WorkspaceId = "w1"
        });
        db.Locations.Add(new LocationItem
        {
            Name = "Statue of Liberty",
            Category = "Landmark",
            Latitude = 40.6892,
            Longitude = -74.0445,
            WorkspaceId = "w1"
        });
        db.Locations.Add(new LocationItem
        {
            Name = "Times Square",
            Category = "Entertainment",
            Latitude = 40.7580,
            Longitude = -73.9855,
            WorkspaceId = "w1"
        });
    }
    
    if (!db.Events.Any())
    {
        var today = DateTime.Today;
        db.Events.Add(new EventItem
        {
            Title = "Team Meeting",
            Description = "Weekly team sync",
            StartDate = new DateTime(today.Year, today.Month, today.Day, 10, 0, 0),
            EndDate = new DateTime(today.Year, today.Month, today.Day, 11, 0, 0),
            IsRecurring = false,
            WorkspaceId = "w1",
            UserId = "u1"
        });
        db.Events.Add(new EventItem
        {
            Title = "Project Deadline",
            Description = "Final delivery of Q2 project",
            StartDate = new DateTime(today.Year, today.Month, today.Day + 3, 17, 0, 0),
            EndDate = new DateTime(today.Year, today.Month, today.Day + 3, 18, 0, 0),
            IsRecurring = false,
            WorkspaceId = "w1",
            UserId = "u1"
        });
    }
    
    if (!db.FinancialEntries.Any())
    {
        var today = DateTime.Today;
        // Income
        db.FinancialEntries.Add(new FinancialEntry
        {
            Type = "Income",
            Category = "Salary",
            Amount = 3000,
            Date = new DateTime(today.Year, 1, 1),
            WorkspaceId = "w1"
        });
        db.FinancialEntries.Add(new FinancialEntry
        {
            Type = "Income",
            Category = "Freelance",
            Amount = 500,
            Date = new DateTime(today.Year, 2, 15),
            WorkspaceId = "w1"
        });
        // Expenses
        db.FinancialEntries.Add(new FinancialEntry
        {
            Type = "Expense",
            Category = "Rent",
            Amount = 1200,
            Date = new DateTime(today.Year, 1, 5),
            WorkspaceId = "w1"
        });
        db.FinancialEntries.Add(new FinancialEntry
        {
            Type = "Expense",
            Category = "Groceries",
            Amount = 400,
            Date = new DateTime(today.Year, 2, 10),
            WorkspaceId = "w1"
        });
        db.FinancialEntries.Add(new FinancialEntry
        {
            Type = "Expense",
            Category = "Utilities",
            Amount = 150,
            Date = new DateTime(today.Year, 3, 1),
            WorkspaceId = "w1"
        });
    }
    
    await db.SaveChangesAsync();
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseDefaultFiles();
app.UseStaticFiles();
// app.UseStaticFiles(new StaticFileOptions
// {
//   FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(modulesPath),
//   RequestPath = "/modules",
//   ServeUnknownFileTypes = true
// });
app.MapControllers();

Console.WriteLine("=== Server Starting ===");
app.Run();
