<template>
  <div>
    <el-aside id="asideNav" style="background-color: rgb(3, 21, 42)">
      <div class="logo-name">
        <p v-if="$store.getters.logoShow">Cerisun</p>
        <p v-else>科瑞森后台</p>
      </div>

      <el-menu
        :default-active="defaultActive"
        class="el-menu-vertical"
        @select="selectmenu"
        :collapse="$store.getters.isCollapse"
        background-color="#03152A"
        text-color="rgba(255,255,255,.7)"
        active-text-color="#ffffff"
        :router="true"
        :unique-opened="true"
        :collapse-transition="true"
      >
          
          <template v-for="(sItem,s) in sideMenu" >
            <el-menu-item v-if='sItem.children.length==0' :index="sItem.url" :key="s" >
              <i :class="sItem.icon"></i>
              <span slot="title">{{ sItem.name }}</span>
            </el-menu-item>
            <el-submenu v-if='sItem.children.length>0' :key="s" :index="s+'11'">
                <template slot="title">
                  <i :class="sItem.icon"></i>
                  <span>{{ sItem.name }}</span>
                </template>
                <el-menu-item-group v-for="(st,stk) in sItem.children" :key="stk">
                  <el-menu-item :index="st.url"><i :class="st.icon"></i> <span>{{ st.name }}</span></el-menu-item>
                </el-menu-item-group>
              </el-submenu>
          </template>
      </el-menu>
    </el-aside>
  </div>
</template>

<script>
import pageRouter from '../../../router/index'
export default {
  name: "asideNav",
  data() {
    return {
      sideMenu:[],
      dataList: "",
      defaultActive:"",
    };
  },
  watch: {
    // 监听浏览器直接输入路由，将此路由添加到tabnavBox(监听路由)
    // "$route.path": function(val) {
    //   this.selectmenu('qqq',val);
    // }
  },
  created: function() {
    this.sideMenu=JSON.parse(sessionStorage.SideArr)
    if(sessionStorage.defActive=='null'){
      this.defaultActive='index'
    }else{
      this.defaultActive=sessionStorage.defActive
    }
  },
  methods: {
    selectmenu(key) {
      console.log('aaaaaa',key)
      sessionStorage.defActive=key
    },
  }
};
</script>

<style lang="scss">
  #asideNav .el-menu-item-group__title{
    padding: 0;
  }
$top: top;
$bottom: bottom;
$left: left;
$right: right;
%w100 {
  width: 100%;
}

%h100 {
  height: 100%;
}

%cursor {
  cursor: pointer;
}

// @mixin set-value($side, $value) {
//   @each $prop in $leftright {
//     #{$side}-#{$prop}: $value;
//   }
// }

#asideNav {
  width: auto !important;
  display: flex;
  flex-direction: column;
  border-right: solid 1px #e6e6e6;
  .logo-name {
    background-color: #03152a !important;
    @extend %w100;
    font-weight: 300;
    z-index: 999;
    p {
      height: 50px;
      line-height: 50px;
      text-align: center;
      font-size: 16px;
      color: #5e6d82;
    }
  }
  .el-menu-vertical:not(.el-menu--collapse) {
    width: 200px;
    @extend %h100;
    overflow-y: scroll;
    overflow-x: hidden;
  }
  .el-menu {
    flex: 1;
    overflow: inherit;
    border-right: none;
    &::-webkit-scrollbar {
      display: none;
    }
    .fa {
      vertical-align: middle;
      margin-right: 5px;
      width: 24px;
      text-align: center;
      font-size: 18px;
    }
    .el-menu-item {
      background-color: #020f1d !important;
      border-bottom: 1px solid #020f1d;
      &:hover {
        color: #ffffff !important;
        background-color: #375573 !important;
      }
    }
    .el-menu-item.is-active {
      background-color: #56a9ff !important;
    }
    .is-opened > .el-submenu__title > .el-icon-arrow-down {
      color: #ffffff;
      font-weight: 500;
      font-size: 18px;
    }
  }
}
</style>
