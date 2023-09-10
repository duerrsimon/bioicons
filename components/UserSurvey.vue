<template>
  <div class="fixed left-0 bottom-0 z-40">
    <div
      class="fixed z-40 sm:right-4 bottom-10 rounded-lg bg-white shadow-2xl w-full sm:w-1/2 xl:w-1/3 max-w-[650px] overflow-hidden border-gray-200"
      v-if="showsurvey"
    >
      <!-- Text -->
      <div class="w-full">
        <div class="relative overflow-hidden px-8 pt-8">
          <div
            width="80"
            height="77"
            class="absolute top-0 right-0 -mt-10 -mr-10 text-theme"
          >
            <svg
              width="120"
              height="119"
              viewBox="0 0 120 119"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                opacity="0.4"
                d="M6.38128 49.1539C3.20326 32.893 13.809 17.1346 30.0699 13.9566L70.3846 6.07751C86.6455 2.89948 102.404 13.5052 105.582 29.7661L113.461 70.0808C116.639 86.3417 106.033 102.1 89.7724 105.278L49.4577 113.157C33.1968 116.335 17.4384 105.729 14.2604 89.4686L6.38128 49.1539Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div class="text-2xl flex flex-col pb-4">
            <div class="text-sm flex items-center space-x-1 text-theme">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="4"></circle>
                <line x1="4.93" y1="4.93" x2="9.17" y2="9.17"></line>
                <line x1="14.83" y1="14.83" x2="19.07" y2="19.07"></line>
                <line x1="14.83" y1="9.17" x2="19.07" y2="4.93"></line>
                <line x1="14.83" y1="9.17" x2="18.36" y2="5.64"></line>
                <line x1="4.93" y1="19.07" x2="9.17" y2="14.83"></line>
              </svg>
              <span>BioIcons needs your help. </span>
            </div>
            <span class="text-xl font-bold"
              >User survey & Letter of support</span
            >
          </div>
          <div class="pb-4">
            <p>
              Answer a few questions about using BioIcons, help us improve the
              platform and get funding for new illustrations.
            </p>
          </div>
        </div>
      </div>
      <div
        class="w-full flex justify-center items-center border-t border-solid border-gray-200"
      >
        <button
          @click="togglebanner()"
          class="border-r border-gray-200 flex-1 px-4 py-3 text-gray-500 hover:text-white hover:bg-red-400 duration-150"
        >
          Not now
        </button>
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSeOGiStwF6Kj9Dqr2b_Ke_Tm1aRp0LmBMyGem-5Li-rghIlBw/viewform"
          @click="togglebanner()"
          target="_blank"
          class="flex-1 text-center px-4 py-3 text-gray-500 hover:text-white hover:bg-theme duration-150"
        >
          Sure
        </a>
      </div>
    </div>

    <button
      class="fixed right-4 bottom-2 text-sm rounded-1 shadow-2 px-3 py-2 bg-cool-gray-800 my-1 rounded text-white flex items-center space-x-1"
      @click="togglebanner()"
      v-else
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-4 h-4"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
        />
      </svg>
      <span>User survey</span>
    </button>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    showsurvey: { type: Boolean, default: false },
  },
  methods: {
    togglebanner() {
      this.$emit('togglebanner')
    },
  },
}
</script>
