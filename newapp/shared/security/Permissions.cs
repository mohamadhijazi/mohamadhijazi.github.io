namespace Shared.Security;

public static class Permissions
{
    public const string ReadWorkspace = "workspace:read";
    public const string WriteWorkspace = "workspace:write";
    public const string ManageUsers = "users:manage";
}

public enum Role
{
    Owner,
    Admin,
    Member,
    Viewer
}
