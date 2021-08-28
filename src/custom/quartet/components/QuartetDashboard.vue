<template>
  <a-row class="search-page">
    <a-row class="header-container">
      <a-col class="left" :span="8">
        <!-- <img width="100%" height="100%" src="https://xenabrowser.net/bdbd099a8d2ef9593481ec8369f88ab4.png" /> -->
        <img width="100%" height="100%" src="/design-qc.png" />
      </a-col>
      <a-col class="right" :span="16">
        <span class="title">{{ title }}</span>
        <p class="content" v-html="welcomeMsg"></p>
        <span class="date">Version: Data Release 1.0 - July 15, 2020</span>
      </a-col>
    </a-row>
    <a-row class="content-container">
      <a-col class="left" :xl="8" :lg="8" :md="24" :sm="24">
        <a-row style="height: 135px;">
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
              <a-tooltip placement="top" title="Discover the Reference Datasets" :arrowPointAtCenter="true">
                <router-link
                  class="span-btn"
                  aria-current="false"
                  :to="{ name: 'visualization' }"
                  style="background-color: #4cc3d9"
                >
                  <span class="span-icon"> <a-icon type="dot-chart" /> </span>&nbsp;
                  <span style="vertical-align: middle">Reference Datasets</span>
                </router-link>
              </a-tooltip>
            </a-col>
            <a-col>
              <a-tooltip placement="top" title="Launch QC Assessment using Custom DataSets" :arrowPointAtCenter="true">
                <router-link
                  class="span-btn"
                  aria-current="false"
                  :to="{ name: 'appstore' }"
                  style="background-color: #7bc8a4"
                >
                  <span class="span-icon"> <a-icon type="hdd" /> </span>&nbsp;
                  <span style="vertical-align: middle">Quality Assessment</span>
                </router-link>
              </a-tooltip>
            </a-col>
          </a-row>
        </a-row>
      </a-col>
      <a-col class="right">
        <fact style="display: none" class="fact-container"></fact>
        <img
          style="width: 100%"
          src="https://nordata-cdn.oss-cn-shanghai.aliyuncs.com/choppy/quality-platform-framework-v3.png"
        />
      </a-col>
    </a-row>
    <a-row class="footer-container">
      <span class="title">{{ title }}</span>
      <p class="description" v-html="description"></p>
    </a-row>
  </a-row>
</template>

<script>
import Fact from '@/views/datasource/Fact'

export default {
  name: 'Quartet',
  data() {
    return {
      title: 'Welcome to the Quartet Data Portal',
      welcomeMsg:
        'The Quartet Data Portal is built to democratize access to the unique Quartet resources and enhance quality consciousness of the community.',
      viewExamples: [],
      description:
        'Quality control of multi-omics profiling requires reliable reference materials and reference datasets, ' +
        'which have been established in the Quartet Project. The Quartet Data Portal is built to democratize ' +
        'access to the unique Quartet resources and enhance quality consciousness of the community. ' +
        'We provide a convenient channel for users to request the reference DNA, RNA, ' +
        'protein and metabolite materials, as well as multi-level datasets that are generated across platforms, ' +
        'labs, protocols, and batches. Interactive visualization is supported to explore the datasets ' +
        'from different dimensions and scenarios. We further integrate knowledge gained ' +
        'from the Quartet Project to evaluate the quality of user-submitted multi-omics data ' +
        'and generate a quality assessment report. ' +
        'Importantly, the Quartet Data Portal can achieve continuous evolution ' +
        'with communitywide participation by facilitating reference materials sharing, ' +
        'integrating new data generated by the community, and upgrading the reference datasets, ' +
        'analysis methods, and thresholds of QC metrics.'
    }
  },
  props: {},
  methods: {
    onSearch() {}
  },
  components: {
    Fact
  }
}
</script>

<style lang="less" scoped>
@height: 160px;
@border-radius: 4px;

.search-page {
  border-radius: @border-radius;
  height: 100%;
  width: 100%;
  background-color: #fff;
  min-height: 90vh;

  .header-container {
    height: @height;
    border-radius: @border-radius;
    // background-color: #1a535c;
    background-color: #dae1ed;
    color: rgb(78, 78, 78);
    text-align: center;
    margin-bottom: 20px;

    .date {
      font-size: 1rem;
      font-weight: 400;
    }

    .left {
      height: @height;
      border-radius: @border-radius;
      padding: 10px;
    }

    .right {
      display: flex;
      flex-direction: column;
      height: @height;
      padding: 10px 20px 0px;

      .title {
        font-size: 1.5rem;
        padding: 0px 0px 10px;
        text-align: left;
      }

      .content {
        font-size: 1.1rem;
        margin-bottom: 10px;
        text-align: justify;
        font-weight: 300;
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
      padding: 0rem 0px 0px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-right: 20px;
      min-width: 500px;

      .fact-container {
        margin-top: 2rem;
        margin-bottom: 1rem;
        width: 100%;
      }
    }
  }

  .footer-container {
    display: none;
    padding: 1rem 1.5rem 0px 1.5rem;

    .title {
      font-size: 2rem;
    }

    .description {
      font-size: 1rem;
      margin: 0px;
      text-align: justify;
    }
  }
}
</style>
