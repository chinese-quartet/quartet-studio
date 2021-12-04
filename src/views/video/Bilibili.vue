<template>
  <div class="bilibili">
    <iframe
      class="video-iframe"
      v-resize="{ log: true }"
      frameborder="no"
      scrolling="no"
      border="0"
      framespacing="0"
      seamless=""
      allowfullscreen
      :src="ihtml"
    ></iframe>
  </div>
</template>

<script>
export default {
  props: {
    videoId: {
      type: String,
      required: true
    }
  },
  computed: {
    ihtml() {
      return 'https://www.bilibili.com/video/' + this.videoId + '?high_quality=1&as_wide=1&danmaku=1'
    }
  },
  mounted() {
    function changeVideoIframe() {
      const video = document.getElementsByClassName('video-iframe')
      const width = document.getElementsByClassName('video-iframe')[0].scrollWidth
      for (let i = 0; i < video.length; i++) {
        video[i].style.height = width * 0.75 + 'px'
      }
    }
    changeVideoIframe()
    window.onresize = function() {
      changeVideoIframe()
    }
  }
}
</script>

<style lang="less" scoped>
.bilibili {
  position: relative;
  overflow: hidden;
  padding-top: 56.25%;
}

.video-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
}
</style>
