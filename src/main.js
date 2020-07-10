// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from './btnPermission'
import ElementUI from 'element-ui'

import 'element-ui/lib/theme-chalk/index.css'
import './assets/iconfont/iconfont.css'
import 'font-awesome/css/font-awesome.css'

import App from './App.vue'
import router from './router'
import store from './vuex'
import i18n from './i18n/i18n'



// 导入富文本编辑器
import VueQuillEditor from "vue-quill-editor";
// 导入富文本编辑器对应的样式
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

Vue.use(VueQuillEditor);

Vue.config.productionTip = false
Vue.use(ElementUI)


//数据转换称json
import Qs from "qs";
import axios from 'axios'
// // 配置请求根路径

// // 创建axios
// const server = axios.create({
//   baseURL: 'http://www.mmkashop.com/api/v1/',
//   timeout: 30000,
//   // withCredentials: true,
//   // headers: {
//   //   'Content-Type': 'application/x-www-form-urlencoded',
//   //   "X-Requested-With": "XMLHttpRequest",
//   //   'Content-Type': 'application/json',
//   // },
//   transformRequest: [data => {
//     data = Qs.stringify(data);
//     return data;
//   }]
// });

// // 添加请求拦截器
// server.interceptors.request.use(
//   function (config) {
//     let token = window.sessionStorage.getItem("token")

//     if (token) {
//       config.headers.common['token'] = window.sessionStorage.getItem("token")
//     }
//     // 在发送请求之前做些什么
//     return config;
//   },
//   function (error) {
//     // 对请求错误做些什么
//     return Promise.reject(error);
//   }
// );



// // 添加响应拦截器
// server.interceptors.response.use(
//   function (response) {
//     // 对响应数据做点什么
//     return response;
//   },
//   function (error) {
//     if (error.response) {
//       switch (error.response.status) {
//         case 401:
//           // 返回 401 清除token信息并跳转到登录页面
//           sessionStorage.removeItem("token");
//           this.$router.push("/login");
//           break
//       }
//     }
//     // // 对响应错误做点什么
//     return Promise.reject(error);
//   }
// );
Vue.prototype.axios = axios;



//  获取角色信息，根据用户权限动态加载路由
// router.beforeEach((to, from, next) => {
//   console.log(store.getters.token)
//   // debugger

//   if (store.getters.token) {
//     store.dispatch('setToken', store.getters.token)
//     if (to.path === '/login') {
//       next({
//         path: '/'
//       })
//     } else {
//       if (!store.getters.info.role) {
//         // const role = ['/markdown', '/erji', '/erji2', '/siji', '/wuji']
//         !async function getAddRouters() {
//           // 省略 axios 请求代码 通过 token 向后台请求用户权限等信息，这里用假数据赋值
//           await store.dispatch('getInfo', {
//             role: 'superAdmin',
//             permissions: '超级管理员'
//           })
//           await store.dispatch('newRoutes', store.getters.info.role)
//           // console.log(store.getters.addRouters)
//           await router.addRoutes(store.getters.addRouters)
//           next({
//             path: '/index'
//           })
//         }()
//       } else {
//         let is404 = to.matched.some(record => {
//           if (record.meta.role) {
//             return record.meta.role.indexOf(store.getters.info.role) === -1
//           }
//         })
//         if (is404) {
//           next({
//             path: '/404'
//           })
//           return false
//         }
//         next()
//       }
//     }
//   } else {
//     if (to.path === '/login') {
//       next()
//     }
//     next({
//       path: '/login'
//     })

//   }
// })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App),
  components: {
    App
  },
  template: '<App/>'
})
