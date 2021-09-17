/**
 * 项目默认配置项
 * primaryColor - 默认主题色, 如果修改颜色不生效，请清理 localStorage
 * navTheme - sidebar theme ['dark', 'light'] 两种主题
 * colorWeak - 色盲模式
 * layout - 整体布局方式 ['sidemenu', 'topmenu'] 两种布局
 * fixedHeader - 固定 Header : boolean
 * fixSiderbar - 固定左侧菜单栏 ： boolean
 * autoHideHeader - 向下滚动时，隐藏 Header : boolean
 * contentWidth - 内容区布局： 流式 |  固定
 *
 * storageOptions: {} - Vue-ls 插件配置项 (localStorage/sessionStorage)
 *
 */
export const projectSettings = {
  primaryColor: '#2F54EB', // primary color of ant design
  navTheme: 'light', // theme for nav menu
  layout: 'topmenu', // nav menu position: sidemenu or topmenu
  contentWidth: 'Fluid', // layout of content: Fluid or Fixed, only works when layout is topmenu
  hiddenHeader: false, // Hide header
  fixedHeader: true, // sticky header
  fixSiderbar: false, // sticky siderbar
  autoHideHeader: true, //  auto hide header
  colorWeak: false,
  multiTab: false,
  // eslint-disable-next-line
  production: process.env.NODE_ENV === 'production' && process.env.VUE_APP_PREVIEW !== 'true',
  // vue-ls options
  storageOptions: {
    namespace: 'pro__', // key prefix
    name: 'ls', // name variable Vue.[ls] or this.[$ls],
    storage: 'local' // storage name session, local, memory
  },
  domTitle: 'Quartet Data Portal',
  // eslint-disable-next-line no-undef
  websiteLogo: require('@/assets/logo.png'),
  websiteName: 'QUARTET',
  websiteId: 'quartet',
  websiteDesc: 'The Quartet Project for the Quality Control of Omics Data',
  defaultCollection: 'quartet_genomics',
  collections: [
    {
      key: 'quartet_genomics',
      name: 'Quartet Genomics',
      description: 'The Quartet Project for Quality Control of Genomics Profiling',
      tabs: [
        {
          title: 'Files',
          key: 'files',
          value: null
        },
        {
          title: 'Libraries',
          key: 'libraries',
          value: 'library_id'
        },
        {
          title: 'Donor',
          key: 'donor',
          value: 'donor_id'
        }
      ]
    },
    {
      key: 'quartet_transcriptomics',
      name: 'Quartet Transcriptomics',
      description: 'The Quartet Project for Quality Control of Transcriptomics Profiling',
      tabs: [
        {
          title: 'Files',
          key: 'files',
          value: null
        },
        {
          title: 'Libraries',
          key: 'libraries',
          value: 'library_id'
        },
        {
          title: 'Donor',
          key: 'donor',
          value: 'donor_id'
        }
      ]
    },
    {
      key: 'quartet_proteomics',
      name: 'Quartet Proteomics',
      description: 'The Quartet Project for Quality Control of Proteomics Profiling',
      tabs: [
        {
          title: 'Files',
          key: 'files',
          value: null
        },
        {
          title: 'Libraries',
          key: 'libraries',
          value: 'library_id'
        },
        {
          title: 'Donor',
          key: 'donor',
          value: 'donor_id'
        }
      ]
    },
    {
      key: 'quartet_metabolomics',
      name: 'Quartet Metabolomics',
      description: 'The Quartet Project for Quality Control of Metabolomics Profiling',
      tabs: [
        {
          title: 'Files',
          key: 'files',
          value: null
        },
        {
          title: 'Libraries',
          key: 'libraries',
          value: 'library_id'
        },
        {
          title: 'Donor',
          key: 'donor',
          value: 'donor_id'
        }
      ]
    }
  ],
  feedbackEntrypoint: 'https://yuque.com/quartet/topics?language=en-us',
  policyEntrypoint: 'https://yuque.com/quartet/policies?language=en-us',
  helpEntrypoint: 'https://yuque.com/quartet/help?language=en-us',
  clientId: 'clinico-omics',
  clientSecret: '97a7d2e8-94f4-48a7-aa90-c8ed206b89df',
  appListConfig: [
    {
      name: 'Home',
      icon: 'home',
      link: 'http://chinese-quartet.org'
    },
    {
      name: 'Documentation',
      icon: 'file-markdown',
      link: 'https://yuque.com/quartet/help'
    },
    {
      name: 'Fast File Transfer',
      icon: 'thunderbolt',
      link: 'https://www.yuque.com/quartet/tools/ossutil'
    },
    {
      name: 'File Browser',
      icon: 'global',
      link: 'https://www.yuque.com/quartet/tools/ossbrowser'
    }
  ],
  footerConfig: {
    metadata: [
      {
        name: 'tservice',
        version: 'v0.1.7-b09dbb47',
        repo: 'https://github.com/clinico-omics/tservice'
      },
      {
        name: 'tservice-plugins',
        version: 'v0.1.4-1de22b3d',
        repo: 'https://github.com/clinico-omics/tservice-plugins'
      },
      {
        name: 'datains',
        version: 'v0.3.3-a48d05cb',
        repo: 'https://github.com/clinico-omics/datains'
      },
      {
        name: 'dataseq-core',
        version: 'v0.2.2-b2192d1d',
        repo: 'https://github.com/clinico-omics/dataseq-core'
      }
    ],
    links: [
      {
        href: 'https://www.3steps.cn',
        name: '智汇医圈联盟',
        target: '_blank'
      },
      {
        href: 'https://github.com/clinico-omics',
        target: '_blank',
        logo: 'github'
      },
      {
        href: 'http://choppy.3steps.cn/',
        target: '_blank',
        name: 'Choppy Platform'
      }
    ]
  },
  localTools: []
}

export function initBaseURL () {
  // const apiService = 'http://quartet-backend.3steps.cn'
  const apiService = 'http://47.103.146.236'
  console.log(`BASE_API_URL: ${apiService}`)
  return apiService
}

export function getDnaHost () {
  return `${initBaseURL()}:8080/quartet-dna-vis/`
}

export function getRnaHost () {
  return `${initBaseURL()}:8080/quartet-rna-vis/`
}

export function getMetabolismHost () {
  return `${initBaseURL()}:8080/quartet-metabolism-vis/`
}

export function getProteinHost () {
  return `${initBaseURL()}:8080/quartet-protein-vis/`
}
