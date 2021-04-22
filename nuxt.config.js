import bodyParser from 'body-parser'

export default {
  telemetry: false,
  /*
  ** Nuxt rendering mode
  ** See https://nuxtjs.org/api/configuration-mode
  */
  mode: 'universal',
  /*
  ** Nuxt target
  ** See https://nuxtjs.org/api/configuration-target
  */
  target: 'static',
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: 'Omnis - %s',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ]
  },

  router: {
    trailingSlash: true
  },
  generate: {
    routes: [
      '/sitemap/'
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  serverMiddleware: [
    bodyParser.json(),
    { path: '/api', handler: '~/api/index.js' }
  ],

  env: {
    siteUrl: 'https://www.omnisplayer.com',

    chatService: {
      chatSIOHost: process.env.CHAT_SIO_HOST,
      chatSIONamespace: process.env.CHAT_SIO_NAMESPACE,
      chatFirebaseApiKey: process.env.CHAT_FIREBASE_API_KEY,
      chatFirebaseAuthDomain: process.env.CHAT_FIREBASE_AUTH_DOMAIN,
      chatFirebaseDataUrl: process.env.CHAT_FIREBASE_DATA_BASEURL,
      chatFirebaseProjectId: process.env.CHAT_FIREBASE_PROJECT_ID,
      chatFirebaseStorageBucket: process.env.CHAT_FIREBASE_STORAGE_BUCKET,
      chatFirebaseMessagingSenderId: process.env.CHAT_FIREBASE_MESSAGING_SENDER_ID,
      chatFirebaseAppId: process.env.CHAT_FIREBASE_APP_ID,
      chatFirebaseMeasurementId: process.env.CHAT_FIREBASE_MEASUREMENT_ID,
      chatApiAuthInstagram: process.env.CHAT_API_AUTH_INSTAGRAM,
      chatInstagramAppId: process.env.CHAT_INSTAGRAM_APP_ID
    }
  },

  /*
  ** Global CSS
  */
  css: [
    '~/assets/css/global.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/main-utils.js',
    '~/plugins/api-utils.js',
    '~/plugins/object-utils.js'
  ],
  /*
  ** Auto import components
  ** See https://nuxtjs.org/api/configuration-components
  */
  components: true,
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxtjs/date-fns',
    '@aceforth/nuxt-optimized-images',
    '@nuxtjs/google-analytics'
  ],

  optimizedImages: {
    optimizeImages: true,
    optimizeImagesInDev: false
  },

  googleAnalytics: {
    id: 'UA-162036547-1',
    debug: {
      enabled: false
    }
  },

  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/pwa'
  ],

  pwa: {
    meta: {
     ogType: false,
     ogTitle: false,
     ogDescription: false,
     description: false
    }
  },

  /*
  ** Build configuration
  */
  build: {
    loadingScreen: false,
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
      config.resolve.alias['vue'] = 'vue/dist/vue.common'
    }
  },

  hooks: {
    listen(server, listener) {
      process.env.INTERNAL_URL = listener.url
    }
  }
}
