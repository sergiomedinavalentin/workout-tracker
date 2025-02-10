import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  /**
   * State: Stores authentication-related data.
   * - `token`: Stores the user's authentication token as a cookie.
   * - `user`: Stores the user's information as a cookie.
   * - Both cookies are set with a path `/` for global availability and expire after 1 hour (3600 seconds).
   */
  state: () => ({
    token: useCookie('token', { path: '/', maxAge: 3600 }),
    user: useCookie('user', { path: '/', maxAge: 3600 })
  }),

  actions: {
    /**
     * Handles the user login process.
     * - Sends a login request to the `/auth/login` endpoint.
     * - If successful, stores the authentication token and user data in cookies.
     *
     * @param {string} email - The user's email address.
     * @param {string} password - The user's password.
     * @throws {Error} - Throws an error if the login credentials are incorrect.
     */
    async login(email: string, password: string) {
      try {
        const { $axios } = useNuxtApp() // Access Nuxt's Axios instance

        const { data } = await $axios.post('/auth/login', {
          email,
          password
        });

        this.token = data?.result?.token; // Store the authentication token
        this.user = data?.result?.user; // Store the authenticated user's details
      } catch (err) {
        throw new Error('Invalid credentials'); // Handle login failure
      }
    },

    /**
     * Logs out the user by clearing the authentication token and user data.
     * - This effectively removes the user's session.
     */
    logUserOut() {
      this.token = null; // Remove authentication token
      this.user = null; // Remove user data
    }
  },
});