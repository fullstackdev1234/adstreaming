<template>
  <div id="video-tabs-social" class="twitter-feed video-tabs-content-block is-active">
    <!--script defer src="https://platform.twitter.com/widgets.js" charset="utf-8"></script -->
    <a class="twitter-timeline" data-lang="en" data-width="1000" data-theme="dark" data-tweet-limit="5" data-chrome="noheader nofooter transparent noborders" :href="twitter"></a>
  </div>
</template>

<script>

export default {
  props: ['twitter'],
  mounted() {
    if (window.twttr) {
      window.twttr.widgets.load()
    }
  },
  activated () {
    /*
    if (window.twttr) {
      console.log('activated twitter', window.twttr)
      window.twttr.widgets.load()
    }
    */
  }
}
</script>

<style scoped>
.video-tabs-content {
  list-style: none;
  margin: 0;
  padding: 0;
}

.video-tabs-content-block {
  display: none;
}


.scroll-box-container {
  width: 100%;
}

.video-tabs-content-block.is-active {
  display: block;
}


@media (min-width: 768px) and (max-width: 1104px) {

  .video-tabs-content {
    margin-top: 8px;
  }

}

@media (min-width: 1105px) {

}
</style>
