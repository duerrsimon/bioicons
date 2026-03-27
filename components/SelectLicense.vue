<template>
  <div
    class="w-full sm:border-l border-cool-gray-200 dark:border-cool-gray-700 mr-4"
  >
    <div>
      <label
        id="license-listbox-label"
        class="block text-sm font-medium text-gray-700 hidden"
      >
        License
      </label>
      <div class="mt-1 relative">
        <button
          type="button"
          class="relative w-full bg-white dark:bg-gray-900 dark:text-gray-200 rounded pl-3 pr-10 py-2 text-left cursor-pointer focus:outline-none focus:text-green-500 sm:text-sm"
          aria-haspopup="listbox"
          aria-expanded="true"
          aria-labelledby="license-listbox-label"
          @click="showSelect(!selected)"
        >
          <span class="flex items-center">
            <span class="ml-3 block whitespace-no-wrap">
              {{ formatLicense(selectedLicense) }}</span
            >
          </span>
          <span
            class="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </span>
        </button>
        <ul
          v-show="selected"
          class="absolute mt-1 w-full bg-white dark:bg-gray-800 shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
          style="min-width: 14rem"
          tabindex="-1"
          role="listbox"
          aria-labelledby="license-listbox-label"
          :aria-activedescendant="
            'license-listbox-option-' + selectedLicenseIndex
          "
        >
          <li
            v-for="(lic, i) in licenses"
            :id="'license-listbox-option-' + i"
            :key="lic"
            :class="{ 'font-bold': selectedLicense == lic }"
            class="cursor-pointer text-gray-700 dark:text-gray-100 hover:text-white hover:bg-green-500 cursor-default select-none relative py-2 pl-3 pr-9"
            role="option"
            @click="select(lic, i)"
          >
            <div class="flex items-center">
              <span class="ml-3 block whitespace-no-wrap">
                {{ formatLicense(lic) }}
              </span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    selectedLicense: { type: String, default: 'All_licenses' },
    licenses: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      selected: false,
      selectedLicenseIndex: 0,
    }
  },
  methods: {
    showSelect(value) {
      this.selected = value
    },
    formatLicense(value) {
      if (value === 'All_licenses') {
        return 'All licenses'
      }
      if (value === 'cc-0') return 'CC0'
      if (value === 'mit') return 'MIT'
      if (value === 'bsd') return 'BSD'
      const saMatch = value.match(/^cc-by-sa-(.+)$/)
      if (saMatch) return `CC BY-SA ${saMatch[1].toUpperCase()}`
      const byMatch = value.match(/^cc-by-(.+)$/)
      if (byMatch) return `CC BY ${byMatch[1].toUpperCase()}`
      return value
    },
    select(lic, i) {
      this.selectedLicenseIndex = i
      this.$emit('license', lic)
      this.selected = false
    },
  },
}
</script>

<style></style>
