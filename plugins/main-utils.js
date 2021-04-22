import Vue from 'vue'

// Prepare the GDPR and USP values
let gdprApplies = 0
let gdprConsent = ''
let uspString = '1---'

// Run checks until the APIs are ready
if (process.client) {
  const checkForTCFtimer = setInterval(() => {
    if (window.__tcfapi == null) return

    clearInterval(checkForTCFtimer)
    window.__tcfapi('getTCData', 2, (tcData, success) => {
      if (success && tcData.gdprApplies) {
        gdprApplies = 1
        gdprConsent = tcData.tcString
      }
    })
  }, 500)

  const checkForUSPtimer = setInterval(() => {
    if (window.__uspapi == null) return

    clearInterval(checkForUSPtimer)
    window.__uspapi && window.__uspapi('getUSPData', 1, d => {
      uspString = d.uspString
    })
  }, 500)
}

Vue.mixin({
  methods: {
    getGdpr() {
      return {
        gdprApplies,
        gdprConsent
      }
    },

    getUsp() {
      return uspString
    },

    getFirst(obj, key, def = {}) {
      if (obj != null && obj.hasOwnProperty(key)) {
        if (Array.isArray(obj[key]) && obj[key].length > 0) {
          return obj[key][0]
        }
      }

      return def
    },

    getImageUrl(obj, key, size) {
      if (obj != null && obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'string' && obj[key]) {
          switch (size) {
            case 70:
              return require(`~/assets/content/${obj[key]}?resize&size=70`)
            case 220:
              return require(`~/assets/content/${obj[key]}?resize&size=220`)
            case 290:
              return require(`~/assets/content/${obj[key]}?resize&size=290`)
            case 308:
              return require(`~/assets/content/${obj[key]}?resize&size=308`)
            case 335:
              return require(`~/assets/content/${obj[key]}?resize&size=335`)
            case 425:
              return require(`~/assets/content/${obj[key]}?resize&size=425`)
            default:
              return require(`~/assets/content/${obj[key]}`)
          }
        }
      }

      // 1px transparent image
      return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGP6zwAAAgcBApocMXEAAAAASUVORK5CYII='
    },
  }
})

export default ({ app }) => {
  app.router.beforeEach((to, from, next) => {
    if (/\/index\.html$/.test(to.path)) next(to.path.replace(/index\.html$/, ''))
    else next()
  })
}
