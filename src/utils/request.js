import axios from 'axios'
import store from '@/store'
import notification from 'ant-design-vue/es/notification'
import {
  VueAxios
} from './axios'
import {
  initBaseURL,
  projectSettings
} from '@/config/defaultSettings'
import {
  refreshToken
} from '@/api/login'
import {
  getRefreshToken
} from '@/utils/util'

// 创建 axios 实例
const service = axios.create({
  baseURL: initBaseURL(), // api base_url
  timeout: 60000 // 请求超时时间
})

const err = (error) => {
  if (error.response) {
    const data = error.response.data
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message
      })
    }

    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      const token = getRefreshToken()
      if (token) {
        refreshToken({
            refresh_token: token,
            grant_type: 'refresh_token',
            client_id: projectSettings.clientId
          })
          .then(response => {
            console.log('Refresh Token: ', response)
            localStorage.setItem('CLINICO_OMICS_AUTH', JSON.stringify(response))
            // New request with new token
            const config = error.config;
            config.headers['Authorization'] = `Bearer ${token}`;

            return new Promise((resolve, reject) => {
              axios.request(config).then(response => {
                resolve(response);
              }).catch((error) => {
                reject(error);
              })
            });
          })
          .catch(error => {
            notification.error({
              message: 'Unauthorized',
              description: 'Authorization verification failed. You need to login if you want to access private resource.'
            })
            reject(error)
          })
      } else {
        notification.error({
          message: 'Unauthorized',
          description: 'Authorization verification failed. You need to login if you want to access private resource.'
        })
        reject(error)
      }
    }
  }
  return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use(config => {
  const user = JSON.parse(localStorage.getItem('CLINICO_OMICS_AUTH'))
  if (user) {
    const token = user.access_token
    config.headers['Authorization'] = 'Bearer ' + token // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  return config
}, err)

// response interceptor
service.interceptors.response.use((response) => {
  return response.data
}, err)

const installer = {
  vm: {},
  install(Vue) {
    Vue.use(VueAxios, service)
  }
}

export {
  installer as VueAxios,
  service as axios
}