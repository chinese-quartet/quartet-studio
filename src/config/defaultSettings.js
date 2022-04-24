// eslint-disable-next-line no-undef
export const project = require('@/custom/index').project

// eslint-disable-next-line no-undef
const customConfig = require('@/custom/' + project + '/config')

export const config = customConfig.projectSettings
export const initBaseURL = customConfig.initBaseURL
export const projectSettings = customConfig.projectSettings

// SeqFlow
export function initSeqFlowHost() {
  const seqFlowHost = localStorage.getItem('seqFlowHost')
  console.log(`SEQ_FLOW_HOST: ${seqFlowHost}`)

  return seqFlowHost || `${initBaseURL()}/datains`
}

// TService
export function initTServiceHost() {
  // let tServiceHost = localStorage.getItem('tServiceHost')
  // tServiceHost = tServiceHost || `${initBaseURL()}/tservice`
  const tServiceHost = `${initBaseURL()}/quartet-service`
  console.log(`TSERVICE_HOST: ${tServiceHost}`)

  return tServiceHost
}

// DataSeq
export function initDataSeqHost() {
  const dataSeqHost = localStorage.getItem('dataSeqHost')
  console.log(`DATA_SEQ_HOST: ${dataSeqHost}`)

  return dataSeqHost || `${initBaseURL()}/dataseq`
}

// -------------------------------------------------

export const domTitle = config.domTitle

export const websiteName = config.websiteName

export const websiteLogo = config.websiteLogo

export const websiteMiniLogo = config.websiteMiniLogo

export const websiteDesc = config.websiteDesc

export function timeFix() {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9
    ? 'Good Morning'
    : hour <= 11
    ? 'Good Morning'
    : hour <= 13
    ? 'Good Afternoon'
    : hour < 20
    ? 'Good Afternoon'
    : 'Good Evening'
}

export function saveSeqFlowHost(seqFlowHost) {
  localStorage.setItem('seqFlowHost', seqFlowHost)
}

export function saveTServiceHost(tServiceHost) {
  localStorage.setItem('tServiceHost', tServiceHost)
}

export function saveTServiceAiHost(tServiceAiHost) {
  localStorage.setItem('tServiceAiHost', tServiceAiHost)
}

export function saveDataSeqHost(dataSeqHost) {
  localStorage.setItem('dataSeqHost', dataSeqHost)
}

export function welcome() {
  const arr = []
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}
