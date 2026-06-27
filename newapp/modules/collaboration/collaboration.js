import { apiClient } from '../../apps/web/shared/apiClient.js';
import { eventBus } from '../../apps/web/shared/eventBus.js';

export const CollaborationModule = {
  template: `
    <div class="collab-module">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold">Workspace Members</h2>
        <button class="btn btn-primary" @click="showInviteModal = true">Invite Member</button>
      </div>

      <div v-if="loading" class="text-muted">Loading members...</div>

      <div v-else>
        <div class="card p-0 overflow-hidden mb-6">
          <table class="collab-table w-full">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Role</th>
                <th>Permissions</th>
                <th class="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="members.length === 0">
                <td colspan="4" class="text-center text-muted py-8">No members in this workspace yet. Invite someone!</td>
              </tr>
              <tr v-for="m in members" :key="m.id">
                <td>
                  <div class="flex items-center gap-2">
                    <div class="avatar-circle">{{ m.userId.substring(0, 2).toUpperCase() }}</div>
                    <span class="font-medium">{{ m.userId }}</span>
                  </div>
                </td>
                <td>
                  <span class="badge" :class="getRoleBadge(m.role)">{{ m.role }}</span>
                </td>
                <td class="text-muted text-sm">{{ m.permissionSet || 'Default' }}</td>
                <td class="text-center">
                  <select :value="m.role" @change="updateRole(m, $event.target.value)" class="input input-small">
                    <option value="Owner">Owner</option>
                    <option value="Editor">Editor</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Invite Modal -->
      <div v-if="showInviteModal" class="modal-overlay">
        <div class="modal-content card">
          <h3 class="mb-4 text-lg font-bold">Invite Member</h3>
          <input v-model="invite.userId" placeholder="User ID or Email" class="input mb-2 w-full" />
          <select v-model="invite.role" class="input mb-4 w-full">
            <option value="Viewer">Viewer</option>
            <option value="Editor">Editor</option>
            <option value="Owner">Owner</option>
          </select>
          <div class="flex gap-2">
            <button class="btn btn-primary" @click="sendInvite">Send Invite</button>
            <button class="btn" @click="showInviteModal = false">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      members: [],
      loading: true,
      showInviteModal: false,
      activeWorkspaceId: 'w1',
      invite: { userId: '', role: 'Viewer' }
    };
  },
  mounted() {
    this.loadMembers();
    this.sub = eventBus.subscribe('WorkspaceChanged', (wsId) => {
      this.activeWorkspaceId = wsId || 'w1';
      this.loadMembers();
    });
  },
  unmounted() {
    if (this.sub) this.sub();
  },
  methods: {
    getRoleBadge(role) {
      if (role === 'Owner') return 'badge-owner';
      if (role === 'Editor') return 'badge-editor';
      return 'badge-viewer';
    },
    async loadMembers() {
      this.loading = true;
      try {
        this.members = await apiClient.get(`/workspaces/${this.activeWorkspaceId}/members`);
      } catch (err) {
        console.error('Failed to load workspace members', err);
      } finally {
        this.loading = false;
      }
    },
    async sendInvite() {
      try {
        const payload = { userId: this.invite.userId, role: this.invite.role, permissionSet: '' };
        const saved = await apiClient.post(`/workspaces/${this.activeWorkspaceId}/invite`, payload);
        this.members.push(saved);
        this.showInviteModal = false;
        this.invite = { userId: '', role: 'Viewer' };
      } catch (err) {
        console.error('Failed to invite member', err);
      }
    },
    async updateRole(member, newRole) {
      try {
        const updated = { ...member, role: newRole };
        await apiClient.request(`/workspaces/${this.activeWorkspaceId}/members/${member.userId}`, {
          method: 'PUT',
          body: JSON.stringify(updated)
        });
        member.role = newRole;
      } catch (err) {
        console.error('Failed to update member role', err);
      }
    }
  }
};
