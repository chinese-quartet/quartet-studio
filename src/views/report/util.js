import moment from 'moment'
import { getReportList, getReport } from '@/api/manage'
import map from 'lodash.map'

export const formatDateTime = function (datetime) {
  if (datetime) {
    return moment(datetime).format('YYYY-MM-DD HH:mm')
  } else {
    return ''
  }
}

const logoMap = {
  'quartet-protqc-report': require('@/assets/images/proteomics.png'),
  'quartet-rseqc-report': require('@/assets/images/transcriptomics.png'),
  'quartet-metqc-report': require('@/assets/images/metabolomics.png'),
  'quartet-dseqc-report': require('@/assets/images/genomics.png')
}

export const getLogo = function(reportType) {
  return logoMap[reportType]
}

export const formatRecords = function (records) {
  const data = []
  records.forEach(record => {
    const newRecord = {
      payload: record.payload,
      name: record.name,
      description: record.description,
      reportType: record.plugin_name,
      category: getLogo(record.plugin_name),
      version: record.plugin_version,
      startedAt: formatDateTime(record.started_time),
      finishedAt: formatDateTime(record.finished_time),
      status: record.status,
      id: record.id,
      percentage: record.percentage,
      response: {
        report: record.response.report.replaceAll('minio://tservice/', ''),
        log: record.response.log.replaceAll('minio://tservice/', '')
      }
    }

    data.push(newRecord)
  })

  console.log('Format Records: ', data)
  return data
}

export const GetTaskList = function (parameter) {
  return new Promise((resolve, reject) => {
    getReportList(parameter)
      .then(response => {
        console.log('GetTaskList: ', parameter, response)

        const data = {
          pageSize: response['page_size'],
          page: response['page'],
          total: response['total'],
          data: formatRecords(response.data)
        }

        resolve(data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export const GetTask = function (taskId) {
  return new Promise((resolve, reject) => {
    getReport(taskId)
      .then(response => {
        console.log('Get Task: ', taskId, response)

        const data = formatRecords([response])[0]

        resolve(data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
