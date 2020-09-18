/*
* 开发环境服务器配置
*/
module.exports = {
  // 开发环境代理服务器
  devProxy: {
    host: 'localhost', // ip/localhost都可以访问
    port: 8080
  },
  // 后端服务器地址
  servers: {
    code: 'http://localhost:9999',
    admin: 'http://localhost:9999',
    auth: 'http://localhost:9999',
    gen: 'http://localhost:9999'
  }
}
