import { defineNuxtPlugin } from '#app';
import type { Settings } from 'vue-toastify';

export default defineNuxtPlugin({
  name: 'toast',
  // Allows the plugin to load in parallel with other plugins
  parallel: true,

  setup: nuxt => {
    /**
     * Lazy loads Vue Toastify.
     * - This ensures the plugin is loaded only when needed, reducing the initial bundle size.
     * - The import is asynchronous (`void import(...)`) to prevent blocking execution.
     */
    void import('vue-toastify').then(exports => {
      /**
       * Registers Vue Toastify with the Vue application.
       * - Provides toast notifications throughout the application.
       * - Uses default settings with slight customization.
       */
      nuxt.vueApp.use<Settings>(exports.default, {
        pauseOnHover: true, // Keeps the toast visible while hovered
        position: 'top-right', // Displays notifications in the top-right corner
        theme: 'auto', // Automatically adjusts to light/dark mode
      });
    });
  }
});
