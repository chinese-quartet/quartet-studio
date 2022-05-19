<template>
  <a-row class="frame-container">
    <a-button class="button" shape="circle" v-if="toPath" icon="left" size="large" @click="onClickBack" />
    <a-spin class="vue-iframe" :spinning="spinning" v-show="spinning" size="large" />
    <iframe
      :id="id"
      :src="src"
      class="vue-iframe"
      v-show="!spinning"
      frameborder="0"
      allowfullscreen="true"
      scrolling="auto"
    >
    </iframe>
  </a-row>
</template>

<script>
import NProgress from 'nprogress' // progress bar

export default {
  name: 'EmbededFrame',
  components: {},
  data() {
    return {
      id: 'vue-iframe',
      spinning: false,
    }
  },
  props: {
    src: {
      type: String,
      required: true,
    },
    toPath: {
      type: String,
      required: false,
      default: null,
    },
  },
  methods: {
    reset() {
      this.spinning = true
    },
    onClickBack() {
      if (this.toPath) {
        this.$router.push({ name: this.toPath })
      }

      this.$emit('return')
    },
  },
  watch: {
    $route: 'reset',
  },
  mounted() {
    const self = this
    this.$nextTick(() => {
      const iframe = document.getElementById(self.id)
      if (iframe.attachEvent) {
        iframe.attachEvent('onload', () => {
          self.spinning = false
        })
      } else {
        iframe.onload = () => {
          self.spinning = false
        }
      }
    })
  },
  created() {},
}
</script>

<style lang="less">
.frame-container {
  width: 100%;
  min-height: 100%;

  .button {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 1000;
  }

  .vue-iframe {
    border: 0;
    height: 100%;
    // max-height: 650px;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
  }
}
</style>
