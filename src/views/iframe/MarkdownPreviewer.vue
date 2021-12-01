<template>
  <page-view :title="getTitle()" logo="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png">
    <template slot="action">
      <span class="markdown-tag">
        <a-tag color="#f50">{{ category }}</a-tag>
        <a-tag color="#108ee9">{{ path }}</a-tag>
      </span>
    </template>
    <a-row class="markdown">
      <vue-markdown :source="helpMsg" @rendered="update"></vue-markdown>
    </a-row>
  </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import axios from 'axios'
import VueMarkdown from 'vue-markdown'
import Prism from 'prismjs'
import { formatTitle } from '@/views/utils'

export default {
  components: {
    VueMarkdown,
    PageView
  },
  props: {
    url: {
      required: true,
      type: String
    }
  },
  computed: {
    path() {
      const path = new URL(this.url)
      return path.pathname
        .split('/')
        .slice(1, -1)
    },
    category() {
      const path = new URL(this.url)
      return path.hostname.split('.')[0]
    }
  },
  data() {
    return {
      helpMsg: ''
    }
  },
  methods: {
    getTitle() {
      return formatTitle(this, this.$route.meta.title)
    },
    update() {
      this.$nextTick(() => {
        Prism.highlightAll()
      })
    },
    fetchMarkdown(url) {
      axios
        .get(url)
        .then(response => {
          console.log('Fetch Help: ', response)
          this.helpMsg = response.data
        })
        .catch(error => {
          console.log('Fetch Help Error: ', error)
          this.helpMsg = 'No Content.'
        })
    }
  },
  created() {
    this.fetchMarkdown(this.url)
  }
}
</script>

<style lang="less" scoped>
.markdown-tag {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  height: 100%;

  span {
    font-size: 16px;
  }
}

.markdown {
  height: 100%;
  width: 100%;
  overflow: scroll;
  background-color: #fff;
  padding: 30px;
  border-radius: 5px;
}

.markdown::-webkit-scrollbar {
  width: 0 !important;
}
</style>