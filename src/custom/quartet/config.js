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
  websiteMiniLogo: require('@/assets/mini-logo.png'),
  websiteName: 'QUARTET',
  websiteId: 'quartet',
  websiteDesc: 'For the Quality Control of Omics Data',
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
  feedbackEntrypoint: {
    en_US: 'https://github.com/chinese-quartet/docs.chinese-quartet.org/issues',
    zh_CN: 'https://yuque.com/quartet/topics?language=zh-cn'
  },
  policyEntrypoint: 'https://yuque.com/quartet/policies?language=en-us',
  helpEntrypoint: 'https://docs.chinese-quartet.org',
  clientId: 'kong-oidc',
  appListConfig: [
    {
      name: 'Home',
      icon: 'home',
      link: 'https://chinese-quartet.org'
    },
    {
      name: 'Documentation',
      icon: 'file-markdown',
      link: 'https://docs.chinese-quartet.org/'
    },
    {
      name: 'Fast File Transfer',
      icon: 'thunderbolt',
      link: 'https://docs.chinese-quartet.org/tools/ossutil/'
    },
    {
      name: 'File Browser',
      icon: 'global',
      link: 'https://docs.chinese-quartet.org/tools/ossbrowser/'
    },
    {
      name: 'GitHub Repos',
      icon: 'github',
      link: 'https://github.com/chinese-quartet'
    }
  ],
  localTools: []
}

export function initBaseURL () {
  return 'https://api.3steps.cn'
}

export function getDnaHost () {
  return `${initBaseURL()}/quartet-dna-vis/`
}

export function getRnaHost () {
  return `${initBaseURL()}/quartet-rna-vis/`
}

export function getMetabolismHost () {
  return `${initBaseURL()}/quartet-metabolism-vis/`
}

export function getProteinHost () {
  return `${initBaseURL()}/quartet-protein-vis/`
}
