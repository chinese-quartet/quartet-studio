<template>
  <page-view :title="getTitle()" logo="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png">
    <template slot="action">
      <a-button icon="question-circle" style="margin-right: 10px" @click="showHelp">Help</a-button>
      <a-button type="primary" disabled @click="onCreateDataSet">Upload Data</a-button>
    </template>

    <upload-task-list :id="refreshToken"></upload-task-list>
    <a-modal title="Help" width="60%" class="help-markdown" :visible="helpVisible" :footer="null" @cancel="closeHelp">
      <a-row style="display: flex; justify-content: flex-end; margin-top: -20px; margin-right: -20px">
        <a-checkbox :checked="helpChecked" @change="changeHelpCheckbox"> Don't show again </a-checkbox>
      </a-row>
      <a-row class="markdown">
        <vue-markdown :source="helpMsg" @rendered="update"></vue-markdown>
      </a-row>
    </a-modal>

    <a-drawer
      title="Create a new account"
      class="upload-data-drawer"
      :width="720"
      :visible="formVisible"
      :body-style="{ paddingBottom: '80px' }"
      @close="onClose"
    >
      <a-form :form="form" layout="vertical" hide-required-mark>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Name">
              <a-input
                v-decorator="[
                  'name',
                  {
                    rules: [{ required: true, message: 'Please enter user name' }],
                  },
                ]"
                placeholder="Please enter user name"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Url">
              <a-input
                v-decorator="[
                  'url',
                  {
                    rules: [{ required: true, message: 'please enter url' }],
                  },
                ]"
                style="width: 100%"
                addon-before="http://"
                addon-after=".com"
                placeholder="please enter url"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Owner">
              <a-select
                v-decorator="[
                  'owner',
                  {
                    rules: [{ required: true, message: 'Please select an owner' }],
                  },
                ]"
                placeholder="Please a-s an owner"
              >
                <a-select-option value="xiao"> Xiaoxiao Fu </a-select-option>
                <a-select-option value="mao"> Maomao Zhou </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Type">
              <a-select
                v-decorator="[
                  'type',
                  {
                    rules: [{ required: true, message: 'Please choose the type' }],
                  },
                ]"
                placeholder="Please choose the type"
              >
                <a-select-option value="private"> Private </a-select-option>
                <a-select-option value="public"> Public </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Approver">
              <a-select
                v-decorator="[
                  'approver',
                  {
                    rules: [{ required: true, message: 'Please choose the approver' }],
                  },
                ]"
                placeholder="Please choose the approver"
              >
                <a-select-option value="jack"> Jack Ma </a-select-option>
                <a-select-option value="tom"> Tom Liu </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="DateTime">
              <a-date-picker
                v-decorator="[
                  'dateTime',
                  {
                    rules: [{ required: true, message: 'Please choose the dateTime' }],
                  },
                ]"
                style="width: 100%"
                :get-popup-container="(trigger) => trigger.parentNode"
              />
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
                    rules: [{ required: true, message: 'Please enter url description' }],
                  },
                ]"
                :rows="4"
                placeholder="please enter url description"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <div class="footer">
        <a-button :style="{ marginRight: '8px' }" @click="onClose"> Cancel </a-button>
        <a-button type="primary" @click="onClose"> Submit </a-button>
      </div>
    </a-drawer>
  </page-view>
</template>

<script>
import axios from 'axios'
import { PageView } from '@/layouts'
import UploadTaskList from '@/views/datasource/UploadTaskList'
import { formatTitle } from '@/views/utils'
import VueMarkdown from 'vue-markdown'
import Prism from 'prismjs'

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
      form: this.$form.createForm(this),
      formVisible: false
    }
  },
  computed: {
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
    onCreateDataSet() {},
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
    },
    showHelp() {
      this.fetchHelp()
    },
    closeHelp() {
      if (this.helpChecked) {
        localStorage.setItem('datains__data__notShownUploadHelp', true)
      }

      this.helpVisible = false
    }
  },
  created() {
    const notShownHelp = localStorage.getItem('datains__data__notShownUploadHelp')
    if (notShownHelp) {
      this.helpVisible = !notShownHelp
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
