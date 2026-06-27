import { apiClient } from '../../apps/web/shared/apiClient.js';

export const AIPlaygroundModule = {
  template: `
    <div class="ai-module">
      <div class="ai-layout">

        <!-- Left Panel: Provider Config -->
        <div class="ai-sidebar">
          <h3 class="panel-title">AI Providers</h3>
          
          <div class="provider-list mb-4">
            <div 
              v-for="p in providers" 
              :key="p.id" 
              class="provider-card"
              :class="{ active: selectedProviderId === p.id }"
              @click="selectedProviderId = p.id"
            >
              <div class="flex items-center gap-2">
                <div class="provider-icon">{{ p.providerName[0] }}</div>
                <div>
                  <div class="font-bold text-sm">{{ p.providerName }}</div>
                  <div class="text-xs text-muted">{{ p.modelName }}</div>
                </div>
              </div>
            </div>
            <div v-if="providers.length === 0" class="text-muted text-sm">
              No providers configured yet.
            </div>
          </div>

          <div class="card p-3">
            <h4 class="text-sm font-bold mb-2">Add Provider</h4>
            <input v-model="newProvider.providerName" placeholder="Provider (e.g. OpenAI)" class="input mb-1 w-full text-sm" />
            <input v-model="newProvider.modelName" placeholder="Model (e.g. gpt-4o)" class="input mb-1 w-full text-sm" />
            <input v-model="newProvider.apiKeyReference" type="password" placeholder="API Key" class="input mb-2 w-full text-sm" />
            <button class="btn btn-primary w-full text-sm" @click="addProvider">Add Provider</button>
          </div>
        </div>

        <!-- Right Panel: Chat -->
        <div class="ai-chat">
          <div class="chat-header">
            <span v-if="selectedProvider">
              Chatting with <strong>{{ selectedProvider.providerName }}</strong> ({{ selectedProvider.modelName }})
            </span>
            <span v-else class="text-muted">Select a provider to begin chatting</span>
          </div>

          <div class="chat-messages" ref="chatContainer">
            <div v-if="messages.length === 0" class="empty-chat">
              <div class="empty-icon">✨</div>
              <p>Start a conversation with your AI assistant</p>
            </div>
            <div v-for="(msg, i) in messages" :key="i" class="message-row" :class="msg.role">
              <div class="message-bubble">
                <div class="message-role">{{ msg.role === 'user' ? 'You' : selectedProvider?.providerName || 'AI' }}</div>
                <div class="message-content">{{ msg.content }}</div>
              </div>
            </div>
            <div v-if="isLoading" class="message-row assistant">
              <div class="message-bubble">
                <div class="typing-indicator"><span></span><span></span><span></span></div>
              </div>
            </div>
          </div>

          <div class="chat-input-area">
            <textarea 
              v-model="userInput"
              placeholder="Ask your AI assistant anything..."
              class="chat-input"
              @keydown.enter.exact.prevent="sendMessage"
              rows="2"
            ></textarea>
            <button class="btn btn-primary send-btn" @click="sendMessage" :disabled="!selectedProviderId || !userInput.trim() || isLoading">
              Send
            </button>
          </div>
        </div>

      </div>
    </div>
  `,
  data() {
    return {
      providers: [],
      selectedProviderId: null,
      messages: [],
      userInput: '',
      isLoading: false,
      newProvider: { providerName: '', modelName: '', apiKeyReference: '' }
    };
  },
  computed: {
    selectedProvider() {
      return this.providers.find(p => p.id === this.selectedProviderId) || null;
    }
  },
  mounted() {
    this.loadProviders();
  },
  methods: {
    async loadProviders() {
      try {
        this.providers = await apiClient.get('/ai/providers?workspaceId=w1');
        if (this.providers.length > 0) this.selectedProviderId = this.providers[0].id;
      } catch (err) {
        console.error('Failed to load AI providers', err);
      }
    },
    async addProvider() {
      if (!this.newProvider.providerName || !this.newProvider.modelName) return;
      try {
        const payload = { ...this.newProvider, workspaceId: 'w1' };
        const saved = await apiClient.post('/ai/providers', payload);
        this.providers.push(saved);
        this.selectedProviderId = saved.id;
        this.newProvider = { providerName: '', modelName: '', apiKeyReference: '' };
      } catch (err) {
        console.error('Failed to add AI provider', err);
      }
    },
    async sendMessage() {
      if (!this.selectedProviderId || !this.userInput.trim() || this.isLoading) return;
      const prompt = this.userInput.trim();
      this.messages.push({ role: 'user', content: prompt });
      this.userInput = '';
      this.isLoading = true;
      this.$nextTick(() => this.scrollToBottom());
      try {
        const res = await apiClient.post('/ai/chat', { prompt, providerId: this.selectedProviderId });
        this.messages.push({ role: 'assistant', content: res.content });
      } catch (err) {
        this.messages.push({ role: 'assistant', content: 'Error: could not reach AI provider.' });
      } finally {
        this.isLoading = false;
        this.$nextTick(() => this.scrollToBottom());
      }
    },
    scrollToBottom() {
      const el = this.$refs.chatContainer;
      if (el) el.scrollTop = el.scrollHeight;
    }
  }
};
