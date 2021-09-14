<template>
  <a-row class="report-submitter">
    <a-tabs class="report-submitter__tabs" default-active-key="report" tab-position="left">
      <a-tab-pane class="report-submitter__tabs__report" key="report" tab="Select Report" :forceRender="true">
        <a-alert style="margin-bottom: 15px" message="Notices" type="info" show-icon>
          <span slot="description">
            <span>
              The QC Report contains three steps: <b>Select Report</b> --> <b>Upload File(s)</b> --> <b>Parameters</b>.
              <br />
              <b>Please follow the order.</b>
            </span>
          </span>
        </a-alert>
        <a-table :columns="columns" :data-source="data" :pagination="false" :row-selection="rowSelection" />
      </a-tab-pane>
      <a-tab-pane class="report-submitter__tabs__uploader" key="files" tab="Upload File(s)" :forceRender="true">
        <a-divider style="margin: 0px 0px 16px">Upload Data & Metadata File</a-divider>
        <a-alert style="margin-bottom: 15px" message="Notices" type="info" show-icon>
          <span slot="description">
            <span> Additional description and informations about data & metadata files. </span>
            <br />

            Example Files: &nbsp;
            <a href="/examples/protqc/data_log2_example.csv">Data File</a>
            &nbsp;
            <a href="/examples/protqc/metadata_example.csv">Metadata File</a>
          </span>
        </a-alert>
        <a-upload-dragger
          :disabled="uploadSuccessList.length === 2"
          :remove="handleRemove"
          :multiple="true"
          :beforeUpload="beforeUpload"
          :customRequest="uploadFile"
          @change="handleChange"
        >
          <p class="ant-upload-drag-icon">
            <a-icon type="inbox" />
          </p>
          <p class="ant-upload-text">Click or drag file to this area to upload</p>
          <p class="ant-upload-hint">A maximum of 2 matched files can be uploaded at a time.</p>
        </a-upload-dragger>
        <p class="ant-upload-help-text">
          File naming conventions:
          <br />1. A file name can contain only UTF-8 characters. <br />2. A file name is case-sensitive. <br />3. A
          file name must be 1 to 1023 bytes in length. <br />4. A file name cannot start with a forward slash (/) or
          consecutive backslashes (\).
          <br />
        </p>
      </a-tab-pane>
      <a-tab-pane class="report-submitter__tabs__metadata-former" key="parameters" tab="Parameters" :forceRender="true">
        <a-divider style="margin: 0px 0px 16px">Metadata for QC Report</a-divider>
        <a-alert style="margin-bottom: 15px" message="Notices" type="info" show-icon>
          <span slot="description">
            <span> Additional description and informations about data & metadata files. </span>
          </span>
        </a-alert>
        <a-form :form="form" layout="vertical" @submit="createReport">
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
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item label="Report Name">
                <a-input
                  v-decorator="[
                    'name',
                    {
                      initialValue: `QC Report with ${dataFileName} + ${metadataFileName}`,
                      rules: [{ required: true, message: 'Please input the report name!' }],
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
import { mapActions } from 'vuex'
import filter from 'lodash.filter'
import { submitReport } from '@/api/manage'
import { v4 as uuidv4 } from 'uuid'

const columns = [
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
    key: 'version'
  }
]

const data = [
  {
    name: 'quartet-protqc-report',
    description: 'Generate the QC Report for Quartet Proteomics data.',
    version: 'v0.1.1',
    key: 'quartet-protqc-report'
  },
  {
    name: 'quartet-metqc-report',
    description: 'Generate the QC Report for Quartet Metabolomics data.',
    version: 'v0.1.1',
    key: 'quartet-metqc-report'
  }
]

export default {
  data() {
    return {
      columns,
      data,
      currentReport: 'Please select the report tool in STEP 1!',
      rowSelection: {
        type: 'radio',
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
        },
        onSelect: (record, selected, selectedRows) => {
          console.log(record, selected, selectedRows)
          this.currentReport = record.key
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
          console.log(selected, selectedRows, changeRows)
        }
      },
      fileList: [],
      uploadSuccessList: [
        {
          name: 'datafile',
          path: 'datafile'
        },
        {
          name: 'metadata',
          path: 'metadata'
        }
      ],
      form: this.$form.createForm(this, { name: 'coordinated' }),
      loading: false,
      modelOptions: []
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
    }
  },
  methods: {
    ...mapActions({
      makeUploadUrl: 'MakeUploadUrl',
      getObjectMeta: 'GetObjectMeta'
    }),
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
      this.loading = true
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          submitReport(values.report_tool, {
            name: values.name,
            description: values.description,
            data_file: values.data_file,
            metadata_file: values.metadata_file
          }).then(response => {
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

      console.log('Before Upload: ', fileList, fileExtList, fileNameList)

      if (
        fileList.length === 2 &&
        fileExtList.length === 2 &&
        fileNameList[0] === fileNameList[1] &&
        fileExtList.includes('csv')
      ) {
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
          name: 'reports',
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
            path: `file:///data/quartet-data-portal/${filekey}`
          })
          onSuccess(response, file)
        })
        .catch(error => {
          console.log(error, ', so we can upload it...')
          this.makeUploadUrl({
            service: 'minio',
            name: 'reports',
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
                    path: `file:///data/quartet-data-portal/${filekey}`
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
  }
}
</script>

<style lang="less" scoped>
.report-submitter {
  position: relative;

  .report-submitter__tabs__uploader {
    .ant-upload-help-text {
      border: 1px solid #eee;
      padding: 10px;
      margin-top: 10px;
      border-radius: 5px;
    }
  }

  .report-submitter__tabs__metadata-former__action {
    float: right;
    position: fixed;
    bottom: 5px;
    right: 25px;
    margin-bottom: 0px;
  }
}
</style>

<style lang="less">
.report-submitter__tabs {
  .ant-tabs-left-bar {
    .ant-tabs-tab {
      height: 100px;
      text-align: left;
      writing-mode: vertical-rl;
    }
  }
}
</style>