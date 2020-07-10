<template>
  <div>
    <el-aside id="asideNav" style="background-color: rgb(3, 21, 42)">
      <div class="logo-name">
        <p v-if="$store.getters.logoShow">Cerisun</p>
        <p v-else>科瑞森后台</p>
      </div>
      <!-- 
       collapse 是否水平折叠收起菜单  
       select 事件 菜单激活回调
       router	是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转
       unique-opened	是否只保持一个子菜单的展开
       collapse-transition boolean	是否开启折叠动画
       default-active	当前激活菜单的 index
      -->
      <el-menu
        :default-active="$route.path"
        class="el-menu-vertical"
        @select="selectmenu"
        
        :collapse="$store.getters.isCollapse"
        background-color="#03152A"
        text-color="rgba(255,255,255,.7)"
        active-text-color="#ffffff"
        :router="$store.getters.uniquerouter"
        :unique-opened="true"
        :collapse-transition="true"
      >
          
          <template v-for="(sItem,s) in sideMenu" >
            <el-menu-item v-if='sItem.children.length==0' :index="sItem.url" :key="s" >
              <i :class="sItem.icon"></i>
              <span slot="title">{{ sItem.name }}</span>
            </el-menu-item>
            <el-submenu v-if='sItem.children.length>0' :key="s" :index="s+''">
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
      sideMenu:[
        {
          icon:'fa fa-home',
          name:"主页",
          path:'index',
          children:[]
        },
        {
          icon:'fa fa-gift',
          name:"选品",
          children:[]
        },
        {
          icon:'fa fa-mortar-board',
          name:"设计",
          children:[]
        },
        {
          icon:'fa fa-shopping-basket',
          name:"素材",
          children:[]
        },
        {
          icon:'fa fa-github-alt',
          name:"优化师",
          children:[]
        },
        {
          icon:'fa fa-user-circle',
          name:"客服",
          children:[]
        },
        {
          icon:'fa fa-link',
          name:"供应链",
          children:[]
        },
        {
          icon:'fa fa-truck',
          name:"SH物流",
          children:[]
        },
        {
          icon:'fa fa-cog',
          name:"系统设置",
          children:[]
        }
      ],
      dataList: ""
    };
  },
  watch: {
    // 监听浏览器直接输入路由，将此路由添加到tabnavBox(监听路由)
    "$route.path": function(val) {
      console.log('路由变化',val)
      this.selectmenu(val);
    }
  },
  created: function() {
    // let routerArr=pageRouter.options.routes[2].children
 
    // for(var  item of  routerArr){
    //   let smObj={ icon:item.iconCls,
    //               name:item.title,
    //               path:item.path,
    //             }
    //   if(item.chinise=='选品'){
    //       this.sideMenu[1].children.push(smObj)
    //   }else if(item.chinise=='设计'){
    //       this.sideMenu[2].children.push(smObj)
    //   }else if(item.chinise=='素材'){
    //       this.sideMenu[3].children.push(smObj)
    //   }else if(item.chinise=='优化师'){
    //       this.sideMenu[4].children.push(smObj)
    //   }else if(item.chinise=='客服'){
    //       this.sideMenu[5].children.push(smObj)
    //   }else if(item.chinise=='供应链'){
    //       this.sideMenu[6].children.push(smObj)
    //   }else if(item.chinise=='SH物流'){
    //       this.sideMenu[7].children.push(smObj)
    //   }else if(item.chinise=='系统设置'){
    //       this.sideMenu[8].children.push(smObj)
    //   }
    // }

    this.sideMenu=JSON.parse(sessionStorage.SideArr)
    console.log('新侧边栏的数据',JSON.parse(sessionStorage.SideArr))




    // console.log('侧边栏数据aaaaaa',this.sideMenu)

  },
  methods: {
    selectmenu(key) {
      console.log(key)
      this.$router.push(key)

      // let router = this.$store.getters.routers;
      // let name = "";
      // let navTitle = function(path, routerARR) {
      //   for (let i = 0; i < routerARR.length; i++) {
      //     if (routerARR[i].children.length > 0 || routerARR[i].path === path) {
      //       if (
      //         routerARR[i].path === path &&
      //         routerARR[i].children.length < 1
      //       ) {
      //         name = routerARR[i].name;
      //         break;
      //       }
      //       navTitle(path, routerARR[i].children);
      //     }
      //   }
      //   return name;
      // };
      // this.$store.dispatch("addTab", {
      //   title: navTitle(key, router),
      //   path: key
      // });
    }
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

@mixin set-value($side, $value) {
  @each $prop in $leftright {
    #{$side}-#{$prop}: $value;
  }
}

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
