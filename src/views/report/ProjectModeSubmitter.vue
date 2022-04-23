<template>
  <a-row class="project-mode-submitter">
    <a-select style="width: 100%" allowClear placeholder="Please select an finished project." @change="selectProject">
      <a-select-option v-for="project in finishedProjects" :key="project.id">
        {{ project.project_name }}
      </a-select-option>
    </a-select>
    <a-form
      layout="inline"
      class="form-container"
      :form="form"
      v-if="libraries.length > 0 && reportTool === 'quartet-rseqc-report'"
    >
      <a-row :gutter="16" v-for="(library, index) in libraries" :key="library">
        <a-col :span="9">
          <a-form-item label="Library?" class="library-container">
            <a-select
              disabled
              v-decorator="[
                `metadata[${index}].library`,
                {
                  initialValue: library,
                  rules: [{ required: true, message: 'Please select the library name!' }],
                },
              ]"
              placeholder="Select a library name"
            >
              <a-select-option :value="library"> {{ library }} </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="Replicate?" class="replicate-container">
            <a-select
              v-decorator="[
                `metadata[${index}].group`,
                { rules: [{ required: true, message: 'Please select the replicate name!' }] },
              ]"
              placeholder="Select a replicate name"
              @change="
                (value) => {
                  changeLibrary(index, value)
                }
              "
            >
              <a-select-option v-for="item in groups" :key="item" :value="item"> {{ item }} </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="7">
          <a-form-item label="Quartet Sample?" class="sample-container">
            <a-select
              v-decorator="[
                `metadata[${index}].sample`,
                { rules: [{ required: true, message: 'Please select the sample name!' }] },
              ]"
              placeholder="Select a sample name"
            >
              <a-select-option v-for="item in samples" :key="item" :value="item"> {{ item }} </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <a-empty
      class="empty-container"
      v-else-if="libraries.length === 0 && this.reportTool === 'quartet-rseqc-report'"
    ></a-empty>
    <vue-json-pretty class="json-viewer" :data="reportMetadata" v-else></vue-json-pretty>
    <a-row class="btn-group">
      <a-button @click="reset" style="margin-right: 5px">Cancel</a-button>
      <a-button
        html-type="submit"
        type="primary"
        :disabled="!submitBtnActive"
        :loading="loading"
        @click="checkAndSubmit"
      >
        Submit
      </a-button>
    </a-row>
  </a-row>
</template>

<script>
import map from 'lodash.map'
import { mapActions } from 'vuex'
import VueJsonPretty from 'vue-json-pretty'
import { getProjectList, submitReport } from '@/api/manage'
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
      submitBtnActive: false,
      form: this.$form.createForm(this),
      groups: ['D5_1', 'D5_2', 'D5_3', 'D6_1', 'D6_2', 'D6_3', 'F7_1', 'F7_2', 'F7_3', 'M8_1', 'M8_2', 'M8_3'],
      samples: ['D5', 'D6', 'F7', 'M8'],
      libraries: []
    }
  },
  computed: {
    reportTool() {
      if (this.appKey === 'renluyao/quartet_dna_quality_control_wgs_big_pipeline-v0.1.2') {
        return 'quartet-dseqc-report'
      } else if (this.appKey === 'lizhihui/quartet-rnaseq-qc-v0.2.1') {
        return 'quartet-rseqc-report'
      }
    }
  },
  watch: {
    appKey(newValue, oldValue) {
      if (
        newValue === 'renluyao/quartet_dna_quality_control_wgs_big_pipeline-v0.1.2' ||
        newValue === 'lizhihui/quartet-rnaseq-qc-v0.2.1'
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
      getProject: 'GetProject',
      makeDownloadUrl: 'MakeDownloadUrl'
    }),
    genSamples(samples) {
      return map(samples, sample => {
        const filpath = sample.read1
        const sampleName = filpath
          .split('/')
          .pop()
          .replace(/_R[12].(fastq|fq).gz/, '')
        return sampleName
      })
    },
    changeLibrary(index, value) {
      const group = {}
      group[`metadata[${index}].sample`] = value.split('_')[0]

      console.log('Change Library: ', index, value, group)
      this.form.setFieldsValue({
        ...group
      })
    },
    selectProject(projectId) {
      this.getProject(projectId)
        .then(result => {
          console.log('searchProject: ', result)
          this.reportMetadata = {
            ...result,
            // Must contains the last slash
            filepath: `oss://quartet-data-portal/results/${result.title}/`,
            name: result.title,
            description: result.description
          }

          if (result.samples && this.reportTool === 'quartet-rseqc-report') {
            this.libraries = this.genSamples(result.samples)
            if (this.libraries.length > 0) {
              this.submitBtnActive = true
            } else {
              this.submitBtnActive = false
              this.$message.warning('Something is wrong, please retry later.')
            }
          } else {
            this.submitBtnActive = true
          }
        })
        .catch(error => {
          console.log('searchProject: ', error)
          this.reportMetadata = {}
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
        app_id: appId,
        status: 'Succeeded'
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
    },
    checkAndSubmit() {
      let parameters = {
        name: this.reportMetadata.name,
        description: this.reportMetadata.description,
        filepath: this.reportMetadata.filepath
      }

      if (this.reportTool === 'quartet-rseqc-report') {
        this.form.validateFields((err, values) => {
          console.log('Received values of form: ', values)

          parameters = {
            ...parameters,
            metadata: values.metadata
          }

          console.log('Check and Submit: ', parameters)
          this.submit(parameters)
        })
      } else {
        console.log('Check and Submit: ', parameters)
        this.submit(parameters)
      }
    },
    submit(parameters) {
      this.loading = true
      submitReport(this.reportTool, parameters)
        .then(response => {
          console.log('ProjectModeSubmitter Submit: ', response)
          this.loading = false
          this.reset()
        })
        .catch(error => {
          console.log('ProjectModeSubmitter Submit Error: ', error)
          this.loading = false
          this.reset()
          this.$message.warning('Failed, Please retry later.')
        })
    }
  },
  created() {
    this.getInstalledApps()
  }
}
</script>

<style lang="less" scoped>
.project-mode-submitter {
  .empty-container,
  .form-container,
  .json-viewer {
    overflow: scroll;
    border: 1px solid #eeee;
    border-radius: 5px;
    margin: 10px 0px;
    padding: 10px;
    height: calc(100vh - 350px);
    background-color: #f5f5f5;
  }

  .empty-container {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .btn-group {
    float: right;
    margin-bottom: 10px;
  }
}
</style>

<style lang="less">
.project-mode-submitter {
  .ant-form-item {
    width: 100%;
  }

  .library-container {
    .ant-form-item-control-wrapper {
      width: 70%;
    }
  }

  .replicate-container {
    .ant-form-item-control-wrapper {
      width: 60%;
    }
  }

  .sample-container {
    .ant-form-item-control-wrapper {
      width: 40%;
    }
  }
}
</style>
