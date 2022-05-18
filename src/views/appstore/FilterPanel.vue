<template>
  <!--eslint-disable-->
  <a-row class="filter-panel">
    <a-tabs class="content" :activeKey="activeKey" @change="redirectTo">
      <a-tab-pane tab="Genomics" key="dnaseq">
        <app-list :appList="dnaSeqApp" appCategory="dnaseq"></app-list>
      </a-tab-pane>
      <a-tab-pane tab="Transcriptomics" key="rnaseq">
        <app-list :appList="rnaSeqApp" appCategory="rnaseq"></app-list>
      </a-tab-pane>
      <a-tab-pane tab="Proteomics" key="proteomics">
        <app-list :appList="proteomicsApp" appCategory="proteomics"></app-list>
      </a-tab-pane>
      <a-tab-pane tab="Metabolomics" key="metabolomics">
        <app-list :appList="metabolomicsApp" appCategory="metabolomics"></app-list>
      </a-tab-pane>
      <a-button icon="question-circle" slot="tabBarExtraContent" @click="openHelpLink" style="margin-right: 5px">
        Help
      </a-button>
    </a-tabs>
    <a-modal
      title="Help for Pipelines"
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
  </a-row>
</template>

<script>
/* eslint-disable */
import { mapActions } from 'vuex'
import { FilterList } from '@/components'
import AppList from '@/views/appstore/AppList'
import orderBy from 'lodash.orderby'
import filter from 'lodash.filter'
import axios from 'axios'
import VueMarkdown from 'vue-markdown'
import Prism from 'prismjs'
import { projectSettings } from '@/config/defaultSettings'

const helps = projectSettings.helps

const apps = {
  dnaseq: ['upload-data', 'quartet_dna_quality_control_wgs_big_pipeline', 'quartet-dseqc-report'],
  rnaseq: ['upload-data', 'quartet-rnaseq-qc', 'quartet-rseqc-report'],
  proteomics: ['quartet-protqc-report'],
  metabolomics: ['quartet-metqc-report']
}

export default {
  name: 'FilterPanel',
  components: {
    FilterList,
    AppList,
    VueMarkdown
  },
  props: {
    appCategory: {
      type: String,
      required: false,
      default: null
    }
  },
  data() {
    return {
      appList: [],
      localTools: [
        {
          id: 'de24a560a1178a5e59085b5b70ef2e35',
          title: 'Upload Your Data',
          shortName: 'upload-data',
          appName: 'upload-your-data-latest',
          version: 'latest',
          home: '',
          hidden: 'false',
          author: 'Jingcheng Yang',
          description: 'Upload your data to the data repo, and then you can use it in the pipeline.',
          icons: null,
          category: 'LocalTool',
          source: ''
        }
      ],
      helpChecked: false,
      helpVisible: false,
      helpMsg: '',
      defaultKey: 'dnaseq'
    }
  },
  computed: {
    activeKey() {
      if (this.appCategory) {
        return this.appCategory
      } else {
        return this.defaultKey
      }
    },
    dnaSeqApp() {
      return filter(this.appList, app => apps.dnaseq.includes(app.shortName))
    },
    rnaSeqApp() {
      return filter(this.appList, app => apps.rnaseq.includes(app.shortName))
    },
    proteomicsApp() {
      return filter(this.appList, app => apps.proteomics.includes(app.shortName))
    },
    metabolomicsApp() {
      return filter(this.appList, app => apps.metabolomics.includes(app.shortName))
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    ...mapActions({
      getAppManifest: 'GetAppManifest',
      getToolManifest: 'GetToolManifest'
    }),
    redirectTo(key) {
      if (key) {
        this.$router.push({
          name: 'appstore',
          query: {
            appCategory: key
          }
        })
      }
    },
    changeHelpCheckbox(e) {
      console.log('Change Help Checkbox: ', e)
      this.helpChecked = e.target.checked
      localStorage.setItem('datains__data__notShownAssessmentHelp', e.target.checked)
    },
    closeHelp() {
      this.helpVisible = false
    },
    openHelpLink() {
      let helpLink = helps['data_pipelines']
      if (helpLink) {
        window.open(helpLink, '_blank')
      } else {
        this.fetchHelp()
      }
    },
    fetchHelp() {
      axios
        .get('/markdown/project-management.md')
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
    getList() {
      Promise.all([this.getAppManifest(), this.getToolManifest()])
        .then(response => {
          this.appList = this.localTools.concat(response[0], response[1])
          console.log('App List: ', this.appList)
        })
        .catch(error => {
          console.log('Get List Error: ', error)
        })
    },
    update() {
      this.$nextTick(() => {
        Prism.highlightAll()
      })
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
.filter-panel {
  margin-right: 0px !important;
  height: 100%;

  .content {
    padding-bottom: 20px;
    border-radius: 4px;
    border: 1px solid #d9d9d9;
    background-color: #fff;
    height: 100%;

    .graph-tab {
      h4 {
        font-size: 1.5rem;
      }

      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>

<style lang="less">
.card-meta {
  .ant-card-meta-description {
    align-content: center;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}

.ant-popover {
  max-width: 50%;
}
</style>
