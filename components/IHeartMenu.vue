<template>
  <div data-test="header-full" class="css-dr6wji e1eawws40">
    <div ref="headerHamburger" class="header-hamburger">
      <svg fill="none" height="24" viewBox="0 0 24 24" width="24">
        <path d="M4 18H20C20.55 18 21 17.55 21 17C21 16.45 20.55 16 20 16H4C3.45 16 3 16.45 3 17C3 17.55 3.45 18 4 18ZM4 13H20C20.55 13 21 12.55 21 12C21 11.45 20.55 11 20 11H4C3.45 11 3 11.45 3 12C3 12.55 3.45 13 4 13ZM3 7C3 7.55 3.45 8 4 8H20C20.55 8 21 7.55 21 7C21 6.45 20.55 6 20 6H4C3.45 6 3 6.45 3 7Z" fill="#3F4447"></path>
      </svg>
    </div>

    <span class="header-logo">
      <div data-test="header-left" class="css-ayu99y e12uso5w0">
        <a class="css-kcr0rw" href="https://www.iheart.com/" title="iHeartRadio" target="_blank">
          <div class="image css-95u9q6">
            <div>
              <img alt="Holiday Logo" class="element css-12yjgno" src="//i.iheart.com/v3/re/new_assets/5ebd8d8f5e00c7f05231f4f9?ops=fit(180%2C38)">
              <div class="default css-120zbbk"></div>
            </div>
          </div>
        </a>
        <a class="ez246370 css-119veyi" data-test="nav-link" title="Upgrade Now" href="https://www.iheart.com/upgrade?upsellFrom=54" target="_blank">
          <button class="e6yvf4d0 css-1qyzkzy ed6pl3l0" data-test="upgrade-now" aria-label="Upgrade Now">
            <span data-test="shared-button-background" class="css-110ss4 eoloy8b0"></span>
            <div data-test="shared-button-children" class="css-1jdsurw e16gqp9y0">Upgrade</div>
          </button>
        </a>
      </div>
    </span>

    <div ref="headerMiddle" class="css-im4zx6 e1gwncks0">
      <ul ref="headerMenuMain" class="css-hsm3e5 e1jswzaf0">
        <li data-test="header-menu-item" class="css-17ibqby e13fikfm0" v-for="menu in visibleMenu" :key="menu.url">
          <a :href="menu.url" target="_blank">{{ menu.title }}</a>
        </li>
        <div ref="menuDropdown" class="css-19wfdma ehpglum0" role="listitem">
          <span data-test="dropdown-trigger-wrapper" class="css-qesx4o ef96odz0">
            <div data-test="more-menu-icon" class="css-fr59j0 emubihf0">
              More
              <svg fill="none" height="24" viewBox="0 0 12 8" width="12" data-test="header-expand-down" class="">
                <path d="M9.87998 1.29L5.99998 5.17L2.11998 1.29C1.72998 0.899998 1.09998 0.899998 0.70998 1.29C0.31998 1.68 0.31998 2.31 0.70998 2.7L5.29998 7.29C5.68998 7.68 6.31998 7.68 6.70998 7.29L11.3 2.7C11.69 2.31 11.69 1.68 11.3 1.29C10.91 0.909998 10.27 0.899998 9.87998 1.29Z" fill="#3F4447"></path>
              </svg>
            </div>
          </span>
          <div data-test="dropdown-content-wrapper" class="css-1n3l0wp ej1klb10">
            <ul data-test="dropdown-content-list" class="css-u8keuz e14l6xm0">
              <li data-test="dropdown-item" v-for="menu in moreMenu" :key="menu.url">
                <a :href="menu.url" target="_blank">{{ menu.title }}</a>
              </li>
            </ul>

            <span data-test="dropdown-arrow" class="css-19x6ief eatmbi30">
              <svg viewBox="0 0 20 10">
                <filter id="headerMenuDropdown">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="2"></feGaussianBlur>
                </filter>
                <g>
                  <path filter="url(#headerMenuDropdown)" opacity="0.2" points="M0,20 L10,10 L20,20" stroke="black"></path>
                  <polygon fill="white" points="0,10 10,0 20,10"></polygon>
                </g>
              </svg>
            </span>
          </div>
        </div>
      </ul>
    </div>

    <div ref="sideNavContainer" class="side-nav-container">
      <nav class="css-1coh1ld" data-test="side-nav">
        <a class="css-6s7g7s" href="/" title="iHeartRadio" target="_blank">
          <img alt="Holiday Logo" class="element css-12yjgno" src="//i.iheart.com/v3/re/new_assets/5ebd8d3d5e00c7f05231f4f6?ops=fit(180%2C38)">
        </a>
        <div ref="scrollContainer" class="css-1vfiy5y">
          <ul class="css-zr3fas">
            <a class="css-f2e8ma" data-test="nav-link" href="https://www.iheart.com/upgrade/?upsellFrom=332" target="_blank">Upgrade Now</a>
            <li class="css-125mpj7" v-for="menu in mainMenu" :key="menu.url">
              <a class="css-6ab0ro" :href="menu.url" target="_blank">{{ menu.title }}</a>
            </li>
          </ul>
          <div ref="topShadow" class="css-t5rpvy"></div>
          <div ref="bottomShadow" class="css-gp55k5"></div>
        </div>
        <div class="css-3613m1">
          <a class="css-wdr8j5" data-test="nav-link" href="https://www.iheart.com/apps/" target="_blank"><span>Get The App</span></a>
        </div>
      </nav>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mainMenu: [{
        url: 'https://www.iheart.com/for-you/',
        title: 'For You'
      }, {
        url: 'https://www.iheart.com/your-library/',
        title: 'Your Library'
      }, {
        url: 'https://www.iheart.com/live/',
        title: 'Live Radio'
      }, {
        url: 'https://www.iheart.com/podcast/',
        title: 'Podcasts'
      }, {
        url: 'https://www.iheart.com/artist/',
        title: 'Artist Radio'
      }, {
        url: 'https://www.iheart.com/playlist/',
        title: 'Playlists'
      }, {
        url: 'https://www.iheart.com/genre/',
        title: 'Genres'
      }, {
        url: 'https://www.iheart.com/news/',
        title: 'News'
      }, {
        url: 'https://www.iheart.com/content/iheartradio-features/',
        title: 'Features'
      }, {
        url: 'https://news.iheart.com/contests/',
        title: 'Contests'
      }, {
        url: 'https://news.iheart.com/photo/',
        title: 'Photos'
      }],

      visibleMenu: [],
      moreMenu: []
    }
  },

  mounted() {
    this.renderMenu()

    window.addEventListener('resize', () => this.renderMenu())

    this.setupMobileMenu()
  },

  methods: {
    renderMenu() {
      const menu = this.$refs.headerMiddle
      const mainMenu = this.$refs.headerMenuMain
      const moreMenu = this.$refs.menuDropdown

      menu.style.overflow = 'hidden'
      const menuWidth = menu.getBoundingClientRect().width
      menu.style.overflow = 'visible'
      moreMenu.style.display = 'block'

      this.visibleMenu = []
      this.moreMenu = []
      // 40 = initial padding of the menu
      let widthSum = 40 + moreMenu.getBoundingClientRect().width
      for (const item of this.mainMenu) {
        const el = document.createElement('li')
        el.classList.add('css-17ibqby')
        Object.assign(el.style, {
          left: '-9999px',
          position: 'absolute'
        })
        el.innerText = item.title
        mainMenu.appendChild(el)
        const { width } = el.getBoundingClientRect()
        el.remove()

        // 30 = margin-right of the menu item
        widthSum += parseFloat(width) + 30

        if (widthSum >= menuWidth) {
          this.moreMenu.push(item)
        } else {
          this.visibleMenu.push(item)
        }
      }

      if (this.moreMenu.length === 0) {
        moreMenu.style.display = 'none'
      }
    },

    setupMobileMenu() {
      const topShadow = this.$refs.topShadow
      const bottomShadow = this.$refs.bottomShadow
      const scrollContainer = this.$refs.scrollContainer
      scrollContainer.addEventListener('scroll', () => {
        bottomShadow.style.opacity = scrollContainer.offsetHeight + scrollContainer.scrollTop >= scrollContainer.scrollHeight ? 0 : 1
        topShadow.style.opacity = scrollContainer.scrollTop > 0 ? 1 : 0
      })

      const sideNav = this.$refs.sideNavContainer
      sideNav.addEventListener('click', e => {
        if (e.target !== sideNav) return

        sideNav.classList.remove('is-open')
      })

      this.$refs.headerHamburger.addEventListener('click', () => {
        sideNav.classList.add('is-open')
      })
    }
  }
}
</script>

<style scoped>
.css-dr6wji {
  align-items: center;
  background-color: rgb(255, 255, 255);
  border-bottom: 2px solid rgb(197, 205, 210);
  display: flex;
  height: 58px;
  justify-content: space-between;
  left: 0;
  line-height: 21.6px;
  padding: 0 15px;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
}

.header-logo {
  display: flex;
  flex-grow: 1;
  justify-content: center;
  /* the width of the hamburger menu */
  margin-right: 29px;
}

.css-im4zx6 a {
  color: #2f3133;
}

.css-ayu99y {
  align-items: center;
  display: flex;
  flex: 0 0 auto;
}

.css-ayu99y > :first-child {
  margin-right: 10px;
}

.css-kcr0rw {
  height: 39px;
  width: 180px;
}

.css-119veyi {
  color: #27292d;
  cursor: pointer;
  display: none;
  float: none;
  font-size: 14px;
  font-weight: 400;
  line-height: 16px;
  text-decoration: none;
  transition: all 300ms ease-in-out;
  width: auto;
}

.css-1qyzkzy {
  -webkit-appearance: button;
  appearance: button;
  align-items: center;
  background-color: rgb(198, 0, 43);
  background-position: center center;
  border: 2px outset buttonface;
  border-radius: 999px;
  color: rgb(255, 255, 255);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  height: 100%;
  justify-content: center;
  line-height: 16px;
  margin: 0;
  min-height: 27px;
  outline: none;
  padding-left: 20px;
  padding-right: 20px;
  position: relative;
  width: auto;
}

.css-110ss4 {
  background-position: center;
  border-radius: 999px;
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  transition: all 0.4s ease-in-out;
  width: 100%;
  z-index: 1;
}

.css-1qyzkzy:not(:disabled):hover .eoloy8b0 {
  background-image: radial-gradient(circle, transparent 1%, rgba(0, 0, 0, 0.15) 1%);
  background-color: rgba(0, 0, 0, 0.15);
  background-size: 15000%;
  background-position: center center;
}

.css-1jdsurw {
  align-items: center;
  cursor: pointer;
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 2;
}

.css-im4zx6 {
  display: none;
  position: relative;
  text-align: left;
  width: 100%;
}

.css-hsm3e5 {
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  margin: 0;
  padding: 0 20px;
}

.css-17ibqby {
  display: inline-block;
  margin-right: 30px;
  white-space: nowrap;
}

.css-17ibqby a {
  color: rgb(113, 114, 119);
  position: relative;
  text-decoration: none;
}

.css-17ibqby a:hover {
  color: rgb(39, 41, 45);
}

.css-19wfdma {
  display: inline-block;
  position: relative;
  vertical-align: middle;
}

.css-qesx4o {
  display: flex;
  flex-direction: column;
  opacity: 0.6;
}

.css-fr59j0,
.header-hamburger {
  align-items: center;
  cursor: pointer;
  display: flex;
  justify-content: center;
  transform: translateY(-2px);
}

svg:not(:root) {
  overflow: hidden;
}

.css-fr59j0 svg,
.header-hamburger {
  margin-left: 5px;
}

.css-1n3l0wp {
  align-items: flex-end;
  bottom: auto;
  display: flex;
  flex-direction: column-reverse;
  max-height: 0;
  max-width: 0;
  opacity: 0;
  position: absolute;
  right: calc(-11px);
  top: calc(100% - 10px + 10px);
  overflow: hidden;
}

.css-u8keuz {
  background-color: rgb(255, 255, 255);
  border-radius: 5px;
  box-shadow: rgba(23, 23, 23, 0.2) 0 1px 10px;
  clear: both;
  color: rgb(24, 24, 24);
  display: flex;
  flex-direction: column;
  list-style: none;
  margin: 0;
  overflow-y: scroll;
  padding: 15px 0;
  text-align: left;
  width: 100%;
}

.css-u8keuz li {
  margin: 3px 15px;
}

.css-u8keuz a {
  cursor: pointer;
  white-space: nowrap;
}

.css-u8keuz a:hover {
  text-decoration: underline;
}

.css-19x6ief {
  clear: both;
  display: block;
  float: right;
  height: 11px;
  padding-left: 15px;
  padding-right: 10px;
  position: relative;
  z-index: 4;
  top: 3px;
}

.css-19x6ief svg {
  bottom: auto;
  display: block;
  position: relative;
  transform: translateY(5px);
  width: 20px;
  transition: all 0.1s cubic-bezier(0.3, 0, 0, 1.1) 0s;
}

.css-qesx4o:hover,
.css-qesx4o.cy-hover {
  opacity: 1;
}

.css-1n3l0wp:hover,
.css-qesx4o:hover + .ej1klb10,
.css-qesx4o.cy-hover + .ej1klb10 {
  max-height: 100vh;
  max-width: 100vw;
  opacity: 1;
  overflow: initial;
  z-index: 10000;
}

.css-1n3l0wp:hover svg,
.css-qesx4o:hover + .ej1klb10 svg,
.css-qesx4o.cy-hover + .ej1klb10 svg {
  transform: translateY(1px);
}

/* Mobile menu */
.side-nav-container {
  background-color: rgba(24, 24, 24, .4);
  bottom: 0;
  left: 0;
  position: fixed;
  top: 0;
  transition: visibility 300ms ease;
  visibility: hidden;
  width: 100%;
  z-index: 1140;
}

.side-nav-container.is-open {
  visibility: visible;
}

.side-nav-container.is-open .css-1coh1ld {
  margin-left: 0;
}

.css-1coh1ld {
  background: #333;
  display: flex;
  flex-direction: column;
  height: 100%;
  left: 0;
  margin: 0 0 0 -322.6px;
  max-width: 322.6px;
  position: absolute;
  top: 0;
  transition: margin 0.5s;
  width: 100%;
}

.css-6s7g7s {
  height: 39px;
  margin-left: 15px;
  margin-top: 8px;
  margin-bottom: 8px;
  width: 180px;
}

.css-1vfiy5y {
  height: 100%;
  overflow-y: scroll;
  width: 100%;
}

.css-1vfiy5y::-webkit-scrollbar {
  display: none;
}

.css-zr3fas {
  display: inline-block;
  list-style: none;
  margin: 0;
  padding: 0;
  vertical-align: middle;
  width: 100%;
}

.css-t5rpvy {
  background-image: linear-gradient(rgb(42, 42, 42), rgba(51, 51, 51, 0) 25%);
  border-top: 1px solid rgb(197, 205, 210);
  bottom: 75px;
  display: block;
  max-width: 322.6px;
  opacity: 0;
  pointer-events: none;
  position: fixed;
  top: 54px;
  transition: opacity 0.5s ease 0s;
  width: 100%;
}

.css-gp55k5 {
  background-image: linear-gradient(to top,rgba(42,42,42,1),rgba(51,51,51,0) 25%);
  bottom: 75px;
  display: block;
  max-width: 322.6px;
  opacity: 1;
  pointer-events: none;
  position: fixed;
  top: 55px;
  transition: opacity 0.5s;
  width: 100%;
}

.css-f2e8ma {
  background-color: rgb(198, 0, 43);
  border-radius: 5px;
  color: rgb(255, 255, 255);
  display: inline-block;
  font-size: 16px;
  height: 45px;
  line-height: 45px;
  margin: 15px;
  padding: 0 15px;
  text-align: center;
  width: calc(100% - 30px);
}

.css-125mpj7 {
  color: #717277;
  display: inline-block;
  font-size: 16px;
  line-height: 2.8;
  width: 100%;
}

.css-6ab0ro {
  display: inline-block;
  color: #d7d7d7;
  margin: 0;
  padding-left: calc(15px * 2 + 6px);
  width: 100%;
}

.css-3613m1 {
  border-top: 1px solid #717277;
  max-width: 322.6px;
  padding: 0 15px;
  width: 100%;
}

.css-wdr8j5 {
  background-color: transparent;
  border: 2px solid rgba(255,255,255,0.5);
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  display: inline-block;
  font-size: 16px;
  height: 45px;
  line-height: 45px;
  margin-bottom: 15px;
  margin-top: 15px;
  padding: 0 15px;
  text-align: center;
  vertical-align: middle;
  width: 100%;
}

@media (min-width: 768px) {
  .header-hamburger {
    display: none;
  }

  .css-119veyi {
    display: block;
  }

  .css-im4zx6 {
    display: block;
  }

  .header-logo {
    flex: 0;
    margin-right: 0;
  }
}
</style>
