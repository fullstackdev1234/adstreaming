<template>
  <div class="layout artist-page">
    <ArtistHeader
      :artist="artist"
      :video="currentVideo"
      :shouldRedirectWhenLive="true"
      :class="{ 'has-you-might-like': videos.length }"
    />

    <ScrollBox class="you-might-like" v-if="videos.length">
      <nuxt-link :to="{ name: 'artists-artistUrlSegment-shortName', params: video }" class="card" v-for="video in videos" :key="video.id">
        <div class="card-image">
          <img :src="getImageUrl(video, 'videoThumbnail', 290)"/>
        </div>
        <div class="card-details">
          <h1 class="card-subtitle">{{ artist.artistName }}</h1>
          <h2 class="card-title">{{ video.videoTitle }}</h2>
        </div>
      </nuxt-link>
    </ScrollBox>

    <div class="container">
      <div class="merch" v-if="merchandise.length">
        <h1>{{ artist.artistName }}'{{ artist.artistName[artist.artistName.length - 1] === 's' ? '' : 's' }} Merch</h1>

        <ScrollBox class="merch-box">
          <a :href="merch.link" class="card" target="_blank" v-for="merch in merchandise" :key="merch.id">
            <div class="card-image">
              <img :src="getImageUrl(merch, 'photo', 220)"/>
            </div>
            <div class="card-details">
              <div class="merch-description">
                <h1 class="merch-title">{{ merch.title }}</h1>
                <div class="merch-price">${{ merch.price }}</div>
              </div>
              <span class="merch-button">Buy Now</span>
            </div>
          </a>
        </ScrollBox>
      </div>

      <div class="bio">
        <div id="ad1"></div>

        <h1>About {{ artist.artistName }}</h1>

        <ul class="bio-links">
          <li v-for="link in links" v-if="artist[link.key]">
            <a :href="artist[link.key]" target="_blank">{{ link.label }}</a>
          </li>
        </ul>

        <ul class="bio-data">
          <li><b>Origin:</b> {{ artist.origin }}</li>
          <li><b>Genres:</b> {{ artist.genre }}</li>
          <li><b>Years Active:</b> {{ artist.activeYearStart }} - present</li>
        </ul>

        <div v-html="artist.bio"></div>

        <div id="ad2"></div>
      </div>
    </div>

    <Footer :legalLinks="legalLinks"/>
  </div>
</template>

<script>
import marked from 'marked'

export default {
  async asyncData({ app, params }) {
    const legalLinks = await app.$api('legal')
    const data = await app.$api('artists')
    const artist = data.find(p => p.shortName === params.shortName)
    artist.bio = marked(artist.bio || '')

    const videoData = await app.$api('videos')
    const videos = videoData
      .filter(vid => vid.artists.find(a => a.id === artist.id))
      .sort((a, b) => app.$dateFns.compareDesc(
        app.$dateFns.parseISO(a.dateLive),
        app.$dateFns.parseISO(b.dateLive)
      ))
    const currentVideo = videos.shift() || {}

    const merchData = await app.$api('merch')
    const merchandise = merchData.filter(merch => merch.artists.find(a => a.id === artist.id))

    return {
      legalLinks: app.$objectMap(legalLinks, app.$pluck('type', 'type_slug')),
      artist,
      currentVideo,
      videos,
      merchandise
    }
  },

  data() {
    return {
      links: [
        { key: 'webUrl', label: 'Website' },
        { key: 'twitterUrl', label: 'Twitter' },
        { key: 'instagramUrl', label: 'Instagram' },
        { key: 'facebookUrl', label: 'Facebook' },
        { key: 'snapchatUrl', label: 'Snapchat' },
        { key: 'tiktokUrl', label: 'Tiktok' },
      ]
    }
  },

  mounted() {
  },

  beforeDestroy() {
  },

  head() {
    return {
      title: this.artist.artistName,
      meta: [
        { name: 'description', content: this.currentVideo.description },
        { property: 'og:url', content: `${process.env.siteUrl}${this.$route.fullPath}` },
        { property: 'og:title', content: `${this.artist.artistName} - ${this.currentVideo.videoTitle}` },
        { property: 'og:description', content: this.currentVideo.description },
        { property: 'og:image', content: `${process.env.siteUrl}${this.getImageUrl(this.artist, 'profilePic')}` }
      ]
    }
  }
}
</script>

<style scoped>
#ad1 {
  margin-bottom: 30px;
}

#ad2 {
  height: 90px;
  margin-top: 30px;
}

.artist-page .header {
  padding-bottom: 75px;
}

.header.has-you-might-like {
  padding-bottom: 170px;
}

.container,
.scroll-box-container {
  padding: 20px;
}

.you-might-like {
  margin-top: -180px;
  position: relative;
  z-index: 100;
}

.you-might-like >>> .scroll-box {
  margin-right: -20px;
}

.you-might-like .card {
  margin-right: 10px;
  position: relative;
}

.you-might-like .card-image {
  height: 140px;
  overflow: hidden;
  position: relative;
  width: 246px;
}

.you-might-like .card-image::after {
  background-image: linear-gradient(to top, #000, rgba(0,0,0,0) 50%);
  content: '';
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 4;
}

.you-might-like .card-image img {
  height: 100%;
  object-fit: cover;
  width: 100%;
}

.you-might-like .card-details {
  bottom: 0;
  left: 0;
  padding: 15px;
  position: absolute;
  right: 0;
  z-index: 5;
}

.you-might-like .card-subtitle {
  color: #888584;
  font-size: 11px;
  margin-bottom: 5px;
}

.you-might-like .card-title {
  color: #fff;
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bio-links {
  font-size: 14px;
  list-style: none;
  margin-bottom: 25px;
  padding: 0;
}

.bio-links a {
  color: #9c9c9d;
}

.bio-data {
  color: #9c9c9d;
  display: flex;
  flex-direction: column;
  font-size: 12px;
  list-style: none;
  padding: 0 0 25px;
}

.bio-data li {
  margin-bottom: 8px;
  margin-right: 20px;
}

.bio-data b {
  color: #fff;
}

.bio {
  color: #fff;
  position: relative;
}

.bio h1 {
  font-size: 23px;
  margin-bottom: 18px;
}

.bio >>> p {
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 15px;
  margin-top: 0;
}

.merch {
  margin-bottom: 30px;
}

.merch .merch-box {
  margin-right: -20px;
  padding: 0;
}

.merch > h1 {
  color: #fff;
  font-size: 22px;
  margin-bottom: 10px;
}

.merch .card {
  color: #fff;
  font-size: 15px;
  margin-right: 20px;
}

.merch .card-image {
  height: 220px;
  width: 220px;
}

.merch .card-image > img {
  display: block;
  height: 100%;
  object-fit: contain;
  width: 100%;
}

.merch-description {
  align-items: center;
  display: flex;
  margin-bottom: 20px;
}

.merch-title {
  font-weight: normal;
  flex-grow: 1;
  height: 45px;
  margin-right: 12px;
  overflow: hidden;
  white-space: normal;
}

.merch-price {
  flex-shrink: 0;
  font-weight: bold;
  text-align: right;
}

.merch-button {
  background: transparent;
  border: 2px solid #e10b16;
  border-radius: 3px;
  color: #fff;
  display: block;
  font-size: 15px;
  font-weight: bold;
  padding: 10px 32px;
  text-align: center;
  text-decoration: none;
  transition: all .3s ease;
  width: 100%;
}

.merch-button:hover {
  background: #e10b16;
}

@media (min-width: 768px) {
  #ad1 {
    margin: 0;
    position: absolute;
    right: 0;
    top: 0;
  }

  .artist-page .header {
    padding-bottom: 40px;
  }

  .container,
  .scroll-box-container {
    padding: 30px 20px;
  }

  .info {
    font-size: 15px;
    margin-bottom: 22px;
    width: 52%;
  }

  .bio {
    min-height: 520px;
    position: relative;
    padding-right: 340px;
  }

  .bio-data {
    flex-direction: row;
  }

  .bio-data li {
    margin-bottom: 0;
  }
}

@media (min-width: 1105px) {
  .header.has-you-might-like {
    padding-bottom: 200px;
  }

  .container,
  .scroll-box-container {
    padding: 30px 45px;
  }

  .you-might-like {
    margin-top: -220px;
  }

  .you-might-like >>> .scroll-box {
    margin-right: -45px;
  }

  .you-might-like .card {
    margin-right: 20px;
  }

  .you-might-like .card-image {
    height: 160px;
    width: 290px;
  }

  .merch .merch-box {
    margin-right: -45px;
  }

  .merch >>> .scroll-box {
    margin-left: -20px;
    padding: 20px;
  }

  .merch .card {
    margin-right: 15px;
    position: relative;
    transition: transform .3s ease;
  }

  .merch .card:hover {
    box-shadow: 0 5px 8px 5px rgba(0,0,0,.5);
    transform: scale(1.05);
    z-index: 1000;
  }

  .merch .card:hover .card-details {
    opacity: 1;
  }

  .merch .card-image {
    height: 195px;
    width: 185px;
  }

  .merch .card-details {
    background: rgba(57, 64, 71, .8);
    bottom: 0;
    left: 0;
    opacity: 0;
    padding: 20px 30px;
    position: absolute;
    right: 0;
    text-align: center;
    top: 0;
    transition: opacity .3s ease;
  }

  .merch-description {
    flex-direction: column;
  }

  .merch-title {
    margin-bottom: 30px;
    text-align: center;
    width: 100%;
  }

  .merch-price {
    text-align: center;
  }

  .merch-button {
    border: 0;
    bottom: 0;
    color: #e10b16;
    font-size: 12px;
    left: 0;
    position: absolute;
    right: 0;
    text-transform: uppercase;
  }

  .merch-button:hover {
    background: none;
  }
}
</style>
