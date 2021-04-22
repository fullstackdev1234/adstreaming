<template>
  <div class="header" :style="{
    '--overlay-color': artist.overlayColor,
    '--overlay-opacity': artist.overlayOpacity ? artist.overlayOpacity / 100 : null,
    '--overlay-position': artist.overlayPosition,
    '--overlay-size': artist.overlaySize,
    backgroundImage: `url('${getImageUrl(artist, 'coverPhoto')}')`
  }">
    <Logo/>

    <div class="artist-logo-container">
      <img :src="getImageUrl(artist, 'logo')" class="artist-logo"/>
    </div>

    <div class="info">
      <nuxt-link
        :to="
          liveReached ?
          { name: 'artists-artistUrlSegment-shortName', params: video } :
          { name: 'artists-shortName', params: artist}
        "
        class="info-link"
      >
        <h1>{{ artist.artistName }}</h1>
      </nuxt-link>

      <div v-if="video.id">
        <nuxt-link
          :to="
            liveReached ?
            { name: 'artists-artistUrlSegment-shortName', params: video } :
            { name: 'artists-shortName', params: artist}
          "
          class="info-link"
        >
          <h2>{{ video.videoTitle }}</h2>
        </nuxt-link>
        <h3 v-if="liveReached == false" class="title-date">
          <small>
            {{ $dateFns.format(video.dateLive, 'EEEE, MMM') }}
            {{ $dateFns.format(video.dateLive, 'do') }},
            {{ $dateFns.format(video.dateLive, 'yyy') }}
          </small>
          {{ video.dateDescription }}

          <AddToCalendar
            :title="video.videoTitle"
            :startDate="video.dateLive"
            :description="video.description"
          />
        </h3>
        <h3 v-if="liveReached && vodReached == false">Live Now</h3>
        <h3 v-if="vodReached">Available to Watch Now</h3>
      </div>
      <p v-if="video.id">{{ video.description }}</p>

      <div class="row v-centered">
        <div class="col collapse">
          <Countdown
            :target="video.dateLive"
            :vod="video.dateVod"
            :redirectMinutes="video.redirectMinutes != null ? video.redirectMinutes : 15"
            @target-reached="targetReached = true"
            @live-reached="liveReached = true"
            @vod-reached="vodReached = true"
            v-show="liveReached == false"
            v-if="video.id"
          />
        </div>
        <div class="col share-container">
          <Share
            :facebook="true"
            :twitter="true"
            :sms="true"
            :message="video.socialMessage"
          />
        </div>
      </div>

      <div class="button-container">
        <Button
          :background="artist.buttonBackgroundColor"
          :color="artist.buttonTextColor"
          @click.native.prevent="showSignupModal = true"
          v-if="artist.sendinblueIFrame && video.id && liveReached == false"
        >
          <svg viewBox="0 0 20 22">
            <path d="M16 7A6 6 0 104 7c0 7-3 9-3 9h18s-3-2-3-9M11.73 20a2 2 0 01-3.46 0" fill="none" :stroke="artist.buttonTextColor" stroke-width="2"/>
          </svg>
          Notify me when the show goes live
        </Button>

        <Button
          :to="{ name: 'artists-artistUrlSegment-shortName', params: video }"
          :background="artist.buttonBackgroundColor"
          :color="artist.buttonTextColor"
          v-if="liveReached && vodReached == false"
        >
          Watch Live Now
        </Button>

        <Button
          :to="{ name: 'artists-artistUrlSegment-shortName', params: video }"
          :background="artist.buttonBackgroundColor"
          :color="artist.buttonTextColor"
          v-if="vodReached"
        >
          Click To Watch Now
        </Button>
      </div>
    </div>

    <SignupModal
      :iframeCode="artist.sendinblueIFrame"
      :isActive="showSignupModal"
      @close="showSignupModal = false"
    />
  </div>
</template>

<script>
export default {
  props: [ 'artist', 'video', 'shouldRedirectWhenLive' ],

  data() {
    return {
      targetReached: false,
      liveReached: false,
      vodReached: false,

      showSignupModal: false
    }
  },

  watch: {
    liveReached() {
      if (this.shouldRedirectWhenLive !== true || this.vodReached === true) return

      setTimeout(() => {
        return this.$router.push({
          name: 'artists-artistUrlSegment-shortName',
          params: this.video
        })
      }, 5000)
    }
  }
}
</script>

<style scoped>
.header {
  background-position: top center;
  background-repeat: no-repeat;
  background-size: contain;
  color: #fff;
  padding: 142px 20px 120px;
  position: relative;
}

.header .artist-logo,
.header .info {
  position: relative;
  z-index: 10;
}

.info-link {
  display: inline-block;
}

.header::before {
  background: var(--overlay-color, rgb(0,0,0));
  bottom: 0;
  content: '';
  left: 0;
  opacity: var(--overlay-opacity, .6);
  position: absolute;
  right: 0;
  top: 0;
  z-index: 1;
}

.header .row {
  margin-bottom: 20px;
  flex-wrap: nowrap;
}

.artist-logo-container {
  max-width: 500px;
}

.artist-logo {
  height: auto;
  margin-bottom: 20px;
  max-height: 100px;
  max-width: 65%;
  width: auto;
}

.info {
  color: #ccc;
  font-size: 13px;
  line-height: 1.7;
  margin-bottom: 26px;
}

.info a {
  text-decoration: none;
}

.info h1 {
  color: #fff;
  font-size: 32px;
  line-height: 1;
  margin-bottom: 10px;
}

.info h2 {
  color: #fff;
  font-size: 23px;
  line-height: 1.1;
  margin-bottom: 12px;
}

.info h3 {
  color: #ccc;
  font-size: 16px;
  text-transform: uppercase;
  line-height: 1.2;
  margin-bottom: 27px;
}

.info .title-date {
  color: #fff;
  font-weight: normal;
  padding-left: 50px;
  position: relative;
}

.title-date small {
  color: #898989;
  display: block;
  font-size: 90%;
  margin-bottom: 8px;
  text-transform: none;
}

.title-date .add-to-calendar {
  left: 0;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.info p {
  margin-bottom: 15px;
}

.share-container {
  display: none;
}

@media (max-width: 460px) {
  .info .title-date {
    padding-left: 0;
  }

  .title-date .add-to-calendar {
    position: static;
    transform: none;
  }
}

@media (min-width: 768px) {
  .header .button-container {
    margin-bottom: 55px;
  }

  .info {
    font-size: 15px;
    margin-bottom: 22px;
    width: 52%;
  }

  .share-container {
    display: block;
  }
}

@media (min-width: 1105px) {
  .header {
    background-position: var(--overlay-position, center);
    background-size: var(--overlay-size, cover);
    padding-left: 45px;
    padding-right: 45px;
  }

  .header .button-container {
    margin-bottom: 75px;
  }
}
</style>
