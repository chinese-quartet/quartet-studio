<template>
  <div class="uploading-task-list">
    <a-card style="margin-top: 10px; height: 81vh" :bordered="false">
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
          <a-col :lg="6" :md="8" :sm="24" :xs="24">
            <a-list-item-meta>
              <div slot="description">{{ item.description }}</div>
              <a-popover slot="avatar" placement="right">
                <template slot="content">
                  <a-descriptions
                    title="DataSet Info"
                    size="small"
                    bordered
                    style="max-width: 800px"
                    :column="{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }"
                  >
                    <a-descriptions-item label="Access Key"> {{ item.accessKey }} </a-descriptions-item>
                    <a-descriptions-item label="Access Secret">
                      <a-button icon="copy" @click="doCopy(item.accessSecret)">Copy</a-button>
                    </a-descriptions-item>
                    <a-descriptions-item label="STS Token">
                      <a-button icon="copy" @click="doCopy(item.stsToken)">Copy</a-button>
                    </a-descriptions-item>
                    <a-descriptions-item label="Authorized Code">
                      <a-button icon="copy" @click="doCopy(item.authorizedCode)">Copy</a-button>
                    </a-descriptions-item>
                    <a-descriptions-item label="Cloud Path"> {{ item.uploadPath }} </a-descriptions-item>
                  </a-descriptions>
                </template>
                <img src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" class="logo" />
              </a-popover>
              <a slot="title" href="">{{ item.name }}</a>
            </a-list-item-meta>
          </a-col>
          <a-col class="list-content" :lg="14" :md="12" :sm="24" :xs="24" :gutter="16">
            <a-col class="list-content-item" :span="8">
              <span>{{ $t('datasource.uploadTaskList.accessKey') }}</span>
              <p>{{ item.accessKey }}</p>
            </a-col>
            <a-col class="list-content-item" :span="8">
              <span>{{ $t('datasource.uploadTaskList.startedTime') }}</span>
              <p>{{ item.startedAt }}</p>
            </a-col>
            <a-col class="list-content-item" :span="8">
              <span>{{ $t('datasource.uploadTaskList.finishedTime') }}</span>
              <p>{{ item.finishedAt }}</p>
            </a-col>
            <a-col class="list-content-item" :span="6" style="display: none">
              <span>{{ $t('datasource.uploadTaskList.status') }}</span>
              <a-progress :stroke-color="strokeColor" :percent="item.percentage" status="active" />
            </a-col>
          </a-col>
          <div slot="actions">
            <a-popconfirm
              title="Do you confirm to create a new token?"
              ok-text="Yes"
              cancel-text="No"
              @confirm="onRefreshToken(item)"
              @cancel="() => {}"
            >
              <a-button :disabled="item.percentage === 100" style="margin-right: 5px" type="danger">
                {{ $t('datasource.uploadTaskList.refreshToken') }}
              </a-button>
            </a-popconfirm>
            <a-popconfirm
              title="Do you confirm to mark the task as completed? NOTE: The Quartet team will get an email notification, and then make your data online after you do it."
              ok-text="Yes"
              cancel-text="No"
              @confirm="onCheckTask(item)"
              @cancel="() => {}"
            >
              <a-button :disabled="item.percentage === 100" type="primary">
                {{ $t('datasource.uploadTaskList.check') }}
              </a-button>
            </a-popconfirm>
          </div>
        </a-list-item>
      </a-list>
    </a-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import v from 'voca'
import sortBy from 'lodash.sortby'
import orderBy from 'lodash.orderby'
import filter from 'lodash.filter'
import { initTServiceHost } from '@/config/defaultSettings'

const tserviceHost = initTServiceHost()
const uploadingTaskEndpoints = {
  getTokenApi: id => {
    return `${tserviceHost}/api/omics-datasets/${id}/refresh-token`
  },
  getStatusApi: id => {
    return `${tserviceHost}/api/omics-datasets/${id}`
  },
  taskApi: `${tserviceHost}/api/tool/omics-datasets`
}

export default {
  name: 'UploadTaskList',
  components: {},
  data() {
    return {
      data: [
        {
          id: 'yyyy',
          name: 'test',
          description: 'This is a description.',
          startedAt: '2019-12-20',
          finishedAt: '2020-12-20',
          status: 'Started',
          percentage: 10,
          accessKey: 'tytyty',
          accessSecret: 'test',
          stsToken: 'test',
          authorizedCode: 'test',
          uploadPath: 'oss://quartet-data-portal/data/yangjingcheng/test-dataset/genomics/'
        }
      ],
      pagination: {
        pageSizeOptions: ['30', '50', '100'],
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: 30,
        page: 1,
        total: 0,
        current: 1,
        onChange: (page, pageSize) => {
          this.pagination.page = page
          this.pagination.pageSize = pageSize
          this.refresh()
        },
        onShowSizeChange: (current, pageSize) => {
          this.pagination.page = 1
          this.pagination.pageSize = pageSize
          this.refresh()
        }
      },
      paginationOptions: {
        enabled: true,
        mode: 'records',
        perPage: 5,
        position: 'top',
        perPageDropdown: [5, 10, 15, 20],
        dropdownAllowAll: false,
        setCurrentPage: 1,
        nextLabel: 'next',
        prevLabel: 'prev',
        rowsPerPageLabel: 'Rows per page',
        ofLabel: 'of',
        pageLabel: 'page', // for 'pages' mode
        allLabel: 'All'
      },
      loading: false,
      radioGroupValue: 'total',
      strokeColor: { '0%': '#108ee9', '100%': '#87d068' },
      timer: null
    }
  },
  computed: {
    adminGroup() {
      return this.userInfo().groups.includes('admin')
    }
  },
  methods: {
    ...mapGetters(['userInfo']),
    onRefreshToken(record) {
      this.$http
        .post(uploadingTaskEndpoints.getTokenApi(record.id), {
          name: record.name,
          manager: record.manager,
          data_type: record.dataType
        })
        .then(response => {})
        .catch(error => {
          this.$message.warn('Something wrong, please retry later.')
        })
    },
    onCheckTask(record) {
      this.$http
        .put(uploadingTaskEndpoints.getStatusApi(record.id), {
          name: record.name,
          email: record.email,
          manager: record.manager,
          data_type: record.dataType,
          description: record.description,
          status: 'Finished'
        })
        .then(response => {})
        .catch(error => {
          this.$message.warn('Something wrong, please retry later.')
        })
    },
    onSearchTask() {},
    onClickRadioBtn() {},
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
  created() {},
  mounted() {},
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

.uploading-task-list {
  .ant-card-body {
    padding: 5px 24px;
    height: calc(100% - 65px);
    overflow: scroll;
  }

  .ant-list-item {
    flex-wrap: wrap;
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
}
</style>
