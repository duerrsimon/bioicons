<template>
  <div class="mt-0 lg:-mt-4 pt-0 lg:pt-4 sticky top-0 z-10">
    <div
      class="hidden lg:block -mx-6 absolute inset-x-0 top-0 pointer-events-none"
      style="z-index: -1"
    >
      <div class="h-4 bg-theme dark:bg-dark-theme"></div>
      <div
        class="bg-theme dark:bg-dark-theme"
        style="height: calc(var(--search-bar-height) / 2)"
      ></div>
    </div>
    <div
      class="rounded-t-0 h-32 sm:h-16 lg:rounded-t-6 shadow dark:shadow-none box-content bg-white dark:bg-cool-gray-900 border-b border-transparent dark:border-cool-gray-800"
    >
      <form
        class="h-full relative flex flex-wrap items-center justify-center sm:justify-between"
      >
        <div class="h-16 flex w-5/6 sm:w-2/3 px-12 sm:px-1">
          <div class="w-1/6 sm:flex-1 pointer-events-none">
            <div class="px-2 sm:px-8 sm:pr-4 flex flex-row h-full">
              <div class="flex flex-row items-center">
                <svg
                  class="w-6 h-6 text-cool-gray-400 dark:text-cool-gray-600 transition duration-200 ease-out"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  :class="{ 'text-green-500': fieldFocus }"
                >
                  <path
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
          <input
            id="searchInput"
            ref="searchInput"
            :value="value"
            aria-label='Search (Press "/" to Focus)'
            autocapitalize="off"
            autocomplete="off"
            autocorrect="off"
            autofocus=""
            class="flex-grow block w-full h-full bg-transparent focus:outline-none px-2 sm:pr-16 text-xl placeholder-cool-gray-400 dark:placeholder-cool-gray-600 text-cool-gray-800 dark:text-cool-gray-200"
            placeholder='Search (Press "/" to Focus)'
            spellcheck="false"
            type="text"
            @input="$emit('input', $event.target.value)"
            @focus="fieldFocus = true"
            @blur="fieldFocus = false"
          />
        </div>
        <div class="w-full sm:w-1/3">
          <div
            class="px-8 pl-4 flex flex-row h-full w-full justify-center sm:justify-end"
          >
            <div class="-mr-1"></div>
            <div class="group px-1 flex flex-row items-center">
              <select-categories
                :categories="categories"
                @category="categorySelected"
              />
              <div
                v-if="clipboardAllowed"
                id="clipboard"
                class="cursor-pointer focus:outline-none transition duration-200 ease-out p-2 relative text-green-500 bg-green-500 bg-opacity-12.5 hover:bg-opacity-25 focus:bg-opacity-25 rounded-full"
                :aria-label="ariaClipboardDownload"
                @click="toggleClipboard"
              >
                <svg
                  v-if="clipboard"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  class="w-6 h-6 overflow-visible"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  ></path>
                </svg>

                <svg
                  v-else
                  class="w-6 h-6 overflow-visible"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                  ></path>
                </svg>
                <div
                  id="clipboardMessage"
                  class="pt-2 absolute right-0 top-full hidden"
                >
                  <div class="rounded-1 shadow">
                    <div
                      class="rounded-1 shadow-px-2 dark:shadow-2 px-3 py-2 bg-white dark:bg-cool-gray-800"
                    >
                      <!-- eslint-disable-->
                      <!-- prettier-ignore -->
                      <p class="text-left text-sm whitespace-pre font-medium text-cool-gray-800 dark:text-cool-gray-100" >{{ clipboard ? 'Copy icons to clipboard (Chrome/Edge only)' : 'Download icons as svg on click' }}</p>
                      <!-- eslint-enable-->
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="group px-1 flex flex-row items-center">
              <div
                id="darkMode"
                aria-label="Click to Enable Dark Mode"
                class="cursor-pointer focus:outline-none transition duration-200 ease-out p-2 relative text-green-500 bg-green-500 bg-opacity-12.5 hover:bg-opacity-25 focus:bg-opacity-25 rounded-full"
                style="color: ; background-color: "
                @click="toggleDarkMode"
              >
                <svg
                  v-if="!darkMode"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-6 h-6 overflow-visible"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  ></path>
                </svg>
                <svg
                  v-else
                  class="w-6 h-6 overflow-visible"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  ></path>
                </svg>
                <div
                  id="darkModeMessage"
                  class="pt-2 absolute right-0 top-full hidden"
                >
                  <div class="rounded-1 shadow">
                    <div
                      class="rounded-1 shadow-px-2 dark:shadow-2 px-3 py-2 bg-white dark:bg-cool-gray-800"
                    >
                      <!-- eslint-disable-->
                      <!-- prettier-ignore -->
                      <p class="text-left text-sm whitespace-pre font-medium text-cool-gray-800 dark:text-cool-gray-100"
                      >Switch to {{ darkMode ? 'light mode' : 'dark mode' }}</p>
                      <!-- eslint-enable-->
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="-ml-1"></div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import SelectCategories from '../components/SelectCategories.vue'

export default {
  components: { SelectCategories },
  props: {
    darkMode: { type: Boolean, default: false },
    value: { type: String, default: '' },
    categories: {
      type: Array,
      default() {
        return []
      },
    },
    clipboard: { type: Boolean, default: false },
    clipboardAllowed: { type: Boolean, default: false },
  },
  data() {
    return {
      // search: '',
      fieldFocus: false,
    }
  },
  computed: {
    ariaClipboardDownload() {
      if (this.clipboard) {
        return 'Click to enable copy to clipboard as SVG'
      }
      return 'Click to download as SVG'
    },
    searchFocus() {
      if (this.value.length > 0 || this.fieldFocus) {
        return true
      }
      return false
    },
  },
  methods: {
    toggleClipboard() {
      let dm = 'File download activated'
      if (this.clipboard) {
        dm = 'Copy to clipboard activated (Chrome/Edge only)'
      }
      this.$notify(
        {
          text: dm,
          type: 'generic',
        },
        2000
      )
      this.$emit('toggleClipboard')
    },
    toggleDarkMode() {
      let dm = 'activated'
      if (this.darkMode) {
        dm = 'deactivated'
      }
      this.$notify(
        {
          text: 'Dark mode ' + dm,
          type: 'generic',
        },
        2000
      )
      this.$emit('toggleDark')
    },
    categorySelected(cat) {
      this.$emit('category', cat)
    },
  },
}
</script>

<style>
html {
  --search-bar-height: 4.5rem;
  --search-bar-negative-margin: 6rem;
}

#darkMode:hover #darkModeMessage {
  display: block;
}
#clipboard:hover #clipboardMessage {
  display: block;
}
</style>
