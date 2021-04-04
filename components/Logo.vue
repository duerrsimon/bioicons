<template>
  <img src="~/assets/logo.svg" v-if="!darkMode" />
  <img src="~/assets/logoDark.svg" v-else />
</template>

<script>
export default {
  props: ['darkMode'],
}
</script>

<style>
.NuxtLogo {
  animation: 1s appear;
  margin: auto;
}

@keyframes appear {
  0% {
    opacity: 0;
  }
}
</style>
