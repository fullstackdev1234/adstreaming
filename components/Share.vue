<template>
  <div
    class="share"
    :class="{ 'has-native': canShare }"
    v-if="message"
  >
    <div class="no-native-share">
      <div class="share-label" v-if="label !== false">Share this event:</div>
      <a
        href="#"
        :data-fb-share="message"
        class="facebook"
        @click="trackEvent('Facebook')"
        @click.prevent="facebookShare"
        v-if="facebook"
      >
        <img src="~/assets/img/share-facebook-logo.svg"/>
      </a>
      <a
        :href="`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`"
        class="twitter"
        @click="trackEvent('Twitter')"
        v-if="twitter"
      >
        <img src="~/assets/img/share-twitter-logo.svg"/>
      </a>
      <a
        :href="`sms:?&body=${encodeURIComponent(message)}`"
        class="message"
        @click="trackEvent('Sms')"
        v-if="sms"
      >
        <img src="~/assets/img/share-messages-logo.svg"/>
      </a>
      <div id="fb-root"></div>
    </div>
    <div class="has-native-share">
      <button ref="mobileShare">
        <img src="~/assets/img/share.svg"/>
        Share
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: [ 'label', 'facebook', 'twitter', 'sms', 'message' ],

  data() {
    return {
      canShare: false
    }
  },

  mounted() {
    window.fbAsyncInit = function() {
      FB.init({
        appId: '2252861731672218',
        status: true,
        xfbml: true,
        version: 'v2.7'
      })
    }

    if (window.twttr) {
      window.twttr.widgets.load()
    }

    this.canShare = !!navigator.share

    if (this.$refs.mobileShare) {
      this.$refs.mobileShare.addEventListener('click', () => {
        navigator.share({
          title: document.title,
          text: this.message,
          url: window.location.href
        })
      })
    }
  },

  methods: {
    trackEvent(label) {
      this.$ga.event({
        eventCategory: 'Social Button',
        eventAction: 'Click',
        eventLabel: label
      })
    },

    facebookShare(e) {
      const link = e.target.closest('[data-fb-share]')
      FB.ui({
        method: 'share',
        href: window.location.href,
        quote: link.dataset.fbShare
      }, function(response){})
    }
  },

  head() {
    return {
      script: [
        { id: 'facebook-jssdk', defer: true, src: '//connect.facebook.net/en_US/sdk.js#version=v2.7&appId=2252861731672218&xfbml=true&autoLogAppEvents=true' }
      ]
    }
  }
}
</script>

<style scoped>
.no-native-share,
.has-native-share {
  align-items: center;
  display: flex;
}

.has-native-share {
  display: none;
}

.share.has-native .no-native-share {
  display: none;
}

.share.has-native .has-native-share {
  display: flex;
}

.has-native-share button {
  align-items: center;
  background: rgba(255,255,255,.2);
  border: 1px solid rgba(255,255,255,.3);
  border-radius: 4px;
  color: #fff;
  display: inline-flex;
  height: 42px;
  justify-content: center;
  text-transform: uppercase;
  width: 114px;
}

.has-native-share button img {
  margin-right: 10px;
}

.share a {
  margin-left: 6px;
  margin-right: 6px;
}

.share a img {
  display: block;
  height: 38px;
  width: 38px;
}

.share-label {
  display: none;
  font-size: 15px;
  font-weight: bold;
}

@media (min-width: 1105px) {
  .share-label {
    display: block;
  }
}
</style>
