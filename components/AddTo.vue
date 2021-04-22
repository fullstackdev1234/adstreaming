<template>
  <div class="add-to" v-if="appleMusic || amazonMusic || spotify">
    <span class="short-label">Add to:</span>
    <span class="long-label">Add this song to your playlist using:</span>

    <a v-if="appleMusic" :href="appleMusic" @click="trackEvent('Apple')" target="_blank">
      <img src="~/assets/img/add-to-apple-music.svg" />
    </a>
    <a v-if="amazonMusic" :href="amazonMusic" class="amazon-music" @click="trackEvent('Amazon')" target="_blank">
      <img src="~/assets/img/add-to-amazon-music.svg" />
    </a>
    <a v-if="spotify" :href="spotify" class="spotify" @click="trackEvent('Spotify')" target="_blank">
      <img src="~/assets/img/add-to-spotify.svg" />
    </a>
  </div>
</template>

<script>
export default {
  props: [ 'appleMusic', 'amazonMusic', 'spotify' ],

  methods: {
    trackEvent(label) {
      this.$ga.event({
        eventCategory: 'Music Dsp',
        eventAction: 'Click',
        eventLabel: label
      })
    }
  }
}
</script>

<style scoped>
.add-to {
  align-items: center;
  color: #8c8b8e;
  display: flex;
  font-size: 16px;
  font-weight: bold;
  justify-content: space-between;
}

.add-to a {
  flex-shrink: 0;
}

.add-to img {
  width: 100%;
}

.apple-music {
  width: 72px;
}

.amazon-music {
  width: 45px;
}

.spotify {
  width: 80px;
}

.long-label {
  display: none;
}

@media (min-width: 768px) and (max-width: 1104px) {
  .short-label {
    display: none;
  }

  .long-label {
    display: block;
  }

  .apple-music {
    width: 97px;
  }

  .amazon-music {
    width: 50px;
  }

  .spotify {
    width: 110px;
  }
}
</style>
