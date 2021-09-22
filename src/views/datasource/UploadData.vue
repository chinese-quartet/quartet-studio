<template>
  <page-view :title="getTitle()" logo="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png">
    <template slot="action">
      <a-button icon="question-circle" style="margin-right: 10px" @click="showHelp">Help</a-button>
      <a-button type="primary" @click="onCreateDataSet">Register & Upload Your Data</a-button>
    </template>

    <upload-task-list :id="refreshToken" :key="forceUpdateKey"></upload-task-list>
    <a-modal
      title="Help for Uploading Omics Data"
      width="60%"
      class="help-markdown"
      :visible="helpVisible"
      :footer="null"
      @cancel="closeHelp"
    >
      <a-row style="display: flex; justify-content: flex-end; margin-top: -20px; margin-right: -20px">
        <a-checkbox :checked="helpChecked" @change="changeHelpCheckbox"> Don't show again </a-checkbox>
      </a-row>
      <a-row class="markdown">
        <vue-markdown :source="helpMsg" @rendered="update"></vue-markdown>
      </a-row>
    </a-modal>

    <a-drawer
      title="Register & Upload Your Omics Data"
      class="upload-data-drawer"
      :width="720"
      :visible="formVisible"
      :maskClosable="false"
      :body-style="{ paddingBottom: '80px' }"
      @close="onClose"
    >
      <a-alert style="margin-bottom: 15px" message="Notices" :description="notices" type="info" show-icon />
      <a-form :form="form" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="Your Data Will Be Uploaded To">
              <a-input disabled :value="uploadingPath">
                <a-icon slot="prefix" type="upload" style="color: rgba(0, 0, 0, 0.25)" />
              </a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Dataset Name">
              <a-input
                v-decorator="[
                  'name',
                  {
                    rules: [
                      { required: true, message: 'Please enter the dataset name' },
                      {
                        pattern: /^[a-zA-Z0-9_\-]{6,16}$/,
                        message:
                          'Only numbers, upper and lower case letters, underscores and short dashes are supported, and are no longer than 16 characters and no shorter than 6 characters',
                      },
                    ],
                  },
                ]"
                placeholder="Please enter the dataset name"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Contact Email">
              <a-input
                disabled
                v-decorator="[
                  'email',
                  {
                    initialValue: email,
                    rules: [{ required: true, message: 'please enter your email.' }],
                  },
                ]"
                style="width: 100%"
                placeholder="Please enter your email."
              >
                <a-icon slot="prefix" type="mail" style="color: rgba(0, 0, 0, 0.25)" />
              </a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Manager">
              <a-input
                disabled
                v-decorator="[
                  'manager',
                  {
                    initialValue: manager,
                    rules: [{ required: true, message: 'Please select an owner' }],
                  },
                ]"
                placeholder="Please enter your name."
              >
                <a-icon slot="prefix" type="user" style="color: rgba(0, 0, 0, 0.25)" />
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="DataType">
              <a-select
                v-decorator="[
                  'data_type',
                  {
                    rules: [{ required: true, message: 'Please choose the data type' }],
                  },
                ]"
                placeholder="Please choose the data type"
              >
                <a-select-option value="genomics"> Genomics </a-select-option>
                <a-select-option value="transcriptomics"> Transcriptomics </a-select-option>
                <a-select-option value="proteomics"> Proteomics </a-select-option>
                <a-select-option value="metabolomics"> Metabolomics </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="Description">
              <a-textarea
                v-decorator="[
                  'description',
                  {
                    rules: [{ required: false, message: 'Please enter the description for your dataset' }],
                  },
                ]"
                :rows="4"
                placeholder="Please enter the description"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <div class="footer" style="float: right">
        <a-button :style="{ marginRight: '8px' }" :disabled="btnLoading" @click="onClose"> Cancel </a-button>
        <a-button type="primary" @click="onSubmit" :disabled="btnLoading" :loading="btnLoading"> Submit </a-button>
      </div>
    </a-drawer>
  </page-view>
</template>

<script>
// import v from 'voca'
import axios from 'axios'
import { PageView } from '@/layouts'
import UploadTaskList from '@/views/datasource/UploadTaskList'
import { formatTitle } from '@/views/utils'
import VueMarkdown from 'vue-markdown'
import Prism from 'prismjs'
import { mapGetters } from 'vuex'

import { initTServiceHost } from '@/config/defaultSettings'

const tserviceHost = initTServiceHost()
const uploadingTaskEndpoints = {
  taskApi: `${tserviceHost}/api/tool/omics-datasets`
}

export default {
  name: 'ProjectManagement',
  components: {
    PageView,
    UploadTaskList,
    VueMarkdown
  },
  props: {
    refresh: {
      default: true,
      type: Boolean,
      required: false
    }
  },
  data() {
    return {
      helpMsg: '',
      helpChecked: false,
      helpVisible: true,
      form: this.$form.createForm(this, {
        onValuesChange: this.updatePath
      }),
      formVisible: false,
      notices: 'Additional description and informations about copywriting.',
      uploadingPath: 'Uploading path...',
      name: '',
      dataType: '',
      btnLoading: false,
      forceUpdateKey: ''
    }
  },
  computed: {
    ...mapGetters(['nickname', 'email']),
    manager() {
      return this.nickname
    },
    refreshToken() {
      if (this.refresh) {
        return Math.random()
          .toString(36)
          .slice(-8)
      } else {
        return 'static'
      }
    }
  },
  methods: {
    update() {
      this.$nextTick(() => {
        Prism.highlightAll()
      })
    },
    getTitle() {
      return formatTitle(this, this.$route.meta.title)
    },
    showDrawer() {
      this.formVisible = true
    },
    onClose() {
      this.formVisible = false
    },
    onCreateDataSet() {
      this.formVisible = true
    },
    updatePath(props, value) {
      this.dataType = value.data_type ? value.data_type : this.dataType
      this.name = value.name ? value.name : this.name
      if (this.dataType && this.name) {
        this.uploadingPath = `oss://quartet-data-portal/data/${this.email}/${this.name}/${this.dataType}/`
      }

      console.log('Update Path: ', props, value, this.dataType, this.name, this.uploadingPath)
    },
    onSubmit() {
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Test UploadData: ', err, values)
          this.btnLoading = true
          this.createDataSet(values)
        }
      })
    },
    createDataSet(record) {
      this.$http
        .post(uploadingTaskEndpoints.taskApi, {
          name: record.name,
          email: record.email,
          manager: record.manager,
          data_type: record.data_type,
          description: record.description
        })
        .then(response => {
          this.$message.success(`The Dataset ${record.name} created.`)
          this.forceUpdateKey = Math.random()
            .toString(36)
            .slice(-8)
          console.log('Create Dataset: ', response)
          this.formVisible = false
          this.btnLoading = false
          this.form.resetFields()
          this.uploadingPath = 'Uploading path...'
        })
        .catch(error => {
          this.$message.error('Failed, Please retry later.')
          console.log('Create Dataset: ', error)
          this.formVisible = false
          this.btnLoading = false
        })
    },
    fetchHelp() {
      axios
        .get('/markdown/upload-data.md')
        .then(response => {
          console.log('Fetch Help: ', response)
          this.helpMsg = response.data
        })
        .catch(error => {
          console.log('Fetch Help Error: ', error)
          this.helpMsg = 'No Content.'
        })
        .finally(() => {
          this.helpVisible = true
        })
    },
    changeHelpCheckbox(e) {
      console.log('Change Help Checkbox: ', e)
      this.helpChecked = e.target.checked
      localStorage.setItem('datains__data__notShownUploadHelp', e.target.checked)
    },
    showHelp() {
      this.fetchHelp()
    },
    closeHelp() {
      this.helpVisible = false
    }
  },
  created() {
    const notShownHelp = JSON.parse(localStorage.getItem('datains__data__notShownUploadHelp'))
    if (notShownHelp) {
      this.helpVisible = !notShownHelp
      this.helpChecked = notShownHelp
    } else {
      this.fetchHelp()
    }
  }
}
</script>

<style lang="less" scoped>
.upload-data-drawer {
  .footer {
    position: 'absolute';
    right: 0;
    bottom: 0;
    width: '100%';
    border-top: '1px solid #e9e9e9';
    padding: '10px 16px';
    background: '#fff';
    text-align: 'right';
    z-index: 1;
  }
}
</style>

<style lang="less">
.help-markdown {
  .ant-modal-body {
    height: 450px;

    .markdown {
      height: 100%;
      overflow: scroll;
    }

    .markdown::-webkit-scrollbar {
      width: 0 !important;
    }
  }
}
</style>
