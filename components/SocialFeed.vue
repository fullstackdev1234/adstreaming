<template>
  <div class="video-tabs-container">
    <nav class="video-tabs-nav">
      <a
        href="#video-tabs-chat"
        :class="{'is-active': selectedTab === 'Chat'}"
        @click.prevent="trackEvent('Chat')"
        v-if="hasChat"
      >
        Chat
      </a>
      <a
        href="#video-tabs-donate"
        :class="{'is-active': selectedTab === 'Donate'}"
        @click.prevent="trackEvent('Donate')"
        v-if="donation.title1 || donation.title2"
      >
        Donate
      </a>
      <a
        href="#video-tabs-merch"
        :class="{'is-active': selectedTab === 'Merch'}"
        @click.prevent="trackEvent('Merch')"
        v-if="merchandise.length"
      >
        Merch
      </a>
      <a
        href="#video-tabs-social-no"
        :class="{'is-active': selectedTab === 'Twitter'}"
        @click.prevent="trackEvent('Twitter')"
        v-if="twitter"
      >
        Social
      </a>
    </nav>

    <div class="video-tabs-content" v-show="selectedTab === 'Twitter'">
      <TwitterComponent :twitter="twitter"/>
    </div>

    <div
      v-show="selectedTab === 'Chat'"
      class="video-tabs-content"
      :class="{ 'is-chat': selectedTab === 'Chat' }"
    >
      <keep-alive>
        <component
          :is="selectedTab"
          :playerTime="playerTime"
          :eventId="eventId"
          :isLive="isLive"
          :tour="tour"
          :merchandise="merchandise"
        />
      </keep-alive>
    </div>

    <div class="video-tabs-content is-donation" v-show="selectedTab === 'Donate'">
      <div v-if="donation.title1" class="donation-box">
        <h2>{{ donation.title1 }}</h2>

        <Button
          :background="donation.buttonBackgroundColor"
          :color="donation.buttonTextColor"
          :to="donation.link1"
        >Donate Now</Button>
      </div>

      <div v-if="donation.title2" class="donation-box">
        <h2>{{ donation.title2 }}</h2>
        <Button
          :background="donation.buttonBackgroundColor"
          :color="donation.buttonTextColor"
          :to="donation.link2"
        >Donate Now</Button>
      </div>
    </div>
  </div>
</template>

<script>
import ChatComponent from './ChatComponent/index.vue'
import MerchComponent from './MerchComponent.vue'

export default {
  props: [
    'twitter',
    'merchandise',
    'tour',
    'playerTime',
    'eventId',
    'isLive',
    'hasChat',
    'donation'
  ],

  data () {
    return {
      selectedTab: this.hasChat ? 'Chat' : 'Twitter'
    }
  },

  components: {
    Twitter: {
      template: '<div></div>'
    },
    Chat: ChatComponent,
    Merch: MerchComponent,
    Tour: {
      template: '<div></div>'
    }
  },

  computed: {
    bandsintownId () {
      return `id_${this.tour}`
    }
  },

  methods: {
    trackEvent(label) {
      this.$ga.event({
        eventCategory: 'Social Feature',
        eventAction: 'Click',
        eventLabel: label
      })

      this.selectedTab = label
    }
  }
}
</script>

<style scoped>
.video-tabs-nav {
  display: flex;
}

.video-tabs-nav a {
  align-items: center;
  background: #242328;
  border: 1px solid #3f3e42;
  color: #8a8a8b;
  display: flex;
  flex-grow: 1;
  font-size: 12px;
  justify-content: center;
  padding: 8px;
  text-transform: uppercase;
}

.video-tabs-nav a:not(:first-child) {
  border-left: 0;
}

.video-tabs-nav a:hover,
.video-tabs-nav a.is-active {
  background: #e10b16;
  color: #fff;
}

.video-tabs-content {
  list-style: none;
  margin: 0 0 15px;
  padding: 0;
}

.scroll-box-container {
  width: 100%;
}

.tour-container {
  width: 100%;
}

.merch {
  margin-bottom: 30px;
}

.merch .merch-box {
  /*margin-right: -20px;*/
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
  /*margin-right: 20px;*/
}

.merch .card-image {
  height: 220px;
  width: 220px;
  margin: 0 auto;
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
  /*margin-right: 12px;*/
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

.card {
  margin-top: 1rem;
  position: relative;
  /*margin: 0 auto;*/
}

.merch-box .card:not(:last-child) {
  margin-bottom: 1rem;
}

.card-image {
  height: 140px;
  overflow: hidden;
  position: relative;
  width: 246px;
}

.card-image::after {
  background-image: linear-gradient(to top, #000, rgba(0,0,0,0) 50%);
  content: '';
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 4;
}

.card-image img {
  height: 100%;
  object-fit: cover;
  width: 100%;
  margin: 0 auto;
}

.card-details {
  padding: 15px;
  z-index: 5;
}

.card-subtitle {
  color: #888584;
  font-size: 11px;
  margin-bottom: 5px;
}

.card-title {
  color: #fff;
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.keyboard-open .video-tabs-nav {
  display: none;
}

.keyboard-open .video-tabs-content {
  margin-bottom: 0;
}

.keyboard-open .video-tabs-container,
.keyboard-open .video-tabs-content.is-chat,
.keyboard-open .chat-container {
  height: 100%;
}

.is-donation {
  padding-top: 20px;
}

.donation-box {
  margin-bottom: 32px;
}

.donation-box h2 {
  color: #fff;
  margin-bottom: 8px;
}

@media (min-width: 1105px) {
  .scroll-box-container {
    /*padding: 30px 45px;*/
  }

  .you-might-like >>> .scroll-box {
    /*margin-right: -45px*/;
  }

  .you-might-like .card {
    /*margin-right: 20px;*/
  }

  .you-might-like .card-image {
    height: 160px;
    width: 290px;
  }

  .merch .merch-box {
    /*margin-right: -45px;*/
  }

  .merch >>> .scroll-box {
    /*margin-left: -20px;*/
    padding: 20px;
  }

  .merch .card {
    /*margin-right: 15px;*/
    position: relative;
    transition: transform .3s ease;
  }

  .merch .card:hover {
    box-shadow: 0 5px 8px 5px rgba(0,0,0,.5);
    transform: scale(1.02);
    z-index: 1000;
  }

  .merch .card:hover .card-details {
    opacity: 1;
  }

  .merch .card-image {
    height: 195px;
    width: 100%;
    margin: 0 auto;
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
