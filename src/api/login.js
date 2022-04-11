import api from './index'
import {
  axios
} from '@/utils/request'
import {
  config
} from '@/config/defaultSettings'
import {
  userInfo
} from '@/utils/defaultUser'

/**
 * login func
 * parameter: {
 *   username: '',
 *   password: '',
 *   client_id: '',
 *   grant_type: 'password'
 * }
 * @param parameter
 * @returns {*}
 */
export function login(payload) {
  return axios({
    url: api.Login,
    method: 'post',
    data: payload
  })
}

/**
 * refresh token func
 * parameter: {
 *   client_id: '',
 *   refresh_token: '',
 *   grant_type: 'refresh_token'
 * }
 * @param parameter
 * @returns {*}
 */
export function refreshToken(payload) {
  const params = new URLSearchParams()
  params.append('client_id', payload.client_id)
  params.append('refresh_token', payload.refresh_token)
  params.append('grant_type', payload.grant_type)
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }

  return axios.post(api.RefreshToken, params, config)
}

export function getInfo(isAnonymous) {
  if (isAnonymous) {
    return new Promise((resolve) => {
      resolve(userInfo)
    })
  } else {
    return axios({
      url: api.UserInfo,
      method: 'get',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
  }
}

export function logout() {
  return axios({
    url: api.Logout,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}