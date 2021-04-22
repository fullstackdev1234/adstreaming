<template>
  <div class="scroll-box-container">
    <h1 v-if="title">{{ title }}</h1>
    <div class="scroll-box-navigation" v-if="showNavigation">
      <button ref="goLeft">
        <img src="~/assets/img/chevron-left.svg"/>
      </button>
      <button ref="goRight">
        <img src="~/assets/img/chevron-right.svg"/>
      </button>
    </div>
    <div class="scroll-box" :class="{'scroll-box--vertical': scrollVertical}" ref="box">
      <slot/>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'showNavigation',
    'title',
    'scrollVertical'
  ],

  mounted() {
    this.setupNavigation()
  },

  methods: {
    setupNavigation() {
      if (this.showNavigation !== true) return

      const goLeft = this.$refs.goLeft
      const goRight = this.$refs.goRight

      goLeft.addEventListener('click', () => this.scrollTheBox(-1))
      goRight.addEventListener('click', () => this.scrollTheBox(1))
    },

    scrollTheBox(multiplier) {
      const box = this.$refs.box
      const {
        marginLeft,
        marginRight,
        width
      } = window.getComputedStyle(box.childNodes[0])
      const boxWidth = parseFloat(width) + parseFloat(marginLeft) + parseFloat(marginRight)

      box.scrollTo(box.scrollLeft + multiplier * boxWidth, 0)
    }
  }
}
</script>

<style scoped>
.scroll-box-container {
  position: relative;
}

.scroll-box-container > h1 {
  color: #fff;
  font-size: 28px;
  margin-bottom: 20px;
}

.scroll-box-navigation {
  align-items: center;
  display: flex;
  height: 42px;
  position: absolute;
  right: 20px;
  top: 0;
}

.scroll-box-navigation button {
  align-items: center;
  background: rgba(255, 255, 255, .2);
  border: 1px solid rgba(255, 255, 255, .3);
  border-radius: 30px;
  display: flex;
  height: 30px;
  justify-content: center;
  margin-left: 10px;
  width: 30px;
}

.scroll-box {
  display: flex;
  overflow-x: scroll;
  overflow-y: none;
  scrollbar-width: none;
  white-space: nowrap;
}

.scroll-box--vertical {
  flex-direction: column;
  max-height: 600px;
  overflow-y: scroll;

}

.scroll-box::-webkit-scrollbar {
  display: none;
}

@media (min-width: 1105px) {
  .scroll-box-container > h1 {
    font-size: 34px;
    margin-bottom: 25px;
  }
}
</style>
