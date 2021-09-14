import { getReportList, getReport } from '@/api/manage'

export const GetTaskList = function (parameter) {
  return new Promise((resolve, reject) => {
    getReportList(parameter)
      .then(response => {
        console.log('GetTaskList: ', parameter, response)

        const data = {
          pageSize: response['page_size'],
          page: response['page'],
          total: response['total'],
          data: response.data
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
