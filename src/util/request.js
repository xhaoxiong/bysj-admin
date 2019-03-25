import axios from 'axios'
import route from '../router/index'

const service = axios.create({
    baseURL: "http://127.0.0.1:9018", // api 的 base_url
    timeout: 500000 // request timeout
})
service.interceptors.request.use(
    config => {
        let token = localStorage.getItem("token");

        config.headers['Authorization'] = 'Bearer ' + token;
        // if(config.url == '/login'){
        //   return config;
        // }
        // Do something before request is sent

        return config
    },
    error => {
        // Do something with request error
        console.log(error) // for debug
        Promise.reject(error)
    }
)

service.interceptors.response.use(
    response => {
        const res = response.data
        if (res.code === 10014) {
            route.push("/login")
            return res
        }
        return res
    }
)

export default service

// service.interceptors.response.use(
//   /**
//    * 下面的注释为通过在response里，自定义code来标示请求状态
//    * 当code返回如下情况则说明权限有问题，登出并返回到登录页
//    * 如想通过 xmlhttprequest 来状态码标识 逻辑可写在下面error中
//    * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
//    */
//   response => {
//     const res = response.data
//     if (res.Status != true) {
//       return Promise.reject('error')
//     } else {
//       return response.data
//     }
//   },
//   error => {
//     console.log('err' + error) // for debug
//     Message({
//       message: error.message,
//       type: 'error',
//       duration: 5 * 1000
//     })
//     return Promise.reject(error)
//   }
// )