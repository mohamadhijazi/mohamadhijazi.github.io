namespace api.Data;

using Microsoft.EntityFrameworkCore;
using Shared.Models;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<UserProfile> UserProfiles => Set<UserProfile>();
    public DbSet<Workspace> Workspaces => Set<Workspace>();
    public DbSet<api.Models.EventItem> Events => Set<api.Models.EventItem>();
    public DbSet<api.Models.GoalItem> Goals => Set<api.Models.GoalItem>();
    public DbSet<api.Models.FinancialEntry> FinancialEntries => Set<api.Models.FinancialEntry>();
    public DbSet<api.Models.RiskItem> Risks => Set<api.Models.RiskItem>();
    public DbSet<api.Models.KnowledgeItem> KnowledgeItems => Set<api.Models.KnowledgeItem>();
    public DbSet<api.Models.WorkspaceMember> WorkspaceMembers => Set<api.Models.WorkspaceMember>();
    public DbSet<api.Models.AIProviderConfig> AIProviders => Set<api.Models.AIProviderConfig>();
    public DbSet<api.Models.DataSource> DataSources => Set<api.Models.DataSource>();
    public DbSet<api.Models.AppNotification> Notifications => Set<api.Models.AppNotification>();
    public DbSet<api.Models.LocationItem> Locations => Set<api.Models.LocationItem>();
    public DbSet<api.Models.UserSettings> UserSettings => Set<api.Models.UserSettings>();
    public DbSet<api.Models.IntegrationConfig> IntegrationConfigs => Set<api.Models.IntegrationConfig>();
}
