<template>
  <div class="signup-modal" :class="{ 'is-active': isActive }" @click.self="$emit('close')">
    <div class="signup-container">
      <button @click="$emit('close')">
        <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg"><g stroke="#FFF" stroke-width="2" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"><path d="M11 1L1 11M1 1l10 10"/></g></svg>
      </button>
      <div class="signup-frame-container" v-html="iframeCode"/>
    </div>
  </div>
</template>

<script>
export default {
  props: [ 'isActive', 'iframeCode' ]
}
</script>

<style scoped>
.signup-modal {
  align-items: flex-start;
  background: rgba(0,0,0,.5);
  bottom: 0;
  display: none;
  justify-content: center;
  left: 0;
  overflow: auto;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 998;
}

.signup-modal.is-active {
  display: flex;
}

.signup-container {
  height: 100%;
  margin-left: auto;
  margin-right: auto;
  max-width: 520px;
  position: relative;
  width: 100%;
}

.signup-frame-container {
  height: 100%;
}

.signup-frame-container >>> iframe {
  display: block;
  height: 100%;
  width: 100%;
}

.signup-modal button {
  align-items: center;
  background: #e10b16;
  border-radius: 32px;
  display: flex;
  height: 32px;
  justify-content: center;
  position: absolute;
  right: 6px;
  top: 24px;
  width: 32px;
  z-index: 1000;
}
</style>
