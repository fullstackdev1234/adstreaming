<template>
  <div class="header" :style="{
    '--overlay-color': series.overlayColor,
    '--overlay-opacity': series.overlayOpacity ? series.overlayOpacity / 100 : null,
    '--overlay-position': series.overlayPosition,
    '--overlay-size': series.overlaySize,
    backgroundImage: `url('${getImageUrl(series, 'coverPhoto')}')`
  }">
    <Logo/>

    <div class="info">
      <nuxt-link
        :to="
          liveReached ?
          { name: 'series-seriesUrlSegment-shortName', params: video } :
          { name: 'series-seriesUrlSegment', params: series }
        "
        class="info-link"
      >
        <h1>{{ series.seriesName }}</h1>
      </nuxt-link>

      <div v-if="video.id">
        <nuxt-link
          :to="
            liveReached ?
            { name: 'series-seriesUrlSegment-shortName', params: video } :
            { name: 'series-seriesUrlSegment', params: series }
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
            :description="series.description"
          />
        </h3>
        <h3 v-if="liveReached && vodReached == false">Live Now</h3>
        <h3 v-if="vodReached">Available On Demand Now</h3>
      </div>
      <p v-if="video.id">{{ series.description }}</p>

      <div class="row v-centered countdown-share-container">
        <div class="col collapse countdown-container">
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
          <div class="row">
            <div class="col scroll-down-column">
              <div class="scroll-down">
                <img src="~/assets/img/scroll-down.svg"/>
                <div>
                  Scroll down to see
                  <br>
                  the full lineup
                </div>
              </div>
            </div>
            <div class="col share-column">
              <Share
                :facebook="true"
                :twitter="true"
                :sms="true"
                :message="video.socialMessage"
              ></Share>
            </div>
          </div>
        </div>
      </div>

      <div class="button-container">
        <Button
          :background="series.buttonBackgroundColor"
          :color="series.buttonTextColor"
          @click.native.prevent="showSignupModal = true"
          v-if="getFirst(video, 'artists').sendinblueIFrame && video.id && liveReached == false"
          class="button"
        >
          <svg viewBox="0 0 20 22">
            <path d="M16 7A6 6 0 104 7c0 7-3 9-3 9h18s-3-2-3-9M11.73 20a2 2 0 01-3.46 0" fill="none" :stroke="series.buttonTextColor" stroke-width="2"/>
          </svg>
          Notify me when the show goes live
        </Button>

        <Button
          :to="{ name: 'series-seriesUrlSegment-shortName', params: video }"
          :background="series.buttonBackgroundColor"
          :color="series.buttonTextColor"
          v-if="liveReached && vodReached == false"
          class="button"
        >
          Watch Live Now
        </Button>

        <Button
          :to="{ name: 'series-seriesUrlSegment-shortName', params: video }"
          :background="series.buttonBackgroundColor"
          :color="series.buttonTextColor"
          v-if="vodReached"
          class="button"
        >
          Click To Watch On VOD
        </Button>
      </div>
    </div>

    <SignupModal
      :iframeCode="getFirst(video, 'artists').sendinblueIFrame"
      :isActive="showSignupModal"
      @close="showSignupModal = false"
    />
  </div>
</template>

<script>
export default {
  props: [ 'series', 'video', 'shouldRedirectWhenLive' ],

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
          name: 'series-seriesUrlSegment-shortName',
          params: this.video
        })
      }, 5000)
    }
  }
}
</script>

<style>
html {
  background-color: #0c0b0e;
}
</style>

<style scoped>
.header {
  background-position: top center;
  background-repeat: no-repeat;
  background-size: contain;
  color: #fff;
  padding: 142px 20px 120px;
  position: relative;
}

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
  font-size: 18px;
  font-weight: normal;
  line-height: 1;
  margin-bottom: 10px;
}

.info h2 {
  color: #fff;
  font-size: 40px;
  line-height: 1.1;
  margin-bottom: 12px;
}

.info h3 {
  color: #ccc;
  font-size: 16px;
  line-height: 1.2;
  margin-bottom: 27px;
  text-transform: uppercase;
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

.scroll-down-column {
  display: none;
}

.share-container .row {
  margin-bottom: 0;
}

@media (max-width: 460px) {
  .countdown-share-container {
    flex-direction: column-reverse;
  }

  .countdown-container {
    text-align: center;
  }

  .button-container .button {
    border-radius: 0;
    display: flex;
    justify-content: center;
    margin-left: -20px;
    margin-right: -20px;
  }

  .info .title-date {
    padding-left: 0;
  }

  .title-date .add-to-calendar {
    position: static;
    transform: none;
  }

  .scroll-down-column {
    display: block;
  }

  .scroll-down {
    align-items: center;
    color: #fff;
    display: flex;
  }

  .scroll-down img {
    margin-right: 10px;
  }

  .share-container {
    margin-bottom: 20px;
    width: 100%;
  }

  .share-column {
    display: flex;
    justify-content: flex-end;
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
    background-size: var(--overlay-size, contain);
    padding-left: 45px;
    padding-right: 45px;
  }

  .header .button-container {
    margin-bottom: 75px;
  }
}
</style>
