import { App } from 'vue';

declare const plugin: {
  version: string;
  install(app: App): void;
};

export default plugin;