namespace api.Controllers;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Data;
using api.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

[ApiController]
[Route("api/workspaces")]
public class CollaborationController : ControllerBase
{
    private readonly AppDbContext _db;

    public CollaborationController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("{workspaceId}/members")]
    public async Task<ActionResult<IEnumerable<WorkspaceMember>>> GetMembers(string workspaceId)
    {
        var members = await _db.WorkspaceMembers
            .Where(m => m.WorkspaceId == workspaceId)
            .ToListAsync();
        return Ok(members);
    }

    [HttpPost("{workspaceId}/invite")]
    public async Task<ActionResult<WorkspaceMember>> InviteMember(string workspaceId, [FromBody] WorkspaceMember member)
    {
        member.WorkspaceId = workspaceId;
        _db.WorkspaceMembers.Add(member);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetMembers), new { workspaceId }, member);
    }

    [HttpPut("{workspaceId}/members/{userId}")]
    public async Task<IActionResult> UpdateMemberRole(string workspaceId, string userId, [FromBody] WorkspaceMember updated)
    {
        var member = await _db.WorkspaceMembers
            .FirstOrDefaultAsync(m => m.WorkspaceId == workspaceId && m.UserId == userId);
        if (member == null) return NotFound();
        member.Role = updated.Role;
        member.PermissionSet = updated.PermissionSet;
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
