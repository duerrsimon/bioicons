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
        <main class="z-10 container mx-auto flex sm:flex-no-wrap sm:space-x-4">
          <div
            class="shadow lg:shadow-lg bg-white h-full minh-0 dark:bg-cool-gray-900 overflow-hidden rounded-xl p-5 w-1/2"
          >
            <div class="w-full mx-auto">
              <div class="flex items-center space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  x="0px"
                  y="0px"
                  class="w-16 h-16"
                  viewBox="0 0 250 250"
                  xml:space="preserve"
                  style="margin-bottom: 0; flex: none"
                >
                  <style type="text/css">
                    .st0 {
                      fill: #f08705;
                    }
                    .st1 {
                      fill: #df6c0c;
                    }
                    .st2 {
                      fill: #ffffff;
                    }
                  </style>
                  <path
                    class="st0"
                    d="M237.5,227.9c0,5.3-4.3,9.6-9.5,9.6c0,0,0,0,0,0H22.1c-5.3,0-9.6-4.3-9.6-9.5c0,0,0,0,0,0V22.1
            	c0-5.3,4.3-9.6,9.5-9.6c0,0,0,0,0,0h205.9c5.3,0,9.6,4.3,9.6,9.5c0,0,0,0,0,0V227.9z"
                  ></path>
                  <path
                    class="st1"
                    d="M237.5,227.9c0,5.3-4.3,9.6-9.5,9.6c0,0,0,0,0,0H89.6L44.8,192l27.9-45.5l82.7-102.7l82.1,84.5V227.9z"
                  ></path>
                  <path
                    class="st2"
                    d="M197.1,138.3h-23.7l-25-42.7c5.7-1.2,9.8-6.2,9.7-12V51.5c0-6.8-5.4-12.3-12.2-12.3c0,0-0.1,0-0.1,0h-41.7
            	c-6.8,0-12.3,5.4-12.3,12.2c0,0,0,0.1,0,0.1v32.1c0,5.8,4,10.8,9.7,12l-25,42.7H52.9c-6.8,0-12.3,5.4-12.3,12.2c0,0,0,0.1,0,0.1
            	v32.1c0,6.8,5.4,12.3,12.2,12.3c0,0,0.1,0,0.1,0h41.7c6.8,0,12.3-5.4,12.3-12.2c0,0,0-0.1,0-0.1v-32.1c0-6.8-5.4-12.3-12.2-12.3
            	c0,0-0.1,0-0.1,0h-4l24.8-42.4h19.3l24.9,42.4h-4.1c-6.8,0-12.3,5.4-12.3,12.2c0,0,0,0.1,0,0.1v32.1c0,6.8,5.4,12.3,12.2,12.3
            	c0,0,0.1,0,0.1,0h41.7c6.8,0,12.3-5.4,12.3-12.2c0,0,0-0.1,0-0.1v-32.1c0-6.8-5.4-12.3-12.2-12.3
            	C197.2,138.3,197.2,138.3,197.1,138.3z"
                  ></path>
                </svg>
                <h1 class="font-bold text-3xl" style="color: #f08705">
                  Draw.io
                </h1>
              </div>
              <p class="text-sm pt-3 text-gray-500">
                Draw.io is a free online drawing service that allows you to save
                your drawing locally or in many cloud providers. Quickly
                assemble your figure with bioicons, add text and other shapes
                and export them to a variety of formats. Zero cost and preserves
                privacy. No registration required. Collaborative editing
                available.
              </p>
              <div class="">
                <div class="py-8 text-base leading-7 space-y-2 text-gray-600">
                  <h4 class="font-medium text-lg">Select Bioicon categories</h4>
                  <div class="mb-2 mt-8 rounded-xl">
                    <button
                      v-for="(value, key) in categories"
                      :key="key"
                      class="badge border-theme border focus:outline-none hover:outline-none rounded-3 px-3 py-2 m-1 text-sm"
                      :class="
                        isSelected(key)
                          ? 'bg-theme text-white  '
                          : 'text-theme bg-white dark:bg-transparent'
                      "
                      @click="toggleSelect(key)"
                    >
                      <span
                        class="mb-3 border border-theme rounded-full px-2 py-1 text-center object-right-top text-xs mr-2"
                        :class="
                          isSelected(key)
                            ? 'bg-white text-green-800  '
                            : 'bg-white text-theme dark:bg-transparent'
                        "
                        >{{ value.n }}</span
                      >{{ key.replace(/_/g, ' ') }}
                    </button>
                  </div>
                </div>
                <div class="my-2 flex space-x-3 items-center">
                  <button
                    class="text-white focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-base px-5 py-2.5 text-center mr-2"
                    :class="
                      selected.length == 0
                        ? 'bg-gray-400  cursor-not-allowed'
                        : 'bg-theme cursor-pointer'
                    "
                    aria-label="Open Draw.io with loaded categories"
                    @click="openUrl(url)"
                  >
                    Launch <b>draw.io</b>
                  </button>
                  <p class="text-gray-500">
                    Depending on how many categories you select it might take 1
                    minute for the icons to be displayed.
                  </p>
                </div>

                <div
                  class="flex p-4 mb-4 text-sm text-yellow-700 bg-yellow-100 rounded-lg dark:bg-yellow-200 dark:text-yellow-800"
                  role="alert"
                >
                  <svg
                    class="inline flex-shrink-0 mr-3 w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <div>
                    <span class="font-medium">Mind the License.</span>
                    Remember to credit the original author of the illustration
                    if required by the license. You do not need to attribute
                    bioicons itself.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="shadow lg:shadow-lg bg-white dark:bg-cool-gray-900 overflow-hidden rounded-xl p-5 w-1/2"
          >
            <div class="w-full mx-auto">
              <div class="flex items-center space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.0"
                  viewBox="0 0 390 390"
                  class="w-16 h-16"
                  style="filter: brightness(125%)"
                >
                  <g id="inkscape-logo">
                    <path
                      d="M163.15,27.83L28.81,165.3C-16.58,221.51 59.7,214.97 92.4,231.16C104.13,243.15 47.44,252 59.17,264C70.9,275.99 130.1,287.1 141.85,299.09C153.58,311.08 117.84,323.8 129.57,335.79C141.3,347.78 168.43,336.42 173.51,364.1C177.13,383.88 222.4,372.6 244.54,356.4C256.27,344.4 222.1,345.53 233.83,333.54C263,303.71 290.16,322.7 300.14,292.81C305.07,278.04 257.2,270.04 268.95,258.05C302.7,238.34 419.35,225.51 364,170.16L224.75,27.83C207.72,11.48 179.3,11.3 163.15,27.83 zM317.46,292.81C317.46,299.63 367.71,304.1 367.71,291.2C360.55,270.48 323.4,271.88 317.46,292.81 zM91.1,329.05C103,339.34 121.38,326.49 126.89,312.13C115.36,296.81 72.2,312.68 91.1,329.05 zM311.16,306.82C295.82,320.58 312.88,334.54 328,325.65C331.37,322.23 327.91,310.24 311.16,306.82z"
                    ></path>
                    <path
                      fill="white"
                      d="M131,238.6C134.59,240.83 188.89,251.86 202.16,254.06C206.76,255.03 203.5,259.77 197.16,262.97C182.86,266.77 113.5,238.6 131,238.6z"
                    ></path>
                    <path
                      fill="white"
                      d="M216.63,37.47L269.78,91.45C274.82,96.6 274.75,106.58 271.93,109.45L245.54,88.34L240.35,119.6L218.3,107.96L182.99,130.27L171.3,83.24L152.33,116.06L123.33,116.06C111.51,116.06 110.12,101.06 120.86,90.32C139.62,70.07 161.15,49.43 172.85,37.47C184.61,25.45 205.1,25.79 216.63,37.47z"
                    ></path>
                  </g>
                </svg>
                <h1 class="font-bold text-3xl dark:text-white">
                  Inkscape (beta)
                </h1>
              </div>
              <p class="text-sm py-3 text-gray-500">
                Inkscape is a free vector graphics editor. It is used to create
                and edit vector graphics. Bioicons are available within the
                Inkscape Import Clipart extension. The Inkscape Import Clipart
                extension is currently undergoing work to be merged into the
                core. Support the developers
                <a
                  href="https://www.patreon.com/doctormo"
                  target="_blank"
                  class="hover:underline text-theme"
                >
                  here</a
                >.
              </p>
              <div class="divide-y divide-gray-300/50">
                <div class="py-3 text-base leading-7 space-y-2 text-gray-600">
                  <img
                    src="/inkscape-ext.png"
                    alt="Inkscape extension"
                    class="rounded border border-gray-300"
                  />
                </div>

                <div
                  class="px-4 py-3 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-3 lg:px-8 lg:py-6 dark:text-white"
                >
                  <div class="">
                    <div class="">
                      <h3 class="font-medium text-2xl">
                        Installation instructions (Inkscape 1.1+)
                      </h3>
                      <p class="pb-4">
                        Note that the package currently only works on Linux.
                      </p>
                      <div class="flex">
                        <div class="flex flex-col items-center mr-4">
                          <div>
                            <div
                              class="flex items-center justify-center w-10 h-10 border rounded-full"
                            >
                              <svg
                                class="w-4 text-gray-600"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                viewBox="0 0 24 24"
                              >
                                <line
                                  fill="none"
                                  stroke-miterlimit="10"
                                  x1="12"
                                  y1="2"
                                  x2="12"
                                  y2="22"
                                ></line>
                                <polyline
                                  fill="none"
                                  stroke-miterlimit="10"
                                  points="19,15 12,22 5,15"
                                ></polyline>
                              </svg>
                            </div>
                          </div>
                          <div class="w-px h-full bg-gray-300"></div>
                        </div>
                        <div class="pt-1 pb-8">
                          <p class="mb-2 text-lg font-bold">
                            Select
                            <span
                              class="p-1 bg-gray-200 rounded dark:text-gray-800"
                              >Extensions</span
                            >
                            in toolbar
                          </p>
                          <img src="/step1.png" alt="Inkscape Toolbar" />
                        </div>
                      </div>
                      <div class="flex">
                        <div class="flex flex-col items-center mr-4">
                          <div>
                            <div
                              class="flex items-center justify-center w-10 h-10 border rounded-full"
                            >
                              <svg
                                class="w-4 text-gray-600"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                viewBox="0 0 24 24"
                              >
                                <line
                                  fill="none"
                                  stroke-miterlimit="10"
                                  x1="12"
                                  y1="2"
                                  x2="12"
                                  y2="22"
                                ></line>
                                <polyline
                                  fill="none"
                                  stroke-miterlimit="10"
                                  points="19,15 12,22 5,15"
                                ></polyline>
                              </svg>
                            </div>
                          </div>
                          <div class="w-px h-full bg-gray-300"></div>
                        </div>
                        <div class="pt-1 pb-8">
                          <p class="mb-2 text-lg font-bold">
                            Navigate to
                            <span
                              class="p-1 bg-gray-200 rounded dark:text-gray-800"
                              >Manage Extensions</span
                            >
                          </p>
                          <img src="/step2.png" alt="Extensions menu" />
                        </div>
                      </div>
                      <div class="flex">
                        <div class="flex flex-col items-center mr-4">
                          <div>
                            <div
                              class="flex items-center justify-center w-10 h-10 border rounded-full"
                            >
                              <svg
                                class="w-4 text-gray-600"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                viewBox="0 0 24 24"
                              >
                                <line
                                  fill="none"
                                  stroke-miterlimit="10"
                                  x1="12"
                                  y1="2"
                                  x2="12"
                                  y2="22"
                                ></line>
                                <polyline
                                  fill="none"
                                  stroke-miterlimit="10"
                                  points="19,15 12,22 5,15"
                                ></polyline>
                              </svg>
                            </div>
                          </div>
                          <div class="w-px h-full bg-gray-300"></div>
                        </div>
                        <div class="pt-1 pb-8">
                          <p class="mb-2 text-lg font-bold">
                            Switch to
                            <span
                              class="p-1 bg-gray-200 rounded dark:text-gray-800"
                              >Install Packages</span
                            >
                            tab and select
                            <span
                              class="p-1 bg-gray-200 rounded dark:text-gray-800"
                              >Import Clipart</span
                            >
                            Extension
                          </p>
                          <img
                            src="/step3.png"
                            alt="Inkscape Extension Manager dialog"
                          />
                        </div>
                      </div>
                      <div class="flex">
                        <div class="flex flex-col items-center mr-4">
                          <div>
                            <div
                              class="flex items-center justify-center w-10 h-10 border rounded-full"
                            >
                              <svg
                                class="w-4 text-gray-600"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                viewBox="0 0 24 24"
                              >
                                <line
                                  fill="none"
                                  stroke-miterlimit="10"
                                  x1="12"
                                  y1="2"
                                  x2="12"
                                  y2="22"
                                ></line>
                                <polyline
                                  fill="none"
                                  stroke-miterlimit="10"
                                  points="19,15 12,22 5,15"
                                ></polyline>
                              </svg>
                            </div>
                          </div>
                          <div class="w-px h-full bg-gray-300"></div>
                        </div>
                        <div class="pt-1 pb-8">
                          <p class="mb-2 text-lg font-bold">
                            Click on
                            <span
                              class="p-1 bg-gray-200 rounded dark:text-gray-800"
                              >Install Package</span
                            >
                          </p>
                          <img src="/step4.png" alt="Install package" />
                        </div>
                      </div>
                      <div class="flex">
                        <div class="flex flex-col items-center mr-4">
                          <div>
                            <div
                              class="flex items-center justify-center w-10 h-10 border rounded-full"
                            >
                              <svg
                                class="w-4 text-gray-600"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                viewBox="0 0 24 24"
                              >
                                <line
                                  fill="none"
                                  stroke-miterlimit="10"
                                  x1="12"
                                  y1="2"
                                  x2="12"
                                  y2="22"
                                ></line>
                                <polyline
                                  fill="none"
                                  stroke-miterlimit="10"
                                  points="19,15 12,22 5,15"
                                ></polyline>
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div class="pt-1 pb-8">
                          <p class="mb-2 text-lg font-bold">
                            Bioicons can now be inserted using
                            <span
                              class="p-1 bg-gray-200 rounded dark:text-gray-800"
                              >Extensions
                            </span>
                            &rarr;
                            <span
                              class="p-1 bg-gray-200 rounded dark:text-gray-800"
                            >
                              Import</span
                            >
                            &rarr;
                            <span
                              class="p-1 bg-gray-200 rounded dark:text-gray-800"
                              >Internet Resource</span
                            >
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
import AppHeader from '../components/AppHeader.vue'
import GithubButtons from '../components/GithubButtons.vue'
// import Loading from '../components/Loading.vue'

const getDrawio = () =>
  import('../static/drawio-lib/categories.json').then((m) => m.default || m)

export default {
  components: { GithubButtons, AppHeader }, // Loading
  async asyncData({ req }) {
    const categories = await getDrawio()
    let nIcons = 0
    // eslint-disable-line
    for (const value of Object.values(categories)) {
      nIcons += value.n
    }
    return { categories, nIcons }
  },
  data() {
    return {
      darkMode: false,
      name: '',
      selected: [],
    }
  },
  head() {
    return {
      title: 'Bioicons - high quality science illustrations',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
            'Bioicons contains free science illustrations for biologists, chemists, machine learning under permissive CC0, CC BY or MIT License.',
        },
      ],
    }
  },
  computed: {
    settings() {
      return {
        clipboard: this.clipboard,
        darkMode: this.darkMode,
      }
    },
    url() {
      let url = 'https://app.diagrams.net/?splash=0&clibs='
      const folderurl = 'Uhttps://bioicons.com/drawio-lib/'
      this.selected.forEach((item) => {
        url += encodeURIComponent(folderurl + this.categories[item].file) + ';'
      })
      return url
    },
  },

  mounted() {
    const settings = JSON.parse(localStorage.getItem('settings'))
    if (settings !== null) {
      if (typeof settings.clipboard !== 'undefined') {
        this.clipboard = settings.clipboard
      }
      if (typeof settings.darkMode !== 'undefined') {
        this.darkMode = settings.darkMode
      }
      if (typeof settings.showTour !== 'undefined') {
        this.showTour = settings.showTour
      }
      this.$notify(
        {
          text: 'Loaded settings from local storage',
          type: 'info',
        },
        2000
      )
    }
    if (
      this.$browserDetect.isFirefox ||
      this.$browserDetect.isIE ||
      this.$browserDetect.isSafari ||
      this.$browserDetect.isIOS ||
      this.$browserDetect.isChromeIOS
    ) {
      this.clipboard = true
      this.clipboardAllowed = false
    }
  },
  methods: {
    openUrl(url) {
      if (this.selected.length > 0) {
        window.open(url, '_blank')
      } else {
        alert('Please select at least one category')
      }
    },
    toggleSelect(key) {
      // check if is already selected
      const index = this.selected.indexOf(key)
      if (index > -1) {
        this.selected.splice(index, 1) // 2nd parameter means remove one item only
      } else {
        this.selected.push(key)
      }
    },
    isSelected(key) {
      // check if is already selected
      const index = this.selected.indexOf(key)
      if (index > -1) {
        return true // 2nd parameter means remove one item only
      } else {
        return false
      }
    },
  },
}
</script>

<style>
@import url('https://rsms.me/inter/inter.css');
html {
  font-family: 'Inter', sans-serif;
}
@supports (font-variation-settings: normal) {
  html {
    font-family: 'Inter var', sans-serif;
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
