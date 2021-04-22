<template>
  <div class="layout">
    <ul>
      <li v-for="serie in series" :key="serie.id">
        <nuxt-link :to="{ name: 'series-seriesUrlSegment', params: serie }">{{ serie.seriesName }}</nuxt-link>
      </li>
    </ul>

    <ul>
      <li v-for="video in seriesVideos" :key="video.id">
        <nuxt-link :to="{ name: 'series-seriesUrlSegment-shortName', params: video }">{{ video.videoTitle }}</nuxt-link>
      </li>
    </ul>

    <ul>
      <li v-for="artist in artists" :key="artist.id">
        <nuxt-link :to="{ name: 'artists-shortName', params: artist }">{{ artist.artistName }}</nuxt-link>
      </li>
    </ul>

    <ul>
      <li v-for="video in videos" :key="video.id">
        <nuxt-link :to="{ name: 'artists-artistUrlSegment-shortName', params: video }">{{ video.videoTitle }}</nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  async asyncData({ app }) {
    const artists = await app.$api('artists')
    const videos = await app.$api('videos')
    const series = await app.$api('series')
    const seriesVideos = videos.filter(video => video.seriesUrlSegment)

    return {
      artists,
      videos,
      series,
      seriesVideos
    }
  },

  head() {
    return {
      title: 'Sitemap'
    }
  }
}
</script>
