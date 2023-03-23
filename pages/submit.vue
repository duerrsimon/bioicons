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
            Available extensions
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
                    <div class="w-full space-y-12 lg:w-1/2">
                      <div>
                        <h1
                          class="text-3xl font-bold text-gray-800 capitalize lg:text-4xl dark:text-white"
                        >
                          How to contribute illustrations?
                        </h1>
                      </div>
  
                      <div class="md:flex md:items-start md:-mx-4">
                        <span
                          class="inline-block p-2 text-green-500 bg-green-100 rounded-xl md:mx-4 dark:text-white dark:bg-blue-500"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="w-6 h-6"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                            />
                          </svg>
                        </span>
  
                        <div class="mt-4 md:mx-4 md:mt-0">
                          <h1
                            class="text-2xl font-semibold text-gray-700 capitalize dark:text-white"
                          >
                            Make your illustrations reusable
                          </h1>
  
                          <p class="mt-3 text-gray-500 dark:text-gray-300">
                            Bioicons only accepts illustrations in SVG format,
                            which can be created using Inkscape, Adobe Illustrator
                            or Corel Draw. Do not include raster graphics textures or vectorize raster graphics
                          </p>
                        </div>
                      </div>
  
                      <div class="md:flex md:items-start md:-mx-4">
                        <span
                          class="inline-block p-2 text-green-500 bg-green-100 rounded-xl md:mx-4 dark:text-white dark:bg-blue-500"
                        >
                          <svg
                            viewbox="0 0  197 197"
                            xmlns="http://www.w3.org/2000/svg"
                            version="1.1"
                            class="w-6 h-6"
                          >
                            <circle cx="98" cy="98" r="98" fill="currentColor" />
                            <circle cx="98" cy="98" r="78" fill="white" />
                            <circle cx="98" cy="98" r="55" fill="currentColor" />
                            <circle cx="98" cy="98" r="30" fill="white" />
                            <rect
                              x="115"
                              y="85"
                              width="45"
                              height="25"
                              fill="white"
                            />
                          </svg>
                        </span>
  
                        <div class="mt-4 md:mx-4 md:mt-0">
                          <h1
                            class="text-2xl font-semibold text-gray-700 capitalize dark:text-white"
                          >
                            Open license
                          </h1>
  
                          <p class="mt-3 text-gray-500 dark:text-gray-300">
                            Choose an appropriate license for your illustrations.
                            If you want to be attributed choose
                            <code>Creative Commons BY 4.0 (cc-by-4.0)</code>,
                            otherwise <code>Creative Commons 0 (cc-0)</code> is
                            the best (and most open) choice. Other licenses are
                            also supported.
                          </p>
                        </div>
                      </div>
  
                      <div class="md:flex md:items-start md:-mx-4">
                        <span
                          class="inline-block p-2 text-green-500 bg-green-100 rounded-xl md:mx-4 dark:text-white dark:bg-blue-500"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="w-6 h-6"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                            />
                          </svg>
                        </span>
  
                        <div class="mt-4 md:mx-4 md:mt-0">
                          <h1
                            class="text-2xl font-semibold text-gray-700 capitalize dark:text-white"
                          >
                            Submit illustrations
                          </h1>
  
                          <p class="mt-3 text-gray-500 dark:text-gray-300">
                            You can open a
                            <a href="https://github.com/duerrsimon/bioicons/"
                              >Pull request</a
                            >
                            on GitHub or directly upload them via the form on this
                            website, which will open a Pull Request for you. We
                            will check the illustrations you uploaded.
                          </p>
                        </div>
                      </div>
                    </div>
                  <div class="w-full space-y-4 lg:w-1/2">
                    <h1 class="text-2xl font-bold">Submission form</h1>
                    <iframe
                      src="https://simonduerr-bioicons-submission.hf.space"
                      frameborder="0"
                      width="100%"
                      height="900px"
                    ></iframe>
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
  