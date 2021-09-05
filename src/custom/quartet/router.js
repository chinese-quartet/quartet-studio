// eslint-disable-next-line
import { BasicLayout, RouteView, UserLayout } from '@/layouts'
import { getDnaHost, getRnaHost, getProteinHost, getMetabolismHost } from '@/custom/quartet/config'

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: 'Home' },
    redirect: '/dashboard',
    children: [
      // Dashboard
      {
        path: '/dashboard',
        name: 'dashboard',
        hidden: false,
        component: () => import('@/custom/quartet/components/QuartetDashboard'),
        meta: { title: 'Overview', icon: 'dashboard', permission: ['dashboard'], keepAlive: false }
      },

      // Materials
      {
        path: '/materials',
        name: 'materials',
        component: () => import('@/views/materials/Analysis'),
        meta: { title: 'Reference Materials', icon: 'experiment', keepAlive: false }
      },

      // Data (Level 0 - 4)
      {
        path: '/data',
        name: 'data',
        component: RouteView,
        redirect: '/data/download',
        hidden: false,
        meta: { title: 'Multiomics Data', icon: 'deployment-unit', keepAlive: false },
        children: [
          {
            path: '/data/upload',
            name: 'upload-data',
            hidden: false,
            component: () => import('@/views/datasource/UploadData'),
            meta: { title: 'Upload Your Omics Data', icon: 'upload', permission: ['table'], keepAlive: false }
          },
          {
            path: '/data/download',
            name: 'download-data',
            hidden: false,
            component: () => import('@/views/datasource/FilterPanel'),
            meta: { title: 'Browser & Download Omics Data', icon: 'download', permission: ['table'], keepAlive: false }
          },
          {
            path: '/data/qc-job-submit/:pageNo([1-9]\\d*)?',
            name: 'create-project',
            hidden: true,
            props: route => ({ appId: route.query.appId }),
            component: () => import('@/views/workflow/stepForm/StepForm'),
            meta: { title: 'Create Project', icon: 'file-add', permission: ['table'], keepAlive: false }
          },
          {
            path: '/data/qc-job-management/:projectId',
            name: 'job-management',
            hidden: true,
            hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/workflow/WorkflowManagement'),
            meta: {
              title: 'Job Management',
              icon: 'file-sync',
              drawerMode: false,
              keepAlive: false,
              permission: ['table']
            }
          }
        ]
      },

      {
        path: '/data/quality-assessment-management',
        name: 'project-management',
        component: () => import('@/views/workflow/ProjectManagement'),
        meta: { title: 'Assessment', icon: 'solution', permission: ['table'], keepAlive: false }
      },

      // SeqFlow
      {
        path: '/seq-flow',
        name: 'seq-flow',
        component: RouteView,
        hidden: true,
        redirect: '/seq-flow/submit',
        meta: { title: 'Analyses', icon: 'project', permission: ['table'], keepAlive: false },
        children: [
          {
            path: '/seq-flow/app-store',
            name: 'appstore',
            hidden: false,
            component: () => import('@/views/appstore/FilterPanel'),
            meta: { title: 'Apps & Tools', icon: 'appstore', permission: ['table'], keepAlive: false }
          },
          {
            path: '/seq-flow/file-manager',
            name: 'file-manager',
            hidden: false,
            component: () => import('@/views/filemanager/FileBrowser'),
            props: route => ({
              path: route.query.path,
              enabledContextMenu: false
            }),
            meta: { title: 'File Management', icon: 'codepen-circle', keepAlive: false }
          },
          {
            path: '/seq-flow/report-management',
            name: 'report-management',
            hidden: false,
            props: route => ({ creationMode: route.query.creationMode, reportTool: route.query.reportTool }),
            component: () => import('@/views/report/ReportManagement'),
            meta: { title: 'Report Management', icon: 'file-done', permission: ['table'], keepAlive: false }
          }
        ]
      },

      // Visualization
      {
        path: '/reference-datasets',
        name: 'reference-datasets',
        component: RouteView,
        redirect: '/reference-datasets/quartet-rna-vis',
        meta: { title: 'Reference Datasets', icon: 'safety-certificate', keepAlive: false },
        children: [
          {
            path: '/reference-datasets/download',
            name: 'download-reference-datasets',
            hidden: false,
            component: () => import('@/views/datasource/ReferenceDataset'),
            meta: { title: 'Browser & Download Reference Datasets', icon: 'download', keepAlive: false },
          },
          {
            path: '/reference-datasets/visualization',
            name: 'visualization',
            component: RouteView,
            redirect: '/visualization/quartet-rna-vis',
            meta: { title: 'Discovery Reference Datasets', icon: 'dot-chart', keepAlive: false },
            children: [
              {
                path: '/reference-datasets/visualization/quartet-dna-vis',
                name: 'Genomics',
                hidden: false,
                component: () => import('@/components/FullFrame'),
                props: route => ({ src: getDnaHost() }),
                meta: { title: 'Genomics', icon: 'double-right', keepAlive: false }
              },
              {
                path: '/reference-datasets/visualization/quartet-rna-vis',
                name: 'Transcriptomics',
                hidden: false,
                component: () => import('@/components/FullFrame'),
                props: route => ({ src: getRnaHost() }),
                meta: { title: 'Transcriptomics', icon: 'double-right', keepAlive: false }
              },
              {
                path: '/reference-datasets/visualization/quartet-protein-vis',
                name: 'Proteomics',
                hidden: false,
                component: () => import('@/components/FullFrame'),
                props: route => ({ src: getProteinHost() }),
                meta: { title: 'Proteomics', icon: 'double-right', disabled: true, keepAlive: false }
              },
              {
                path: '/reference-datasets/visualization/quartet-metabolism-vis',
                name: 'Metabolomics',
                hidden: false,
                component: () => import('@/components/FullFrame'),
                props: route => ({ src: getMetabolismHost() }),
                meta: { title: 'Metabolomics', icon: 'double-right', disabled: true, keepAlive: false }
              }
            ]
          }
        ]
      },

      // Embeded Frame
      {
        path: '/embeded-frame',
        name: 'embeded-frame',
        hidden: true,
        component: () => import('@/components/FullFrame'),
        props: route => ({ src: route.query.src }),
        meta: { title: 'Embeded Frame', icon: 'dot-chart', keepAlive: false }
      },

      // Request Materials
      {
        path: '/request-materials',
        name: 'request-materials',
        hidden: true,
        component: () => import('@/custom/quartet/components/Request'),
        meta: { titile: 'Request Materials', icon: 'pull-request', keepAlive: false }
      },

      // Account
      {
        path: '/account',
        hidden: true,
        component: RouteView,
        redirect: '/account/center',
        name: 'account',
        meta: { title: 'User', icon: 'user', keepAlive: false, permission: ['user'] },
        children: [
          {
            path: '/account/center',
            name: 'center',
            component: () => import('@/views/account/center/Index'),
            meta: { title: 'User Center', keepAlive: false, permission: ['user'] }
          },
          {
            path: '/account/settings',
            name: 'settings',
            component: () => import('@/views/account/settings/Index'),
            meta: { title: 'Profiles', hideHeader: true, permission: ['user'] },
            redirect: '/account/settings/base',
            hideChildrenInMenu: true,
            children: [
              {
                path: '/account/settings/base',
                name: 'base-settings',
                component: () => import('@/views/account/settings/BaseSetting'),
                meta: { title: 'Basic Profiles', hidden: true, permission: ['user'] }
              },
              {
                path: '/account/settings/security',
                name: 'security-settings',
                component: () => import('@/views/account/settings/Security'),
                meta: { title: 'Secure Profiles', hidden: true, keepAlive: false, permission: ['user'] }
              },
              {
                path: '/account/settings/custom',
                name: 'custom-settings',
                component: () => import('@/views/account/settings/Custom'),
                meta: { title: 'Customization', hidden: true, keepAlive: false, permission: ['user'] }
              },
              {
                path: '/account/settings/binding',
                name: 'binding-settings',
                component: () => import('@/views/account/settings/Binding'),
                meta: { title: 'Binding Settings', hidden: true, keepAlive: false, permission: ['user'] }
              },
              {
                path: '/account/settings/notification',
                name: 'notification-settings',
                component: () => import('@/views/account/settings/Notification'),
                meta: { title: 'Notifications', hidden: true, keepAlive: false, permission: ['user'] }
              }
            ]
          }
        ]
      },

      // Subcomponent - Report
      {
        path: '/datains-report',
        name: 'datains-report',
        component: RouteView,
        hidden: true,
        redirect: '/datains-report/report-management',
        meta: { title: 'Report', icon: 'solution', permission: ['table'] },
        children: [
          {
            path: '/datains-report/:reportId',
            name: 'report-details',
            hidden: true,
            component: () => import('@/views/report/ReportDetails'),
            props: route => ({ readonly: route.query.readonly }),
            meta: { title: 'Report Details', drawerMode: true, permission: ['table'] }
          }
        ]
      },

      // Subcomponent - Notification
      {
        path: '/notifications',
        name: 'notifications',
        hidden: true,
        component: () => import('@/views/notification/NotificationTable'),
        meta: { title: 'Notifications', icon: 'notification', permission: ['table'] }
      },

      // Exception
      {
        path: '/exception',
        hidden: true,
        name: 'exception',
        component: RouteView,
        redirect: '/exception/403',
        meta: { title: '异常页', icon: 'warning', permission: ['exception'] },
        children: [
          {
            path: '/exception/403',
            name: 'exception403',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
            meta: { title: '403', permission: ['exception'] }
          },
          {
            path: '/exception/404',
            name: 'exception404',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
            meta: { title: '404', permission: ['exception'] }
          },
          {
            path: '/exception/500',
            name: 'exception500',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),
            meta: { title: '500', permission: ['exception'] }
          }
        ]
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  },

  {
    path: '/welcome',
    name: 'welcome',
    beforeEnter () {
      location.href = 'http://chinese-quartet.org'
    },
    meta: { title: 'Welcome', isPublic: true, keepAlive: false, target: '_blank' }
  },

  // User
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: '/user/login',
        name: 'login',
        component: () => import('@/views/account/Login')
      },
      {
        path: '/user/register',
        name: 'register',
        component: () => import('@/views/account/Register')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  }
]
