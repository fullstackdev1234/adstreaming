<template>
  <nuxt-link to="/" class="logo">
    <img src="~/assets/img/logo.png" width="52" height="70" alt="omnis logo"/>
  </nuxt-link>
</template>

<style scoped>
a {
  height: 50px;
  left: 20px;
  position: absolute;
  text-decoration: none;
  top: 20px;
  z-index: 11;
}

a img {
  display: block;
  height: 100%;
  width: auto;
}

@media (min-width: 1105px) {
  a {
    height: 50px;
    left: 45px;
    top: 45px;
  }
}
</style>
