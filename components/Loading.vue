<template>
  <transition name="fade">
    <div v-show="loading" class="fixed bottom-0 w-full z-50 mb-2">
      <div
        class="w-32 mx-auto text-center p-2 text-white rounded space-x-2 justify-center bg-gray-700 flex items-center"
      >
        <svg
          class="w-4 h-4"
          viewBox="0 0 105 105"
          xmlns="http://www.w3.org/2000/svg"
          fill="#fff"
        >
          <circle cx="12.5" cy="12.5" r="12.5">
            <animate
              attributeName="fill-opacity"
              begin="0s"
              dur="1s"
              values="1;.2;1"
              calcMode="linear"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="12.5" cy="52.5" r="12.5" fill-opacity=".5">
            <animate
              attributeName="fill-opacity"
              begin="100ms"
              dur="1s"
              values="1;.2;1"
              calcMode="linear"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="52.5" cy="12.5" r="12.5">
            <animate
              attributeName="fill-opacity"
              begin="300ms"
              dur="1s"
              values="1;.2;1"
              calcMode="linear"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="52.5" cy="52.5" r="12.5">
            <animate
              attributeName="fill-opacity"
              begin="600ms"
              dur="1s"
              values="1;.2;1"
              calcMode="linear"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="92.5" cy="12.5" r="12.5">
            <animate
              attributeName="fill-opacity"
              begin="800ms"
              dur="1s"
              values="1;.2;1"
              calcMode="linear"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="92.5" cy="52.5" r="12.5">
            <animate
              attributeName="fill-opacity"
              begin="400ms"
              dur="1s"
              values="1;.2;1"
              calcMode="linear"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="12.5" cy="92.5" r="12.5">
            <animate
              attributeName="fill-opacity"
              begin="700ms"
              dur="1s"
              values="1;.2;1"
              calcMode="linear"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="52.5" cy="92.5" r="12.5">
            <animate
              attributeName="fill-opacity"
              begin="500ms"
              dur="1s"
              values="1;.2;1"
              calcMode="linear"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="92.5" cy="92.5" r="12.5">
            <animate
              attributeName="fill-opacity"
              begin="200ms"
              dur="1s"
              values="1;.2;1"
              calcMode="linear"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
        <span class="text-cool-gray-200"> Loading</span>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: true,
    },
  },
}
</script>
