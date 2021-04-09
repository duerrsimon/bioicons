<template>
  <img class="h-20" src="~/assets/logo.svg" />
</template>

<script>
export default {
  props: { darkMode: Boolean },
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
