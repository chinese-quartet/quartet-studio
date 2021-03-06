<template>
  <a-row class="report-submitter">
    <a-alert type="warning" show-icon style="margin-left: 10px; display: none">
      <span slot="message">Each QC Report contains several steps, <b>please finish it step by step.</b></span>
    </a-alert>
    <a-tabs class="report-submitter__tabs" default-active-key="report" tab-position="top">
      <a-tab-pane class="report-submitter__tabs__report" key="report" tab="Step1: Choose Report" :forceRender="true">
        <a-alert style="margin-bottom: 15px" message="Notices" type="info" show-icon>
          <span slot="description">
            <span>
              Please select the expected quality assessment tool from the following list, after selecting the tool, the
              corresponding guidance message will appear.
            </span>
          </span>
        </a-alert>
        <a-table :columns="columns" :data-source="filteredData" :pagination="false" :row-selection="rowSelection">
          <span slot="logo" slot-scope="text, record">
            <img width="30" height="30" v-if="text" :src="text" />
          </span>
          <span slot="github" slot-scope="text, record" v-if="record.github">
            <a :href="record.github" target="_blank">
              <a-icon type="github" />
            </a>
          </span>
        </a-table>
      </a-tab-pane>
      <a-tab-pane
        class="report-submitter__tabs__uploader"
        v-if="reportMode"
        key="files"
        tab="Step2: Upload File(s)"
        :forceRender="true"
      >
        <a-alert style="margin-bottom: 15px" message="Notices" type="info" show-icon>
          <span slot="description" v-html="getDescription(currentReport, 'uploadNotice')"> </span>
        </a-alert>
        <a-row class="uploader">
          <a-upload-dragger
            :disabled="uploadSuccessList.length === 2"
            :remove="handleRemove"
            :multiple="true"
            :beforeUpload="beforeUpload"
            :customRequest="uploadFile"
            @change="handleChange"
            accept="text/csv"
          >
            <p class="ant-upload-drag-icon">
              <a-icon type="inbox" />
            </p>
            <p class="ant-upload-text">Click or drag file to this area to upload</p>
            <p class="ant-upload-hint">A maximum of 2 matched files can be uploaded at a time.</p>
          </a-upload-dragger>
          <p class="ant-upload-help-text">
            File naming conventions: <br />
            1. A file name can contain <b>only ASCII characters.</b> <br />
            2. A file name is <b>case-sensitive.</b> <br />
            3. A file name must be 1 to 1023 bytes in length. <br />
            4. <b>Only uppercase and lowercase letters, underscores and dashes are supported.</b> <br />
          </p>
        </a-row>
      </a-tab-pane>
      <a-tab-pane
        class="report-submitter__tabs__uploader"
        v-else
        key="projects"
        tab="Step2: Load Project & Submit"
        :forceRender="true"
      >
        <a-alert style="margin-bottom: 15px" message="Notices" type="info" show-icon>
          <span slot="description">
            <span v-html="getDescription(currentReport, 'description')"></span>
          </span>
        </a-alert>
        <project-mode-submitter @close="reset" :appKey="currentAppKey"></project-mode-submitter>
      </a-tab-pane>
      <a-tab-pane
        v-if="reportMode"
        class="report-submitter__tabs__metadata-former"
        key="parameters"
        tab="Step3: Parameters & Submit"
        :forceRender="true"
      >
        <a-alert style="margin-bottom: 15px" message="Notices" type="info" show-icon>
          <span slot="description">
            <span v-html="getDescription(currentReport, 'description')"></span>
          </span>
        </a-alert>
        <a-form :form="form" layout="vertical" @submit="createReport">
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item label="Report Name">
                <a-input
                  v-decorator="[
                    'name',
                    {
                      rules: [
                        { required: true, message: 'Please input the report name!' },
                        { min: 10, max: 64, message: 'Length should be 10 to 64' },
                      ],
                    },
                  ]"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="Which Report?">
                <a-input
                  disabled
                  v-decorator="[
                    'report_tool',
                    {
                      initialValue: currentReport,
                      rules: [{ required: true, message: 'Please input the report tool!' }],
                    },
                  ]"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item label="Data File">
                <a-select
                  v-decorator="[
                    'data_file',
                    {
                      rules: [{ required: true, message: 'Please select your data file!' }],
                    },
                  ]"
                  placeholder="Please select your data file"
                >
                  <a-select-option v-for="file in uploadSuccessList" :key="file.name" :value="file.path">
                    {{ file.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="Metadata File">
                <a-select
                  v-decorator="[
                    'metadata_file',
                    {
                      rules: [{ required: true, message: 'Please select your metadata file!' }],
                    },
                  ]"
                  placeholder="Please select your metadata file"
                >
                  <a-select-option v-for="file in uploadSuccessList" :key="file.name" :value="file.path">
                    {{ file.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-form-item label="Description">
            <a-textarea
              :rows="8"
              placeholder="Please input the description!"
              v-decorator="[
                'description',
                {
                  rules: [{ required: false, message: 'Please input the description!' }],
                },
              ]"
            />
          </a-form-item>
          <a-row>
            <a-form-item class="report-submitter__tabs__metadata-former__action">
              <a-button @click="reset" style="margin-right: 5px">Cancel</a-button>
              <a-button html-type="submit" type="primary" :disabled="submitBtnActive" :loading="loading">
                Submit
              </a-button>
            </a-form-item>
          </a-row>
        </a-form>
      </a-tab-pane>
    </a-tabs>
  </a-row>
</template>

<script>
import axios from 'axios'
import map from 'lodash.map'
import filter from 'lodash.filter'
import { mapActions } from 'vuex'
import { submitReport, getManifest } from '@/api/manage'
import { getLogo } from '@/views/report/util'
import { v4 as uuidv4 } from 'uuid'
import ProjectModeSubmitter from './ProjectModeSubmitter'

const columns = [
  {
    title: 'Category',
    dataIndex: 'category',
    key: 'category',
    scopedSlots: { customRender: 'logo' }
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description'
  },
  {
    title: 'Version',
    dataIndex: 'version',
    width: '100px',
    align: 'center',
    key: 'version'
  },
  {
    title: 'Github',
    dataIndex: 'github',
    key: 'github',
    width: '80px',
    align: 'center',
    scopedSlots: { customRender: 'github' }
  }
]

const data = [
  {
    name: 'WGS QC Report for Quartet',
    description: 'Quality control of germline variants calling results using a Chinese Quartet family.',
    version: 'v0.1.3',
    key: 'quartet-dseqc-report',
    category: getLogo('quartet-dseqc-report'),
    github: 'https://github.com/chinese-quartet/quartet-dseqc-report.git',
    appKey: 'renluyao/quartet_dna_quality_control_wgs_big_pipeline-v0.1.2'
  },
  {
    name: 'RNA-Seq QC Report for Quartet',
    description: 'RNA Sequencing Quality Control Pipeline for Quartet.',
    version: 'v0.1.0',
    appKey: 'lizhihui/quartet-rnaseq-qc-v0.2.1',
    category: getLogo('quartet-rseqc-report'),
    github: 'https://github.com/chinese-quartet/quartet-rseqc-report.git',
    key: 'quartet-rseqc-report'
  },
  {
    name: 'Protqc Report for Quartet',
    description: 'Generate the QC Report for Quartet Proteomics data.',
    version: 'v0.1.0',
    category: getLogo('quartet-protqc-report'),
    github: 'https://github.com/chinese-quartet/quartet-protqc-report.git',
    key: 'quartet-protqc-report'
  },
  {
    name: 'Metqc Report for Quartet',
    description: 'Generate the QC Report for Quartet Metabolomics data.',
    version: 'v0.1.0',
    category: getLogo('quartet-metqc-report'),
    github: 'https://github.com/chinese-quartet/quartet-metqc-report.git',
    key: 'quartet-metqc-report'
  }
]

export default {
  components: {
    ProjectModeSubmitter
  },
  props: {
    pluginName: {
      type: String,
      default: null,
      required: false
    }
  },
  data() {
    return {
      columns,
      data,
      currentReport: 'Please select the report tool in STEP 1!',
      currentAppKey: '',
      rowSelection: {
        type: 'radio',
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
        },
        onSelect: (record, selected, selectedRows) => {
          console.log('onSelect: ', record, selected, selectedRows)
          this.currentReport = record.key
          this.currentAppKey = record.appKey
        }
      },
      fileList: [],
      uploadSuccessList: [],
      form: this.$form.createForm(this, { name: 'coordinated' }),
      loading: false,
      description: {
        dna:
          'Please select the completed project from the dropdown menu below and the QC report tool will automatically extract the required data from the results file generated by the `WGS QC for Quartet` app and generate a QC report. If you do not find the expected project, please check whether the corresponding analysis has been completed properly.',
        rna:
          'Please select the completed project from the dropdown menu below and the QC report tool will automatically extract the required data from the results file generated by the `RNA-Seq QC for Quartet` app and generate a QC report. If you do not find the expected project, please check whether the corresponding analysis has been completed properly.',
        protein:
          'Quality Assessment of a Quartet proteomic profiling dataset is based on built-in biological differences of the samples and consistency with the reference dataset at relative quantitation levels. The former is scored as an Signal-to-Noise Ratio (SNR) and displayed in a PCA scatterplot, and the latter is scored as Pearson correlation to the reference dataset and displayed in a scatterplot, in which a strict filter criteria was applied (features with p.adj<0.05 in at least 4 batches were kept).',
        metabolite:
          'Quality Assessment of a Quartet metabolomic profiling dataset is based on built-in biological differences of the samples, consistency with the reference dataset at relative quantitation levels. The three QC metrics, including Signal-to-Noise Ratio (SNR), Correlation to reference dataset (CTR), and Root Mean Square Error (RMSE), to comprehensively assess the performance of metabolic profiles from 2 aspects: reproducibility and accuracy.',
        default: 'Please finish the <b>Step1: Choose Report</b> firstly.'
      },
      uploadNotice: {
        dna: '',
        rna: '',
        protein:
          'The <b>data file</b> contains gene symbols of each protein and its quantitated expression level in each sample (replicate), and the missing values are allowed . The required file format has samples in columns and a column named "rowname".' +
          '<br />' +
          'The <b>metadata file</b> has the information of each sample in the data file. With columns named "name" ,  "sample" (D5, D6, F7 and M8 for Quartet samples).  Remember that the column "name" and column names of the data file table must be in one-to-one correspondence.' +
          '<br />' +
          '<br />' +
          'Example Files: &nbsp;' +
          '<a href="/examples/protqc/protqc_data_log2_example.csv">Data File</a>' +
          '&nbsp;&nbsp;' +
          '<a href="/examples/protqc/protqc_metadata_example.csv">Metadata File</a>',
        metabolite:
          'The <b>data file</b> is the metabolite concentration result of metabolomics profiling. The required file format has samples in columns and two columns named "metabolites" and "HMDBID" including the names and HMDB IDs of metabolite compounds.&nbsp;' +
          '<br />' +
          'The <b>metadata file</b> has the information of each sample in the data file. With columns named "col_names" (names of samples, identical to their names in the columns of data file), "strategy" (Targeted or Untargeted), "lab" (the name of lab), "sample" (D5, D6, F7 and M8 for Quartet samples), "rep" (the replicates for each sample) and "batch" (the name of batch).' +
          '<br />' +
          '<br />' +
          'Example Files: &nbsp;' +
          '<a href="/examples/metqc/metqc_data_example.csv">Data File</a>' +
          '&nbsp;&nbsp;' +
          '<a href="/examples/metqc/metqc_metadata_example.csv">Metadata File</a>'
      }
    }
  },
  watch: {
    uploadSuccessList(newValue, oldValue) {
      if (newValue.length === 2) {
        this.$message.success('The files have been successfully uploaded.')
      }
    }
  },
  computed: {
    reportMode() {
      return ['quartet-protqc-report', 'quartet-metqc-report'].indexOf(this.currentReport) >= 0
    },
    submitBtnActive() {
      return this.uploadSuccessList.length !== 2
    },
    dataFileName() {
      return this.fileNames.length === 2 ? this.getFilePrefix(this.fileNames[0]) : ''
    },
    metadataFileName() {
      return this.fileNames.length === 2 ? this.getFilePrefix(this.fileNames[1]) : ''
    },
    fileNames() {
      if (this.uploadSuccessList.length == 2) {
        return map(this.uploadSuccessList, file => {
          return file.name
        })
      } else {
        return []
      }
    },
    filteredData() {
      if (this.pluginName) {
        return filter(this.data, item => {
          return item.key === this.pluginName
        })
      } else {
        return this.data
      }
    }
  },
  methods: {
    ...mapActions({
      makeUploadUrl: 'MakeUploadUrl',
      getObjectMeta: 'GetObjectMeta'
    }),
    getToolManifest() {
      getManifest()
        .then(response => {
          this.data.forEach(item => {
            const matches = filter(response.data, o => {
              return o.short_name === item.key
            })

            if (matches.length == 1) {
              const matched = matches[0]
              item['description'] = matched.description
              item['version'] = matched.version
              item['name'] = matched.name
            }
          })
          
          console.log("Report Schema: ", this.data)
        })
        .catch(error => {
          console.log('Get Tool Manifest Error: ', error)
        })
    },
    getDescription(key, obj) {
      if (key === 'renluyao/quartet_dna_quality_control_wgs_big_pipeline-v0.1.2' || key === 'quartet-dseqc-report') {
        return this[obj]['dna']
      } else if (key === 'lizhihui/quartet-rnaseq-qc-v0.2.1' || key === 'quartet-rseqc-report') {
        return this[obj]['rna']
      } else if (key === 'quartet-protqc-report') {
        return this[obj]['protein']
      } else if (key === 'quartet-metqc-report') {
        return this[obj]['metabolite']
      } else {
        return this[obj]['default']
      }
    },
    handleChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        this.$message.success(`${info.file.name} file uploaded successfully`)
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`)
      }
    },
    reset() {
      this.fileList = []
      this.uploadSuccessList = []
      this.$emit('close')
    },
    createReport(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true
          console.log('Received values of form: ', values)
          submitReport(values.report_tool, {
            name: values.name,
            description: values.description,
            data_file: values.data_file,
            metadata_file: values.metadata_file
          })
            .then(response => {
              this.loading = false
              this.reset()
            })
            .catch(error => {
              this.loading = false
              this.$message.warning('Failed, Please retry later.')
              this.reset()
            })
        }
      })
    },
    handleRemove(file) {
      const request = this.fileList[this.makeKey(file.name)]
      if (request) {
        request.cancel('Canceling Upload.')
      }
    },
    getFilePrefix(filename) {
      return filename.replace(/\.[^/.]+$/, '')
    },
    getFileExt(filename) {
      return filename.split('.').pop()
    },
    beforeUpload(file, fileList) {
      const fileNameList = map(fileList, file => {
        return this.getFilePrefix(file.name)
      })

      const fileExtList = map(fileList, file => {
        return this.getFileExt(file.name)
      })

      const incorrectFileNameList = filter(fileNameList, filename => {
        const regex = new RegExp('^[a-zA-Z0-9_\\-.]+$')
        return !regex.test(filename)
      })

      console.log('Before Upload: ', fileList, fileExtList, fileNameList)

      if (incorrectFileNameList.length > 0) {
        this.$message.warn('Filename(s) is not valid, please rename them and retry.')
        return false
      }

      if (fileList.length === 2 && fileExtList.length === 2 && fileExtList.includes('csv')) {
        return true
      } else {
        this.$message.warn('Please upload matched data & metadata files.')
        return false
      }
    },
    makeKey(filename) {
      return `${uuidv4()}/${filename}`
    },
    existFile(filekey) {
      return new Promise((resolve, reject) => {
        this.getObjectMeta({
          service: 'minio',
          name: 'tservice',
          key: filekey
        })
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    uploadFile({ action, data, file, filename, headers, onError, onProgress, onSuccess, withCredentials }) {
      console.log('uploadFiles: ', file)
      const filekey = this.makeKey(file.name)
      this.existFile(filekey)
        .then(response => {
          console.log(file.name, 'exist.', response)
          this.uploadSuccessList.push({
            name: file.name,
            path: `file:///data/quartet-data-portal/tservice/${filekey}`
          })
          onSuccess(response, file)
        })
        .catch(error => {
          console.log(error, ', so we can upload it...')
          this.makeUploadUrl({
            service: 'minio',
            name: 'tservice',
            key: filekey
          })
            .then(response => {
              const request = axios.CancelToken.source()
              this.fileList[filekey] = request
              const action = response.upload_url
              const formData = new FormData()
              if (data) {
                Object.keys(data).forEach(key => {
                  formData.append(key, data[key])
                })
              }
              formData.append(filename, file)

              axios({
                url: action,
                method: 'put',
                data: file,
                processData: false,
                contentType: false,
                onUploadProgress: ({ total, loaded }) => {
                  console.log('onUploadProgress: ', total, loaded, Math.round((loaded / total) * 100).toFixed(2))
                  onProgress({ percent: Math.round((loaded / total) * 100) }, file)
                },
                cancelToken: request.token
              })
                .then(({ data: response }) => {
                  console.log('Upload Files: ', response, file)
                  this.uploadSuccessList.push({
                    name: file.name,
                    path: `file:///data/quartet-data-portal/tservice/${filekey}`
                  })
                  onSuccess(response, file)
                })
                .catch(error => {
                  console.log('Upload Files (Error): ', error)
                  onError(error)
                })

              return {
                abort() {
                  console.log('upload progress is aborted.')
                }
              }
            })
            .catch(error => {
              console.log('getUploadUrl: ', error)
            })
        })
    }
  },
  created() {
    this.getToolManifest()
  }
}
</script>

<style lang="less" scoped>
.report-submitter {
  position: relative;

  .report-submitter__tabs__uploader {
    .uploader {
      height: calc(100vh - 300px);

      .ant-upload-help-text {
        border: 1px solid #eee;
        padding: 10px;
        margin-top: 10px;
        border-radius: 5px;
      }
    }
  }

  .report-submitter__tabs__metadata-former__action {
    float: right;
    position: fixed;
    bottom: 5px;
    right: 10px;
    margin-bottom: 0px;
  }
}
</style>

<style lang="less">
.report-submitter__tabs {
  margin-left: 10px;

  .uploader {
    .ant-upload-drag {
      height: 50%;
    }
  }

  .ant-tabs-left-bar {
    .ant-tabs-tab {
      height: 100px;
      text-align: left;
      writing-mode: vertical-rl;
    }
  }
}
</style>