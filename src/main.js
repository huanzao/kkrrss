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
Vue.prototype.axios = axios;

import { Message } from 'element-ui';

//  获取角色信息，根据用户权限动态加载路由

router.beforeEach((to, from, next) => {
  if(to.name=='login'||to.name=='index'){
    next()
  }else{
    if(sessionStorage.auth_m==null||sessionStorage.auth_m==undefined){
      ElementUI.Message.error('请先登录')
      next('/login')
    }else if(JSON.parse(sessionStorage.auth_m).includes(to.name)){
      next()
    }else{
      ElementUI.Message.warning('抱歉，您没有相关权限，如果需要请联系管理员')
      next(false)
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  components: {
    App
  },
  template: '<App/>'
})
