import router from './router'
import store from './store'

import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import notification from 'ant-design-vue/es/notification'
import {
  setDocumentTitle
} from '@/utils/domUtil'
import {
  domTitle
} from '@/config/defaultSettings'
import {
  timeFix
} from '@/config/defaultSettings'

NProgress.configure({
  showSpinner: true
}) // NProgress Configuration

const whiteList = [
  '/404',
  // Menu
  '/',
  '/dashboard',
  '/materials',
  '/request-materials',
  '/data/download',
  '/markdown-previewer',
  '/seq-flow/app-store',
  '/reference-datasets/download',
  '/reference-datasets/visualization/quartet-dna-vis',
  '/reference-datasets/visualization/quartet-rna-vis',
  '/reference-datasets/visualization/quartet-protein-vis',
  '/reference-datasets/visualization/quartet-metabolism-vis',
  // User
  '/user/login',
  '/user/register',
  '/user/recover'
] // no redirect whitelist

const loginRoutePath = '/user/login'
const defaultRoutePath = '/dashboard'

const logout = (store, next, to) => {
  // 过期清理
  store.dispatch('Logout')

  notification.error({
    message: 'No Permission',
    description: 'You need to login if you want to access private resource.',
    btn: h => {
      return h(
        'a-button', {
          props: {
            type: 'primary',
            size: 'small'
          },
          on: {
            click: () => {
              notification.close('no-permission')
              next({
                path: loginRoutePath,
                query: {
                  redirect: to.fullPath
                }
              })
            }
          }
        },
        'Confirm'
      )
    },
    key: 'no-permission',
    onClose: () => {}
  })
  NProgress.done() // finish progress bar  
}

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  to.meta && typeof to.meta.title !== 'undefined' && setDocumentTitle(`${to.meta.title} - ${domTitle}`)

  store.dispatch('CheckToken').then(isAuthenticated => {
    if (isAuthenticated) {
      store.dispatch('GetInfo', false).then(userInfo => {
        if (to.path === loginRoutePath) {
          next({
            path: defaultRoutePath
          })
          NProgress.done()
        } else {
          const redirect = decodeURIComponent(from.query.redirect || to.path)
          if (to.path === redirect) {
            // Set the replace: true so the navigation will not leave a history record
            next()
          } else {
            // 跳转到目的路由
            next({
              path: redirect
            })
          }
        }
      }).catch(err => {
        logout(store, next, to)
      })
    } else {
      if (whiteList.includes(to.path)) {
        next()
      } else {
        logout(store, next, to)
      }
    }
  })
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})