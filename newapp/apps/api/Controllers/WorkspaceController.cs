namespace api.Controllers;

using Microsoft.AspNetCore.Mvc;
using Shared.Models;
using System.Collections.Generic;

[ApiController]
[Route("api/workspaces")]
public class WorkspaceController : ControllerBase
{
    [HttpGet]
    public ActionResult<IEnumerable<Workspace>> GetWorkspaces()
    {
        var workspaces = new List<Workspace>
        {
            new Workspace { Id = "w1", Name = "Personal", OwnerId = "u1" },
            new Workspace { Id = "w2", Name = "Family", OwnerId = "u1" }
        };
        return Ok(workspaces);
    }

    [HttpPost]
    public ActionResult<Workspace> CreateWorkspace([FromBody] Workspace newWorkspace)
    {
        newWorkspace.Id = System.Guid.NewGuid().ToString();
        return CreatedAtAction(nameof(GetWorkspaces), new { id = newWorkspace.Id }, newWorkspace);
    }

    [HttpGet("plugins")]
    public ActionResult<IEnumerable<object>> GetPlugins()
    {
        return Ok(new[]
        {
            new { id = "calendar", name = "Calendar", enabled = true },
            new { id = "planning", name = "Planning", enabled = true },
            new { id = "finance", name = "Finance", enabled = true },
            new { id = "risk", name = "Risk", enabled = true },
            new { id = "knowledge", name = "Knowledge", enabled = true },
            new { id = "collaboration", name = "Collaboration", enabled = true },
            new { id = "ai", name = "AI Playground", enabled = true },
            new { id = "settings", name = "Settings", enabled = true }
        });
    }
}
