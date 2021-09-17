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
            type="primary"
            size="small"
            icon="logout"
            @click.native="backToProjectList(report.relatedProjectId)"
          />
        </div>
      </a-col>
      <a-col :xs="8" :sm="8">
        <div class="text">Report Log</div>
        <div class="heading">
          <a-popover placement="left">
            <template slot="content">
              <a-row v-html="log" class="log-container"></a-row>
            </template>
            <a-button type="primary" size="small" @click="loadLog(report.response.log)" icon="eye" />
          </a-popover>
        </div>
      </a-col>
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
      reportUrl: ''
    }
  },
  computed: {
    reportId() {
      return this.$route.params.reportId
    }
  },
  methods: {
    loadLog(logLink) {
      this.log = ''
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
          const key = JSON.parse(this.report.response).report

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
