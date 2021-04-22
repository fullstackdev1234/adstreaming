<template>
  <div class="layout">
    <SeriesHeader
      :series="series"
      :video="heroVideo"
      :shouldRedirectWhenLive="true"
    />

    <div class="container">
      <div class="featured-events">
        <ScrollBox
          title="Lineup"
          :showNavigation="true"
        >
          <nuxt-link
            :to="
              event.video.artists != null ?
              { name: 'series-seriesUrlSegment-shortName', params: event.video } :
              ''
            "
            class="card"
            v-for="event in featuredEvents"
            :key="event.id"
          >
            <div class="card-image">
              <img :src="getImageUrl(event, 'videoThumbnail', 308)"/>
            </div>

            <div class="card-tag tag-upcoming" v-if="event.video.artists == null">upcoming</div>
            <div class="card-tag tag-live" v-if="event.video.artists != null">watch now</div>

            <div class="card-details">
              <h3 class="card-date">{{ event.dateDescription }}</h3>
              <h2 class="card-title">{{ event.eventTitle }}</h2>
              <h1 class="card-subtitle">{{ getFirst(event, 'artists').artistName }}</h1>
              <span class="trending-play" v-if="event.video">
                <img src="~/assets/img/play.svg"/>
              </span>
            </div>
          </nuxt-link>
        </ScrollBox>
      </div>

      <div class="featured-clips" v-if="previousShows.length">
        <ScrollBox
          title="Previous Shows"
          :showNavigation="true"
        >
          <nuxt-link :to="{ name: 'series-seriesUrlSegment-shortName', params: video }" class="card" v-for="video in previousShows" :key="video.id">
            <div class="card-image">
              <img :src="getImageUrl(video, 'videoThumbnail', 290)"/>
            </div>
            <div class="card-details">
              <h1 class="card-subtitle">{{ getFirst(video, 'artists').artistName }}</h1>
              <h2 class="card-title">{{ video.videoTitle }}</h2>
            </div>
          </nuxt-link>
        </ScrollBox>
      </div>

      <div class="featured-clips" v-if="featuredClips.length">
        <ScrollBox
          title="Featured Clips"
          :showNavigation="true"
        >
          <nuxt-link :to="{ name: 'artists-artistUrlSegment-shortName', params: video }" class="card" v-for="video in featuredClips" :key="video.id">
            <div class="card-image">
              <img :src="getImageUrl(video, 'videoThumbnail', 290)"/>
            </div>
            <div class="card-details">
              <h1 class="card-subtitle">{{ getFirst(video, 'artists').artistName }}</h1>
              <h2 class="card-title">{{ video.videoTitle }}</h2>
            </div>
          </nuxt-link>
        </ScrollBox>
      </div>

      <div id="ad1"></div>
    </div>

    <Footer :legalLinks="legalLinks"/>
  </div>
</template>

<script>
export default {
  async asyncData({ app, params }) {
    const legalLinks = await app.$api('legal')
    const seriesData = await app.$api('series')
    const series = seriesData.find(s => s.seriesUrlSegment === params.seriesUrlSegment)

    return {
      legalLinks: app.$objectMap(legalLinks, app.$pluck('type', 'type_slug')),
      series,
      heroVideo: series.heroVideo || {},
      featuredEvents: series.eventLineup || [],
      previousShows: series.previousShows || [],
      featuredClips: series.featuredClips || []
    }
  },

  mounted() {
  },

  beforeDestroy() {
  },

  head() {
    return {
      title: `${this.series.seriesName} - ${this.heroVideo.videoTitle}`,
      meta: [
        { name: 'description', content: this.series.description },
        { property: 'og:url', content: `${process.env.siteUrl}${this.$route.fullPath}` },
        { property: 'og:title', content: `${this.series.seriesName} - ${this.heroVideo.videoTitle}` },
        { property: 'og:description', content: this.series.description },
        { property: 'og:image', content: `${process.env.siteUrl}${this.getImageUrl(this.series, 'coverPhoto')}` }
      ]
    }
  }
}
</script>

<style scoped>
#ad1 {
  height: 90px;
  margin-top: 40px;
}

.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.container {
  flex-grow: 1;
  margin-left: auto;
  margin-right: auto;
  padding: 20px;
  width: 100%;
}

.scroll-box-container {
  padding: 0;
}

.featured-events {
  margin-bottom: 80px;
  margin-right: -20px;
  margin-top: -120px;
  position: relative;
  z-index: 100;
}

.featured-clips .card,
.featured-events .card {
  margin-right: 10px;
  position: relative;
}

.featured-clips .card-image,
.featured-events .card-image {
  height: 140px;
  overflow: hidden;
  position: relative;
  width: 246px;
}

.featured-events .card-image {
  height: 246px;
}

.featured-clips .card-image::after,
.featured-events .card-image::after {
  background-image: linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.6) 40%, rgba(0,0,0,0) 100%);
  content: '';
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 4;
}

.featured-clips .card-image::after {
  background-image: linear-gradient(to top, #000, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0) 100%);
}

.featured-clips .card-image img,
.featured-events .card-image img {
  height: 100%;
  object-fit: cover;
  width: 100%;
}

.featured-clips .card-details,
.featured-events .card-details {
  bottom: 0;
  left: 0;
  padding: 15px;
  position: absolute;
  right: 0;
  z-index: 5;
}

.featured-events .card-tag {
  border-radius: 4px;
  color: #fff;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 1px;
  padding: 6px 11px;
  position: absolute;
  right: 10px;
  text-transform: uppercase;
  top: 10px;
}

.tag-upcoming {
  background-color: #e17e0b;
}

.tag-live {
  background-color: rgba(255, 255, 255, .4);
}

.featured-events .card-date {
  color: #fff;
  font-size: 12px;
  font-weight: normal;
  margin-bottom: 5px;
  text-transform: uppercase;
}

.featured-events .card-subtitle {
  color: #888584;
  font-size: 14px;
  font-weight: normal;
}

.featured-events .card-title {
  color: #fff;
  font-size: 18px;
  margin-bottom: 5px;
  margin-right: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.trending-play {
  bottom: 14px;
  height: 30px;
  position: absolute;
  right: 10px;
  width: 30px;
}

.featured-clips {
  background: #242326;
  padding: 25px 0 25px 25px;
  position: relative;
  z-index: 100;
}

.featured-clips {
  margin-right: -20px;
}

.featured-clips + .featured-clips {
  margin-top: 80px;
}

.featured-clips .card-subtitle {
  color: #898a89;
  font-size: 14px;
  font-weight: normal;
  margin-bottom: 5px;
}

.featured-clips .card-title {
  color: #fff;
  font-size: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (min-width: 768px) {
  .featured-events {
    margin-top: -160px;
  }

  .trending-play {
    bottom: 34px;
    right: 20px;
  }
}

@media (min-width: 1105px) {
  .container {
    padding: 30px 45px;
  }

  .featured-clips,
  .featured-events {
    margin-right: -45px;
  }

  .featured-events .card {
    margin-right: 20px;
  }

  .featured-events .card-image {
    height: 308px;
    width: 308px;
  }

  .featured-clips .card {
    margin-right: 20px;
  }

  .featured-clips .card-image {
    height: 160px;
    width: 290px;
  }
}
</style>
