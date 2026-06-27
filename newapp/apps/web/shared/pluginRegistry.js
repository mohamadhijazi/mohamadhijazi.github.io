// pluginRegistry.js
export class PluginRegistry {
  constructor() {
    this.plugins = new Map();
  }

  register(pluginManifest) {
    if (this.plugins.has(pluginManifest.id)) {
      console.warn(`Plugin ${pluginManifest.id} is already registered.`);
      return;
    }
    this.plugins.set(pluginManifest.id, pluginManifest);
    console.log(`Registered plugin: ${pluginManifest.name}`);
  }

  getPlugins() {
    return Array.from(this.plugins.values());
  }

  getPlugin(id) {
    return this.plugins.get(id);
  }
}

export const pluginRegistry = new PluginRegistry();
