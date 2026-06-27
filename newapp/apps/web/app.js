import { pluginRegistry } from './shared/pluginRegistry.js';
import { eventBus } from './shared/eventBus.js';
import { apiClient } from './shared/apiClient.js';
import { CalendarModule } from '../modules/calendar/calendar.js';
import { PlanningModule } from '../modules/planning/planning.js';
import { FinanceModule } from '../modules/finance/finance.js';
import { RiskModule } from '../modules/risk/risk.js';
import { KnowledgeModule } from '../modules/knowledge/knowledge.js';
import { CollaborationModule } from '../modules/collaboration/collaboration.js';
import { AIPlaygroundModule } from '../modules/ai-playground/ai-playground.js';
import { DataETLModule } from '../modules/data-etl/data-etl.js';
import { NotificationsModule } from '../modules/notifications/notifications.js';
import { MapsModule } from '../modules/maps/maps.js';
import { SettingsModule } from '../modules/settings/settings.js';

const { createApp, ref, onMounted } = Vue;

const App = {
  setup() {
    const activeModule = ref('calendar');
    const isDarkMode = ref(false);
    const isAuthenticated = ref(false);
    
    const modules = ref([]);
    
    const workspaces = ref([
      { id: 'w1', name: 'Personal' },
      { id: 'w2', name: 'Family' }
    ]);
    const activeWorkspace = ref('w1');
    
    const user = ref(null);
    
    onMounted(() => {
      console.log('App initialized.');
      
      // Register built-in modules
      pluginRegistry.register({ id: 'calendar', name: 'Calendar', component: CalendarModule });
      pluginRegistry.register({ id: 'planning', name: 'Planning', component: PlanningModule });
      pluginRegistry.register({ id: 'finance', name: 'Finance', component: FinanceModule });
      pluginRegistry.register({ id: 'risk', name: 'Risk', component: RiskModule });
      pluginRegistry.register({ id: 'knowledge', name: 'Knowledge', component: KnowledgeModule });
      pluginRegistry.register({ id: 'collaboration', name: 'Collaboration', component: CollaborationModule });
      pluginRegistry.register({ id: 'ai', name: 'AI Playground', component: AIPlaygroundModule });
      pluginRegistry.register({ id: 'data-etl', name: 'Data ETL', component: DataETLModule });
      pluginRegistry.register({ id: 'notifications', name: 'Notifications', component: NotificationsModule });
      pluginRegistry.register({ id: 'maps', name: 'Maps', component: MapsModule });
      pluginRegistry.register({ id: 'settings', name: 'Settings', component: SettingsModule });
      
      modules.value = pluginRegistry.getPlugins();

      // Check mock token
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('token')) {
        isAuthenticated.value = true;
        window.history.replaceState({}, document.title, "/");
        loadShellData();
        eventBus.publish('UserLoggedIn', user.value);
      } else {
        loadShellData();
      }
    });

    const setModule = (moduleId) => { activeModule.value = moduleId; };
    const toggleTheme = () => { isDarkMode.value = !isDarkMode.value; };
    const mockLogin = () => { window.location.href = '?token=mock_google_token'; };
    const mockLogout = () => { isAuthenticated.value = false; user.value = null; };

    const loadShellData = async () => {
      try {
        const [workspaceData, userData] = await Promise.all([
          apiClient.get('/workspaces'),
          apiClient.get('/users/me')
        ]);
        workspaces.value = workspaceData;
        user.value = userData;
        isAuthenticated.value = true;
        eventBus.publish('UserLoggedIn', userData);
      } catch (error) {
        console.error('Failed to load shell data', error);
      }
    };

    const selectWorkspace = (workspaceId) => {
      activeWorkspace.value = workspaceId;
      eventBus.publish('WorkspaceChanged', workspaceId);
    };

    return {
      activeModule, modules, user, isAuthenticated,
      workspaces, activeWorkspace, isDarkMode,
      setModule, toggleTheme, mockLogin, mockLogout,
      loadShellData, selectWorkspace
    };
  },
  template: `
    <div class="shell-layout" :class="{ 'theme-dark': isDarkMode }">
      <aside class="sidebar">
        <div class="sidebar-header">
          Intelligence OS
        </div>
        <div class="p-4 border-b border-border" v-if="isAuthenticated">
          <select :value="activeWorkspace" @change="selectWorkspace($event.target.value)" class="w-full p-2 border rounded">
            <option v-for="ws in workspaces" :key="ws.id" :value="ws.id">{{ ws.name }} Workspace</option>
          </select>
        </div>
        <nav class="sidebar-nav">
          <div 
            v-for="mod in modules" 
            :key="mod.id" 
            class="nav-item" 
            :class="{ active: activeModule === mod.id }"
            @click="setModule(mod.id)"
          >
            {{ mod.name }}
          </div>
        </nav>
      </aside>
      <main class="main-content">
        <header class="topbar">
          <div class="text-lg">{{ modules.find(m => m.id === activeModule)?.name }}</div>
          <div style="display: flex; gap: 10px; align-items: center;">
            <button @click="toggleTheme" class="btn">Toggle Theme</button>
            <template v-if="isAuthenticated">
              <span>{{ user.name }}</span>
              <button @click="mockLogout" class="btn btn-primary">Sign Out</button>
            </template>
            <template v-else>
              <button @click="mockLogin" class="btn btn-primary">Sign In</button>
            </template>
          </div>
        </header>
        <div class="page-content">
          <component 
            v-if="modules.find(m => m.id === activeModule)?.component" 
            :is="modules.find(m => m.id === activeModule).component"
          ></component>
          <div v-else class="card">
            <h1 class="text-2xl mb-4">{{ modules.find(m => m.id === activeModule)?.name }}</h1>
            <p class="text-muted">This module is currently loading or not yet implemented.</p>
          </div>
        </div>
      </main>
    </div>
  `
};

createApp(App).mount('#plugin-root');
