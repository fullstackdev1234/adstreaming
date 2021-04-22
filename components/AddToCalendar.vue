<template>
  <div class="add-to-calendar">
    <button @click="showProviders = true">
      <span>Add to Calendar</span>
    </button>

    <ul class="add-to-calendar-providers" :class="{ 'is-active': showProviders }">
      <li v-for="provider in calendars" v-html="provider"/>
    </ul>
  </div>
</template>

<script>
import { addToCalendarData } from '~/assets/add-to-calendar.js'

export default {
  props: [ 'description', 'startDate', 'title' ],

  data() {
    return {
      showProviders: false,
      calendars: []
    }
  },

  mounted() {
    const providers = ['google', 'ical']
    const calendarData = addToCalendarData({
      data: {
        title: this.title,
        start: new Date(this.startDate),
        description: this.description,
        timezone: 'America/New_York'
      }
    })

    this.calendars = []
    providers.forEach(prov => this.calendars.push( calendarData[prov] ))

    document.addEventListener('click', () => {
      if (this.showProviders === false) return

      this.showProviders = false
    }, { capture: true })
  }
}
</script>

<style scoped>
.add-to-calendar {
  position: relative;
}

.add-to-calendar > button {
  align-items: center;
  background: url('~@/assets/img/calendar-icon.svg') rgba(252, 204, 4, .2) no-repeat center;
  border-radius: 38px;
  color: rgb(252, 204, 4);
  display: flex;
  height: 38px;
  justify-content: center;
  transition: ease .3s;
  width: 38px;
}

.add-to-calendar > button:hover {
  background-color: rgb(252, 204, 4);
  background-image: url('~@/assets/img/calendar-icon-active.svg');
}

.add-to-calendar > button span {
  display: none;
  white-space: nowrap;
}

.add-to-calendar-providers {
  background: #fff;
  border-radius: 6px;
  box-shadow: rgba(0,0,0,0.4) 0px 10px 26px;
  color: #333;
  left: 0;
  overflow: hidden;
  text-transform: none;
  pointer-events: none;
  position: absolute;
  top: 100%;
  transform: scaleY(0);
  transform-origin: top;
  transition: transform ease .3s;
}

.add-to-calendar-providers.is-active {
  pointer-events: all;
  transform: scaleY(1);
}

.add-to-calendar-providers >>> a {
  background-position: 13px 50%;
  background-repeat: no-repeat;
  background-size: 22px 100%;
  display: block;
  padding: 12px 15px 12px 45px;
  white-space: nowrap;
}

.add-to-calendar-providers >>> a:hover {
  background-color: #eee;
}

.add-to-calendar-providers >>> .icon-google {
  background-image: url('~@/assets/img/add-to-calendar-google.svg');
}

.add-to-calendar-providers >>> .icon-ical {
  background-image: url('~@/assets/img/add-to-calendar-apple.svg');
}

@media (max-width: 460px) {
  .add-to-calendar > button,
  .add-to-calendar > button:hover {
    background-color: transparent;
    background-image: url('~@/assets/img/calendar-icon-mobile.svg');
    background-position: left;
    padding-left: 24px;
    transition: none;
    width: auto;
  }

  .add-to-calendar > button span {
    display: block;
  }
}
</style>
