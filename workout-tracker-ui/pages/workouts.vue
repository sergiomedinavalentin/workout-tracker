<template>
  <v-container class="h-100">
    <!-- Workout list -->
    <template v-if="!route.query.id">
      <div v-for="(items, date) in workouts" :key="date">
        <v-divider class="mb-3 mt-3"></v-divider>

        <h3 class="mb-2">{{ formatDate(date) }}</h3>

        <v-row dense>
          <v-col v-for="workout in items" :key="workout.id" cols="6" md="3" lg="3">
            <v-card class="pa-3 d-flex align-center" elevation="4">
              <v-avatar class="mr-4" size="40">
                <v-icon size="x-large">{{ getTypeIcon(workout.type) }}</v-icon>
              </v-avatar>

              <div>
                <v-card-title>{{ workout.title }}</v-card-title>

                <v-card-actions>
                  <v-btn color="primary" @click="showWorkout(workout)">Ver Detalles</v-btn>
                </v-card-actions>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </div>

      <v-divider v-if="Object.keys(workouts).length" class="mb-3 mt-3"></v-divider>

      <h2 class="text-center mt-4" v-if="!Object.keys(workouts).length">Aún no has añadido ningún entrenamiento</h2>
    </template>

    <!-- New and detail view -->
    <template v-else-if="route.query.id === 'new' || record.id">
      <v-card class="pa-5">
        <v-card-title>{{ route.query.id === 'new' ? "Nuevo Entrenamiento" : "Detalles del Entrenamiento"}}</v-card-title>

        <v-form @submit.prevent="saveWorkout">
          <v-card-text class="mt-3">
            <v-row>
              <v-col>
                <v-text-field v-model="record.title" label="Título" :rules="[rules.required]"></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-text-field v-model="formattedDate" type="date" label="Fecha" :rules="[rules.required]"></v-text-field>
              </v-col>

              <v-col>
                <v-select v-model="record.type" label="Selecciona el tipo" :items="types" item-title="name"
                  item-value="value" :rules="[rules.required]">
                  <template v-slot:selection="{ item }">
                    <v-icon class="mr-2">{{ item.raw.icon }}</v-icon> {{ item.raw.name }}
                  </template>

                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props">
                      <template v-slot:prepend>
                        <v-icon>{{ item.raw.icon }}</v-icon>
                      </template>
                    </v-list-item>
                  </template>
                </v-select>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions>
            <v-btn type="submit" :loading="loading" :readonly="loading || !isFormValid" color="primary">Guardar</v-btn>

            <v-btn class="ml-3" @click="goBack">Cancelar</v-btn>
          </v-card-actions>
          </v-form>
      </v-card>
    </template>

    <!-- Add button -->
    <v-fab v-if="!route.query.id" color="primary" extended prepend-icon="mdi-plus" text="Añadir" :app="true" @click="showNewWorkout"
      class="fab-button"></v-fab>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastify';
import moment from 'moment';
import 'moment/dist/locale/es';

// Define that this page requires authentication middleware
definePageMeta({
  middleware: 'auth',
});

const route = useRoute();
const router = useRouter();
const toast = useToast();

const workouts = ref({});
const workoutId = ref(route.query.id);
const loading = ref(false);
const record = ref({
  title: '',
  date: '',
  type: '',
});

// Validation rules for form inputs
const rules = {
  required: value => !!value || 'Obligatorio',
};

// Computed property to check form validity
const isFormValid = computed(() => {
  return rules.required(record?.value.title) === true &&
         rules.required(record?.value.date) === true &&
         rules.required(record?.value.type) === true;
});

// Available workout types with icons
const types = ref([
  { name: 'Ciclismo', icon: 'mdi-bike', value: 'bike' },
  { name: 'Running', icon: 'mdi-run', value: 'run' },
  { name: 'Natación', icon: 'mdi-swim', value: 'swim' },
  { name: 'Gym', icon: 'mdi-dumbbell', value: 'gym' },
  { name: 'Yoga', icon: 'mdi-yoga', value: 'yoga' },
  { name: 'Hiking', icon: 'mdi-hiking', value: 'hiking' },
  { name: 'Caminar', icon: 'mdi-walk', value: 'walk' },
]);

// Format the date in YYYY-MM-DD format
const formattedDate = computed({
  get: () => record.value.date ? moment(record.value.date).format('YYYY-MM-DD') : '',
  set: (newValue) => record.value.date = newValue
});

/**
 * Get the icon for a given workout type.
 * @param {string} type - Workout type.
 * @returns {string} - Icon associated with the workout type.
 */
const getTypeIcon = (type) => {
  return types.value.find(t => t.value === type)?.icon;
};

/**
 * Retrieves a specific workout based on the selected ID.
 */
const getRecord = () => {
  for (const date in workouts.value) {
    const workout = workouts.value[date].find(w => w.id === parseInt(workoutId.value));

    if (workout) {
      record.value = workout;
    }
  }
};

/**
 * Navigates to the workout detail view.
 * @param {Object} workout - Selected workout.
 */
const showWorkout = (workout) => {
  if (!workoutId.value) {
    workoutId.value = workout.id;
  }

  getRecord();

  router.push(`/workouts?id=${workoutId.value}`);
};

/**
 * Opens the new workout form.
 */
const showNewWorkout = () => {
  router.push('/workouts?id=new');

  workoutId.value = null;
};

/**
 * Navigates back to the workouts list.
 */
const goBack = async () => {
  router.push('/workouts');

  workoutId.value = null;
  record.value = { title: '', date: '', type: '' };

  await getWorkouts();
};

/**
 * Formats a date to display in a human-readable format.
 * @param {string} date - Date string.
 * @returns {string} - Formatted date.
 */
const formatDate = (date) => {
  return moment(date).format('dddd, D [de] MMMM [de] YYYY');
};

/**
 * Fetches the list of workouts from the API.
 */
const getWorkouts = async () => {
  try {
    const { data } = await useNuxtApp().$axios.get('/workouts');
    workouts.value = data.result;

    if (workoutId.value) {
      getRecord();
    }
  } catch (err) {
    toast.error('Error al obtener los entrenamientos');
  }
};

/**
 * Saves or updates a workout entry.
 * - If `workoutId` is 'new', a new workout is created.
 * - If `workoutId` exists, the workout is updated.
 *
 * @returns {Promise<void>} - Executes the API request to save or update the workout.
 */
const saveWorkout = async () => {
  try {
    loading.value = true;

    if (workoutId.value) {
      if (workoutId.value === 'new') {
        await useNuxtApp().$axios.post('/workouts', record.value);

        toast.success({ body: 'Se ha guardado tu nuevo entrenamiento' });
      } else {
        console.log('record', record.value);
        await useNuxtApp().$axios.put(`/workouts/${workoutId.value}`, record.value);

        toast.success({ body: 'Se ha actualizado correctamente el entrenamiento' });
      }
    }

    record.value = { title: '', date: '', type: '' };

  } catch (err) {
    toast.error('Error al guardar el nuevo entrenamiento');
  } finally {
    loading.value = false;
  }

  goBack();
};

onMounted(getWorkouts);
</script>
