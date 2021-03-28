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
      class="rounded-t-0 lg:rounded-t-6 shadow-2 shadow dark:shadow-none box-content bg-white dark:bg-cool-gray-900 border-b border-transparent dark:border-cool-gray-800"
      style="height: var(--search-bar-height)"
    >
      <form class="h-full relative">
        <div class="absolute left-0 inset-y-0 pointer-events-none">
          <div class="px-8 pr-4 flex flex-row h-full">
            <div class="flex flex-row items-center">
              <svg
                class="w-6 h-6 text-cool-gray-400 dark:text-cool-gray-600 transition duration-200 ease-out"
                fill="none"
                stroke="currentColor"
                style=""
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
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
          aria-label='Search (Press "/" to Focus)'
          autocapitalize="off"
          autocomplete="off"
          autocorrect="off"
          autofocus=""
          class="block w-full h-full bg-transparent focus:outline-none px-16 text-xl placeholder-cool-gray-400 dark:placeholder-cool-gray-600 text-cool-gray-800 dark:text-cool-gray-200"
          placeholder="Search (Press / to Focus)"
          spellcheck="false"
          style="padding-left: 4.5rem; padding-right: 11.5rem"
          type="text"
          value=""
        />
        <div class="absolute right-0 inset-y-0">
          <div class="px-8 pl-4 flex flex-row h-full">
            <div class="-mr-1"></div>
            <div class="group px-1 flex flex-row items-center">
              <button
                aria-label="Click to Switch to Solid Icons"
                class="focus:outline-none transition duration-200 ease-out p-2 relative text-green-500 bg-purple-500 bg-opacity-12.5 focus:bg-opacity-25 rounded-full"
                style="color: ; background-color: "
              >
                <svg
                  class="w-6 h-6 overflow-visible"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2.94336C14.3567 5.05797 17.4561 6.15127 20.618 5.98336C20.867 6.94736 21 7.95736 21 8.99936C21 14.5914 17.176 19.2894 12 20.6214C6.824 19.2894 3 14.5904 3 8.99936C2.99918 7.98191 3.12754 6.96847 3.382 5.98336C6.5439 6.15127 9.64327 5.05797 12 2.94336Z"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  ></path>
                </svg>
              </button>
            </div>
            <div class="group px-1 flex flex-row items-center">
              <button
                aria-label="Click to Enable Copy as JSX"
                class="focus:outline-none transition duration-200 ease-out p-2 relative text-green-500 bg-purple-500 bg-opacity-12.5 focus:bg-opacity-25 rounded-full"
                style="color: ; background-color: "
              >
                <svg
                  class="w-6 h-6 overflow-visible"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  ></path>
                </svg>
              </button>
            </div>
            <div class="group px-1 flex flex-row items-center">
              <button
                aria-label="Click to Enable Dark Mode"
                class="focus:outline-none transition duration-200 ease-out p-2 relative text-green-500 bg-purple-500 bg-opacity-12.5 focus:bg-opacity-25 rounded-full"
                style="color: ; background-color: "
              >
                <svg
                  class="w-6 h-6 overflow-visible"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  ></path>
                </svg>
              </button>
            </div>
            <div class="-ml-1"></div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style>
html {
  --search-bar-height: 4.5rem;
  --search-bar-negative-margin: 6rem;
}
</style>
