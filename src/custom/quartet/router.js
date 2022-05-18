// eslint-disable-next-line
import {
  BasicLayout,
  RouteView,
  UserLayout
} from '@/layouts'
import {
  getDnaHost,
  getRnaHost,
  getProteinHost,
  getMetabolismHost
} from '@/custom/quartet/config'

export const asyncRouterMap = [{
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: {
      title: 'Home'
    },
    redirect: '/dashboard',
    children: [
      // Dashboard
      {
        path: '/dashboard',
        name: 'dashboard',
        hidden: false,
        component: () => import('@/views/dashboard/QuartetDashboard'),
        meta: {
          title: 'Overview',
          icon: 'dashboard',
          keepAlive: false
        }
      },

      // Materials
      {
        path: '/materials',
        name: 'materials',
        component: () => import('@/views/materials/Analysis'),
        meta: {
          title: 'Reference Materials',
          icon: 'experiment',
          keepAlive: false
        }
      },

      // Data (Level 0 - 4)
      {
        path: '/data',
        name: 'data',
        component: RouteView,
        redirect: '/data/download',
        hidden: false,
        meta: {
          title: 'Multiomics Data',
          icon: 'deployment-unit',
          keepAlive: false
        },
        children: [{
            path: '/data/download',
            name: 'download-data',
            hidden: true,
            component: () => import('@/views/datasource/FilterPanel'),
            meta: {
              title: 'Browse & Download',
              icon: 'download',
              keepAlive: false
            }
          },
          {
            path: '/data/download/quartet-genomics',
            name: 'download-genomics-data',
            hidden: false,
            component: () => import('@/views/datasource/FilterPanel'),
            meta: {
              title: 'Genomics Data',
              icon: 'download',
              keepAlive: false
            },
            props: route => ({
              whichCollection: 'quartet_genomics'
            }),
          },
          {
            path: '/data/download/quartet-transcriptomics',
            name: 'download-transcriptomics-data',
            hidden: false,
            component: () => import('@/views/datasource/FilterPanel'),
            meta: {
              title: 'Transcriptomics Data',
              icon: 'download',
              keepAlive: false
            },
            props: route => ({
              whichCollection: 'quartet_transcriptomics'
            }),
          },
          {
            path: '/data/download/quartet-proteomics',
            name: 'download-proteomics-data',
            hidden: false,
            component: () => import('@/views/datasource/FilterPanel'),
            meta: {
              title: 'Proteomics Data',
              icon: 'download',
              keepAlive: false
            },
            props: route => ({
              whichCollection: 'quartet_proteomics'
            }),
          },
          {
            path: '/data/download/quartet-metabolomics',
            name: 'download-metabolomics-data',
            hidden: false,
            component: () => import('@/views/datasource/FilterPanel'),
            meta: {
              title: 'Metabolomics Data',
              icon: 'download',
              keepAlive: false
            },
            props: route => ({
              whichCollection: 'quartet_metabolomics'
            }),
          },
          {
            path: '/data/qc-job-submit/:pageNo([1-9]\\d*)?',
            name: 'create-project',
            hidden: true,
            props: route => ({
              appId: route.query.appId
            }),
            component: () => import('@/views/workflow/stepForm/StepForm'),
            meta: {
              title: 'Create Project',
              icon: 'file-add',
              keepAlive: false
            }
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
              keepAlive: false
            }
          }
        ]
      },

      // SeqFlow
      {
        path: '/seq-flow',
        name: 'seq-flow',
        component: RouteView,
        hidden: false,
        redirect: '/seq-flow/submit',
        meta: {
          title: 'Quality Assessment',
          icon: 'project',
          keepAlive: false
        },
        children: [{
            path: '/seq-flow/app-store',
            name: 'appstore',
            hidden: false,
            component: () => import('@/views/appstore/FilterPanel'),
            meta: {
              title: 'QC Apps',
              icon: 'appstore',
              keepAlive: false
            },
            props: route => ({
              appCategory: route.query.appCategory
            }),
          },
          {
            path: '/seq-flow/quality-assessment-management',
            name: 'project-management',
            hidden: true,
            component: () => import('@/views/workflow/ProjectManagement'),
            meta: {
              title: 'DNA-Seq & RNA-Seq Pipelines',
              icon: 'solution',
              keepAlive: false
            }
          },
          {
            path: '/seq-flow/dnaseq-quality-assessment-management',
            name: 'dnaseq-project-management',
            hidden: true,
            component: RouteView,
            meta: {
              title: 'DNA-Seq Data',
              icon: 'file-done',
              keepAlive: false
            },
            children: [{
                path: '/seq-flow/dnaseq-quality-assessment-pipeline',
                name: 'quartet_dna_quality_control_wgs_big_pipeline',
                hidden: false,
                component: () => import('@/views/workflow/ProjectManagement'),
                meta: {
                  title: 'DNA-Seq Pipeline',
                  icon: 'apartment',
                  keepAlive: false
                },
                // Need to keep the appId stable for the same app
                props: route => ({
                  appId: 'ea989ffd08517f6c4dc1edf931ac946f',
                })
              },
              {
                path: '/seq-flow/dseqc-report-management',
                name: 'quartet-dseqc-report',
                hidden: false,
                component: () => import('@/views/report/ReportList'),
                meta: {
                  title: 'DNA-Seq QC Report',
                  icon: 'file-done',
                  keepAlive: false
                },
                props: {
                  pluginName: 'quartet-dseqc-report'
                }
              },
            ]
          },
          {
            path: '/seq-flow/rnaseq-quality-assessment-management',
            name: 'rnaseq-project-management',
            component: RouteView,
            hidden: true,
            meta: {
              title: 'RNA-Seq Data',
              icon: 'file-done',
              keepAlive: false
            },
            children: [{
                path: '/seq-flow/rnaseq-quality-assessment-pipeline',
                name: 'quartet-rnaseq-qc',
                hidden: false,
                component: () => import('@/views/workflow/ProjectManagement'),
                meta: {
                  title: 'RNA-Seq Pipeline',
                  icon: 'solution',
                  keepAlive: false
                },
                props: route => ({
                  appId: 'fd63809bc013bec3664b072d3465ba75',
                })
              },
              {
                path: '/seq-flow/rseqc-report-management',
                name: 'quartet-rseqc-report',
                hidden: false,
                component: () => import('@/views/report/ReportList'),
                meta: {
                  title: 'RNA-Seq QC Report',
                  icon: 'file-done',
                  keepAlive: false
                },
                props: {
                  pluginName: 'quartet-rseqc-report'
                }
              },
            ]
          },
          {
            path: '/seq-flow/protqc-report-management',
            name: 'quartet-protqc-report',
            hidden: true,
            component: () => import('@/views/report/ReportList'),
            meta: {
              title: 'Proteomics Data',
              icon: 'file-done',
              keepAlive: false
            },
            props: {
              pluginName: 'quartet-protqc-report'
            }
          },
          {
            path: '/seq-flow/metqc-report-management',
            name: 'quartet-metqc-report',
            hidden: true,
            component: () => import('@/views/report/ReportList'),
            meta: {
              title: 'Metabolomics Data',
              icon: 'file-done',
              keepAlive: false
            },
            props: {
              pluginName: 'quartet-metqc-report'
            }
          },
          {
            path: '/seq-flow/qc-report-management',
            name: 'report-management',
            hidden: false,
            component: () => import('@/views/report/ReportList'),
            meta: {
              title: 'QC Report History',
              icon: 'file-text',
              keepAlive: false
            }
          },
          {
            path: '/data/upload',
            name: 'upload-data',
            hidden: false,
            component: () => import('@/views/datasource/UploadData'),
            meta: {
              title: 'All Your Data',
              icon: 'upload',
              keepAlive: false
            }
          },
          {
            path: '/seq-flow/file-manager',
            name: 'file-manager',
            hidden: true,
            component: () => import('@/views/filemanager/FileBrowser'),
            props: route => ({
              path: route.query.path,
              enabledContextMenu: false
            }),
            meta: {
              title: 'File Management',
              icon: 'codepen-circle',
              keepAlive: false
            }
          }
        ]
      },

      // Visualization
      {
        path: '/reference-datasets',
        name: 'reference-datasets',
        component: RouteView,
        redirect: '/reference-datasets/quartet-rna-vis',
        meta: {
          title: 'Reference Datasets',
          icon: 'safety-certificate',
          keepAlive: false
        },
        children: [{
            path: '/reference-datasets/download',
            name: 'download-reference-datasets',
            hidden: false,
            component: () => import('@/views/datasource/ReferenceDataset'),
            meta: {
              title: 'Browse & Download',
              icon: 'download',
              keepAlive: false
            },
          },
          {
            path: '/reference-datasets/visualization',
            name: 'visualization',
            component: RouteView,
            redirect: '/visualization/quartet-rna-vis',
            meta: {
              title: 'Discovery & Visualize',
              icon: 'dot-chart',
              keepAlive: false
            },
            children: [{
                path: '/reference-datasets/visualization/quartet-dna-vis',
                name: 'Genomics',
                hidden: false,
                component: () => import('@/components/FullFrame'),
                props: route => ({
                  src: getDnaHost()
                }),
                meta: {
                  title: 'Genomics',
                  icon: 'double-right',
                  keepAlive: false
                }
              },
              {
                path: '/reference-datasets/visualization/quartet-rna-vis',
                name: 'Transcriptomics',
                hidden: false,
                component: () => import('@/components/FullFrame'),
                props: route => ({
                  src: getRnaHost()
                }),
                meta: {
                  title: 'Transcriptomics',
                  icon: 'double-right',
                  keepAlive: false
                }
              },
              {
                path: '/reference-datasets/visualization/quartet-protein-vis',
                name: 'Proteomics',
                hidden: false,
                component: () => import('@/components/FullFrame'),
                props: route => ({
                  src: getProteinHost()
                }),
                meta: {
                  title: 'Proteomics',
                  icon: 'double-right',
                  disabled: true,
                  keepAlive: false
                }
              },
              {
                path: '/reference-datasets/visualization/quartet-metabolism-vis',
                name: 'Metabolomics',
                hidden: false,
                component: () => import('@/components/FullFrame'),
                props: route => ({
                  src: getMetabolismHost()
                }),
                meta: {
                  title: 'Metabolomics',
                  icon: 'double-right',
                  disabled: true,
                  keepAlive: false
                }
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
        props: route => ({
          src: route.query.src
        }),
        meta: {
          title: 'Embeded Frame',
          icon: 'dot-chart',
          keepAlive: false
        }
      },

      // Markdown Previewer
      {
        path: '/markdown-previewer',
        name: 'markdown-previewer',
        hidden: true,
        component: () => import('@/views/iframe/MarkdownPreviewer'),
        props: route => ({
          url: route.query.url
        }),
        meta: {
          title: 'Markdown Previewer',
          icon: 'markdown',
          keepAlive: false
        }
      },

      // Request Materials
      {
        path: '/request-materials',
        name: 'request-materials',
        hidden: true,
        component: () => import('@/views/materials/Request'),
        meta: {
          title: 'Request Materials',
          icon: 'pull-request',
          keepAlive: false
        }
      },

      // Account
      {
        path: '/account',
        hidden: true,
        component: RouteView,
        redirect: '/account/center',
        name: 'account',
        meta: {
          title: 'User',
          icon: 'user',
          keepAlive: false
        },
        children: [{
            path: '/account/center',
            name: 'center',
            component: () => import('@/views/account/center/Index'),
            meta: {
              title: 'User Center',
              keepAlive: false
            }
          },
          {
            path: '/account/settings',
            name: 'settings',
            component: () => import('@/views/account/settings/Index'),
            meta: {
              title: 'Profiles',
              hideHeader: true
            },
            redirect: '/account/settings/base',
            hideChildrenInMenu: true,
            children: [{
                path: '/account/settings/base',
                name: 'base-settings',
                component: () => import('@/views/account/settings/BaseSetting'),
                meta: {
                  title: 'Basic Profiles',
                  hidden: true
                }
              },
              {
                path: '/account/settings/security',
                name: 'security-settings',
                component: () => import('@/views/account/settings/Security'),
                meta: {
                  title: 'Secure Profiles',
                  hidden: true,
                  keepAlive: false
                }
              },
              {
                path: '/account/settings/custom',
                name: 'custom-settings',
                component: () => import('@/views/account/settings/Custom'),
                meta: {
                  title: 'Customization',
                  hidden: true,
                  keepAlive: false
                }
              },
              {
                path: '/account/settings/binding',
                name: 'binding-settings',
                component: () => import('@/views/account/settings/Binding'),
                meta: {
                  title: 'Binding Settings',
                  hidden: true,
                  keepAlive: false
                }
              },
              {
                path: '/account/settings/notification',
                name: 'notification-settings',
                component: () => import('@/views/account/settings/Notification'),
                meta: {
                  title: 'Notifications',
                  hidden: true,
                  keepAlive: false
                }
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
        meta: {
          title: 'Report',
          icon: 'solution'
        },
        children: [{
          path: '/datains-report/:reportId',
          name: 'report-details',
          hidden: true,
          component: () => import('@/views/report/ReportDetails'),
          props: route => ({
            readonly: route.query.readonly
          }),
          meta: {
            title: 'Report Details',
            drawerMode: true
          }
        }]
      },

      // Subcomponent - Notification
      {
        path: '/notifications',
        name: 'notifications',
        hidden: true,
        component: () => import('@/views/notification/NotificationTable'),
        meta: {
          title: 'Notifications',
          icon: 'notification'
        }
      },

      // Exception
      {
        path: '/exception',
        hidden: true,
        name: 'exception',
        component: RouteView,
        redirect: '/exception/403',
        meta: {
          title: '异常页',
          icon: 'warning'
        },
        children: [{
            path: '/exception/403',
            name: 'exception403',
            component: () => import( /* webpackChunkName: "fail" */ '@/views/exception/403'),
            meta: {
              title: '403'
            }
          },
          {
            path: '/exception/404',
            name: 'exception404',
            component: () => import( /* webpackChunkName: "fail" */ '@/views/exception/404'),
            meta: {
              title: '404'
            }
          },
          {
            path: '/exception/500',
            name: 'exception500',
            component: () => import( /* webpackChunkName: "fail" */ '@/views/exception/500'),
            meta: {
              title: '500'
            }
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
export const constantRouterMap = [{
    path: '/404',
    component: () => import( /* webpackChunkName: "fail" */ '@/views/exception/404')
  },

  // User
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [{
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