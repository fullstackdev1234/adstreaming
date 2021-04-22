<template>
  <div class="chat-container" :style="{ 'max-height': windowHeight }">
    <div class="login-wrapper" v-if="showLogin">
      <button @click="showLogin = false" class="login-close__button">
        <svg class="login-close__icon" width="20" height="20" viewBox="0 0 20 20">
          <path d="M10 8.586l-7.071-7.071-1.414 1.414 7.071 7.071-7.071 7.071 1.414 1.414 7.071-7.071 7.071 7.071 1.414-1.414-7.071-7.071 7.071-7.071-1.414-1.414-7.071 7.071z"></path>
        </svg>
      </button>
      <div class="login-container">
        <h2 class="login-container__title">Login to start Chatting</h2>
        <div class="login-vendors">
          <button class="login-vendors__btn login-vendors__btn--facebook" @click="onFacebookLogin">
            <img src="~/assets/img/facebook-icon.svg" alt="">
            <p class="text-white">Login using Facebook</p>
          </button>
          <button class="login-vendors__btn login-vendors__btn--twitter" @click="onTwitterLogin">
            <img src="~/assets/img/twitter-icon.svg" alt="">
            <p class="text-white">Login using Twitter</p>
          </button>
        </div>
      </div>
    </div>

    <div class="chat-buttons">
      <a @click="showSettings = !showSettings">
        <img src="~/assets/img/chat-settings.svg" alt="">
      </a>
      <a>
        <img src="~/assets/img/chat-eye.svg" alt="">
        <span>{{ connectedUsers }}</span>
      </a>

      <ul class="chat-settings-dropdown" v-show="showSettings">
        <li>
          <a :disabled="!isLive" @click="onLogout">Logout</a>
        </li>
      </ul>
    </div>

    <div class="chat-messages-list-container">
      <ul ref="messageList" class="chat-messages-list">
        <li
          v-for="(msg, i) in messages"
          :key="`${i}-${msg}`"
          :style="{}"
        >
          <div class="chat-row">
            <div class="col-1-of-4 chat-messages-list__icon">
              <div class="post-item-table__shape" :class="{'post-item-table__shape--no-image': !msg.photoURL}">
                <img v-if="msg.photoURL" class="post-item-table__img" :src="msg.photoURL" />
                <p v-else>{{ msg.username.split('')[0].toUpperCase() }}</p>
              </div>
            </div>

            <div class="col-1-of-4--nowrap">
              <p class="text-white__bold"><strong>{{ msg.username }}</strong></p>
            </div>

            <div v-if="msg.verified" class="col-1-of-4">
              <div class="post-item-table__user-icon">
                <svg class="post-item-table__user-icon--shape" width="20px" height="20px" viewBox="0 0 20 20">
                  <path d="M8.294 16.998c-0.435 0-0.847-0.203-1.111-0.553l-3.573-4.721c-0.465-0.613-0.344-1.486 0.27-1.951 0.615-0.467 1.488-0.344 1.953 0.27l2.351 3.104 5.911-9.492c0.407-0.652 1.267-0.852 1.921-0.445s0.854 1.266 0.446 1.92l-6.984 11.21c-0.242 0.391-0.661 0.635-1.12 0.656-0.022 0.002-0.042 0.002-0.064 0.002z"></path>
                </svg>
              </div>
            </div>
            <div class="col-1-of-4--fit">
              <p class="text-white text-wrap">{{msg.message}}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <div v-if="isLogged && isLive" class="chat-messages-input__container">
      <form action="#">
        <input
          class="chat-messages-input__input"
          type="text"
          ref="message"
          id="message"
          v-model="chatMessage"
          autocomplete="off"
          placeholder="Send Message"
          @keydown.enter.prevent="onInputSubmit"
          @focus="onInputFocus"
          @blur="onInputBlur"
        >
        <button
          :disabled="!chatMessage.length"
          class="chat-messages-input__btn"
          @touchstart="onMessageSubmit"
          @click="onMessageSubmit"
        >
          <svg class="chat-messages-input__icon" width="24" height="24" viewBox="0 0 24 24">
            <path d="M22.963 2.269c0.043-0.151 0.050-0.314 0.015-0.476-0.024-0.113-0.068-0.224-0.131-0.325-0.064-0.102-0.145-0.19-0.238-0.262-0.117-0.090-0.249-0.15-0.386-0.181s-0.282-0.034-0.426-0.004c-0.042 0.009-0.085 0.021-0.126 0.035l-0.021 0.007-19.98 6.993c-0.252 0.088-0.467 0.276-0.584 0.538-0.224 0.505 0.003 1.096 0.508 1.32l8.649 3.844 3.844 8.649c0.108 0.243 0.313 0.443 0.583 0.538 0.521 0.182 1.092-0.092 1.274-0.614l6.993-19.979c0.010-0.027 0.019-0.054 0.027-0.082zM10.779 11.807l-6.068-2.696 13.483-4.72zM19.609 5.806l-4.72 13.483-2.696-6.068z"></path>
          </svg>
        </button>
      </form>
    </div>
    <div v-else-if="!isLogged" class="login-sign-in">
      <button :disabled="!isLive" @click="showLogin = true" class="login-sign-in__button">Login to start Chatting</button>
    </div>
  </div>
</template>

<script>
import {
  serviceConnect,
  postMessage,
  loadChatHistory,
  loadMessageIndex
} from '../../chat-service/messaging'

import {
  signInWithFacebook,
  signInWithTwitter,
  signInWithInstagram,
  logout
} from '../../chat-service/firebase/auth'

const logger = console.log

export default {
  props: {
    playerTime: {
      type: Number,
      default: 0
    },
    eventId: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      connectedUsers: 0,
      user: null,
      isLogged: false,
      messages: [],
      chatMessage: '',
      showLogin: false,
      messageIndex: {},
      maxMsg: 8,
      msgToken: null,
      isLive: true,

      showSettings: false,
      resizeTimeout: null,
      windowHeight: 'auto',
      preventBlur: false
    }
  },

  computed: {
    reorderMessages () {
      return this.messages.slice().reverse()
    },
    canSubmit () {
      return this.isLogged || !this.isLive
    }
  },

  watch: {
    async playerTime (newTime, oldTime) {
      if (!this.isLive && (parseInt(newTime) > parseInt(oldTime))) {
        const newMessages = this.messageIndex[`${parseInt(this.playerTime)}`]
        if (newMessages) {
          this.messages = this.messages.concat(newMessages)
          await this.scrollDown()
        }
      }
    }
  },

  methods: {
    onLogout () {
      this.isLogged = false
      this.showSettings = false
      logout()
    },

    onCount (payload) {
      const { data } = payload
      this.connectedUsers = data.count
    },

    onMessage (payload) {
      if (!this.isLive) return
      const { data } = payload
      console.log('message!', data)
      const newMessages = this.user ? data.filter(d => d.userId && d.userId !== this.user.uid) : data
      this.messages = this.messages.concat(newMessages)
      this.scrollDown()
    },

    async scrollDown () {
      if (!this.$refs.messageList) return

      await this.$nextTick()

      const r = this.$refs.messageList

      if (r.scrollTop < r.scrollHeight - r.clientHeight) {
        this.$refs.messageList.scrollTo({
          top: this.$refs.messageList.scrollHeight,
          behavior: 'smooth'
        })
      }
    },

    async onFacebookLogin (e) {
      try {
        const { user } = await signInWithFacebook()
        this._login(user)
      } catch (e) {
        logger(e)
      }
    },

    async onTwitterLogin (e) {
      try {
        const { user } = await signInWithTwitter()
        this._login(user)
      } catch (e) {
        logger(e)
      }
    },

    async onInstagramLogin (token) {
      try {
        const { user } = await signInWithInstagram(token)
        this._login(user)
      } catch (e) {
        logger(e)
      }
    },

    async onInstagramPopUp () {
      const target = 'https://ws.omnisplayer.com/auth/instagram'
      const popup = window.open(target, 'Omnis - Login with Instagram', 'width=800,height=600,resizable=yes')

      window.addEventListener('message', msg => {
        const { data } = msg
        const { code } = data
        if (code) {
          popup.close()
          this.onInstagramLogin(code)
        }
      }, false)
    },

    async _login (user) {
      if (!user) { return }
      this.isLogged = true
      const { uid, displayName, email, emailVerified, photoURL, verified } = user
      this.user = { uid, displayName, email, emailVerified, photoURL, verified }
      this.showLogin = false
      await this.scrollDown()
    },

    onInputSubmit (ev) {
      if (ev.keyCode === 13) {
        if (this.chatMessage.length < 2) {
          this.chatMessage = ''
          return
        }

        if (this.isLive) this.onMessageSubmit()
      }
    },

    onMessageSubmit () {
      this.preventBlur = true

      const { displayName, photoURL, verified } = this.user
      const msg = verified ? {
        userId: this.user.uid,
        username: displayName,
        message: this.chatMessage,
        date: `${Date.now()}`,
        photoURL,
        verified
      } : {
        userId: this.user.uid,
        username: displayName,
        message: this.chatMessage,
        date: `${Date.now()}`,
        photoURL
      }

      this.sendMessage(msg)
    },

    sendMessage (msg) {
      this.messages.push(msg)
      this.chatMessage = ''
      this.scrollDown()
      postMessage(msg)
    },

    onInputFocus() {
      const isTablet = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(navigator.userAgent)
      if (window.innerWidth >= 1105 && isTablet === false) return

      document.body.classList.add('keyboard-open')
      document.dispatchEvent(new CustomEvent('chat:keyboard', { detail: { show: true } }))

      if (window.visualViewport) {
        let lastHeight = 0
        this.resizeTimeout = setInterval(() => {
          if ( ! document.body.classList.contains('keyboard-open')) {
            clearInterval(this.resizeTimeout)
            this.windowHeight = 'auto'
            return
          }

          if (lastHeight != window.visualViewport.height) {
            this.scrollDown()
            lastHeight = window.visualViewport.height
            this.windowHeight = `${lastHeight - 15}px`
          }
          // Essentially disable page scroll while the keyboard is up
          document.documentElement.scrollTo(0, 0)
        }, 50)
      }
    },

    onInputBlur() {
      if (this.preventBlur) {
        this.$refs.message.focus()
        this.onInputFocus()
        this.preventBlur = false
      } else {
        document.body.classList.remove('keyboard-open')
        document.dispatchEvent(new CustomEvent('chat:keyboard', { detail: { show: false } }))
        this.windowHeight = 'auto'
      }
    }
  },

  destroyed() {
    this.onInputBlur()
  },

  async mounted () {
    if (this.isLive) {
      await serviceConnect(this.onMessage, this.onCount)
      const chatHistory = await loadChatHistory()
      this.messages = chatHistory ? chatHistory.filter(d => d.userId) : []
      await this.scrollDown()
    } else {
      const index = await loadMessageIndex(this.eventId)
      this.messageIndex = index
    }
  },

  async activated () {
    await this.scrollDown()
  }
}
</script>

<style lang="scss" scoped>
@import './sass/main.scss'
</style>
