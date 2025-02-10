import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

export default defineNuxtPlugin(() => {
  // Retrieve API base URL from Nuxt runtime configuration
  const apiBase = useRuntimeConfig().public.apiBase as string;

  // Create an Axios instance with the base API URL
  const axiosInstance = axios.create({ baseURL: apiBase });

  /**
   * Request Interceptor:
   * - Attaches the Authorization header with the Bearer token from the authentication store.
   * - Ensures all API requests include the token if the user is authenticated.
   */
  axiosInstance.interceptors.request.use((config) => {
    const authStore = useAuthStore(); // Access authentication store

    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`; // Attach token to request headers
    }

    return config;
  });

  /**
   * Response Interceptor:
   * - Handles unauthorized responses (401).
   * - Logs out the user and redirects to the login page if their session is invalid.
   */
  axiosInstance.interceptors.response.use(
    (response) => response, // Return successful responses
    (error) => {
      if (error.response?.status === 401) {
        const authStore = useAuthStore();

        authStore.logUserOut(); // Clear user session

        navigateTo('/login'); // Redirect to login page
      }

      return Promise.reject(error); // Forward the error for further handling
    }
  );

  /**
   * Provide the Axios instance globally in Nuxt.
   * Allows usage via `useNuxtApp().$axios` throughout the application.
   */
  return {
    provide: {
      axios: axiosInstance
    }
  };
});
