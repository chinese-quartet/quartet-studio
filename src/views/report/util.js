import moment from 'moment'
import { getReportList, getReport } from '@/api/manage'

export const formatDateTime = function (datetime) {
  if (datetime) {
    return moment(datetime).format('YYYY-MM-DD HH:mm')
  } else {
    return ''
  }
}

export const formatRecords = function (records) {
  const data = []
  records.forEach(record => {
    console.log('Format Records: ', record)
    const newRecord = {
      payload: record.payload,
      name: record.name,
      description: record.description,
      reportType: record.plugin_name,
      startedAt: formatDateTime(record.started_time),
      finishedAt: formatDateTime(record.finished_time),
      status: record.status,
      id: record.id,
      percentage: record.percentage,
      response: record.response
    }

    data.push(newRecord)
  })

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
