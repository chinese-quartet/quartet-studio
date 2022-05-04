<template>
  <div class="uploading-task-list">
    <a-card style="margin-top: 10px" :bordered="false">
      <a-badge slot="extra" showZero :count="pagination.total" :numberStyle="{ backgroundColor: '#52c41a' }" />
      <div slot="title">
        <a-radio-group @change="onClickRadioBtn" defaultValue="total" :value="radioGroupValue">
          <a-radio-button value="total">{{ $t('datasource.uploadTaskList.total') }}</a-radio-button>
          <a-radio-button value="Started">{{ $t('datasource.uploadTaskList.started') }}</a-radio-button>
          <a-radio-button value="Finished">{{ $t('datasource.uploadTaskList.finished') }}</a-radio-button>
          <a-radio-button value="Failed">{{ $t('datasource.uploadTaskList.failed') }}</a-radio-button>
        </a-radio-group>

        <a-input-search
          disabled
          style="margin-left: 16px; width: 272px"
          :placeholder="$t('datasource.uploadTaskList.enterDataSetName')"
          :loading="loading"
          allowClear
          @search="onSearchTask"
        />
      </div>

      <a-list size="large" :loading="loading" :pagination="pagination">
        <a-list-item :key="index" v-for="(item, index) in data">
          <a-col :lg="4" :md="6" :sm="24" :xs="24">
            <a-list-item-meta>
              <a-tag slot="description">{{ item.dataType }}</a-tag>
              <a-popover slot="avatar" placement="right">
                <template slot="content">
                  <a-descriptions
                    title="DataSet Info"
                    size="small"
                    bordered
                    style="max-width: 800px"
                    :column="{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }"
                  >
                    <a-descriptions-item label="Contact Email">
                      {{ item.email }}
                    </a-descriptions-item>
                    <a-descriptions-item label="Manager">
                      {{ item.manager }}
                    </a-descriptions-item>
                    <a-descriptions-item label="Status">
                      {{ item.status }}
                    </a-descriptions-item>
                    <a-descriptions-item label="Data Type">
                      {{ item.dataType }}
                    </a-descriptions-item>
                    <a-descriptions-item label="Description">
                      {{ item.description }}
                    </a-descriptions-item>
                  </a-descriptions>
                </template>
                <img :src="logoMap[item.dataType]" class="logo" />
              </a-popover>
              <span slot="title">{{ item.name }}</span>
            </a-list-item-meta>
          </a-col>
          <a-col class="list-content" :lg="16" :md="14" :sm="24" :xs="24" :gutter="16">
            <a-col class="list-content-item" :span="14">
              <span class="title">
                {{ $t('datasource.uploadTaskList.uploadPath') }}
                <a-icon type="eye" @click="redirectToFS(item.uploadPath)"></a-icon>
              </span>
              <a-tooltip>
                <template slot="title">
                  <span style="cursor: pointer" @click="doCopy(item.uploadPath)">Copy Uploading Path</span>
                </template>
                <a-tag color="blue" class="path-tag">
                  {{ item.uploadPath }}
                </a-tag>
              </a-tooltip>
            </a-col>
            <a-col class="list-content-item" :span="5" style="display: none">
              <span class="title">{{ $t('datasource.uploadTaskList.status') }}</span>
              <a-progress
                style="padding-right: 50px"
                :stroke-color="strokeColor"
                :percent="item.percentage"
                status="active"
              />
            </a-col>
            <a-col class="list-content-item" :span="5">
              <span class="title">{{ $t('datasource.uploadTaskList.startedTime') }}</span>
              <p>{{ item.startedAt }}</p>
            </a-col>
            <a-col class="list-content-item" :span="6">
              <span class="title">{{ $t('datasource.uploadTaskList.finishedTime') }}</span>
              <p>{{ item.finishedAt }}</p>
            </a-col>
          </a-col>
          <div slot="actions">
            <!-- <a-button @click="redirectToFS(item.uploadPath)" v-if="item.percentage === 100" style="margin-right: 5px">
              {{ $t('datasource.uploadTaskList.viewFiles') }}
            </a-button> -->
            <a-popconfirm
              title="Do you confirm to generate a new token?"
              placement="topRight"
              ok-text="Yes"
              cancel-text="No"
              @confirm="onRefreshToken(item)"
              @cancel="() => {}"
            >
              <a-button :disabled="item.percentage === 100" style="margin-right: 5px" type="danger">
                {{ $t('datasource.uploadTaskList.refreshToken') }}
              </a-button>
            </a-popconfirm>
            <a-popconfirm ok-text="Yes" cancel-text="No" placement="topRight" @confirm="onCheckTask(item)" @cancel="() => {}">
              <span slot="title">
                Do you confirm to mark the dataset as completed?<br /><br />
                NOTE: The Quartet Data Portal will automatically check your metadata <br/>
                and data files. If everything is okay, you and Quartet Team will get an <br />
                email notification, and then you can view or analyze your data.
              </span>
              <a-button :disabled="item.percentage === 100" type="primary" icon="check">
                {{ $t('datasource.uploadTaskList.check') }}
              </a-button>
            </a-popconfirm>
          </div>
        </a-list-item>
      </a-list>
    </a-card>
    <a-modal
      class="token-info"
      @cancel="closeTokenModal"
      centered
      title="New Token Information (Only Show Once)"
      v-model="tokenVisible"
      :footer="null"
      :maskClosable="false"
    >
      <a-spin :spinning="spinning">
        <vue-json-pretty class="json-viewer" :data="token"></vue-json-pretty>
      </a-spin>
      <a-button class="token-download-btn" icon="download" @click="downloadAsJSON(token, 'tokenTag')">
        Download
      </a-button>
      <a id="tokenTag" v-show="false"></a>
    </a-modal>
    <a-modal width="50%" v-model="logVisible" title="Log Container" :footer="null">
      <a-row v-html="log" class="modal-log-container"></a-row>
    </a-modal>
    <div class="box" v-if="fileManagerActive" @click.stop="hideFileBrowser">
      <a-row class="file-manager-container">
        <file-browser
          :standalone="false"
          :height="500"
          filterType="/"
          :allowMultiSelection="false"
          :path="defaultPath"
          :strictedPrefix="strictedPrefix"
        ></file-browser>
      </a-row>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import { initTServiceHost } from '@/config/defaultSettings'
import { downloadAsJSON, logoMap } from '@/views/utils'
import VueJsonPretty from 'vue-json-pretty'

const tserviceHost = initTServiceHost()
const uploadingTaskEndpoints = {
  getTokenApi: id => {
    return `${tserviceHost}/api/tool/omics-dataset/${id}/refresh-token`
  },
  getStatusApi: id => {
    return `${tserviceHost}/api/tool/omics-dataset/${id}`
  },
  taskListApi: `${tserviceHost}/api/tasks`
}

export default {
  name: 'UploadTaskList',
  components: {
    VueJsonPretty,
    FileBrowser: () => import('@/views/filemanager/FileBrowser')
  },
  data() {
    return {
      logoMap,
      data: [],
      pagination: {
        pageSizeOptions: ['30', '50', '100'],
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: 30,
        total: 0,
        current: 1,
        onChange: (page, pageSize) => {
          this.pagination.current = page
          this.pagination.pageSize = pageSize
          this.onSearchTask(page, pageSize)
        },
        onShowSizeChange: (current, pageSize) => {
          this.pagination.current = 1
          this.pagination.pageSize = pageSize
          this.onSearchTask(1, pageSize)
        }
      },
      loading: false,
      radioGroupValue: 'total',
      strokeColor: { '0%': '#108ee9', '100%': '#87d068' },
      timer: null,
      spinning: false,
      tokenVisible: false,
      token: {
        accessKey: 'test',
        accessSecret: 'test',
        stsToken: 'test',
        authorizedCode: 'test',
        uploadPath: 'oss://quartet-data-portal/data/test/test-dataset/genomics/',
        region: 'oss-cn-shanghai',
        durationHours: 12,
        expiration: moment('2021-09-14T02:18:33Z').toLocaleString()
      },
      defaultPath: '',
      fileManagerActive: false,
      logVisible: false,
      log: 'Not Found'
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'kebab_nickname']),
    strictedPrefix() {
      return `oss://quartet-data-portal/data/${this.kebab_nickname}`
    }
  },
  methods: {
    downloadAsJSON,
    viewDataFiles() {
      this.defaultPath = this.strictedPrefix + '/'
      this.fileManagerActive = true
    },
    onRefreshToken(record) {
      this.spinning = true
      this.tokenVisible = true
      this.$http
        .post(uploadingTaskEndpoints.getTokenApi(record.id), {
          name: record.name,
          manager: this.kebab_nickname,
          email: record.email,
          data_type: record.dataType
        })
        .then(response => {
          console.log('Generate new token: ', response)
          this.token = {
            uploadPath: response.sts_token.osspath,
            region: response.sts_token.region,
            durationHours: 12,
            expiration: moment(response.sts_token.expiration).toLocaleString(),
            accessKey: response.sts_token.id,
            accessSecret: response.sts_token.secret,
            stsToken: response.sts_token.stoken,
            authorizedCode: response.authorization_code
          }
          this.spinning = false
        })
        .catch(error => {
          this.spinning = false
          this.$message.warn('Something wrong, please retry later.')
        })
    },
    closeTokenModal() {
      this.tokenVisible = false
      this.token = {
        accessKey: '',
        accessSecret: '',
        stsToken: '',
        authorizedCode: '',
        uploadPath: ''
      }
    },
    redirectToFS(path) {
      this.fileManagerActive = true
      this.defaultPath = path
    },
    hideFileBrowser(e) {
      if (e.target !== e.currentTarget) {
        return
      } else {
        this.fileManagerActive = false
        this.defaultPath = ''
      }
    },
    formatDateTime(datetime) {
      if (datetime) {
        return moment(datetime).format('YYYY-MM-DD HH:mm')
      } else {
        return ''
      }
    },
    formatStatus(status) {
      if (status === 'Started') {
        return '#108ee9'
      } else if (status === 'Failed') {
        return '#f50'
      } else if (status === 'Finished') {
        return '#87d068'
      }
    },
    onCheckTask(record) {
      this.$http
        .put(uploadingTaskEndpoints.getStatusApi(record.id), {
          name: record.name,
          email: record.email,
          manager: this.kebab_nickname,
          data_type: record.dataType,
          description: record.description,
          status: 'Finished'
        })
        .then(response => {
          if (response.status === 'Success') {
            this.$message.success(`Dataset ${record.name}: check finished!`, 5)
            this.onSearchTask(this.pagination.current, this.pagination.pageSize)
          } else {
            this.$message.error(`Dataset ${record.name}: check failed!`, 5)
          }

          this.log = response.msg ? response.msg.replaceAll('\n', '<br/>') : 'Not Found'
          this.logVisible = true
        })
        .catch(error => {
          this.$message.warn('Something wrong, please retry later.')
        })
    },
    formatRecords(records) {
      const data = []
      records.forEach(record => {
        console.log('Format Records: ', record)
        const newRecord = {
          id: record.id,
          name: record.name,
          description: record.description,
          startedAt: this.formatDateTime(record.started_time),
          finishedAt: this.formatDateTime(record.finished_time),
          status: record.status,
          percentage: record.percentage,
          uploadPath: record.response.data.upload_link,
          dataType: record.payload.data_type,
          status: record.payload.status,
          durationSecords: record.payload.duration_seconds,
          email: record.payload.email,
          manager: record.payload.manager
        }

        data.push(newRecord)
      })

      return data
    },
    onSearchTask(page, pageSize, status) {
      let params = {
        page: page,
        page_size: pageSize,
        plugin_name: 'omics-dataset'
      }

      if (status !== 'total') {
        params = Object.assign(params, {
          status: status
        })
      }

      this.$http
        .get(uploadingTaskEndpoints.taskListApi, {
          params: params
        })
        .then(response => {
          this.pagination.total = response.total
          this.pagination.current = response.page
          this.pagination.pageSize = response.page_size
          this.data = this.formatRecords(response.data)
          this.loading = false
        })
        .catch(error => {
          this.loading = false
          console.log('Get OmicsDataset Tasks: ', error)
          this.$message.error('Something wrong, please retry later!')
          this.data = []
        })
    },
    onClickRadioBtn(e) {
      this.radioGroupValue = e.target.value

      this.onSearchTask(this.pagination.current, this.pagination.pageSize, this.radioGroupValue)
    },
    doCopy(text) {
      console.log('Copy ', text)
      this.$copyText(text)
        .then(message => {
          console.log('copy', message)
          this.$message.success('Copied')
        })
        .catch(err => {
          console.log('copy.err', err)
          this.$message.error('Failed')
        })
    }
  },
  created() {
    this.onSearchTask(this.pagination.current, this.pagination.pageSize)
  },
  mounted() {
    this.timer = setInterval(() => {
      this.onSearchTask(this.pagination.current, this.pagination.pageSize)
    }, 60000)
  },
  beforeRouteLeave(to, from, next) {
    if (this.timer) {
      console.log('Clear the refresh timer.')
      clearInterval(this.timer)
      this.timer = null
    }
    next()
  },
  beforeDestroy() {
    if (this.timer) {
      console.log('Clear the refresh timer.')
      clearInterval(this.timer)
      this.timer = null
    }
  }
}
</script>

<style lang="less">
.text-center {
  text-align: center;
}

.token-info {
  .ant-modal-body {
    padding: 10px;
  }

  .token-download-btn {
    position: absolute;
    top: 15px;
    right: 50px;
  }

  .json-viewer {
    overflow: scroll;
    border: 1px solid #eeee;
    border-radius: 5px;
    margin-top: 10px;
    padding: 10px;
    max-height: 400px;
    background-color: #f5f5f5;
  }
}

.uploading-task-list {
  .ant-card-body {
    padding: 5px 24px;
  }

  .ant-list-pagination {
    margin: 10px 0px;
  }

  .ant-spin-nested-loading {
    overflow: scroll;
    height: calc(100vh - 300px);
  }

  .ant-list-item {
    flex-wrap: wrap;

    .ant-list-item-meta-title {
      margin-top: 4px;
    }

    .title,
    .ant-list-item-meta-title {
      font-size: 15px;
      color: #000000a6;
      font-weight: bold;
    }
  }

  .list-content {
    display: flex;
    flex-direction: row;
  }

  .ant-list-item-meta,
  .list-content-item {
    margin-top: 5px;
  }

  .ant-list-item-action {
    margin-left: 0px;
    float: right;
  }

  .list-content-item {
    color: rgba(0, 0, 0, 0.45);
    display: flex;
    flex-direction: column;
    vertical-align: middle;
    font-size: 14px;

    .ant-tag {
      margin-bottom: 5px;
    }

    span {
      line-height: 20px;
    }

    p {
      margin-top: 4px;
      margin-bottom: 0;
      line-height: 22px;
    }

    .path-tag {
      display: block;
      margin-top: 5px;
      margin-bottom: 0px;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }

  .logo {
    border-radius: 10px;
    font-size: 16px;
    padding: 4px;
    width: 55px;
    height: 55px;
    vertical-align: middle;
  }

  .logo:hover {
    cursor: pointer;
  }

  .box {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 10;

    .file-manager-container {
      top: 35%;
      position: absolute;
      width: 1000px;
      left: 50%;
      margin-top: -150px;
      margin-left: -500px;
      z-index: 1000;

      .file-list {
        border: 1px solid #d3d3d3;
        border-radius: 5px;
      }

      .ant-btn-group {
        margin-top: 5px;
        float: right;
      }
    }
  }
}

.modal-log-container {
  max-width: 100%;
  max-height: 300px;
  overflow: scroll;
}
</style>
