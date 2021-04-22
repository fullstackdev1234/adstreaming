<template>
  <footer>
    <div>TM + &copy; {{ copyrightYear }} Omnis, LLC. All rights reserved.</div>
    <nav>
      <a href="#" id="ot-sdk-btn-floating" @click.prevent="showPopup">{{ cookieSettingsText }}</a>
      <nuxt-link :to="{ name: 'legal-type_slug', params: page }" v-for="page in legalLinks" :key="page.id">{{ page.type }}</nuxt-link>
    </nav>
    <a href="#" class="to-top" @click.prevent="scrollTop">
      <img src="~/assets/img/to-top.svg" alt="Go to top" />
    </a>
  </footer>
</template>

<script>
export default {
  props: [ 'legalLinks' ],

  data() {
    return {
      copyrightYear: new Date().getFullYear(),
      cookieSettingsText: 'Cookie Settings'
    }
  },

  mounted() {
    this.updateCookieSettingsText()
  },

  methods: {
    scrollTop() {
      window.scrollTo(0,0)
    },

    showPopup() {
      OneTrust.ToggleInfoDisplay()
    },

    updateCookieSettingsText() {
      if (
        window.OneTrust &&
        OneTrust.GetDomainData() != null &&
        typeof OneTrust.GetDomainData() === 'object'
      ) {
        const { CookieSettingButtonText } = OneTrust.GetDomainData()
        this.cookieSettingsText = CookieSettingButtonText
        return
      }
      setTimeout(() => {
        this.updateCookieSettingsText()
      }, 500)
    }
  }
}
</script>

<style scoped>
footer {
  align-items: center;
  background-color: #242b33;
  color: #fff;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  margin-top: 30px;
  padding: 3px 35px 2px;
  position: relative;
  text-align: left;
}

footer a {
  color: #d3d4d6;
  text-decoration: none;
}

footer > div,
footer > nav {
  padding-bottom: 8px;
  padding-top: 10px;
  width: 100%;
}

footer > nav {
  border-top: 1px solid #373d44;
}

footer > nav a {
  padding-right: 12px;
}

.to-top {
  bottom: 0;
  height: 40px;
  position: absolute;
  right: 0;
  width: 40px;
}

.to-top img {
  display: block;
  width: 100%;
}

@media (min-width: 768px) {
  footer {
    flex-direction: row;
    justify-content: space-between;
    padding-left: 35px;
    padding-right: 45px;
  }

  footer > nav {
    border-top: 0;
    text-align: right;
  }
}
</style>
