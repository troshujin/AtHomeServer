<template>
  <h1>You did it!</h1>
  <p>
    Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
    documentation
  </p>
  <button @click="fetch">Click me</button>
</template>

<script lang="ts" setup>
import useWorkouts from '@/composables/gym/useWorkout';

const workoutApi = useWorkouts();
const fetch = async () => {
  const { data, error, loading, execute } = workoutApi.fetchWorkouts;
  await execute();

  console.log(loading.value)
  console.log(data.value)
  console.log(error.value)
}
</script>
