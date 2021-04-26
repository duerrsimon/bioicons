<template>
  <header
    class="px-4 lg:px-6 flex flex-row justify-center bg-theme dark:bg-dark-theme"
  >
    <div class="w-full max-w-screen-xl">
      <div class="h-16"></div>
      <div class="flex flex-row justify-center">
        <div class="relative">
          <Logo :dark-mode="darkMode" />
        </div>
      </div>
      <div class="h-2"></div>
      <div class="flex flex-row justify-center mt-4">
        <h2 class="text-center font-medium text-xl text-green-50">
          <div class="flex text-base space-x-4 justify-center flex-wrap">
            <div class="flex space-x-2 items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-gray-200"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>{{ numberoficons }} icons</span>
            </div>
            <div class="flex space-x-2 items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-gray-200"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L5 10.274zm10 0l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L15 10.274z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>CC 0 &middot; CC by SA &middot; MIT License</span>
            </div>
            <div class="flex space-x-2 items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-gray-200"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                  clip-rule="evenodd"
                />
              </svg>
              <span
                >Viewer by
                <a
                  class="font-semibold no-underline hover:underline"
                  href="https://twitter.com/simonduerr"
                  target="_blank"
                  rel="noopener noreferrer"
                  >@simonduerr</a
                ></span
              >
            </div>

            <div></div>
          </div>
        </h2>
      </div>
      <div class="h-8"></div>
      <div class="flex flex-row justify-center">
        <div class="flex flex-col sm:flex-row w-full sm:w-auto">
          <!-- <a
            href=""
            target="_blank"
            rel="noopener noreferrer"
            class="block"
          > -->
          <div
            class="p-5 bg-green-50 bg-opacity-18.75 dark:bg-opacity-12.5 rounded-3 text-green-50"
          >
            <p
              class="text-center sm:text-left font-medium text-lg leading-none"
            >
              <span class="align-top inline-flex flex-row items-center"
                ><svg
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.0"
                  viewBox="0 0 390 390"
                  class="w-5 h-5"
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
                  </g></svg
                ><span style="width: 0.67ch"></span>
                <span
                  class="text-green-600 dark:text-green-900 uppercase text-xs font-medium pr-1"
                  >Coming soon</span
                ><span> Inkscape integration</span></span
              >
            </p>
          </div>
          <!-- </a> -->
          <div class="w-3 h-3"></div>
          <a
            href="https://github.com/duerrsimon/bioicons"
            target="_blank"
            rel="noopener noreferrer"
            class="block"
          >
            <div
              class="p-5 bg-green-50 bg-opacity-18.75 dark:bg-opacity-12.5 text-green-50 rounded-3 hover:bg-white hover:text-gray-800"
            >
              <p
                class="text-center sm:text-left font-medium text-lg leading-none"
              >
                <span class="align-top inline-flex flex-row items-center"
                  ><svg
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-5 h-5"
                  >
                    <path
                      d="M7.975 16a9.39 9.39 0 003.169-.509c-.473.076-.652-.229-.652-.486l.004-.572c.003-.521.01-1.3.01-2.197 0-.944-.316-1.549-.68-1.863 2.24-.252 4.594-1.108 4.594-4.973 0-1.108-.39-2.002-1.032-2.707.1-.251.453-1.284-.1-2.668 0 0-.844-.277-2.77 1.032A9.345 9.345 0 008 .717c-.856 0-1.712.113-2.518.34C3.556-.24 2.712.025 2.712.025c-.553 1.384-.2 2.417-.1 2.668-.642.705-1.033 1.612-1.033 2.707 0 3.852 2.342 4.72 4.583 4.973-.29.252-.554.692-.642 1.347-.58.264-2.027.692-2.933-.831-.19-.302-.756-1.045-1.549-1.032-.843.012-.34.478.013.667.428.239.919 1.133 1.032 1.422.201.567.856 1.65 3.386 1.184 0 .55.006 1.079.01 1.447l.003.428c0 .265-.189.567-.692.479 1.007.34 1.926.516 3.185.516z"
                    ></path></svg
                  ><span style="width: 0.67ch"></span>Open on GitHub</span
                >
              </p>
            </div>
          </a>
        </div>
      </div>
      <div id="v-step-0" class="mb-2 mt-8 text-center">
        <button
          v-for="(value, name) in counts"
          :key="name"
          class="badge bg-green-50 focus:outline-none hover:outline-none bg-opacity-18.75 dark:bg-opacity-12.5 text-green-50 rounded-3 hover:bg-white hover:text-gray-800 px-3 py-2 m-1 text-sm"
          @click="selectCat(name)"
        >
          <span
            class="mb-3 bg-white text-green-800 rounded-full px-2 py-1 text-center object-right-top text-xs mr-2"
            >{{ value }}</span
          >{{ removeUnderscore(name) }}
        </button>
      </div>
      <div class="h-4"></div>
      <div style="height: var(--search-bar-negative-margin)"></div>
    </div>
  </header>
</template>

<script>
import Logo from './Logo.vue'
export default {
  components: { Logo },
  props: {
    darkMode: { type: Boolean, default: false },
    numberoficons: { type: Number, default: 0 },
    counts: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  methods: {
    removeUnderscore(value) {
      return value.split('_').join(' ')
    },
    selectCat(value) {
      this.$emit('category', value)
    },
  },
}
</script>

<style>
.badge:hover span {
  @apply bg-green-400 text-white;
}
</style>
