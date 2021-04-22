<template>
  <div class="layout">
    <Logo/>

    <div class="header">
      <h1>{{ legal.type }}</h1>
    </div>

    <div class="container">
      <div class="row">
        <div class="col sidebar">
          <div class="sidebar-content">
            <h1>Legal</h1>
            <ul>
              <li v-for="page in legalLinks" :key="page.id">
                <nuxt-link :to="{ name: 'legal-type_slug', params: page }">{{ page.type }}</nuxt-link>
              </li>
            </ul>
          </div>
        </div>

        <div class="col content">
          <div class="last-update">Last updated: {{ $dateFns.format(legal.dateUpdated, 'MMMM d, yyyy') }}</div>
          <div v-html="legal.body"></div>
        </div>
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
    const currentPage = legalLinks.find(p => p.type_slug === params.type_slug)
    currentPage.body = marked(currentPage.body)

    return {
      legalLinks: app.$objectMap(legalLinks, app.$pluck('type', 'type_slug')),
      legal: currentPage
    }
  },

  data() {
    return {
      cookieRenderInterval: null
    }
  },

  updated() {
    this.renderCookieInfo()
  },

  mounted() {
    this.renderCookieInfo()
  },

  methods: {
    renderCookieInfo() {
      clearInterval(this.cookieRenderInterval)
      this.cookieRenderInterval = setInterval(() => {
        if (window.OneTrust) {
          OneTrust.initializeCookiePolicyHtml()
          clearInterval(this.cookieRenderInterval)
        }
      }, 500)
    }
  },

  head() {
    return {
      title: this.legal.type
    }
  }
}
</script>

<style scoped>
.layout {
  background: #fff;
  min-height: 100vh;
}

.header {
  background: #242b33;
  padding: 80px 20px 20px;
}

.header h1 {
  color: #fff;
  font-size: 25px;
  margin: 0;
}

.container {
  color: #19181d;
  margin-left: auto;
  margin-right: auto;
  max-width: 1200px;
  padding: 40px 20px;
  position: static;
  width: 100%;
}

.sidebar {
  margin-bottom: 40px;
}

.sidebar h1 {
  font-size: 28px;
  margin-bottom: 20px;
}

.sidebar a {
  color: #565559;
}

.content {
  color: #4f4f52;
  font-size: 14px;
  line-height: 1.6;
}

.content >>> h3 {
  color: #19181d;
  font-size: 16px;
  text-transform: uppercase;
}

.content >>> h4 {
  color: #19181d;
  font-size: 14px;
  margin-bottom: 20px;
  margin-top: 20px;
  text-transform: uppercase;
}

.content >>> p {
  margin-bottom: 14px;
}

.content >>> ul {
  list-style: disc;
  margin-bottom: 14px;
  padding-left: 20px;
}

.content >>> a {
  text-decoration: underline;
}

.content >>> .ot-cookies-td,
.content >>> .ot-cookies-td-content {
  word-wrap: break-all;
}

.last-update {
  color: #9e9ea0;
  margin-bottom: 8px;
}

@media (min-width: 768px) {
  .header {
    padding-bottom: 30px;
    padding-top: 100px;
  }

  .header h1 {
    font-size: 45px;
  }

  .container {
    padding-left: 20px;
    padding-right: 20px;
  }

  .sidebar {
    border-right: 2px solid #f4f4f5;
    flex: 0 0 auto;
    margin: 0;
    padding-right: 30px;
    padding-top: 80px;
    text-align: right;
    width: 235px;
  }

  .sidebar-content {
    position: -webkit-sticky;
    position: sticky;
    top: 0;
  }

  .sidebar h1 {
    font-size: 46px;
    line-height: 56px;
    margin-bottom: 30px;
  }

  .sidebar ul {
    font-size: 17px;
  }

  .sidebar li {
    margin-bottom: 17px;
  }

  .content {
    padding-bottom: 80px;
    padding-left: 30px;
    padding-top: 80px;
    width: 50%;
  }

  .content >>> h3 {
    font-size: 22px;
  }

  .content >>> h4 {
    margin-top: 58px;
  }

  .content >>> p {
    font-size: 17px;
  }

  .last-update {
    margin-bottom: 20px;
  }
}

@media (min-width: 1105px) {
  .logo {
    height: 50px;
    left: 50px;
    top: 50px;
  }

  .header {
    padding-bottom: 50px;
    padding-left: 50px;
    padding-right: 50px;
    padding-top: 190px;
  }

  .container {
    padding-left: 50px;
    padding-right: 50px;
  }

  .sidebar {
    padding-right: 60px;
    width: 335px;
  }

  .content {
    padding-left: 115px;
  }
}
</style>
