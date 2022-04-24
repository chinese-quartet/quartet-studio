<template>
  <page-view :title="getTitle()" logo="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png">
    <detail-list slot="headerContent" size="small" :col="2" class="detail-layout">
      <detail-list-item term="Report Type">{{ report.reportType }}</detail-list-item>
      <detail-list-item term="Started Time">{{ report.startedAt }}</detail-list-item>
      <detail-list-item term="Finished Time">{{ report.finishedAt }}</detail-list-item>
      <detail-list-item term="Description">{{ report.description }}</detail-list-item>
      <detail-list-item term="Status">
        <a-tag color="green">Finished</a-tag>
      </detail-list-item>
    </detail-list>
    <a-row slot="extra" class="status-list">
      <a-col :xs="8" :sm="8">
        <div class="text">Related Project</div>
        <div class="heading">
          <a-button
            disabled
            type="primary"
            size="small"
            icon="logout"
            @click.native="backToProjectList(report.relatedProjectId)"
          />
        </div>
      </a-col>
      <a-col :xs="8" :sm="8">
        <div class="text">Download</div>
        <div class="heading">
          <a-button
            type="primary"
            size="small"
            icon="download"
            @click.native="downloadFile('multi-report.html', reportUrl)"
          />
        </div>
      </a-col>
      <a-col :xs="8" :sm="8">
        <div class="text">Show Log</div>
        <div class="heading">
          <a-popover placement="leftTop" trigger="click">
            <template slot="content">
              <a-row v-html="log" class="log-container"></a-row>
            </template>
            <a-button type="primary" size="small" @click="loadLog(report)" icon="eye" />
          </a-popover>
        </div>
      </a-col>
    </a-row>

    <a-row class="header-btn-group">
      <a-popover v-model="logVisible" placement="leftTop" trigger="click">
        <template slot="content">
          <a-icon type="close-circle" style="float: right" theme="filled" slot="content" @click="hideLog" />
          <a-row v-html="log" class="log-container"></a-row>
        </template>
        <a-button type="primary" @click="loadLog(report)" icon="eye">Show Log</a-button>
      </a-popover>
      <a-button
        type="primary"
        icon="download"
        style="margin-left: 10px"
        @click.native="downloadFile('multi-report.html', reportUrl)"
      >
        Download
      </a-button>
    </a-row>
    <embeded-frame :src="reportUrl" class="embeded-frame"></embeded-frame>
  </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import EmbededFrame from '@/views/iframe/EmbededFrame'
import DetailList from '@/components/Tools/DetailList'
import { GetTask } from './util'
import { makeDownloadUrl } from '@/api/manage'
import axios from 'axios'

const DetailListItem = DetailList.Item

export default {
  name: 'ReportDetails',
  components: {
    PageView,
    DetailList,
    DetailListItem,
    EmbededFrame
  },
  props: {
    readonly: {
      type: [Boolean, String],
      default: true
    }
  },
  data() {
    return {
      report: {},
      log: '',
      reportUrl: '',
      logVisible: false
    }
  },
  computed: {
    reportId() {
      return this.$route.params.reportId
    }
  },
  methods: {
    hideLog() {
      this.logVisible = false
    },
    downloadFile(filename, link) {
      this.$message.info('Please hold on, downloading...')
      axios.get(link).then(response => {
        var element = document.createElement('a')
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(response.data))
        element.setAttribute('target', '_blank')
        element.setAttribute('download', filename)

        element.style.display = 'none'
        document.body.appendChild(element)

        element.click()

        document.body.removeChild(element)
      })
    },
    loadLog(report) {
      const key = report.response.log

      makeDownloadUrl('minio', 'tservice', {
        key: key
      })
        .then(response => {
          console.log('Make Download Url: ', key, response)

          axios
            .get(response.download_url)
            .then(response => {
              console.log('Report Log: ', response)
              if (response.data.msg && response.data.msg.length > 0) {
                this.log = response.data.msg.replaceAll('\n', '<br/>')
              } else {
                this.log = 'No logs have been generated yet, please check back later.'
              }
              this.logVisible = true
            })
            .catch(error => {
              this.log = 'Not Found'
            })
        })
        .catch(error => {
          console.log('Make Download Url Error: ', error)
          this.log = 'Not Found'
        })
    },
    backToProjectList(projectId) {
      this.$router.push({ name: 'project-management', params: { projectId: projectId } })
    },
    getTitle() {
      return this.$route.meta.title
    },
    searchReport(reportId) {
      GetTask(reportId).then(data => {
        this.report = data
        console.log('Report Record: ', data)

        if (this.report.response) {
          const key = this.report.response.report

          makeDownloadUrl('minio', 'tservice', {
            key: key
          })
            .then(response => {
              console.log('Make Download Url: ', key, response)

              this.reportUrl = response.download_url
            })
            .catch(error => {
              console.log('Make Download Url Error: ', error)
              this.$message.warn('Not found the report.')
              this.$router.go(-1)
            })
        }
      })
    }
  },
  mounted() {},
  created() {
    this.$message.info("The report file size is large, please wait a moment.", 5)
    console.log('Request Report: ', this.reportId)
    this.searchReport(this.reportId)
  }
}
</script>

<style lang="less" scoped>
.embeded-frame {
  height: 92vh;
}

.report {
  padding: 20px 80px 0px 20px;
  background: white;
  border-radius: 10px;
}

.detail-layout {
  margin-left: 44px;
}

.text {
  text-align: right;
  color: rgba(0, 0, 0, 0.45);
}

.heading {
  text-align: right;
  display: block;
  color: rgba(0, 0, 0, 0.85);
  font-size: 16px;
}

.mobile {
  .detail-layout {
    margin-left: unset;
  }

  .status-list {
    text-align: left;
  }
}

.header-btn-group {
  position: absolute;
  margin: 10px;
  right: 20px;
  z-index: 10;
}
</style>

<style lang="less">
.log-container {
  max-width: 300px;
  max-height: 200px;
  overflow: scroll;
}

.log-container::-webkit-scrollbar {
  width: 0 !important;
}
</style>
