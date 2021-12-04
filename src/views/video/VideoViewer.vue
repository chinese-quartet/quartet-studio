<template>
  <a-tabs class="video-viewer" :activeKey="currentKey" @change="changeTabPane">
    <a-tab-pane :key="dataKey" v-for="dataKey in keys">
      <span slot="tab">
        <a-icon type="youtube" />
        {{ getTitle(dataKey) }}
      </span>
      <a-row class="content">
        <a-col class="left" :span="18">
          <a-spin v-if="loading" />
          <a-row v-show="!loading" class="video-container">
            <!-- TODO: Bilibili's api is low, how to fix it? -->
            <!-- <bilibili :videoId="videoId" v-if="currentKey === 'bilibili' && videoId"></bilibili> -->
            <youtube
              :resize="true"
              @ready="isReady"
              @error="isError"
              :video-id="videoId"
              :player-vars="{ origin: 'http://chinese-quartet.org' }"
              v-if="currentKey === 'youtube' && videoId && !errorMode"
              :fitParent="true"
              ref="youtube"
            ></youtube>
            <a v-if="errorMode" :href="'https://www.youtube.com/watch?v=' + videoId" target="_blank">
              Load failed, open video in youtube
            </a>
          </a-row>
        </a-col>
        <a-col class="right" :span="6">
          <a-list size="large" :data-source="videoList" style="overflow: scroll; height: 100%">
            <a-list-item @click="playVideo(item.videoId)" slot="renderItem" slot-scope="item, index">
              <span :class="{ highlight: item.videoId === videoId }">{{ item.title }}</span>
            </a-list-item>
          </a-list>
        </a-col>
      </a-row>
    </a-tab-pane>
  </a-tabs>
</template>

<script>
import v from 'voca'
import Bilibili from './Bilibili'
import Vue from 'vue'
import VueYoutube from 'vue-youtube'

Vue.use(VueYoutube)

export default {
  components: { Bilibili },
  props: {
    data: {
      required: true,
      type: Object
    }
  },
  computed: {
    keys() {
      return Object.keys(this.data)
    }
  },
  data() {
    return {
      currentKey: '',
      videoId: null,
      videoList: [],
      loading: false,
      errorMode: false
    }
  },
  methods: {
    isError(e) {
      console.log('Video Error: ', e)
      this.loading = false
      this.errorMode = true
    },
    isReady(e) {
      console.log('Video Ready: ', e)
      this.loading = false
      this.errorMode = false
    },
    getTitle(key) {
      return v.titleCase(key)
    },
    changeTabPane(key) {
      this.loading = true
      this.currentKey = key
      this.videoList = this.data[key]
      this.videoId = this.videoList[0] ? this.videoList[0].videoId : null
    },
    playVideo(videoId) {
      this.videoId = videoId
    }
  },
  created() {
    this.changeTabPane(this.keys[0])
  }
}
</script>

<style lang="less">
.video-viewer {
  border-radius: 5px;
  position: absolute;
  top: calc((100% - 400px) / 2 - 40px);
  z-index: 1000;
  width: 853.75px;
  left: calc((100% - 853.75px) / 2);

  .ant-tabs-content,
  .ant-tabs-bar {
    background-color: #fff;
  }

  .ant-tabs-bar {
    margin-bottom: 3px;
  }

  .content {
    display: flex;
    flex-direction: row;

    .left {
      overflow: scroll;
      display: flex;
      justify-content: center;
      align-items: center;

      .video-container {
        height: 360px;
        overflow: hidden;
      }

      .video-container iframe {
        height: 360px;
        width: 640px;
      }
    }

    .right {
      padding: 0px 10px;
      border-left: 1px solid #eee;

      .ant-list-item:hover {
        cursor: pointer;
      }

      .highlight {
        color: #1890ff;
      }
    }
  }
}
</style>