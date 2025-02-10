import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles';

export default defineNuxtPlugin((nuxtApp) => {
  /**
   * Creates a Vuetify instance with predefined settings.
   * - Registers all Vuetify components and directives globally.
   * - Sets the default theme to "dark".
   */
  const vuetify = createVuetify({
    components, // Load all Vuetify components
    directives, // Load all Vuetify directives
    theme: {
      defaultTheme: 'dark', // Sets dark mode as the default theme
    },
  });

  /**
   * Registers Vuetify as a plugin in the Nuxt application.
   * - Allows usage of Vuetify components throughout the project.
   */
  nuxtApp.vueApp.use(vuetify);
});
