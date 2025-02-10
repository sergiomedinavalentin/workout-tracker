<template>
  <v-container>
    <v-card class="pa-5">
      <v-card-title>Perfil del Usuario</v-card-title>

      <v-card-text v-if="authStore?.user">
        <p><strong>Nombre:</strong> {{ authStore.user?.name }} </p>
        <p><strong>Email:</strong> {{ authStore.user?.email }} </p>
        <p><strong>Fecha de Nacimiento:</strong> {{ formatDate(authStore.user?.birthdate) }} </p>
        <p><strong>Edad:</strong> {{ getAge(authStore.user?.birthdate) }} años </p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import moment from 'moment';

// Define that this page requires authentication middleware
definePageMeta({
  middleware: 'auth',
});

// Access the authentication store to get user data
const authStore = useAuthStore();

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

</script>
