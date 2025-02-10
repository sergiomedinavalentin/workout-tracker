// Nuxt Configuration File

import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  /**
   * Enables or disables server-side rendering (SSR).
   * - `false` means the application runs fully as a client-side SPA (Single Page Application).
   */
  ssr: false,

  /**
   * Global CSS files to be included in the project.
   * - `vuetify/lib/styles/main.sass`: Vuetify framework styles.
   * - `@mdi/font/css/materialdesignicons.min.css`: Material Design Icons for UI components.
   * - `@/assets/styles/custom.scss`: Custom global styles for the project.
   * - `vue-toastify/index.css`: Styles for toast notifications.
   * - `vue-toastify/themes/light.css`: Theme styles for Vue Toastify.
   */
  css: [
    'vuetify/lib/styles/main.sass',
    '@mdi/font/css/materialdesignicons.min.css',
    '@/assets/styles/custom.scss',
    'vue-toastify/index.css',
    'vue-toastify/themes/light.css'
  ],

  build: {
    /**
     * Specifies packages that should be transpiled during the build process.
     * - Vuetify needs to be transpiled since it is written in TypeScript.
     */
    transpile: ['vuetify'],
  },

  modules: [
    /**
     * Registers the Vuetify plugin with Vite.
     * - Uses the `vite:extendConfig` hook to add Vuetify as a plugin.
     */
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error - Ignore TypeScript error due to plugin modification
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },

    /**
     * Adds Pinia as a state management module.
     * - This allows Vue components to access global state stores.
     */
    '@pinia/nuxt',
  ],

  imports: {
    /**
     * Automatically imports selected functions from Vue Toastify.
     * - Only `useToast` is imported to reduce bundle size.
     * - Other functions (`useVtEvents`, `useVtSettings`) are available but not included by default.
     */
    presets: [
      {
        from: 'vue-toastify',
        imports: [
          'useToast', // Enables toast notifications globally
        ]
      }
    ]
  },

  vite: {
    vue: {
      template: {
         /**
         * Ensures correct handling of asset URLs in Vue templates.
         * - Vuetify requires this for properly resolving assets like images and icons.
         */
        transformAssetUrls,
      },
    },
  },

  runtimeConfig: {
    public: {
      /**
       * Base URL for API requests.
       * - This value is fetched from environment variables (`.env` file).
       * - Allows different API URLs for development and production.
       */
      apiBase: process.env.NUXT_PUBLIC_API_BASE
    }
  },

  compatibilityDate: '2025-02-09',
})