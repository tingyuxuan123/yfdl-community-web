let baseURL = ''
const TIME_OUT = 10000

if (import.meta.env.PROD) {
  //生产环境
  // baseURL = 'http://127.0.0.1:5173/api'
  baseURL = 'http://yfdl.site:7777'
} else {
  //开发环境
  baseURL = 'http://127.0.0.1:5173'
}

export { baseURL, TIME_OUT }
