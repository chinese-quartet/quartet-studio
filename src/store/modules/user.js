import {
  getInfo,
  login,
  logout
} from '@/api/login'

import {
  welcome
} from '@/config/defaultSettings'

import {
  tokenIsExpired,
  validateEmail,
} from '@/utils/util'

import {
  userInfo
} from '@/utils/defaultUser'

import v from 'voca'

export const checkToken = (tokenJSON) => {
  if (tokenJSON) {
    const tokenIsValid = !tokenIsExpired(tokenJSON.access_token)
    if (tokenIsValid) {
      return tokenJSON
    }
  } else {
    tokenJSON = JSON.parse(localStorage.getItem('CLINICO_OMICS_AUTH'))
    if (tokenJSON) {
      const tokenIsValid = !tokenIsExpired(tokenJSON.access_token)
      if (tokenIsValid) {
        return tokenJSON
      }
    }
  }

  return null
}

const user = {
  state: {
    name: '',
    kebab_name: '',
    email: '',
    lastname: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {},
    token: undefined,
    isAuthenticated: false
  },

  mutations: {
    SET_NAME: (state, {
      name,
      welcome,
      kebab_name
    }) => {
      state.name = name
      state.welcome = welcome
      state.kebab_name = kebab_name
    },
    SET_TOKEN(state, token) {
      state.token = token
    },
    SET_EMAIL: (state, {
      email
    }) => {
      state.email = email
    },
    SET_LAST_NAME: (state, lastname) => {
      state.lastname = lastname
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_STATE: (state, isAuthenticated) => {
      state.isAuthenticated = isAuthenticated
    }
  },

  actions: {
    CheckToken({
      commit,
      state
    }) {
      return new Promise(resolve => {
        const authJSON = checkToken(state.token)
        console.log('Check Token: ', authJSON)
        if (authJSON) {
          commit('SET_STATE', true)
        } else {
          commit('SET_STATE', false)
        }

        resolve(authJSON)
      })
    },
    // 获取用户信息
    GetInfo({
      commit,
      state
    }, isAnonymous) {
      return new Promise((resolve, reject) => {
        // console.log("Current State: ", state)
        if (state.email.length > 0) {
          console.log("The user information exists, so skip to get it.")
          resolve(state.info)
        } else {
          getInfo(isAnonymous)
            .then(response => {
              userInfo.name = response.name ? response.name : response.preferred_username
              userInfo.username = v.titleCase(userInfo.name)
              userInfo.email = response.email
              // Keycloak may be not return groups in response, so we need to check it
              userInfo.groups = response.groups ? response.groups : []

              let kebab_name = response.preferred_username ? response.preferred_username : ""
              if (!validateEmail(kebab_name)) {
                kebab_name = v.kebabCase(kebab_name)
              }

              console.log('GetInfo: ', isAnonymous, response, userInfo, userInfo.name)
              commit('SET_INFO', userInfo)

              commit('SET_NAME', {
                name: userInfo.name,
                welcome: welcome(),
                kebab_name: kebab_name
              })
              commit('SET_EMAIL', {
                email: userInfo.email
              })
              commit('SET_LAST_NAME', userInfo.name.split(' ').pop())
              commit('SET_AVATAR', userInfo.avatar)

              resolve(userInfo)
            })
            .catch(error => {
              reject(error)
            })
        }
      })
    },
    Login({
      commit
    }, payload) {
      return new Promise((resolve, reject) => {
        const authJSON = checkToken()
        if (authJSON) {
          commit('SET_STATE', true)
          resolve(authJSON)
        } else {
          login(payload)
            .then(response => {
              commit('SET_TOKEN', response)
              console.log('login ', response)
              localStorage.setItem('CLINICO_OMICS_AUTH', JSON.stringify(response))
              commit('SET_STATE', true)
              resolve(response)
            })
            .catch(error => {
              reject(error)
            })
        }
      })
    },
    Logout({
      dispatch,
      commit
    }) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', undefined)
        for (var i in localStorage) {
          if (i == new RegExp('kc-callback', 'gi')) {
            console.log('Remove kc-callback: ', i, localStorage.getItem(i))
            localStorage.removeItem(i)
            break
          }
        }
        if (localStorage.getItem('CLINICO_OMICS_AUTH')) {
          if (window.location.hostname !== 'localhost') {
            logout()
              .then(response => {
                console.log('Logout ', response)
                localStorage.removeItem('CLINICO_OMICS_AUTH')
                resolve(response)
              })
              .catch(error => {
                localStorage.removeItem('CLINICO_OMICS_AUTH')
                // It will be failed When encounter CORS problem
                // reject(error)
                resolve()
              })
          } else {
            localStorage.removeItem('CLINICO_OMICS_AUTH')
            resolve()
          }
        } else {
          resolve()
        }
      })
    }
  }
}

export default user