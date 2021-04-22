<template>
  <div class="layout">
    <ArtistHeader :artist="getFirst(video, 'artists')" :video="video" v-for="video in highlightedVideos" :key="video.id"/>

    <div class="container">
      <ScrollBox class="trending-artists">
        <div class="card" v-for="video in featuredVideos" :key="video.id">
          <div class="card-image">
            <img :src="getImageUrl(getFirst(video, 'artists'), 'homepageFeature', 335)"/>
          </div>
          <nuxt-link :to="{ name: 'artists-artistUrlSegment-shortName', params: video }" class="card-body">
            <div class="trending-tag">WATCH NOW ON VOD</div>
            <h1>{{ getFirst(video, 'artists').artistName }}</h1>
            <h2>{{ video.videoTitle }}</h2>
            <span class="trending-play">
              <img src="~/assets/img/play.svg"/>
            </span>
          </nuxt-link>
        </div>
      </ScrollBox>

      <div id="ad1"></div>

      <div class="most-popular-upcoming-container">
        <div class="most-popular-container" v-if="mostPopularVideos.length">
          <h1 class="title">Most Popular</h1>
          <div class="most-popular">
            <nuxt-link :to="{ name: 'artists-artistUrlSegment-shortName', params: video }" class="video-card" v-for="video in mostPopularVideos" :key="video.id">
              <div class="video-card-head">
                <img :src="getImageUrl(video, 'videoThumbnail', 425)" class="video-card-image"/>
                <img src="~/assets/img/play.svg" class="video-card-play"/>
              </div>
              <h2>{{ getFirst(video, 'artists').artistName }}</h2>
              <h3>{{ video.videoTitle }}</h3>
            </nuxt-link>
          </div>
        </div>

        <div class="upcoming-container" v-if="upcomingShows.length">
          <h1 class="title">Upcoming Shows</h1>
          <div class="upcoming">
            <div class="upcoming-card" v-for="event in upcomingShows">
              <nuxt-link :to="{ name: 'artists-shortName', params: getFirst(event, 'artists') }" class="upcoming-profile">
                <img :src="getImageUrl(getFirst(event, 'artists'), 'profilePic', 70)"/>
                <div>
                  <span class="upcoming-date">{{ $dateFns.format(event.dateLive, 'MMMM dd') }}</span>
                  <h2>{{ getFirst(event, 'artists').artistName }}</h2>
                  <h3>{{ event.eventTitle }}</h3>
                </div>
              </nuxt-link>

              <Button
                background="transparent"
                @click.native.prevent="showSignupModal(event)"
                v-if="getFirst(event, 'artists').sendinblueIFrame"
                class="upcoming-signup"
              >
                <svg viewBox="0 0 20 22">
                  <path d="M16 7A6 6 0 104 7c0 7-3 9-3 9h18s-3-2-3-9M11.73 20a2 2 0 01-3.46 0" fill="none" stroke="#919599" stroke-width="2"/>
                </svg>
                <div class="upcoming-signup-tooltip">Notify me when show goes live</div>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div class="must-watch" v-if="mustWatchVideos.length">
        <nuxt-link :to="{ name: 'artists-artistUrlSegment-shortName', params: video }" v-for="video in mustWatchVideos" :key="video.id">
          <img :src="getImageUrl(video, 'videoThumbnail')" class="must-watch-cover"/>
          <img src="~/assets/img/play.svg" class="video-card-play"/>
          <span class="must-watch-tag">Must watch</span>
          <div class="must-watch-description">
            <h2>{{ getFirst(video, 'artists').artistName }}</h2>
            <h3>{{ video.videoTitle }}</h3>
          </div>
        </nuxt-link>
      </div>

      <div v-if="latestShows.length">
        <h1 class="title">Latest Shows</h1>
        <div class="latest-shows">
          <nuxt-link :to="{ name: 'artists-artistUrlSegment-shortName', params: video }" class="video-card" v-for="video in latestShows" :key="video.id">
            <div class="video-card-head">
              <img :src="getImageUrl(video, 'videoThumbnail', 425)" class="video-card-image"/>
              <img src="~/assets/img/play.svg" class="video-card-play"/>
            </div>
            <h2>{{ getFirst(video, 'artists').artistName }}</h2>
            <h3>{{ video.videoTitle }}</h3>
          </nuxt-link>
        </div>
      </div>
    </div>

    <SignupModal
      :iframeCode="upcomingSignupModalUrl"
      :isActive="showUpcomingSignupModal"
      @close="showUpcomingSignupModal = false"
    ></SignupModal>

    <Footer :legalLinks="legalLinks"/>
  </div>
</template>

<script>
export default {
  async asyncData({ app }) {
    const events = await app.$api('event')
    const legalLinks = await app.$api('legal')
    const {
      highlightedVideos,
      featuredVideos,
      mostPopularVideos,
      mustWatchVideos
    } = await app.$api('homePage')
    const videos = await app.$api('videos')
    const series = await app.$api('series')

    return {
      events,
      legalLinks: app.$objectMap(legalLinks, app.$pluck('type', 'type_slug')),
      highlightedVideos,
      featuredVideos,
      mostPopularVideos,
      mustWatchVideos,
      videos,
      series
    }
  },

  data() {
    return {
      showUpcomingSignupModal: false,
      upcomingSignupModalUrl: null
    }
  },

  computed: {
    upcomingShows() {
      // http://en.wikipedia.org/wiki/List_of_tz_database_time_zones
      // -4 is New York
      const now = this.convertTimezone(-4)
      const sorted = this.events.sort((a, b) => this.$dateFns.compareAsc(
        this.$dateFns.parseISO(a.dateLive),
        this.$dateFns.parseISO(b.dateLive)
      ))
      return sorted.filter(event => this.prepareDate(event.dateLive) >= now)
    },

    latestShows() {
      // http://en.wikipedia.org/wiki/List_of_tz_database_time_zones
      // -4 is New York
      const now = this.convertTimezone(-4)
      const sorted = this.videos.sort((a, b) => this.$dateFns.compareDesc(
        this.$dateFns.parseISO(a.dateLive),
        this.$dateFns.parseISO(b.dateLive)
      ))
      return sorted.filter(vid => vid.videoType === 'stream' && this.prepareDate(vid.dateLive) < now)
    }
  },

  mounted() {

  },

  beforeDestroy() {

  },

  methods: {
    showSignupModal(event) {
      this.upcomingSignupModalUrl = this.getFirst(event, 'artists').sendinblueIFrame
      this.showUpcomingSignupModal = true
    },

    // Converts local timezone to target timezone
    convertTimezone(timezone) {
      const now = new Date()
      const localTime = now.getTime()
      const localOffset = now.getTimezoneOffset() * 60000
      const utc = localTime + localOffset
      const ret = new Date(utc + 3600000 * timezone)
      return ret.getTime()
    },

    prepareDate(date) {
      const [ y, m, d, h, i ] = date.split(/[-T:]/)
      const ret = new Date(
        parseInt(y, 10),
        parseInt(m, 10) - 1,
        parseInt(d, 10),
        parseInt(h, 10),
        parseInt(i, 10),
        0
      )
      return ret.getTime()
    }
  },

  head() {
    const video = this.highlightedVideos[0] || {}
    const artist = this.getFirst(video, 'artists')
    return {
      title: 'Home',
      meta: [
        { name: 'description', content: video.description },
        { property: 'og:url', content: `${process.env.siteUrl}${this.$route.fullPath}` },
        { property: 'og:title', content: `${artist.artistName} - ${video.videoTitle}` },
        { property: 'og:description', content: video.description },
        { property: 'og:image', content: `${process.env.siteUrl}${this.getImageUrl(artist, 'profilePic')}` }
      ]
    }
  }
}
</script>

<style scoped>
#ad1 {
  height: 90px;
  margin-bottom: 20px;
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
  max-width: 1430px;
  padding: 20px;
  width: 100%;
}

.container .title {
  color: #fff;
  font-size: 28px;
  margin-bottom: 20px;
}

.scroll-box-container {
  padding: 0;
}

.trending-artists {
  margin-bottom: 40px;
  margin-top: -80px;
  position: relative;
  z-index: 100;
}

.card {
  position: relative;
  white-space: normal;
}

.card-image {
  position: relative;
}

.card-image::after {
  bottom: 0;
  content: '';
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 1;
}

.card-image > img {
  display: block;
  filter: grayscale(1);
  height: 240px;
  object-fit: cover;
  width: 170px;
}

.card-body {
  background-color: #00000052;
  bottom: 0;
  color: #fff;
  display: block;
  left: 0;
  padding: 12px 10px;
  position: absolute;
  right: 0;
  text-decoration: none;
  z-index: 100;
}

.card-body h1,
.card-body h2 {
  margin: 0 30px 0 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-body h1 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 2px;
  margin-top: 0px;
}

.card-body h2 {
  font-size: 14px;
  font-weight: normal;
}

.trending-artists .card:nth-child(1) .card-image img {
  filter: grayscale(.5) sepia(.8);
}

.trending-artists .card:nth-child(4) .card-image img {
  filter: grayscale(.5) sepia(.8);
}

.trending-artists .card:nth-child(1) .card-image::after {
  background: rgba(14, 4, 2, .4);
}

.trending-artists .card:nth-child(2) .card-image::after {
  background: rgba(119, 69, 158, .4);
}

.trending-artists .card:nth-child(3) .card-image::after {
  background: rgba(0, 0, 0, .4);
}

.trending-artists .card:nth-child(4) .card-image::after {
  background: rgba(96, 71, 66, .4);
}

.trending-tag {
  text-transform: uppercase;
  font-weight: 500;
  font-size: 12px;
}

.trending-play {
  bottom: 14px;
  height: 30px;
  position: absolute;
  right: 10px;
  width: 30px;
}

.most-popular-upcoming-container {
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
}

.most-popular-container {
  flex-grow: 1;
}

.upcoming-container {
  flex-shrink: 0;
  max-width: 100%;
  width: 320px;
}

.upcoming {
  background: #242b33;
  max-height: 310px;
  overflow-y: auto;
  padding: 30px 20px;
}

.upcoming-card {
  margin-bottom: 25px;
  position: relative;
}

.upcoming-card:last-child {
  margin-bottom: 0;
}

.upcoming-profile {
  align-items: center;
  display: flex;
  margin-right: 40px;
  white-space: nowrap;
}

.upcoming-profile img {
  margin-right: 12px;
  width: 70px;
}

.upcoming-profile > div {
  width: calc(100% - 82px);
}

.upcoming-profile h2 {
  color: #fff;
  font-size: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.upcoming-profile h3 {
  color: #a5a8ab;
  font-size: 14px;
  font-weight: normal;
  overflow: hidden;
  text-overflow: ellipsis;
}

.upcoming-date {
  color: #e1a70b;
  display: block;
  font-size: 13px;
  margin-bottom: 6px;
  text-transform: uppercase;
}

.upcoming-signup {
  padding: 16px 0 16px 16px;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

.upcoming-signup-tooltip {
  background: #4f555b;
  border-radius: 3px;
  bottom: 100%;
  color: #fff;
  font-weight: normal;
  margin-bottom: -6px;
  opacity: 0;
  padding: 12px;
  pointer-events: none;
  position: absolute;
  right: -13px;
  text-align: right;
  transition: opacity ease .3s;
  width: 110px;
}

.upcoming-signup-tooltip::after {
  border-color: #4f555b transparent transparent transparent;
  border-style: solid;
  border-width: 6px 6px 0 6px;
  content: '';
  height: 0;
  margin-top: -1px;
  position: absolute;
  right: 15px;
  top: 100%;
  width: 0;
}

.upcoming-signup:hover .upcoming-signup-tooltip {
  opacity: 1;
}

.upcoming-signup svg {
  margin-right: 0;
}

.upcoming-signup svg path {
  transition: all ease .3s;
}

.upcoming-signup:hover svg path {
  stroke: #e10b16;
}

.latest-shows,
.most-popular {
  display: flex;
  flex-wrap: wrap;
  margin-left: -8px;
  margin-right: -8px;
}

.most-popular .video-card {
  width: 50%;
  width: calc(50% - 16px);
}

.video-card {
  margin-bottom: 20px;
  margin-left: 8px;
  margin-right: 8px;
  max-width: 425px;
}

.video-card-head {
  margin-bottom: 10px;
  padding-top: 56.47%;
  position: relative;
}

.video-card-image {
  border: 2px solid #525155;
  bottom: 0;
  height: 100%;
  left: 0;
  object-fit: cover;
  position: absolute;
  transition: border ease .3s;
  top: 0;
  width: 100%;
}

.video-card-play {
  left: 50%;
  opacity: 0;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  transition: opacity ease .3s;
}

.video-card:hover .video-card-image {
  border-color: #e10b16;
}

.video-card:hover .video-card-play {
  opacity: 1;
}

.video-card h2 {
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.video-card h3 {
  color: #bababb;
  font-size: 14px;
  font-weight: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.latest-shows .video-card {
  width: 50%;
  width: calc(50% - 16px);
}

.must-watch {
  display: flex;
  flex-direction: column;
  margin-bottom: 40px;
  margin-left: -20px;
  margin-right: -20px;
}

.must-watch .video-card-play {
  height: 60px;
  width: 60px;
  z-index: 100;
}

.must-watch a {
  position: relative;
}

.must-watch a::after {
  border: 2px solid #e10b16;
  bottom: 0;
  content: '';
  left: 0;
  opacity: 0;
  position: absolute;
  right: 0;
  top: 0;
  transition: opacity ease .3s;
}

.must-watch a:hover::after {
  opacity: 1;
}

.must-watch a:hover .video-card-play {
  opacity: 1;
}

.must-watch-tag {
  color: rgba(255,255,255,.8);
  left: 20px;
  letter-spacing: 1px;
  position: absolute;
  text-transform: uppercase;
  top: 20px;
}

.must-watch-description {
  background: #00000052;
  bottom: 0;
  left: 0;
  padding: 16px 20px;
  position: absolute;
  right: 0;
}

.must-watch-description h2 {
  color: #fff;
  font-size: 26px;
  margin-bottom: 2px;
}

.must-watch-description h3 {
  color: #fff;
  font-size: 18px;
}

.must-watch-cover {
  height: 200px;
  object-fit: cover;
  width: 100%;
}

@media (min-width: 768px) {
  .trending-artists {
    margin-top: -100px;
  }

  .trending-tag {
    font-size: 15px;
    font-weight: 500;
    text-transform: uppercase;
  }

  .card-image > img {
    height: 480px;
    width: 335px;
  }

  .card-body {
    padding: 22px 30px;
  }

  .card-body h1 {
    font-size: 22px;
    margin-bottom: 8px;
    margin-top: 22px;
  }

  .card-body h2 {
    font-size: 16px;
    font-weight: normal;
  }

  .trending-play {
    bottom: 34px;
    right: 30px;
  }

  .most-popular-upcoming-container {
    flex-direction: row;
  }

  .upcoming-container {
    margin-left: 30px;
  }

  .upcoming {
    height: 100%;
    max-height: 536px;
  }

  .latest-shows,
  .most-popular {
    margin-left: -15px;
    margin-right: -15px;
  }

  .most-popular .video-card {
    width: calc(50% - 30px);
  }

  .video-card {
    margin-bottom: 30px;
    margin-left: 15px;
    margin-right: 15px;
  }

  .video-card h2 {
    font-size: 20px;
    margin-bottom: 4px;
  }

  .latest-shows .video-card {
    width: 30%;
    width: calc(33.3333% - 30px);
  }

  .must-watch {
    flex-direction: row;
  }

  .must-watch a {
    width: 50%;
  }

  .must-watch-tag {
    left: 50px;
    top: 50px;
  }

  .must-watch-description {
    padding: 40px 50px;
  }

  .must-watch-cover {
    height: 410px;
  }

  .must-watch-description h2 {
    font-size: 34px;
  }

  .must-watch-description h3 {
    font-size: 20px;
  }
}

@media (min-width: 1105px) {
  #ad1 {
    margin-bottom: 25px;
  }

  .container {
    padding: 30px 45px;
  }

  .container .title {
    font-size: 34px;
    margin-bottom: 25px;
  }

  .must-watch {
    margin-left: -45px;
    margin-right: -45px;
  }

  .upcoming-container {
    width: 420px;
  }

  .upcoming-profile h2 {
    font-size: 20px;
  }
}
</style>
