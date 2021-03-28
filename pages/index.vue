<template>
  <div class="container">
    <section class="relative">
      <github-buttons />
      <app-header />
      <div class="absolute inset-x-0 top-full pointer-events-none">
        <svg
          preserveAspectRatio="none"
          fill="currentColor"
          viewBox="0 0 32 1"
          xmlns="http://www.w3.org/2000/svg"
          class="text-theme dark:text-dark-theme"
        >
          <path d="M16 1C4 1 0 0 0 0H32C32 0 28 1 16 1Z"></path>
        </svg>
      </div>
    </section>

    <section>
      <div
        class="px-0 lg:px-6 flex flex-row justify-center items-start"
        style="margin-top: calc(-1 * var(--search-bar-negative-margin))"
      >
        <main class="z-10" style="width: 100%; max-width: 1152px">
          <toolbar />

          <div
            class="shadow-2 shadow lg:shadow-2 bg-white dark:bg-cool-gray-900 overflow-hidden"
            style="
              margin-top: calc(-1 * var(--search-bar-height));
              padding-top: var(--search-bar-height);
              min-height: calc(100vh - 7rem);
            "
          >
            <div id="app-grid">
              <icon />
            </div>
          </div>
        </main>
      </div>
      <div class="hidden lg:block h-24"></div>
    </section>
    <div
      class="px-4 sm:px-6 py-4 fixed left-0 bottom-0 opacity-0 scale-90 z-30 transition duration-300 ease-out transform"
    >
      <div class="rounded-1 shadow-4">
        <div class="rounded-1 shadow-2 px-3 py-2 bg-cool-gray-800">
          <p
            class="font-medium text-cool-gray-100"
            style="font-size: 0.875rem; letter-spacing: 0.0125em"
          >
            <span class="flex flex-row"
              ><span
                class="flex flex-row items-center"
                style="height: 1.3125rem"
              ></span
              ><span style="width: 1ch"></span><span></span
            ></span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppHeader from '../components/AppHeader.vue'
import GithubButtons from '../components/GithubButtons.vue'
import Icon from '../components/Icon.vue'
import Toolbar from '../components/Toolbar.vue'
export default {
  components: { GithubButtons, AppHeader, Toolbar, Icon },
}
</script>

<style>
@media (min-width: 1072px) {
  html {
    background-attachment: fixed, fixed;
    /* https://yoksel.github.io/url-encoder */
    background-image: url("data:image/svg+xml,%3Csvg fill='rgba(16, 185, 129,50)' viewBox='0 0 1 1' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='1' height='1' /%3E%3C/svg%3E"),
      url("data:image/svg+xml,%3Csvg fill='rgba(16, 185, 129,50)' viewBox='0 0 32 1' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M16 1C4 1 0 0 0 0H32C32 0 28 1 16 1Z' /%3E%3C/svg%3E");
    background-repeat: repeat-x, no-repeat;
    background-size: 112px, 100%;
    background-position: 0 0, 0 112px;
  }
}
@media (min-width: 1072px) {
  html.dark {
    background-attachment: fixed, fixed;
    /* https://yoksel.github.io/url-encoder */
    background-image: url("data:image/svg+xml,%3Csvg fill='rgba(16, 185, 129,50)' viewBox='0 0 1 1' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='1' height='1' /%3E%3C/svg%3E"),
      url("data:image/svg+xml,%3Csvg fill='rgba(16, 185, 129,50)' viewBox='0 0 32 1' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M16 1C4 1 0 0 0 0H32C32 0 28 1 16 1Z' /%3E%3C/svg%3E");
    background-repeat: repeat-x, no-repeat;
    background-size: 112px, 100%;
    background-position: 0 0, 0 112px;
  }
}
#app-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(calc(260px - 1px), 1fr));
  gap: 1px;
}

#app-grid > * {
  outline: 1px solid var(--cool-gray-200);
}

.dark #app-grid > * {
  outline: 1px solid var(--cool-gray-800);
}
</style>
