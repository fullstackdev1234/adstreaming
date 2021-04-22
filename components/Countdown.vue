<template>
  <div class="countdown">
    <span class="countdown-label">
      <span id="countdown-days" class="countdown-number">{{ days }}</span>
      Days
    </span>
    <span class="countdown-separator">:</span>

    <span class="countdown-label">
      <span id="countdown-hours" class="countdown-number">{{ hours }}</span>
      Hours
    </span>
    <span class="countdown-separator">:</span>

    <span class="countdown-label">
      <span id="countdown-minutes" class="countdown-number">{{ minutes }}</span>
      Minutes
    </span>
    <span class="countdown-separator">:</span>

    <span class="countdown-label">
      <span id="countdown-seconds" class="countdown-number">{{ seconds }}</span>
      Seconds
    </span>
  </div>
</template>

<script>
export default {
  props: {
    target: { type: String, required: true },
    vod: { type: String, required: true },
    redirectMinutes: { type: Number, required: true }
  },

  data() {
    return {
      // http://en.wikipedia.org/wiki/List_of_tz_database_time_zones
      // -4 is New York
      timezone: -5,
      days: '00',
      hours: '00',
      minutes: '00',
      seconds: '00'
    }
  },

  computed: {
    targetTime() {
      return this.prepareDate(this.target)
    },

    vodTime() {
      return this.prepareDate(this.vod)
    }
  },

  mounted() {
    this.countdown()
  },

  methods: {
    countdown() {
      const startTime = this.convertTimezone(this.timezone).getTime()

      const untilTarget = this.targetTime.getTime() - startTime
      const untilVod = this.vodTime.getTime() - startTime

      if (untilTarget <= this.redirectMinutes * 60 * 1000 + 2000) {
        this.$emit('live-reached')
      }

      if (untilTarget <= 0) {
        this.$emit('target-reached')
      }

      if (untilVod <= 0) {
        this.$emit('vod-reached')
      } else {
        setTimeout(() => {
          this.countdown()
        }, 1000)
      }

      this.calcTime(untilTarget < 0 ? 0 : untilTarget)
    },

    // Converts local timezone to target timezone
    convertTimezone(timezone) {
      const now = new Date()
      const localTime = now.getTime()
      const localOffset = now.getTimezoneOffset() * 60000
      const utc = localTime + localOffset

      return new Date(utc + 3600000 * timezone)
    },

    calcTime(dist) {
      // Time calculations for days, hours, minutes and seconds
      this.days = this.zeroPad(Math.floor(dist / (1000 * 60 * 60 * 24)))
      this.hours = this.zeroPad(Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))
      this.minutes = this.zeroPad(Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60)))
      this.seconds = this.zeroPad(Math.floor((dist % (1000 * 60)) / 1000))
    },

    zeroPad(val) {
      return val < 10 ? `0${val}` : val
    },

    prepareDate(date) {
      const [ y, m, d, h, i ] = date.split(/[-T:]/)

      return new Date(
        parseInt(y, 10),
        parseInt(m, 10) - 1,
        parseInt(d, 10),
        parseInt(h, 10),
        parseInt(i, 10),
        0
      )
    }
  }
}
</script>

<style scoped>
.countdown {
  align-items: flex-start;
  background: rgba(255,255,255,.2);
  border: 1px solid rgba(255,255,255,.3);
  display: inline-flex;
  margin-right: 20px;
  padding: 6px 15px;
}

.countdown-label {
  align-items: center;
  color: #bebebe;
  display: flex;
  flex-direction: column;
  font-size: 12px;
}

.countdown-number {
  color: #fff;
  font-size: 26px;
  font-weight: bold;
}

.countdown-separator {
  color: #e10b16;
  font-size: 26px;
  font-weight: bold;
  padding-left: 8px;
  padding-right: 8px;
}

@media (max-width: 414px) {
  .countdown {
    border-radius: 4px;
    margin-right: 0;
  }
}
</style>
