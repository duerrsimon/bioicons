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
              class="h-3/5 w-auto pb-6"
              crossorigin
              data-mime-type="image/svg+xml"
              :alt="icon.name"
              :data-src="
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
      </button>
      <div class="p-4 absolute inset-x-0 bottom-0">
        <div class="-mx-2 flex flex-row flex-wrap justify-center">
          <p
            class="subpixel-antialiased text-center w-full px-2 py-1 text-base sm:text-sm tracking-wide leading-tight text-cool-gray-600 dark:text-cool-gray-400 cursor-text select-text"
          >
            {{ icon.name }}
          </p>
          <div
            class="flex justify-center tracking-wide text-base sm:text-sm md:text-xs leading-tight text-cool-gray-600 dark:text-cool-gray-400 cursor-text select-text pt-1 space-x-2"
          >
            <div class="flex-initial flex items-center space-x-1">
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
                class="hover:text-green-500 focus:text-green-500 license"
                rel="noopener noreferrer"
                >{{ license }}</a
              >
            </div>
            <div
              class="flex-initial flex items-center justify-center space-x-1"
            >
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
              <span
                ><a
                  class="hover:text-green-500 focus:text-green-500 license"
                  rel="noopener noreferrer"
                  target="_blank"
                  :href="authors[icon.author]"
                  >{{ icon.author }}</a
                ></span
              >
            </div>
            <div class="flex-1 flex items-center space-x-1 attribution">
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
              <button
                id="how-to-attribute"
                class="hover:text-green-500 focus:text-green-500"
                @click="showLicense()"
              >
                Attribution?
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showTooltip"
      class="absolute w-full h-full z-10"
      role="dialog"
      aria-labelledby="how-to-attribute"
      aria-modal="true"
    >
      <div
        class="bg-gray-600 h-full text-white text-sm rounded right-0 bottom-full"
      >
        <span class="bg-gray-700 py-2 w-full block text-center"
          >{{ icon.name }} is licensed under {{ license }}</span
        >
        <div class="p-3 text-left text-sm my-auto">
          <span class="text-center block">This work is free to:</span>
          <ul class="text-sm">
            <li><b>Share</b> - copy and redistribute in any medium</li>
            <li><b>Adapt</b> - Make modifcations and remix</li>
          </ul>
          <span class="text-center block mt-2"
            >under the following terms:
          </span>
          <ul class="text-sm">
            <li v-for="m in licenses[icon.license].modules" :key="m">
              <b>{{ licenseModules[m].name }}</b> - {{ licenseModules[m].desc }}
            </li>
            <!-- <li>
              <b>Share Alike</b> - Any modifications must also be licensed under
              {{ license }}
            </li> -->
          </ul>

          <div class="flex items-center mt-2 justify-center space-x-1">
            <button
              class="p-2 text-xs border border-white hover:bg-white hover:text-gray-700"
              aria-label="Copy attribution to clipboard"
              @click="copyAndClose"
            >
              Copy attribution to clipboard
            </button>
            <button
              class="p-2 text-xs border border-white hover:bg-white hover:text-gray-700"
              aria-label="Close"
              @click="showTooltip = false"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<script>
// import { createPopper } from '@popperjs/core'

export default {
  props: {
    icon: {
      type: Object,
      default() {
        return {}
      },
    },
    authors: {
      type: Object,
      default() {
        return {}
      },
    },
    clipboard: { type: Boolean, default: true },
  },
  data() {
    return {
      showTooltip: false,
      licenses: {
        'cc-0': {
          name: 'CC0',
          modules: ['nocopyright'],
          url: 'https://creativecommons.org/publicdomain/zero/1.0/',
        },
        'cc-by-3.0': {
          name: 'CC-BY 3.0 Unported',
          modules: ['by'],
          url: 'https://creativecommons.org/licenses/by/3.0/',
        },
        'cc-by-4.0': {
          name: 'CC-BY 4.0 Unported',
          modules: ['by'],
          url: 'https://creativecommons.org/licenses/by/4.0/',
        },
        'cc-by-sa-4.0': {
          name: 'CC-BY SA 4.0',
          modules: ['by', 'sa'],
          url: 'https://creativecommons.org/licenses/by-sa/4.0/',
        },
        'cc-by-sa-3.0': {
          name: 'CC-BY SA 3.0',
          modules: ['by', 'sa'],
          url: 'https://creativecommons.org/licenses/by-sa/3.0/',
        },
        mit: {
          name: 'MIT',
          modules: ['retaincopyrightnotice'],
          url: 'https://mit-license.org/',
        },
        bsd: {
          name: 'BSD',
          modules: ['retaincopyrightnotice', 'noendorsement'],
          url: 'https://opensource.org/licenses/BSD-3-Clause',
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
    attributionText() {
      return (
        this.icon.name +
        ' icon by ' +
        this.icon.author +
        ' ' +
        this.authors[this.icon.author] +
        ' is licensed under ' +
        this.license +
        ' ' +
        this.licenseurl
      )
    },
    licenseModules() {
      return {
        nocopyright: {
          name: 'No restrictions',
          desc:
            'Public domain, no attribution or credit necessary but appreciated.',
        },
        by: {
          name: 'Attribution',
          desc:
            'Give credit to ' +
            this.icon.author +
            ' in the figure caption or acknowledgements, link the license and indicate changes. Do not suggest endorsement.',
        },
        sa: {
          name: 'Share Alike',
          desc: 'Any modifications must also be licensed under ' + this.license,
        },
        retaincopyrightnotice: {
          name: 'Retain Copyright Notice',
          desc:
            'Include COPYRIGHT 2020 ' +
            this.authorunderscore +
            ' and include license file',
        },
        noendorsement: {
          name: 'No endorsement',
          desc:
            'Do not promote or endorse products using the name of the copyright holder',
        },
      }
    },
  },
  mounted() {},
  methods: {
    copyAndClose() {
      this.showTooltip = false
      this.copyTextToClipboard(this.attributionText)
    },
    copyTextToClipboard(text) {
      const textArea = document.createElement('textarea')
      textArea.style.position = 'fixed'
      textArea.style.top = 0
      textArea.style.left = 0
      textArea.style.width = '2em'
      textArea.style.height = '2em'
      textArea.style.padding = 0
      textArea.style.border = 'none'
      textArea.style.outline = 'none'
      textArea.style.boxShadow = 'none'
      textArea.style.background = 'transparent'
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      try {
        const successful = document.execCommand('copy')
        if (successful) {
          this.$notify(
            {
              text: 'Copied attribution to clipboard',
              type: 'info',
            },
            2000
          )
        }
      } catch (err) {
        this.$notify(
          {
            text: 'Could not copy attribution to clipboard',
            type: 'info',
          },
          2000
        )
      }
      document.body.removeChild(textArea)
    },
    showLicense() {
      this.showTooltip = !this.showTooltip
    },
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
      /* eslint-disable */
      let canvas = new OffscreenCanvas(img.naturalWidth, img.naturalHeight)
      if (this.icon.author == 'Servier') {
        // hack to make Servier images bigger
        canvas = new OffscreenCanvas(
          img.naturalWidth * 4,
          img.naturalHeight * 4
        )
      }
      /* eslint-enable */
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = 'white'
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
