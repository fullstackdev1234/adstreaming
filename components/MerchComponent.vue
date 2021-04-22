<template>
  <div class="merch" v-if="merchandise.length">
    <ScrollBox class="merch-box" scrollVertical="true">
    <a :href="merch.link" class="card" target="_blank" v-for="merch in merchandise" :key="merch.id">
      <div class="card-image">
        <img :src="getImageUrl(merch, 'photo', 220)"/>
      </div>
      <div class="card-details">
        <div class="merch-description">
          <h1 class="merch-title">{{ merch.title }}</h1>
          <div class="merch-price">${{ merch.price }}</div>
        </div>
        <span class="merch-button">Buy Now</span>
      </div>
    </a>
    </ScrollBox>
  </div>
</template>

<script>

export default {
  props: ['merchandise']
}

</script>


<style scoped>

.scroll-box-container {
  width: 100%;
}

.tour-container {
  width: 100%;
}

.merch {
  margin-bottom: 30px;
}

.merch .merch-box {
  /*margin-right: -20px;*/
  padding: 0;
}

.merch > h1 {
  color: #fff;
  font-size: 22px;
  margin-bottom: 10px;
}

.merch .card {
  color: #fff;
  font-size: 15px;
  /*margin-right: 20px;*/
}

.merch .card-image {
  height: 220px;
  width: 220px;
  margin: 0 auto;
}

.merch .card-image > img {
  display: block;
  height: 100%;
  object-fit: contain;
  width: 100%;
}

.merch-description {
  align-items: center;
  display: flex;
  margin-bottom: 20px;
}

.merch-title {
  font-weight: normal;
  flex-grow: 1;
  height: 45px;
  /*margin-right: 12px;*/
  overflow: hidden;
  white-space: normal;
}

.merch-price {
  flex-shrink: 0;
  font-weight: bold;
  text-align: right;
}

.merch-button {
  background: transparent;
  border: 2px solid #e10b16;
  border-radius: 3px;
  color: #fff;
  display: block;
  font-size: 15px;
  font-weight: bold;
  padding: 10px 32px;
  text-align: center;
  text-decoration: none;
  transition: all .3s ease;
  width: 100%;
}

.merch-button:hover {
  background: #e10b16;
}

.card {
  margin-top: 1rem;
  position: relative;
  /*margin: 0 auto;*/
}

.merch-box .card:not(:last-child) {
  margin-bottom: 1rem;
}

.card-image {
  height: 140px;
  overflow: hidden;
  position: relative;
  width: 246px;
}

.card-image::after {
  background-image: linear-gradient(to top, #000, rgba(0,0,0,0) 50%);
  content: '';
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 4;
}

.card-image img {
  height: 100%;
  object-fit: cover;
  width: 100%;
  margin: 0 auto;
}

.card-details {
  padding: 15px;
  z-index: 5;
}

.card-subtitle {
  color: #888584;
  font-size: 11px;
  margin-bottom: 5px;
}

.card-title {
  color: #fff;
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.video-tabs-content-block.is-active {
  display: block;
}

@media (min-width: 768px) and (max-width: 1104px) {

}

@media (min-width: 1105px) {
  .scroll-box-container {
    /*padding: 30px 45px;*/
  }

  .you-might-like >>> .scroll-box {
    /*margin-right: -45px*/;
  }

  .you-might-like .card {
    /*margin-right: 20px;*/
  }

  .you-might-like .card-image {
    height: 160px;
    width: 290px;
  }

  .merch .merch-box {
    /*margin-right: -45px;*/
  }

  .merch >>> .scroll-box {
    /*margin-left: -20px;*/
    padding: 20px;
  }

  .merch .card {
    /*margin-right: 15px;*/
    position: relative;
    transition: transform .3s ease;
  }

  .merch .card:hover {
    box-shadow: 0 5px 8px 5px rgba(0,0,0,.5);
    transform: scale(1.02);
    z-index: 1000;
  }

  .merch .card:hover .card-details {
    opacity: 1;
  }

  .merch .card-image {
    height: 195px;
    width: 100%;
    margin: 0 auto;
  }

  .merch .card-details {
    background: rgba(57, 64, 71, .8);
    bottom: 0;
    left: 0;
    opacity: 0;
    padding: 20px 30px;
    position: absolute;
    right: 0;
    text-align: center;
    top: 0;
    transition: opacity .3s ease;
  }

  .merch-description {
    flex-direction: column;
  }

  .merch-title {
    margin-bottom: 30px;
    text-align: center;
    width: 100%;
  }

  .merch-price {
    text-align: center;
  }

  .merch-button {
    border: 0;
    bottom: 0;
    color: #e10b16;
    font-size: 12px;
    left: 0;
    position: absolute;
    right: 0;
    text-transform: uppercase;
  }

  .merch-button:hover {
    background: none;
  }
}
</style>
