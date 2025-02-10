import { useAuthStore } from '@/stores/auth';

export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie('token');
  const authStore = useAuthStore();

  /**
   * Redirects authenticated users away from the login page.
   * If a user has a token and tries to access the login page, they will be redirected to the workouts page.
   */
  if (token.value && to?.name === 'login') {
    return navigateTo('/workouts');
  }

  /**
   * Redirects unauthenticated users to the login page.
   * If the user does not have a valid token and tries to access a protected page, they will be logged out and redirected.
   */
  if (!token.value && to?.name !== 'login') {
    abortNavigation(); // Prevents the current navigation

    authStore.logUserOut(); // Clears the user's session

    return navigateTo('/login'); // Redirects to login page
  }

  let timeout: NodeJS.Timeout; // Variable to store the inactivity timeout reference

  /**
   * Resets the session timeout upon user activity.
   * Clears the existing timeout and sets a new one to log out the user after 60 seconds of inactivity.
   */
  const resetTimer = () => {
    if (timeout) {
      clearTimeout(timeout); // Clears the previous timeout to prevent multiple triggers
    }

    timeout = setTimeout(() => {
      console.log('⏳ Session expired due to inactivity');

      authStore.logUserOut(); // Logs out the user

      navigateTo('/login'); // Redirects to the login page
    }, 60 * 1000); // 60 seconds timeout
  };

  // Remove any existing event listeners to avoid multiple bindings
  document.removeEventListener('mousemove', resetTimer);
  document.removeEventListener('keydown', resetTimer);

  // Attach event listeners to detect user activity
  document.addEventListener('mousemove', resetTimer);
  document.addEventListener('keydown', resetTimer);

  resetTimer(); // Start the initial timeout countdown
});
