<template>
  <page-view title="QC Report for Quartet" logo="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png">
    <template slot="action">
      <a-button type="primary" style="margin-right: 5px" @click="onCreateModels('single')">New QC Report</a-button>
    </template>
    <a-table
      class="report-container"
      :columns="filteredColumns"
      :loading="reportLoading"
      :data-source="data"
      :pagination="pagination"
      :scroll="{ y: 430 }"
      rowKey="id"
    >
      <span slot="operation" slot-scope="text, record">
        <a-button
          @click="loadResult(record)"
          :disabled="record.status !== 'Finished'"
          icon="eye"
          type="primary"
          style="margin-right: 5px"
        >
          Result
        </a-button>
      </span>
      <span slot="status" slot-scope="text, record" class="single-tag">
        <a-progress
          type="circle"
          :showInfo="false"
          :percent="record.percentage"
          :width="45"
          v-if="text === 'Started'"
        />
        <a-tag color="#87d068" v-if="text === 'Finished'">
          {{ text }}
        </a-tag>
        <a-tag color="#f50" v-if="text === 'Failed'">
          {{ text }}
        </a-tag>
        <a-tag color="#108ee9" v-if="false && text === 'Started'">
          {{ text }}
        </a-tag>
      </span>
    </a-table>
    <a-drawer
      class="report-uploader"
      title="New QC Report"
      width="70%"
      placement="right"
      @close="hideSubmitPanel"
      :maskClosable="false"
      :destroyOnClose="true"
      :visible="submitPanelVisible"
    >
      <submitter @close="hideSubmitPanel"></submitter>
    </a-drawer>
  </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import Submitter from './Submitter'
import filter from 'lodash.filter'
import { GetTaskList } from './util'

const columns = [
  {
    title: 'Report Name',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
    visible: true
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    align: 'center',
    visible: true
  },
  {
    title: 'Report Type',
    dataIndex: 'reportType',
    key: 'reportType',
    align: 'center',
    visible: true
  },
  {
    title: 'Created At',
    dataIndex: 'startedAt',
    key: 'startedAt',
    align: 'center',
    visible: true
  },
  {
    title: 'Finished At',
    dataIndex: 'finishedAt',
    key: 'finishedAt',
    align: 'center',
    visible: true
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    align: 'center',
    scopedSlots: { customRender: 'status' },
    visible: true
  },
  {
    title: 'Action',
    key: 'operation',
    scopedSlots: { customRender: 'operation' },
    align: 'center',
    visible: true
  }
]

export default {
  components: {
    PageView,
    Submitter
  },
  data() {
    return {
      columns,
      data: [],
      reportLoading: false,
      submitPanelVisible: false,
      pagination: {
        pageSizeOptions: ['10', '30', '50', '100'],
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: 10,
        total: 0,
        current: 1,
        onChange: (page, pageSize) => {
          this.pagination.current = page
          this.pagination.pageSize = pageSize
          this.getReports(this.pagination.current, this.pagination.pageSize)
        },
        onShowSizeChange: (current, pageSize) => {
          this.pagination.current = current
          this.pagination.pageSize = pageSize
          this.getReports(this.pagination.current, this.pagination.pageSize)
        }
      }
    }
  },
  computed: {
    filteredColumns: function() {
      return filter(this.columns, item => {
        return item.visible
      })
    }
  },
  methods: {
    loadResult(record) {
      this.$router.push({
        name: 'report-details',
        params: { reportId: record.id }
      })
    },
    onCreateModels(mode) {
      this.submitPanelVisible = true
    },
    hideSubmitPanel() {
      this.submitPanelVisible = false
      this.getReports(this.pagination.current, this.pagination.pageSize)
    },
    getReports(page, pageSize) {
      this.reportLoading = true
      GetTaskList({
        page: page,
        page_size: pageSize,
        plugin_type: 'ReportPlugin'
      })
        .then(response => {
          this.pagination.total = response.total
          this.pagination.current = response.page
          this.pagination.pageSize = response.pageSize
          this.data = response.data
          // this.$message.success('Refresh successfully!', 3)
          this.reportLoading = false
        })
        .catch(error => {
          this.reportLoading = false
          console.log('Get report Collection: ', error)
          this.$message.error('Something wrong, please retry later!')
          this.data = []
        })
    }
  },
  mounted() {
    this.timer = setInterval(() => {
      this.getReports(this.pagination.current, this.pagination.pageSize)
    }, 30000)
  },
  created() {
    this.getReports(this.pagination.current, this.pagination.pageSize)
  },
  beforeRouteLeave(to, from, next) {
    next()
    if (this.timer) {
      console.log('Clear the updateTasks timer.')
      clearInterval(this.timer)
      this.timer = null
    }
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
.report-container {
  width: 100%;
  height: 81vh;
  background-color: #fff;

  .ant-pagination {
    margin-right: 5px;
  }

  .inner-table {
    margin: 0px !important;
    border-radius: 5px;
    border: 1px solid #d6d6d6;
  }

  .single-tag {
    .ant-tag {
      margin-right: 0px;
    }
  }
}

.prediction-modal {
  .ant-modal-body {
    padding: 16px 24px;
  }
}

.report-list-drawer {
  .ant-collapse-content > .ant-collapse-content-box {
    padding: 0px;
  }

  .ant-collapse > .ant-collapse-item > .ant-collapse-header {
    font-size: 16px;
  }

  .ant-drawer-body {
    padding: 12px;
  }

  .file-viewer {
    height: 450px;
    width: 100%;
  }

  .empty-container {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    height: 300px;
  }

  .ant-collapse-extra {
    margin-top: -5px;
  }

  .ant-tabs-tab {
    font-size: 16px;
    font-weight: 800;
  }

  .ant-tabs-nav .ant-tabs-tab-active {
    color: #ff0000;
  }

  .extra-actions {
    .ant-dropdown-menu-item {
      padding: 0px;
    }

    .ant-btn:hover {
      border-color: #fff;
    }
  }

  .report-image-viewer {
    width: 100%;
    height: 100%;

    .heatmap {
      position: absolute;
      width: 200px;
      right: 5px;
      bottom: 5px;
    }
  }
}

.report-uploader {
  .ant-drawer-body {
    padding: 10px 10px 0px 0px;
  }
}
</style>
