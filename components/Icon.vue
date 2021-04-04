<template>
  <article class="pb-full relative">
    <div class="absolute inset-0">
      <button
        class="block w-full h-full focus:outline-none group relative"
        aria-label="Click to Copy Agitator as SVG"
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
              v-lazy-load
            />
          </div>
        </div>
        <div class="p-4 absolute inset-x-0 bottom-0">
          <div class="-mx-2 -my-1 flex flex-row flex-wrap justify-center">
            <p
              class="subpixel-antialiased w-full px-2 py-1 tracking-wide leading-tight text-cool-gray-600 dark:text-cool-gray-400 cursor-text select-text"
              style="font-size: 0.8125rem"
            >
              {{ icon.name }}
            </p>
            <p
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
            </p>
          </div>
        </div>
      </button>
    </div>
  </article>
</template>

<script>
export default {
  props: ['icon', 'clipboard'],
  data() {
    return {
      licenses: {
        'cc-0': {
          name: 'CC-0',
          attribute: 'No attribution',
          url: 'https://creativecommons.org/publicdomain/zero/1.0/',
        },
        'cc-by-3.0': {
          name: 'CC-BY 3.0 Unported',
          attribute: 'Attribute',
          url: 'https://creativecommons.org/licenses/by/3.0/',
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
      })
        .then((response) => {
          this.forceFileDownload(response, name)
        })
        .catch(() => console.log('error occured'))
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
    // ToDo: Detect browser and download directly in firefox
    // below functions are from https://blog.tomayac.com/2020/03/20/multi-mime-type-copying-with-the-async-clipboard-api/
    // they perform multi-mime copying to the clipboard
    // in MacOs Preview or Adobe Illustrator an SVG is pasted, in a text editor XML is pasted
    // in GIMP or Power Point the image is pasted
    // https://github.com/ICJIA/vue-browser-detect-plugin
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
        console.warn(err.name, err.message)
        if (err.name === 'NotAllowedError') {
          const disallowedMimeType = err.message.replace(
            /^.*? (\w+\/[^\s]+).*?$/,
            '$1'
          )
          delete clipboardData[disallowedMimeType]

          await navigator.clipboard.write([new ClipboardItem(clipboardData)]) // eslint-disable-line
        }
      }
      console.log(clipboardData)
      // debug.value = JSON.stringify(clipboardData, null, 2)
    },
  },
}
</script>

<style></style>
