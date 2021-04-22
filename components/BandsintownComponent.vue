<template>
  <div id="bandsintown-feed" class="tour-container" v-show="tour">
    <a
      class="bit-widget-initializer"
      :data-artist-name="bandsintownId"
      data-display-local-dates="false"
      data-display-past-dates="false"
      data-auto-style="false"
      data-text-color="#fff"
      data-link-color="#E10C16"
      data-background-color="rgba(0,0,0,0)"
      data-display-limit="5"
      data-display-start-time="false"
      data-display-lineup="false"
      data-display-play-my-city="true"
      data-separator-color="#494f56"
      ></a>
  </div>
</template>

<script>

export default {
  props: ['tour'],
  computed: {
    bandsintownId () {
      return `id_${this.tour}`
    }
  },

  head() {
    return {
      script: [
        {
          src: 'https://widget.bandsintown.com/main.min.js',
          hid: 'bandsintown'
        }
      ]
    }
  }
}
</script>
