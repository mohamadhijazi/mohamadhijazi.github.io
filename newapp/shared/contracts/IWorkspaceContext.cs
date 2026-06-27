namespace Shared.Contracts;

using Shared.Models;

public interface IWorkspaceContext
{
    Workspace GetCurrentWorkspace();
    bool HasAccessToWorkspace(string workspaceId);
}
