import Vue from 'vue'
import Vuex from 'vuex'
import Cookies from 'js-cookie'
import layout from './modules/layout/index'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    token: Cookies.get('token'),
    skuData_VX:[],
    imgLookshow:false
  },
  mutations: {
    //mutations是用来触发事件，相当于方法，用户需要通过触发这个方法，借此来保存数据，参数的话，第二个参数就是用户传入的值，然后在方法中赋值给state中的变量
    setToken(state, token) {
      state.token = token
      Cookies.set('token', token, {
        expires: 1 / 24
      });
    },
    setSkyData(state,skuData_VX){
        state.skuData_VX=skuData_VX
        console.log('vuex中',state.skuData_VX)
    },
    setImgLookShow(state,value){
      state.imgLookshow=value
    }
  },
  actions: {
    setToken({
      commit
    }, token) {
      return new Promise((resolve, reject) => {
        commit('setToken', token)
        resolve()
      })
    }
  },
  getters: {
    isCollapse: state => state.layout.isCollapse,
  },
  modules: {
    layout
  },
})

export default store
