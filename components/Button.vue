<template>
  <div>
    <a
      v-if="/^https?:\/\//.test(to)"
      :href="to"
      target="_blank"
    >
      <slot/>
    </a>

    <nuxt-link
      v-else
      :to="to || ''"
      :style="{
        '--background-color': background,
        '--text-color': color
        }"
    >
      <slot/>
    </nuxt-link>
  </div>
</template>

<script>
export default {
  props: [
    'background',
    'color',
    'to'
  ]
}
</script>

<style scoped>
a {
  align-items: center;
  background: #e10b16;
  background: var(--background-color, #e10b16);
  border: 0;
  border-radius: 3px;
  color: #fff;
  color: var(--text-color, #fff);
  display: inline-flex;
  font-size: 12px;
  font-weight: bold;
  margin-left: 0;
  margin-right: 0;
  padding: 12px 16px;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  width: auto;
}

a >>> img,
a >>> svg {
  margin-right: 16px;
  width: 16px;
}
</style>
