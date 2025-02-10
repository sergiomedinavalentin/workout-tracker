<template>
  <v-row justify="center">
    <v-col cols="12" sm="8" md="4">
      <v-img src="/logo.svg" contain height="100" class="mb-8"></v-img>

      <v-card class="pa-5" elevation="4">

        <v-card-title class="text-center">Login</v-card-title>

        <v-card-text>
          <v-form @submit.prevent="login">
            <v-text-field v-model="email" label="Email" type="email" :rules="[rules.required, rules.email]"
              class="mb-4"></v-text-field>

            <v-text-field v-model="password" label="Password" type="password" :rules="[rules.required]"
              class="mb-4"></v-text-field>

            <v-btn type="submit" color="primary" block :loading="loading" :disabled="!isFormValid" class="mt-8">Login</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastify';
import { useAuthStore } from '@/stores/auth';

// Define that this page uses the "empty" layout (no sidebar or menu)
definePageMeta({
  layout: 'empty',
});

// Reference to the authentication store
const authStore = useAuthStore();

// Reactive variables for login fields
const email = ref('');
const password = ref('');
const loading = ref(false);

// Validation rules for form fields
const rules = {
  required: value => !!value || 'Obligatorio',
  email: value => {
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return pattern.test(value) || 'Email inválido'
  },
};

// Computed property to check if the form is valid
const isFormValid = computed(() => {
  return rules.required(email.value) === true &&
    rules.email(email.value) === true &&
    rules.required(password.value) === true;
});

// Initialize router and notification system
const router = useRouter();
const toast = useToast();

/**
 * Handles the user login process.
 * @returns {Promise<void>} - Initiates the authentication process and redirects the user on success.
 * @throws {Error} - Displays an error notification if the login fails.
 */
const login = async () => {
  loading.value = true; // Activate the loading state

  try {
    // Call the login function from the authentication store
    await authStore.login(email.value, password.value);

    // Redirect the user to the workouts page after successful login
    router.push('/workouts');

  } catch (error) {
    toast.error('Error al iniciar sesión. Inténtalo de nuevo');
  } finally {
    loading.value = false;
  }
};
</script>