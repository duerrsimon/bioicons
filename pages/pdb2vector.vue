<template>
    <div class="mx-auto relative" :class="{ dark: darkMode }">
      <section class="relative">
        <github-buttons />
        <div id="start" class="absolute top-0 right-0"></div>
        <app-header
          :dark-mode="darkMode"
          :display-categories="false"
          :numberoficons="nIcons"
        />
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
        <div class="flex w-full justify-center">
          <h1 class="text-gray-100 font-semibold -mt-16 text-4xl py-4 z-50">
        Vectorize a protein
          </h1>
        </div>
        <div class="px-0 lg:px-6 flex flex-row justify-center items-start">
          <main
            class="z-10 container mx-auto flex flex-wrap md:flex-nowrap space-y-4 md:space-y-0 md:space-x-4"
          >
            <div
              class="shadow lg:shadow-lg bg-white h-full minh-0 dark:bg-cool-gray-900 overflow-hidden rounded-xl p-5 w-full"
            >
              <!-- component -->
              <section class="bg-white dark:bg-gray-900">
                  <div class="lg:flex p-4 space-x-6">
                    <div class="w-full space-y-12">
                    
                        <gradio-app src="https://simonduerr-pdb2vector.hf.space"></gradio-app>
                    
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
        <div class="hidden lg:block h-24"></div>
      </section>
      <div class="container mx-auto mb-4 text-cool-gray-800 text-right">
        <span>Made with Tailwind, Vue.js, Nuxt and Inkscape</span> &middot;
        <a
          href="https://github.com/duerrsimon/bioicons"
          class="text-green-500 hover:underline font-medium"
          rel="noopener noreferrer"
          >Contribute</a
        >
        your own icons by creating a pull request &middot;
        <a
          href="https://simonduerr.eu/impressum"
          class="text-green-500 hover:underline font-medium"
          rel="noopener noreferrer"
          >Imprint</a
        >
      </div>
    </div>
  </template>
  
  <script>
  import AppHeader from "../components/AppHeader.vue";
  import GithubButtons from "../components/GithubButtons.vue";
  // import Loading from '../components/Loading.vue'
  
  export default {
    components: { GithubButtons, AppHeader }, // Loading
    data() {
      return {
        darkMode: false,
        name: "",
        selected: [],
      };
    },
    head() {
      return {
        title: "Bioicons - high quality science illustrations",
        meta: [
          {
            hid: "description",
            name: "description",
            content:
              "Submit new Bioicons under permissive CC0, CC BY or MIT License.",
          },
        ],
      };
    },
    computed: {},
  
    mounted() {},
    methods: {},
  };
  </script>
  
  <style>
  @import url("https://rsms.me/inter/inter.css");
  html {
    font-family: "Inter", sans-serif;
  }
  @supports (font-variation-settings: normal) {
    html {
      font-family: "Inter var", sans-serif;
    }
  }
  @media (min-width: 1072px) {
    html {
      background-attachment: fixed, fixed;
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
    grid-template-columns: repeat(auto-fill, minmax(calc(300px - 1px), 1fr));
    gap: 1px;
  }
  
  #app-grid > * {
    outline: 1px solid #eee;
  }
  
  .dark #app-grid > * {
    outline: 1px solid #2d3748;
  }
  </style>
  