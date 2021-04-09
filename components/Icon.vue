<template>
  <article class="pb-full relative">
    <div class="absolute inset-0">
      <button
        class="block w-full h-full focus:outline-none group relative"
        :aria-label="'Click to Copy/download ' + icon.name + ' as SVG'"
      >
        <div class="flex flex-row justify-center items-center h-full">
          <div
            class="opacity-0 group-hover:opacity-100 group-focus:opacity-100 transform scale-0 group-hover:scale-100 group-focus:scale-100 transition duration-300 ease-out w-40 h-40 bg-transparent bg-green-500 dark:bg-green-600 bg-opacity-12.5 dark:bg-opacity-100 rounded-full"
          ></div>
        </div>
        <div class="absolute inset-0" @click="clickAction">
          <div class="flex flex-row justify-center items-center h-full px-8">
            <img
              :ref="icon.name"
              v-lazy-load
              class="h-3/5 w-auto"
              crossorigin
              data-mime-type="image/svg+xml"
              :alt="icon.name"
              :src="
                '/icons/' +
                icon.license +
                '/' +
                icon.category +
                '/' +
                authorunderscore +
                '/' +
                icon.name +
                '.svg'
              "
            />
          </div>
        </div>
        <div class="p-4 absolute inset-x-0 bottom-0">
          <div class="-mx-2 flex flex-row flex-wrap justify-center">
            <p
              class="subpixel-antialiased w-full px-2 py-1 text-base sm:text-sm tracking-wide leading-tight text-cool-gray-600 dark:text-cool-gray-400 cursor-text select-text"
            >
              {{ icon.name }}
            </p>
            <div
              class="flex justify-center tracking-wide text-base sm:text-sm md:text-xs leading-tight text-cool-gray-600 cursor-text select-text pt-1 space-x-2"
            >
              <div class="flex items-center space-x-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 text-cool-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L5 10.274zm10 0l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L15 10.274z"
                    clip-rule="evenodd"
                  />
                </svg>
                <a
                  :href="licenseurl"
                  target="_blank"
                  class="hover:text-green-500 focus:text-green-500"
                  >{{ license }}</a
                >
              </div>
              <div class="flex items-center space-x-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 text-cool-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>{{ icon.author }}</span>
              </div>
              <div class="flex items-center space-x-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 text-cool-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>{{ attribution }}</span>
              </div>
            </div>

            <!-- <p
              class="subpixel-antialiased w-full px-2 py-1 tracking-wide leading-tight text-gray-500 dark:text-cool-gray-400 cursor-text select-text"
              style="font-size: 0.625rem"
            >
              <a
                :href="licenseurl"
                target="_blank"
                class="hover:text-green-500 focus:text-green-500"
                >{{ license }}</a
              >
              - {{ attribution }}
              {{ icon.author }}
            </p> -->
          </div>
        </div>
      </button>
    </div>
  </article>
</template>

<script>
export default {
  props: {
    icon: {
      type: Object,
      default() {
        return {}
      },
    },
    clipboard: { type: Boolean, default: true },
  },
  data() {
    return {
      licenses: {
        'cc-0': {
          name: 'CC0',
          attribute: 'No attribution',
          url: 'https://creativecommons.org/publicdomain/zero/1.0/',
        },
        'cc-by-3.0': {
          name: 'CC-BY 3.0 Unported',
          attribute: 'Attribute',
          url: 'https://creativecommons.org/licenses/by/3.0/',
        },
        mit: {
          name: 'MIT',
          attribute: 'No attribution',
          url: 'https://mit-license.org/',
        },
      },
    }
  },
  computed: {
    authorunderscore() {
      return this.icon.author.replace(' ', '_')
    },
    license() {
      return this.licenses[this.icon.license].name
    },
    licenseurl() {
      return this.licenses[this.icon.license].url
    },
    attribution() {
      return this.licenses[this.icon.license].attribute
    },
    fileurl() {
      return (
        '/icons/' +
        this.icon.license +
        '/' +
        this.icon.category +
        '/' +
        this.authorunderscore +
        '/' +
        this.icon.name +
        '.svg'
      )
    },
  },
  methods: {
    forceFileDownload(response, name) {
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', name + '.svg') // or any other extension
      document.body.appendChild(link)
      link.click()
    },
    downloadWithAxios(fileurl, name) {
      this.$axios({
        method: 'get',
        url: fileurl,
        responseType: 'arraybuffer',
      }).then((response) => {
        this.forceFileDownload(response, name)
      })
    },
    copy2clipboard() {
      this.$emit('copy-clipboard', this.icon.name)
      this.copy(this.$refs[this.icon.name])
    },
    clickAction() {
      if (!this.clipboard) {
        // ToDo: this should be inverted
        this.copy2clipboard()
      } else {
        this.downloadWithAxios(this.fileurl, this.icon.name)
      }
    },
    // below functions are from https://blog.tomayac.com/2020/03/20/multi-mime-type-copying-with-the-async-clipboard-api/
    // they perform multi-mime copying to the clipboard
    // in MacOs Preview or Adobe Illustrator an SVG is pasted, in a text editor XML is pasted
    // in GIMP or Power Point the image is pasted
    async toSourceBlob(img) {
      const response = await fetch(img.src)
      const source = await response.text()
      return new Blob([source], { type: 'text/plain' })
    },
    async toOriginBlob(img) {
      const response = await fetch(img.src)
      return await response.blob()
    },
    async toPNGBlob(img) {
      const canvas = new OffscreenCanvas(
        img.naturalWidth * 4,
        img.naturalHeight * 4
      )
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
      return await canvas.convertToBlob()
    },
    async copy(img) {
      const mimeType = img.dataset.mimeType
      let text = null
      if (mimeType === 'image/svg+xml') {
        text = await this.toSourceBlob(img)
      } else {
        text = new Blob([img.alt], { type: 'text/plain' })
      }
      const clipboardData = {
        'text/plain': text,
      }
      clipboardData['image/png'] = await this.toPNGBlob(img)
      if (mimeType !== 'image/png') {
        clipboardData[mimeType] = await this.toOriginBlob(img)
      }
      try {
        await navigator.clipboard.write([new ClipboardItem(clipboardData)]) // eslint-disable-line
      } catch (err) {
        if (err.name === 'NotAllowedError') {
          const disallowedMimeType = err.message.replace(
            /^.*? (\w+\/[^\s]+).*?$/,
            '$1'
          )
          delete clipboardData[disallowedMimeType]

          await navigator.clipboard.write([new ClipboardItem(clipboardData)]) // eslint-disable-line
        }
      }
      // debug.value = JSON.stringify(clipboardData, null, 2)
    },
  },
}
</script>

<style></style>
