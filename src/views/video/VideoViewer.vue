<template>
  <a-tabs class="video-viewer" :activeKey="currentKey" @change="changeTabPane">
    <a-tab-pane :key="dataKey" v-for="dataKey in keys">
      <span slot="tab">
        <a-icon type="youtube" />
        {{ getTitle(dataKey) }}
      </span>
      <a-row class="content">
        <a-col class="left" :span="18">
          <bilibili :videoId="videoId" v-if="currentKey === 'bilibili' && videoId"></bilibili>
          <youtube
            :video-id="videoId"
            v-if="currentKey === 'youtube' && videoId"
            :fitParent="true"
            ref="youtube"
          ></youtube>
        </a-col>
        <a-col class="right" :span="6">
          <a-list size="large" :data-source="videoList">
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
      videoList: []
    }
  },
  methods: {
    getTitle(key) {
      return v.titleCase(key)
    },
    changeTabPane(key) {
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
  position: absolute;
  top: 10px;
  z-index: 1000;
  width: 80%;
  left: 10%;

  .ant-tabs-content,
  .ant-tabs-bar {
    background-color: #fff;
  }

  .ant-tabs-bar {
    margin-bottom: 10px;
  }

  .content {
    display: flex;
    flex-direction: row;

    .left {
      overflow: scroll;
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