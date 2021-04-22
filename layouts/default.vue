<template>
  <div>
    <nuxt />
  </div>
</template>

<script>
export default {
  head() {
    return {
      meta: [
        { property: 'fb:app_id', content: '2252861731672218' }
      ],

      script: [
        // Google Adsense
        {
          src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
          async: true,
          'data-ad-client' : 'ca-pub-7510744857341647'
        },

        // OneTrust Cookies Consent
        {
          src: 'https://cookie-cdn.cookiepro.com/scripttemplates/otSDKStub.js',
          'data-domain-script': 'b5a4deaf-2875-478c-b7dd-c733f7e9ceb7',
          hid: 'onetrust'
        },
        {
          src: 'https://cmp-cdn.cookielaw.org/consent/cmp-features/cmp-features.js',
          hid: 'cookielaw-consent'
        },
        { innerHTML: 'function OptanonWrapper(){}' },
        {
          src: 'https://cdn.cookielaw.org/opt-out/otCCPAiab.js',
          'ccpa-opt-out-ids': 'C0004',
          'ccpa-opt-out-geo': 'ca',
          'ccpa-opt-out-lspa': 'true',
          hid: 'cookielaw'
        },
    
        // Facebook pixel
        {
          innerHTML: [
            `if(typeof fbq === 'undefined'){`,
            `!function(f,b,e,v,n,t,s)`,
            `{if(f.fbq)return;n=f.fbq=function(){n.callMethod?`,
            `n.callMethod.apply(n,arguments):n.queue.push(arguments)};`,
            `if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';`,
            `n.queue=[];t=b.createElement(e);t.async=!0;`,
            `t.src=v;s=b.getElementsByTagName(e)[0];`,
            `s.parentNode.insertBefore(t,s)}(window,document,'script',`,
            `'https://connect.facebook.net/en_US/fbevents.js');`,
            `fbq('init', '3576616205763207');`,
            `}`,
            `fbq('track', 'PageView');`
          ].join('')
        },

        // Quantcast Tag
        {
          innerHTML: [
            `var _qevents = _qevents || [];`,
            `(function() {`,
            `var elem = document.createElement('script');`,
            `elem.src = (document.location.protocol == "https:" ? "https://secure" : "http://edge") + ".quantserve.com/quant.js";`,
            `elem.async = true;`,
            `elem.type = "text/javascript";`,
            `var scpt = document.getElementsByTagName('script')[0];`,
            `scpt.parentNode.insertBefore(elem, scpt);`,
            `})();`,
            `_qevents.push({`,
            `qacct:"p-QMv0_LBRBy-rX"`,
            `});`
          ].join('')
        },

        // comScore Tag
        {
          innerHTML: [
            `var _comscore = _comscore || [];`,
            `_comscore.push({ c1: "2", c2: "34035553" });`,
            `(function() {`,
            `var s = document.createElement("script"), el = document.getElementsByTagName("script")[0]; s.async = true;`,
            `s.src = (document.location.protocol == "https:" ? "https://sb" : "http://b") + ".scorecardresearch.com/beacon.js";`,
            `el.parentNode.insertBefore(s, el);`,
            `})();`
          ].join('')
        },

        {
          src: '//d34r9qjv63o49.cloudfront.net/script.js',
          'data-api-autoplay': 'ads',
          hid: 'd34r9qjv63o49'
        },

        {
          src: 'https://js.ad-score.com/score.min.js?pid=1000449&tt=g#tid=DFP_JS&l1=omnisplayer&l2=&l3=&l4=omnisplayer.com&l5=Omnis&pub_domain=DOMAIN',
          async: true,
          hid: 'ad-score'
        },
        {
          id: 'twitter-jssdk',
          defer: true,
          src: 'https://platform.twitter.com/widgets.js',
          hid: 'twitter-jssdk',
          callback: () => window.twttr.widgets.load()
        }
      ],

      noscript: [
        // Facebook pixel
        { innerHTML: '<img height="1" width="1" src="https://www.facebook.com/tr?id=222429628866327&ev=PageView&noscript=1"/>' },

        // Quantcast Tag
        { innerHTML: '<div style="display:none;"><img src="//pixel.quantserve.com/pixel/p-QMv0_LBRBy-rX.gif" border="0" height="1" width="1" alt="Quantcast"/></div>' },

        // comScore Tag
        { innerHTML: '<img src="https://sb.scorecardresearch.com/p?c1=2&c2=34035553&cv=2.0&cj=1" />' }
      ],

      __dangerouslyDisableSanitizers: [ 'script', 'noscript' ]
    }
  }
}
</script>

<style>
</style>
