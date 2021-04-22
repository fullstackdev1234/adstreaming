<template>
  <div class="layout">
    <Logo/>

    <div class="player-container">
      <div class="video-js-responsive-container vjs-hd">
        <video 
        id="videojs-vast-vpaid-waterfall-player" 
        class="video-js vjs-default-skin vjs-big-play-centered" 
        controls
        preload
        playsinline 
        :poster="getImageUrl(video, 'videoThumbnail')"
        :data-setup="videoData"
        width="640" 
        height="480">
        <source :src="video.sourceUrl" type="application/x-mpegURL">
        </video>
      </div>

      <div class="player-end-screen" :class="{ 'is-active': showEndScreen }">
        <div>
          <div>
            <div class="next-box" v-if="nextVideo.id">
              <h2>Next Up in <span id="counter">{{ endScreenCountDown }}</span>s...</h2>
              <nuxt-link :to="{ name: 'artists-artistUrlSegment-shortName', params: nextVideo }">
                <img :src="getImageUrl(nextVideo, 'videoThumbnail', 290)"/>
                <h1>{{ nextVideo.artistNames.join(' & ') }}</h1>
                <h2>{{ nextVideo.videoTitle }}</h2>
              </nuxt-link>
            </div>

            <div class="next-box" v-if="youMightLikeVideos.length">
              <h2>You Might Also Like</h2>
              <nuxt-link :to="{ name: 'artists-artistUrlSegment-shortName', params: youMightLikeVideos[0] }">
                <img :src="getImageUrl(youMightLikeVideos[0], 'videoThumbnail', 290)"/>
                <h1>{{ youMightLikeVideos[0].artistNames.join(' & ') }}</h1>
                <h2>{{ youMightLikeVideos[0].videoTitle }}</h2>
              </nuxt-link>
            </div>
          </div>

          <div class="artist-box">
            <nuxt-link :to="{ name: 'artists-shortName', params: artist }" class="artist-img">
              <img :src="getImageUrl(artist, 'profilePic', 70)"/>
              <h1>{{ artist.artistName }}</h1>
            </nuxt-link>

            <div v-html="artist.bio"/>

            <Button :to="{ name: 'artists-shortName', params: artist }">
              More About the Artist
            </Button>
          </div>
        </div>
      </div>
    </div>
    <div class="player-placeholder"></div>

    <div id="video-sidebar" class="container">
      <div class="currently-playing">
        <div class="playlist-item">
          <div class="playlist-image is-mobile-block is-tablet-block is-desktop-block">
            <nuxt-link :to="{ name: 'artists-shortName', params: artist }">
              <img :src="getImageUrl(artist, 'profilePic', 70)"/>
            </nuxt-link>
          </div>
          <div class="playlist-content">
            <h1 class="playlist-title">
              <nuxt-link :to="{ name: 'artists-shortName', params: artist }">{{ artist.artistName }}</nuxt-link>
            </h1>
            <h3 class="playlist-subtitle">{{ video.videoTitle }}</h3>
          </div>
        </div>

        <div class="btn-group">
          <a href="#" @click.prevent="showSocialOrShare">
            <img src="~/assets/img/share.svg" alt="">
            <span>Share</span>
          </a>
          <a href="#" @click.prevent="showAddTo = !showAddTo">
            <img src="~/assets/img/save-icon.svg" alt="">
            <span>Save for later</span>
          </a>
        </div>
      </div>

      <div class="social-share-container" v-show="showSocialShare">
        <Share
          :facebook="true"
          :twitter="true"
          :sms="true"
          :label="false"
          :message="video.socialMessage"
        />
      </div>

      <div class="add-to-container" v-show="showAddTo">
        <AddTo
          :appleMusic="artist.appleMusicUrl"
          :amazonMusic="artist.amazonMusicUrl"
          :spotify="artist.spotifyUrl"
        />
      </div>

      <div id="ad1">
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
        <!-- OMN-Mobile-BelowPlayer-Responsive-A -->
        <ins class="adsbygoogle"
            style="display:block"
            data-ad-client="ca-pub-7510744857341647"
            data-ad-slot="8663283416"
            data-ad-format="auto"
            data-full-width-responsive="true"></ins>
        <script>
            (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
      </div>
      <div id="ad2">
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
        <!-- OMN-RightRail-Responsive-A -->
        <ins class="adsbygoogle"
            style="display:block"
            data-ad-client="ca-pub-7510744857341647"
            data-ad-slot="8763355760"
            data-ad-format="auto"
            data-full-width-responsive="true"></ins>
        <script>
            (adsbygoogle = window.adsbygoogle || []).push({});
        </script>        
      </div>

      <SocialFeed
        :twitter="artist.twitterUrl"
        :merchandise="merchandise"
        :tour="artist.bandsintownId"
        :playerTime="getPlayerTime"
        :eventId="video.shortName"
        :isLive="video.isLive"
        :hasChat="video.chat"
        :donation="{
          title1: video.donation1Title,
          link1: video.donation1Link,
          title2: video.donation2Title,
          link2: video.donation2Link,
          buttonBackgroundColor: artist.buttonBackgroundColor,
          buttonTextColor: artist.buttonTextColor
        }"
      />

      <ScrollBox class="you-might-like" v-if="youMightLikeVideos.length">
        <nuxt-link :to="{ name: 'artists-artistUrlSegment-shortName', params: video }" class="card" v-for="video in youMightLikeVideos" :key="video.id">
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

    <!-- /21721248453/omnis-1x1 
    <div id="div-gpt-ad-1604449546347-0" style="width: 1px; height: 1px; position: absolute">
    </div>
    -->
    <Footer :legalLinks="legalLinks"/>
  </div>
</template>

<script>
// *added by Natalia - 2021/03/04
// videojs, waterfall js imports
import videojs from 'video.js'
import 'videojs-contrib-ads'
import 'videojs-youtube'
if (process.client) {
  require('~/assets/videojs/videojs-vast-vpaid-waterfall.js')
}
import '~/assets/videojs/videojs.ga.js'
// *added by Natalia - 2021/03/04
// videojs, waterfall css imports
import '~/assets/videojs/videojs-vast-vpaid-waterfall.css'
import '~/assets/videojs/waterfall/video-js.css'
import marked from "marked"

export default {
  async asyncData({ app, params }) {
    const legalLinks = await app.$api('legal')

    const videoData = await app.$api('videos')
    const video = videoData.find(vid => vid.shortName === params.shortName)

    const artist = app.router.app.getFirst(video, 'artists')
    artist.bio = artist.bio ? marked(
      artist.bio.length > 150 ?
      artist.bio.substring(0, 150) + '...' :
      artist.bio
    ) : ''

    const youMightLikeVideos = (video.youMightLikeVideos || []).map(vid => {
      vid.artistNames = (vid.artists || []).map(a => a ? a.artistName : '')
      return vid
    })

    const nextVideo = video.nextVideo || {}
    nextVideo.artistNames = (nextVideo.artists || []).map(a => a ? a.artistName : '')

    const merchData = await app.$api('merch')
    const merchandise = merchData.filter(merch => merch.artists.find(a => a.id === artist.id))

    return {
      legalLinks: app.$objectMap(legalLinks, app.$pluck('type', 'type_slug')),
      video,
      artist,
      nextVideo,
      youMightLikeVideos,
      merchandise
    }
  },

  data() {
    return {
      player: null,
      showEndScreen: false,
      endScreenCountDown: 4,
      upcomingAds: [],

      showAddTo: false,
      showSocialShare: false
    }
  },

  computed: {
    videoData() {
      if (this.video.videoType === 'youtube') {
        return JSON.stringify({
          techOrder: ['youtube'],
          sources: [{ type: 'video/youtube', src: this.video.sourceUrl }],
          youtube: { iv_load_policy: 3 }
        })
      }
    },

    artistKey() {
      return this.video.artistUrlSegment
    },

    getPlayerTime () {
      return this.player ? this.player.currentTime() : 0
    }
  },

  mounted() {
    if (this.video.videoType === 'stream') {
      this.initializePlayer()
    }
  },

  beforeDestroy() {
    if (this.player) {
      this.player.dispose()
    }
  },

  methods: {
    initializePlayer() {
      this.player = window.player = videojs("videojs-vast-vpaid-waterfall-player", {}, function(){
        this.ga();
      });

      /** load GoogleAnalytics */
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','http://www.google-analytics.com/analytics.js','ga');

      ga('create', 'UA-162036547-1', { 'cookieDomain': 'none' });
      ga('send', 'pageview');

      this.player.vastWaterfall({
        /*preroll:
        [
        ],
        midroll: [
        ],
        postroll:
        [
        ],*/
        flashWrapperPath: "",
        debug: true
      });
    },

    showSocialOrShare() {
      const canShare = !!navigator.share

      if (canShare) {
        navigator.share({
          title: document.title,
          text: this.video.socialMessage,
          url: window.location.href
        })
      } else {
        this.showSocialShare = !this.showSocialShare
      }
    }
  },

  head() {
    return {
      title: `${this.artist.artistName} - ${this.video.videoTitle}`,

      script: [
        // Pubmatic script
        {
          hid: 'pubmatic',
          innerHTML: [
            `var purl = window.location.href;`,
            `var url = '//ads.pubmatic.com/AdServer/js/pwt/159748/2633';`,
            `var profileVersionId = '';`,
            `if (purl.indexOf('pwtv=') > 0) {`,
              `var regexp = /pwtv=(.*?)(&|$)/g;`,
              `var matches = regexp.exec(purl);`,
              `if (matches.length >= 2 && matches[1].length > 0) {`,
                `profileVersionId = '/' + matches[1];`,
              `}`,
            `}`,
            `var wtads = document.createElement('script');`,
            `wtads.async = true;`,
            `wtads.src = url + profileVersionId + '/pwt.js';`,
            `var node = document.getElementsByTagName('script')[0];`,
            `node.parentNode.insertBefore(wtads, node);`
          ].join('')
        }
      ],

      __dangerouslyDisableSanitizers: [ 'script' ],

      meta: [
        { name: 'description', content: this.video.description },
        { property: 'og:url', content: `${process.env.siteUrl}${this.$route.fullPath}` },
        { property: 'og:title', content: `${this.artist.artistName} - ${this.video.videoTitle}` },
        { property: 'og:description', content: this.video.description },
        { property: 'og:image', content: `${process.env.siteUrl}${this.getImageUrl(this.video, 'videoThumbnail')}` }
      ]
    }
  }
}
</script>

<style scoped>
#ad1,
#ad2 {
  display: block !important;
  margin-bottom: 15px;
}

#ad1 {
  height: 50px;
}

.logo {
  height: 34px;
  position: fixed;
}

.player-container,
.player-placeholder {
  background: #010001;
  /* 16:9 aspect ratio */
  height: 56.25vw;
  max-height: calc(100vh - 40px);
  overflow: hidden;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 10;
}

.player-placeholder {
  position: static;
}

.video-js,
.video-js video {
  height: 100% !important;
  padding-top: 0 !important;
  width: 100% !important;
}

.player-end-screen {
  bottom: 0;
  display: none;
  left: 0;
  pointer-events: none;
  position: absolute;
  right: 0;
  z-index: 1000;
}

.player-end-screen.is-active {
  display: block;
}

.player-end-screen > div {
  align-items: flex-end;
  display: flex;
  margin-bottom: 40px;
  padding-left: 8px;
  padding-right: 8px;
  width: 100%;
}

.next-box {
  color: #fff;
  margin-top: 8px;
  pointer-events: all;
}

.next-box > h2 {
  display: none;
  font-size: 14px;
  margin: 0 0 4px;
  text-align: center;
}

.next-box a {
  border: 1px solid #7d7d7f;
  color: inherit;
  display: flex;
  flex-direction: column;
  height: 50px;
  justify-content: flex-end;
  overflow: hidden;
  padding: 4px;
  position: relative;
  text-decoration: none;
  width: 90px;
}

.next-box a::after {
  background: linear-gradient(to top, #000, rgba(0,0,0,0) 50%);
  bottom: 0;
  content: '';
  height: 100px;
  left: 0;
  position: absolute;
  right: 0;
  z-index: 1;
}

.next-box img {
  height: 100%;
  left: 0;
  position: absolute;
  object-fit: cover;
  top: 0;
  width: 100%;
  z-index: -1;
}

.next-box a h1,
.next-box a h2 {
  font-size: 10px;
  font-weight: normal;
  line-height: 1.1;
  margin: 2px 0 0;
  overflow: hidden;
  position: relative;
  text-overflow: ellipsis;
  white-space: nowrap;
  z-index: 2;
}

.artist-box {
  color: #fff;
  margin-left: auto;
  margin-bottom: 20px;
  margin-right: 20px;
  pointer-events: all;
}

.artist-box a,
.artist-box h1,
.artist-box div {
  color: inherit;
  display: none;
  margin: 0;
  text-decoration: none;
}

.artist-box .artist-img {
  display: block;
}

.artist-box .artist-img img {
  border-radius: 50px;
  display: block;
  height: 50px;
  width: 50px;
}

.container {
  padding: 15px 20px;
}

.currently-playing {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.playlist-item {
  align-self: flex-start;
  display: flex;
  flex-shrink: 0;
  flex-grow: 0;
  margin-bottom: 15px;
  margin-right: 15px;
  max-width: 66%;
}

.playlist-image {
  flex-shrink: 0;
  height: 40px;
  margin-right: 15px;
  width: 40px;
}

.playlist-image img {
  width: 100%;
}

.playlist-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.playlist-subtitle {
  color: #8a8a8b;
  font-size: 15px;
  font-weight: normal;
  margin: 0;
}

.playlist-title {
  color: #fff;
  font-size: 16px;
  margin: 0;
}

.social-share-container {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}

.add-to-container {
  margin-bottom: 15px;
}

.social-feed-container {
  margin-bottom: 20px;
}

.you-might-like {
  background: #302f34;
  margin-right: -20px;
  padding: 15px 0 15px 15px;
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

.btn-group {
  display: flex;
  margin-bottom: 15px;
  max-width: 330px;
  width: 100%;
}

.btn-group a {
  align-items: center;
  border: 1px solid #323035;
  color: #fff;
  display: flex;
  font-size: 12px;
  justify-content: center;
  padding: 8px;
  text-transform: uppercase;
  white-space: nowrap;
  width: 50%;
}

.btn-group a:not(:first-child) {
  border-left: 0;
}

.btn-group a:hover {
  background: #47464a;
}

.btn-group span {
  display: none;
}

.keyboard-open .container {
  bottom: 0;
  left: 0;
  padding: 15px 20px;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 1000;
}

.keyboard-open #ad1,
.keyboard-open #ad2,
.keyboard-open .currently-playing,
.keyboard-open .you-might-like,
.keyboard-open footer {
  display: none !important;
}

@media (min-width: 630px) {
  .playlist-subtitle + .playlist-title,
  .playlist-title + .playlist-subtitle {
    margin-top: 3px;
  }

  .btn-group img {
    margin-right: 6px;
  }

  .btn-group span {
    display: block;
  }
}

@media (orientation: landscape) and (max-width: 767px) {
  .player-placeholder {
    display: none;
  }

  .player-container {
    position: relative;
  }
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1104px) {
  #ad1 {
    height: 90px;
    margin-left: -10px !important;
    margin-right: -10px !important;
    margin-top: 0;
  }

  .player-container,
  .player-placeholder {
    max-height: 50vh;
  }

  .container {
    padding-bottom: 20px;
    padding-left: 30px;
    padding-right: 30px;
    padding-top: 30px;
  }

  .you-might-like {
    margin-right: -30px;
  }

  .you-might-like .card-image {
    height: 160px;
    width: 290px;
  }
}

@media (min-width: 768px) {
  .player-end-screen > div {
    margin-bottom: 60px;
    padding: 0 20px;
  }

  .next-box {
    margin-top: 12px;
  }

  .next-box > h2 {
    display: block;
    margin-bottom: 6px;
  }

  .next-box a {
    height: 110px;
    padding: 8px;
    width: 180px;
  }

  .next-box a h1 {
    font-size: 14px;
    font-weight: bold;
  }

  .next-box a h2 {
    font-size: 13px;
    margin-top: 4px;
  }

  .artist-box {
    background: rgba(25, 24, 29, .8);
    border: 1px solid #7d7d7f;
    margin-bottom: 0;
    margin-right: 0;
    padding: 20px;
    width: 240px;
  }

  .artist-box a,
  .artist-box h1,
  .artist-box div {
    display: block;
  }

  .artist-box h1 {
    font-size: 18px;
    margin-left: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .artist-box .artist-img {
    align-items: center;
    display: flex;
    margin-bottom: 12px;
  }

  .artist-box .artist-img img {
    flex-shrink: 0;
  }

  .artist-box div {
    margin-bottom: 12px;
  }

  .playlist-image {
    height: 60px;
    margin-right: 15px;
    width: 60px;
  }
}

/* Desktop */
@media (min-width: 1105px) {
  .logo {
    height: 70px;
    left: 40px;
    top: 40px;
  }

  #ad1 {
    bottom: 60px;
    height: 90px;
    left: calc((100% - 375px - 728px) / 2);
    margin-bottom: 0;
    position: fixed;
    width: 728px;
    z-index: 11;
  }

  #ad2 {
    height: 250px;
  }

  .player-container,
  .player-placeholder {
    height: 100vh;
    max-height: calc(100vh - 42px);
    width: calc(100% - 375px);
  }

  .player-end-screen > div {
    margin-bottom: 220px;
  }

  .next-box {
    margin-top: 16px;
  }

  .next-box a {
    height: 110px;
    width: 200px;
  }

  .container {
    bottom: 42px;
    overflow-x: hidden;
    overflow-y: auto;
    position: absolute;
    right: 0;
    top: 0;
    width: 375px;
  }

  .currently-playing {
    flex-direction: column;
  }

  .playlist-item {
    margin-bottom: 15px;
    max-width: none;
  }

  footer {
    margin-top: 0 !important;
  }
}

.video-js-responsive-container.vjs-hd {
    padding-top: 56.25%;
}
.video-js-responsive-container.vjs-sd {
    padding-top: 75%;
}
.video-js-responsive-container {
    width: 100%;
    position: relative;
}
.video-js-responsive-container .video-js {
    height: 100% !important; 
    width: 100% !important;
    position: absolute;
    top: 0;
    left: 0;
}
</style>
