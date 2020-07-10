<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view v-if="isRouterAlive"></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: "app",
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      isRouterAlive: true
    };
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function() {
        this.isRouterAlive = true;
      });
    }
  }
};
</script>

<style lang="scss">
body {
  margin: 0px;
  padding: 0px;
  font-family: Microsoft YaHei, Helvetica Neue, Helvetica, PingFang SC,
    Hiragino Sans GB, SimSun, sans-serif;
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
}


#app {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
}
a {
  color: #56a9ff;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

::-webkit-scrollbar {
  width: 8px; /*滚动条宽度*/
  height: 8px; /*滚动条高度*/
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(206, 204, 204, 0.3);
  border-radius: 4px; /*滚动条的背景区域的圆角*/
  background-color: #ecf0f1; /*滚动条的背景颜色*/
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 4px; /*滚动条的圆角*/
  -webkit-box-shadow: inset 0 0 6px rgba(206, 204, 204, 0.3);
  background-color:#c7c8ca; /*滚动条的背景颜色*/
}

/*  头部搜索框和按钮的布局样式  */
#myHeaderBox{
  display: flex;
}
#myHeaderBox >div.el-input,#myHeaderBox >div.el-select {
    width: 250px;
    margin-right:15px ;
}
#myHeaderBox >div.el-date-editor{
    width: 280px;
    margin-right:15px ;
}
#myHeaderBox>.el-button{
  margin-right: 15px;
  margin-left: 0;
}
#myshow label:first-child{
  margin-left: 30px;
}
</style>
