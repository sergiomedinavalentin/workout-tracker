<template>
  <v-app>
    <v-navigation-drawer app :width="290">
      <v-list>
        <v-list-item v-if="authStore?.user" :prepend-avatar="getGravatar(authStore.user?.email)" to="/profile" :title="authStore.user?.name" lines="three">
          <template v-slot:subtitle>
            {{ authStore.user?.email }}<br>
            {{ getAge(authStore.user?.birthdate) }} años<br>
            {{ formatDate(authStore.user?.birthdate) }}
          </template>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list>
        <v-list-item to="/workouts" title="Entrenamientos" prepend-icon="mdi-run"></v-list-item>
      </v-list>

      <template v-slot:append>
        <v-divider></v-divider>

        <v-container class="d-flex justify-space-around pa-2">
          <v-btn icon @click="toggleTheme" variant="flat">
            <v-icon>{{ isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
          </v-btn>

          <v-btn icon @click="logout" variant="flat">
            <v-icon>mdi-logout</v-icon>
          </v-btn>
        </v-container>
      </template>
    </v-navigation-drawer>

    <v-main>
      <NuxtPage />
    </v-main>
  </v-app>
</template>

<script setup>
import { useTheme } from 'vuetify';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import moment from 'moment';
import MD5 from 'crypto-js/md5';

const theme = useTheme();
const isDark = computed(() => theme.global.name.value === 'dark');
const router = useRouter();
const authStore = useAuthStore();

/**
 * Toggles between dark mode and light mode.
 */
const toggleTheme = () => {
  theme.global.name.value = isDark.value ? 'light' : 'dark';
};

/**
 * Calculate the user's age based on the birthdate.
 * @param {string} birthdate - User's birthdate in string format.
 * @returns {number | string} - Age in years or '-' if birthdate is not provided.
 */
const getAge = (birthdate) => {
  return birthdate ? moment().diff(moment(birthdate), 'years') : '-';
};

/**
 * Format the birthdate to DD/MM/YYYY format.
 * @param {string} birthdate - User's birthdate in string format.
 * @returns {string} - Formatted birthdate or '-' if not available.
 */
const formatDate = (birthdate) => {
  return birthdate ? moment(birthdate).format('DD/MM/YYYY') : '-';
};

/**
 * Generates a Gravatar URL for the user's avatar.
 * @param {string} email - The user's email address.
 * @returns {string} - A Gravatar URL or a default avatar if the email is not provided.
 */
const getGravatar = (email) => {
  const hash = MD5(email.trim().toLowerCase()).toString();

  return `https://www.gravatar.com/avatar/${hash}?s=200&d=identicon`;
};

/**
 * Logs out the user by clearing the authentication state and redirecting to the login page.
 */
const logout = () => {
  authStore.logUserOut();
  router.push('/login');
};
</script>