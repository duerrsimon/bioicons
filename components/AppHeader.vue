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
              v-if="numberoficons>0"
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
              <span v-if="numberoficons>0">{{ numberoficons }} icons</span>
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
          <a href="/extensions" class="block">
            <div
              class="p-5 bg-green-50 bg-opacity-18.75 dark:bg-opacity-12.5 rounded-3 text-green-50 hover:bg-white hover:text-gray-800"
            >
              <p
                class="text-center sm:text-left font-medium text-lg leading-none"
              >
                <span
                  class="align-top inline-flex flex-row items-center space-x-2"
                  ><svg
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.0"
                    viewBox="0 0 390 390"
                    class="w-8 h-8"
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    x="0px"
                    y="0px"
                    class="w-8 h-8"
                    viewBox="0 0 250 250"
                    xml:space="preserve"
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
                  <span> Extensions</span></span
                >
              </p>
            </div>
          </a>
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
                    class="w-8 h-8"
                  >
                    <path
                      d="M7.975 16a9.39 9.39 0 003.169-.509c-.473.076-.652-.229-.652-.486l.004-.572c.003-.521.01-1.3.01-2.197 0-.944-.316-1.549-.68-1.863 2.24-.252 4.594-1.108 4.594-4.973 0-1.108-.39-2.002-1.032-2.707.1-.251.453-1.284-.1-2.668 0 0-.844-.277-2.77 1.032A9.345 9.345 0 008 .717c-.856 0-1.712.113-2.518.34C3.556-.24 2.712.025 2.712.025c-.553 1.384-.2 2.417-.1 2.668-.642.705-1.033 1.612-1.033 2.707 0 3.852 2.342 4.72 4.583 4.973-.29.252-.554.692-.642 1.347-.58.264-2.027.692-2.933-.831-.19-.302-.756-1.045-1.549-1.032-.843.012-.34.478.013.667.428.239.919 1.133 1.032 1.422.201.567.856 1.65 3.386 1.184 0 .55.006 1.079.01 1.447l.003.428c0 .265-.189.567-.692.479 1.007.34 1.926.516 3.185.516z"
                    ></path></svg
                  ><span style="width: 0.67ch"></span>Open on GitHub</span
                >
              </p>
            </div>
          </a>
          <div class="w-3 h-3"></div>
          <a
            href="https://bioicons.com/pdb2vector"
            class="block"
          >
            <div
              class="p-5 bg-green-50 bg-opacity-18.75 dark:bg-opacity-12.5 text-green-50 rounded-3 hover:bg-white hover:text-gray-800"
            >
              <p
                class="text-center sm:text-left font-medium text-lg leading-none"
              >
                <span class="align-top inline-flex flex-row items-center"
                  >
                 
<svg  class="w-8 h-8" viewBox="-1.5 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="currentColor"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="icomoon-ignore"> </g> <path d="M26.667 9.867l-0.96 0.96c-2.080-1.813-4.747-2.827-7.52-2.827-1.867 0-3.733 0.48-5.333 1.333l4.053-4.053c0.32 0.213 0.693 0.32 1.067 0.32 0.533 0 1.067-0.213 1.493-0.64 0.853-0.853 0.853-2.187 0-3.040-0.427-0.427-0.96-0.64-1.493-0.64s-1.067 0.213-1.493 0.64c-0.693 0.747-0.8 1.813-0.32 2.613l-5.12 5.12-0.96-0.96-2.613 2.613 0.96 0.96-5.227 5.227c-0.32-0.213-0.693-0.32-1.067-0.32-0.533 0-1.067 0.213-1.493 0.64-0.853 0.853-0.853 2.187 0 3.040 0.427 0.373 0.96 0.587 1.493 0.587s1.067-0.213 1.493-0.64c0.693-0.693 0.8-1.76 0.32-2.613l4.053-4.053c-2.133 4.107-1.653 9.227 1.493 12.853l-0.96 1.013 2.667 2.613 2.613-2.613-2.613-2.613-0.907 0.907c-3.093-3.627-3.253-8.853-0.64-12.693l0.427 0.427 2.667-2.613-0.48-0.427c1.707-1.227 3.787-1.867 5.92-1.867 2.507 0 4.853 0.907 6.773 2.507l-0.96 0.907 2.667 2.613 2.613-2.613-2.613-2.667zM12.32 28l-1.12 1.12-1.12-1.12 1.12-1.12 1.12 1.12zM17.227 2.72c0.213-0.213 0.48-0.32 0.747-0.32s0.533 0.107 0.747 0.32c0.427 0.427 0.427 1.067 0 1.493-0.213 0.213-0.48 0.32-0.747 0.32s-0.533-0.107-0.747-0.32c-0.427-0.373-0.427-1.067 0-1.493zM2.88 20.053c-0.213 0.213-0.48 0.32-0.747 0.32s-0.533-0.107-0.747-0.32c-0.213-0.16-0.32-0.427-0.32-0.747 0-0.267 0.107-0.533 0.32-0.747s0.48-0.32 0.747-0.32c0.267 0 0.533 0.107 0.747 0.32 0.427 0.427 0.427 1.12 0 1.493zM10.027 12.533l-1.12-1.12 1.12-1.12 1.12 1.12-1.12 1.12zM26.667 13.653l-1.12-1.12 1.12-1.12 1.12 1.12-1.12 1.12z" fill="currentColor"> </path> </g></svg>

<span style="width: 0.67ch"></span>PDB2Vector</span
                >
              </p>
            </div>
          </a>
          <div class="w-3 h-3"></div>
          <a
            href="https://bioicons.com/submit"
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
                  >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8">
  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
</svg>

<span style="width: 0.67ch"></span>Submit illustrations</span
                >
              </p>
            </div>
          </a>
        </div>
      </div>
      <div v-if="displayCategories" id="v-step-0" class="mb-2 mt-8 text-center">
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
    displayCategories: { type: Boolean, default: true },
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
