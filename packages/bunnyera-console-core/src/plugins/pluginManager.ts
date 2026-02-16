export interface PluginContext {
  log: (msg: string) => void;
  config: Record<string, unknown>;
}

export interface Plugin {
  id: string;
  name: string;
  version: string;
  init: (ctx: PluginContext) => Promise<void> | void;
  start?: () => Promise<void> | void;
  stop?: () => Promise<void> | void;
}

const plugins: Plugin[] = [];
let initialized = false;

export function registerPlugin(plugin: Plugin) {
  plugins.push(plugin);
}

export async function initPlugins(ctx: PluginContext) {
  if (initialized) return;
  for (const p of plugins) {
    await p.init(ctx);
  }
  initialized = true;
}

export async function startPlugins() {
  for (const p of plugins) {
    if (p.start) await p.start();
  }
}

export async function stopPlugins() {
  for (const p of plugins) {
    if (p.stop) await p.stop();
  }
}

export function listPlugins(): Plugin[] {
  return [...plugins];
}
