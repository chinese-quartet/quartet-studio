<template>
  <a-row style="width: 100%; height: 100%">
    <notice v-if="noticeVisible" @disable="disableNotice" @close="closeNotice" style="margin-bottom: 3px">
      <span style="font-size: 18px; color: #fff; text-align: center; display: inherit">
        The Quartet Data Portal only supports access from modern browsers, such as
        <icon-font type="icon-chrome" /> Chrome, <icon-font type="icon-Safari" /> Safari,
        <icon-font type="icon-firefox" /> Firefox or <icon-font type="icon-Edge-01" /> Edge.
      </span>
    </notice>
    <notice style="margin-bottom: 3px" :hideClose="true" :hideDisable="true">
      <span style="font-size: 18px; color: #fff; text-align: center; display: inherit">
        We're announcing the release of our new documentation service >>>
        <a href="https://docs.chinese-quartet.org">https://docs.chinese-quartet.org</a> <<<
      </span>
    </notice>
    <a-row class="search-page">
      <a-row class="header-container">
        <a-col class="left" :lg="24" :md="24" :sm="24" :xs="24">
          <a-col class="title" :lg="20" :md="24" :sm="24" :xs="24">
            <h2>
              {{ title }}
              <a-icon theme="filled" @click="playVideo" class="icon-twinkle" type="youtube" />
            </h2>
            <span>{{ summary }}</span>
          </a-col>
          <a-col class="logo" :lg="4" :md="0" :sm="0" :xs="0">
            <img :src="require('@/assets/images/qdp_large_logo.png')" />
          </a-col>
        </a-col>
        <a-row class="button-group">
          <a-button
            class="request-button"
            @click="
              () => {
                this.$router.push({ name: 'materials' })
              }
            "
          >
            Request Reference Materials
          </a-button>
          <a-button
            class="request-button"
            @click="
              () => {
                this.$router.push({ name: 'download-genomics-data' })
              }
            "
          >
            Download MultiOmics Data
          </a-button>
          <a-button
            class="request-button"
            @click="
              () => {
                this.$router.push({ name: 'appstore' })
              }
            "
          >
            Analyze Your Omics Data
          </a-button>
        </a-row>
        <a-col class="right" :lg="24" :md="24" :sm="24" :xs="24">
          <p class="content" v-html="welcomeMsg"></p>
        </a-col>
      </a-row>
      <a-row class="description-container">
        <a-col class="top">
          <span class="title">Data Portal Summary</span>
          <span class="description">Release v1.0 (October 18, 2021)</span>
        </a-col>
        <a-col class="bottom">
          <a-col v-for="item in statisticsData" :key="item.key" :span="6">
            <a-row class="item">
              <span class="label">{{ item.label }}</span>
              <span class="value">{{ item.value }}</span>
            </a-row>
          </a-col>
        </a-col>
      </a-row>
      <!-- <a-row class="content-container" style="display: none">
        <a-col class="left" :xl="8" :lg="8" :md="24" :sm="24">
          <a-row style="height: 135px">
            <span style="font-size: 1rem; font-weight: bold">News</span>
            <a-col>
              <a href="">Quartet Data Portal is now open to the public</a>
            </a-col>
          </a-row>
          <a-row>
            <span style="font-size: 1rem; font-weight: bold">Get Started by Exploring:</span>
            <a-input-search
              placeholder="Search for a Project, Primary Site, Case"
              @search="onSearch"
              disabled
              enterButton="Search"
              size="large"
              class="search-bar"
            />
            <a-row class="btn-group" :gutter="16">
              <a-col>
                <a-tooltip placement="top" title="Request Reference Materials" :arrowPointAtCenter="true">
                  <router-link
                    class="span-btn"
                    aria-current="false"
                    :to="{ name: 'materials' }"
                    style="background-color: #ffc65d"
                  >
                    <span class="span-icon"> <a-icon type="experiment" /> </span>&nbsp;
                    <span style="vertical-align: middle">Reference Materials</span>
                  </router-link>
                </a-tooltip>
              </a-col>
              <a-col>
                <a-tooltip placement="top" title="Browser and Download Multiomics Data" :arrowPointAtCenter="true">
                  <router-link
                    class="span-btn"
                    aria-current="false"
                    :to="{ name: 'data' }"
                    style="background-color: #f16745"
                  >
                    <span class="span-icon"> <a-icon type="deployment-unit" /> </span>&nbsp;
                    <span style="vertical-align: middle">Multiomics Data</span>
                  </router-link>
                </a-tooltip>
              </a-col>
              <a-col>
                <a-tooltip
                  placement="top"
                  title="Launch QC Assessment using Custom DataSets"
                  :arrowPointAtCenter="true"
                >
                  <router-link
                    class="span-btn"
                    aria-current="false"
                    :to="{ name: 'project-management' }"
                    style="background-color: #7bc8a4"
                  >
                    <span class="span-icon"> <a-icon type="hdd" /> </span>&nbsp;
                    <span style="vertical-align: middle">Quality Assessment</span>
                  </router-link>
                </a-tooltip>
              </a-col>
              <a-col>
                <a-tooltip placement="top" title="Discover the Reference Datasets" :arrowPointAtCenter="true">
                  <router-link
                    class="span-btn"
                    aria-current="false"
                    :to="{ name: 'download-reference-datasets' }"
                    style="background-color: #4cc3d9"
                  >
                    <span class="span-icon"> <a-icon type="dot-chart" /> </span>&nbsp;
                    <span style="vertical-align: middle">Reference Datasets</span>
                  </router-link>
                </a-tooltip>
              </a-col>
            </a-row>
          </a-row>
        </a-col>
        <a-col class="right" :xl="16" :lg="16" :md="24" :sm="24">
          <fact style="display: none" class="fact-container"></fact>
          <img
            style="width: 100%; margin: 0px 10px"
            :src="require('@/assets/images/quality-platform-framework-v3.png')"
          />
        </a-col>
      </a-row> -->
      <a-row class="footer-container">
        <p class="description" v-html="description"></p>
      </a-row>
    </a-row>
    <div class="mask-window" @click="stopVideo" v-if="videoViewerVisible"></div>
    <video-viewer @close="stopVideo" :data="video" :key="videoKey" v-if="videoViewerVisible"></video-viewer>
  </a-row>
</template>

<script>
import Fact from '@/views/datasource/Fact'
import VideoViewer from '@/views/video/VideoViewer'
import Notice from '@/views/dashboard/Notice.vue'
import IconFont from '@/components/IconFont'

export default {
  name: 'Quartet',
  data() {
    return {
      title: 'The Quartet Project',
      summary: 'Quality Control and Data Integration of Multi-omics Profiling',
      welcomeMsg:
        '<span>Multi-omics (or molecular phenomics) profiling at the genomic, transcriptomic, proteomic, and metabolomic levels is the cornerstone of high-throughput technologies for discovering biomarkers for precision medicine. However, the lack of quality control procedures of multi-omics profiling during data generation and data analysis can lead to false findings, raising serious concerns about the reliability of multi-omics studies.</span><span>The Quartet Project provides publicly accessible multi-omics reference materials and practical tools to enhance the reproducibility and reliability of multi-omics results. Well-characterized multiomics reference materials and quality control metrics pertinent to precision medicine study purposes can be used to measure and mitigate technical variation, enabling more accurate cross-batch and cross-omics data integration in increasingly large-scale and longitudinal studies such as the International Human Phenome Project.</span>',
      statisticsData: [
        {
          key: 'cell-lines',
          label: 'Cell Lines',
          value: 4
        },
        {
          key: 'omics',
          label: 'Omics',
          value: 6
        },
        {
          key: 'reference-materials',
          label: 'Reference Materials',
          value: 20
        },
        {
          key: 'reference-datasets',
          label: 'Reference Datasets',
          value: 16
        },
        {
          key: 'platforms',
          label: 'Platforms',
          value: 26
        },
        {
          key: 'sites',
          label: 'Sites',
          value: 27
        },
        {
          key: 'libraries',
          label: 'Libraries',
          value: 1323
        },
        {
          key: 'files',
          label: 'Files',
          value: 2646
        }
      ],
      description:
        'The Quartet project is designed in Fudan University (Shanghai, China). The Quartet multi-omics reference materials and datasets are publicly available and accessible. The recipients of the Reference Materials are highly encouraged to share their data with Fudan University through the Quartet Data Portal in order for us to improve the reference datasets and to better serve the community.',
      videoKey: '',
      videoViewerVisible: false,
      video: {
        youtube: [
          {
            title: '1. General Introduction',
            videoId: 'cDQydyuT_Ps'
          },
          {
            title: '2. Request Materials and Register an Account',
            videoId: 'GZa_UbSh_fA'
          },
          {
            title: '3. Uploading and Analyzing your Data',
            videoId: 'BV-uqufLAhw'
          }
        ]
      },
      noticeVisible: true
    }
  },
  props: {},
  methods: {
    disableNotice() {
      this.closeNotice()
      localStorage.setItem('datains__noticeVisible', JSON.stringify(this.noticeVisible))
    },
    closeNotice() {
      this.noticeVisible = false
    },
    onSearch() {},
    playVideo() {
      this.videoViewerVisible = true
      this.videoKey = Math.random()
        .toString(36)
        .slice(-8)
    },
    stopVideo() {
      this.videoViewerVisible = false
    }
  },
  components: {
    Fact,
    VideoViewer,
    Notice,
    IconFont
  },
  created() {
    const noticeVisible = JSON.parse(localStorage.getItem('datains__noticeVisible'))
    console.log('Quartet Dashboard: ', noticeVisible, noticeVisible === undefined ? true : noticeVisible)
    this.noticeVisible = noticeVisible === null ? true : noticeVisible
  }
}
</script>

<style lang="less">
@border-radius: 4px;

.search-page {
  border-radius: @border-radius;
  height: 100%;
  width: 100%;
  padding: 20px 50px;
  background-color: #fff;
  overflow: scroll;

  .header-container {
    height: fit-content;
    border-radius: @border-radius;
    color: rgb(78, 78, 78);
    // text-align: center;

    .date {
      font-size: 1rem;
      font-weight: 400;
    }

    .left {
      border-radius: @border-radius;
      padding: 10px 20px 0px;
      display: flex;
      flex-direction: row;
      align-content: space-between;

      .title {
        h2 {
          font-weight: bold;
          font-size: 2.8rem;
          text-align: left;
          margin: 0px;
        }

        span {
          font-size: 25px;
          text-align: left;
          width: 100%;
          display: flex;
        }
      }

      .logo {
        text-align: end;

        img {
          width: 120px;
          height: 120px;
          border-radius: 5px;
        }
      }
    }

    .button-group {
      margin-left: 20px;
    }

    .request-button {
      font-size: 16px;
      margin-right: 10px;
      background-color: #ffffff;
      color: #1890ff;
    }

    .right {
      display: flex;
      flex-direction: column;
      padding: 10px 20px 0px;

      .content {
        font-size: 1rem;
        margin-bottom: 10px;
        text-align: justify;
        font-weight: 300;

        span {
          display: block;
          margin-bottom: 10px;
        }
      }
    }
  }

  .description-container {
    margin: 0px auto;
    border: 2px solid #d6d6d6;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;

    .top {
      text-align: center;

      .title {
        display: block;
        font-size: 1.4rem;
        color: #011049a6;
        font-weight: bold;
        margin-right: 10px;
      }

      .description {
        display: block;
        font-size: 1.1rem;
        color: #d6d6d6;
      }
    }

    .bottom {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;

      .item {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        height: 60px;

        .label {
          font-size: 1rem;
          font-weight: bold;
          margin-bottom: 5px;
          text-align: center;
        }

        .value {
          text-align: center;
          font-size: 1rem;
          font-weight: bold;
        }
      }
    }
  }

  .content-container {
    .left {
      padding: 0rem 1rem 0px 1rem;

      .search-bar {
        width: 100%;
        margin: 10px auto;
      }

      .btn-group {
        display: flex;
        flex-direction: column;

        .ant-col {
          margin-bottom: 5px;
        }

        .span-btn {
          display: inline-block;
          white-space: wrap;
          text-align: left;
          font-size: 1rem;
          height: 3rem;
          width: 100%;
          color: white !important;
          padding: 0.5rem 1rem 0.5rem 0.5rem;
          margin-bottom: 5px;
          border-radius: 6px;
          transition: all 0.25s ease 0s;
          text-decoration: none !important;

          .span-icon {
            -webkit-box-align: center;
            -webkit-box-pack: center;
            background-color: rgba(255, 255, 255, 0.35);
            width: 2rem;
            height: 2.1rem;
            vertical-align: middle;
            font-size: 1rem;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 0.5rem;
          }
        }

        .span-btn:hover {
          opacity: 0.8;
        }
      }
    }

    .right {
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-width: 500px;

      .fact-container {
        margin-top: 2rem;
        margin-bottom: 1rem;
        width: 100%;
      }

      img {
        width: 100%;
        padding: 0px 20px 0px 0px;
      }
    }
  }

  .footer-container {
    padding: 1rem 16px;

    .description {
      font-size: 1rem;
      margin: 0px;
      text-align: justify;
    }
  }
}

// Small devices (landscape phones, 576px and up)
@media (min-width: 576px) {
  .search-page {
    .description-container {
      width: calc(100% - 32px);
      margin: 0px 16px;
    }
  }
}

// Medium devices (tablets, 768px and up)
@media (min-width: 768px) {
  .search-page {
    .description-container {
      width: calc(100% - 32px);
      margin: 0px 16px;
    }
  }
}

// Large devices (desktops, 992px and up)
@media (min-width: 992px) {
  .search-page {
    .description-container {
      width: 65%;
      margin: 0px auto;
    }
  }
}

@keyframes heartAnimate {
  0%,
  100% {
    transform: scale(1) rotate(0);
  }

  10%,
  30% {
    transform: scale(0.9) rotate(2deg);
  }

  20%,
  40%,
  60%,
  80% {
    transform: scale(1.1) rotate(-2deg);
  }

  50%,
  70% {
    transform: scale(1.1) rotate(2deg);
  }
}

@-webkit-keyframes heartAnimate {
  0%,
  100% {
    -webkit-transform: scale(1) rotate(0);
  }

  10%,
  30% {
    -webkit-transform: scale(0.9) rotate(2deg);
  }

  20%,
  40%,
  60%,
  80% {
    -webkit-transform: scale(1.1) rotate(-2deg);
  }

  50%,
  70% {
    -webkit-transform: scale(1.1) rotate(2deg);
  }
}

@-moz-keyframes heartAnimate {
  0%,
  100% {
    -moz-transform: scale(1) rotate(0);
  }

  10%,
  30% {
    -moz-transform: scale(0.9) rotate(2deg);
  }

  20%,
  40%,
  60%,
  80% {
    -moz-transform: scale(1.1) rotate(-2deg);
  }

  50%,
  70% {
    -moz-transform: scale(1.1) rotate(2deg);
  }
}

@-o-keyframes heartAnimate {
  0%,
  100% {
    -o-transform: scale(1) rotate(0);
  }

  10%,
  30% {
    -o-transform: scale(0.9) rotate(2deg);
  }

  20%,
  40%,
  60%,
  80% {
    -o-transform: scale(1.1) rotate(-2deg);
  }

  50%,
  70% {
    -o-transform: scale(1.1) rotate(2deg);
  }
}

@-ms-keyframes heartAnimate {
  0%,
  100% {
    -ms-transform: scale(1) rotate(0);
  }

  10%,
  30% {
    -ms-transform: scale(0.9) rotate(2deg);
  }

  20%,
  40%,
  60%,
  80% {
    -ms-transform: scale(1.1) rotate(-2deg);
  }

  50%,
  70% {
    -ms-transform: scale(1.1) rotate(2deg);
  }
}

.icon-twinkle {
  color: #ff8901;
  vertical-align: super;
  font-size: 2rem;
  margin-left: 10px;
  height: 25px;
  margin-right: 5px;
  -webkit-animation: heartAnimate 3s ease infinite;
  -moz-animation: heartAnimate 3s ease infinite;
  -o-animation: heartAnimate 3s ease infinite;
  -ms-animation: heartAnimate 3s ease infinite;
  animation: heartAnimate 3s ease infinite;
}
</style>
