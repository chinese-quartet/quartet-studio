export function actionToObject(json) {
  try {
    return JSON.parse(json)
  } catch (e) {
    console.log('err', e.message)
  }
  return []
}

const userInfo = {
  id: '4291d7da9005377ec9aec4a71ea837f',
  name: 'Anonymous',
  username: 'anonymous',
  description: '[Past - A Cardiothoracic Surgeon] - [Present - A Software Developer] - [Future - A Data Scientist]',
  title: 'Software Developer',
  organization: 'Fudan University',
  address: 'Shanghai',
  password: '',
  avatar: 'https://nordata-cdn.oss-cn-shanghai.aliyuncs.com/clinico-omics/avatar2.png',
  status: 1,
  telephone: '',
  lastLoginIp: '27.154.74.117',
  lastLoginTime: 1534837621348,
  creatorId: 'admin',
  createTime: 1497160610259,
  merchantCode: 'TLif2btpzg079h15bk',
  deleted: 0,
  roleId: 'admin',
  role: {},
  tags: ['很有想法的', '专注设计', '海纳百川']
}

export { userInfo }
