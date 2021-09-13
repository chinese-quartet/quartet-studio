import router from './router'
import store from './store'

import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import notification from 'ant-design-vue/es/notification'
import { setDocumentTitle } from '@/utils/domUtil'
import { domTitle } from '@/config/defaultSettings'

NProgress.configure({ showSpinner: true }) // NProgress Configuration

const whiteList = [
  '/404',
  // Menu
  '/',
  '/dashboard',
  '/materials',
  '/request-materials',
  '/data/upload',
  '/data/download',
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

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  to.meta && typeof to.meta.title !== 'undefined' && setDocumentTitle(`${to.meta.title} - ${domTitle}`)

  store.dispatch('CheckToken').then(isAuthenticated => {
    if (store.getters.roles.length === 0) {
      store.dispatch('GetInfo', !isAuthenticated).then(userInfo => {
        console.log('userInfo: ', userInfo)
        const roles = userInfo.role

        store.dispatch('GenerateRoutes', { roles }).then(() => {
          // 根据roles权限生成可访问的路由表
          // 动态添加可访问路由表
          router.addRoutes(store.getters.addRouters)

          const redirect = decodeURIComponent(from.query.redirect || to.path)
          if (to.path === redirect) {
            // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
            next({ ...to, replace: true })
          } else {
            // 跳转到目的路由
            next({ path: redirect })
          }
        })
      }).catch(error => {
        store.dispatch('Logout')
        console.log('Permission: ', error)

        next(false)
        NProgress.done() // finish progress bar
      })
    }

    if (isAuthenticated) {
      if (to.path === loginRoutePath) {
        next({ path: defaultRoutePath })
        NProgress.done()
      } else {
        next()
      }
    } else {
      if (whiteList.includes(to.path)) {
        next()
      } else {
        // 过期清理
        store.dispatch('Logout')

        notification.error({
          message: 'Authorization verification failed',
          description:
            'You need to request reference materials and then get an official account from the Quartet Team for accessing private resource.',
          btn: h => {
            return h(
              'a-button',
              {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => notification.close('no-permission')
                }
              },
              'Confirm'
            )
          },
          key: 'no-permission',
          onClose: () => {}
        })

        next(false)
        NProgress.done() // finish progress bar
      }
    }
  })
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
