<template>
  <page-view :title="getTitle()" logo="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png">
    <template slot="action">
      <a-button icon="question-circle" style="margin-right: 10px" @click="showHelp">
        {{ $t('workflow.projectManagement.showHelp') }}
      </a-button>
      <a-button type="primary" @click="onCreateProject">
        {{ $t('workflow.projectManagement.createProject') }}
      </a-button>
    </template>

    <project-list :id="refreshToken" :appId="appId"></project-list>
    <a-modal
      title="Help for Piplines"
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
  </page-view>
</template>

<script>
import axios from 'axios'
import { PageView } from '@/layouts'
import ProjectList from '@/views/workflow/itemList/ProjectList'
import { formatTitle } from '@/views/utils'
import VueMarkdown from 'vue-markdown'
import Prism from 'prismjs'

const appMap = {
  ea989ffd08517f6c4dc1edf931ac946f: 'app_dna-seq',
  fd63809bc013bec3664b072d3465ba75: 'app_rna-seq'
}

export default {
  name: 'ProjectManagement',
  components: {
    PageView,
    ProjectList,
    VueMarkdown
  },
  props: {
    refresh: {
      default: true,
      type: Boolean,
      required: false
    },
    appId: {
      type: String,
      required: false,
      default: null
    }
  },
  data() {
    return {
      helpMsg: '',
      helpChecked: false,
      helpVisible: true
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
    onCreateProject() {
      this.$router.push({
        name: 'create-project',
        query: {
          appId: this.appId
        }
      })
    },
    fetchHelp() {
      let path = '/markdown/project-management.md'
      if (this.appId) {
        path = `/markdown/${appMap[this.appId]}.md`
      }
      axios
        .get(path)
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
      localStorage.setItem('datains__data__notShownAssessmentHelp', e.target.checked)
    },
    showHelp() {
      this.fetchHelp()
    },
    closeHelp() {
      this.helpVisible = false
    }
  },
  created() {
    const notShownHelp = JSON.parse(localStorage.getItem('datains__data__notShownAssessmentHelp'))
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
