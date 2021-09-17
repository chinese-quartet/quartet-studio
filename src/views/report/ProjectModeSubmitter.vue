<template>
  <a-row class="project-mode-submitter">
    <a-select style="width: 100%" placeholder="Please select an finished project." @change="selectProject">
      <a-select-option v-for="project in finishedProjects" :key="project.id">
        {{ project.project_name }}
      </a-select-option>
    </a-select>
    <vue-json-pretty class="json-viewer" :data="reportMetadata"></vue-json-pretty>
    <a-row class="btn-group">
      <a-button @click="reset" style="margin-right: 5px">Cancel</a-button>
      <a-button html-type="submit" type="primary" :disabled="!submitBtnActive" :loading="loading"> Submit </a-button>
    </a-row>
  </a-row>
</template>

<script>
import axios from 'axios'
import { mapActions } from 'vuex'
import VueJsonPretty from 'vue-json-pretty'
import { getProjectList } from '@/api/manage'
import filter from 'lodash.filter'

export default {
  components: {
    VueJsonPretty
  },
  props: {
    appKey: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      installedApps: [],
      finishedProjects: [],
      reportMetadata: {},
      loading: false,
      submitBtnActive: false
    }
  },
  watch: {
    appKey(newValue, oldValue) {
      if (
        newValue === 'renluyao/quartet_dna_quality_control_wgs_big_pipeline-v0.1.2' ||
        newValue === 'lizhihui/quartet-rnaseq-qc-v0.1.4'
      ) {
        const filteredApps = filter(this.installedApps, app => {
          return app.name === newValue
        })

        console.log('Fetch Apps: ', this.installedApps, filteredApps)
        if (filteredApps.length > 0) {
          const appId = filteredApps[0].id
          this.getFinishedProjects(appId)
        }
      }
    }
  },
  methods: {
    ...mapActions({
      getInstalledAppList: 'GetInstalledAppList',
      getProjectList: 'GetProjectList',
      makeDownloadUrl: 'MakeDownloadUrl'
    }),
    selectProject(value) {
      this.makeDownloadUrl({ service: 'minio', name: 'projects', key: `${value}/report.json` })
        .then(response => {
          const downloadUrl = response.download_url

          axios.get(downloadUrl).then(response => {
            console.log('Select Project: ', response.data)
            this.reportMetadata = response.data
            this.submitBtnActive = true
          })
        })
        .catch(error => {
          this.$message.error('Unknown Error!')
          console.log('getDownloadUrl: ', error)
        })
    },
    getInstalledApps() {
      this.getInstalledAppList().then(res => {
        console.log('res', res)
        this.installedApps = res.data
      })
    },
    getFinishedProjects(appId) {
      getProjectList({
        page: 1,
        page_size: 100,
        app_id: appId
      })
        .then(response => {
          this.finishedProjects = response.data
          console.log('Get Project List: ', response)
        })
        .catch(error => {
          this.$message.warning('Something wrong, please retry later.')
          console.log('Get Project List Error: ', error)
        })
    },
    reset() {
      this.$emit('close')
    }
  },
  created() {
    this.getInstalledApps()
  }
}
</script>

<style lang="less" scoped>
.project-mode-submitter {
  .json-viewer {
    overflow: scroll;
    border: 1px solid #eeee;
    border-radius: 5px;
    margin: 10px 0px;
    padding: 10px;
    height: calc(100vh - 350px);
    background-color: #f5f5f5;
  }

  .btn-group {
    float: right;
  }
}
</style>