const api = {
  Login: 'https://keycloak.3steps.cn:8443/auth/realms/quartet-data-portal/protocol/openid-connect/token',
  RefreshToken: 'https://keycloak.3steps.cn:8443/auth/realms/quartet-data-portal/protocol/openid-connect/token',
  Logout: 'https://keycloak.3steps.cn:8443/auth/realms/quartet-data-portal/protocol/openid-connect/logout',
  // get my info
  // Will cause a 401 error(cookie not found) if use api.3steps.cn/xxx
  UserInfo: 'https://keycloak.3steps.cn:8443/auth/realms/quartet-data-portal/protocol/openid-connect/userinfo',
  ForgePassword: 'https://keycloak.3steps.cn:8443/auth/realms/quartet-data-portal/login-actions/reset-credentials?client_id=account-console',
  Register: 'https://keycloak.3steps.cn:8443/auth/realms/quartet-data-portal/login-actions/registration?client_id=account-console',
}

export default api