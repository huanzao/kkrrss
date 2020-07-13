<template>
  <div id="loyout">
    <el-container>
      <layoutAside></layoutAside>
      <el-container>
        <layoutHeader></layoutHeader>
        <el-main id="elmain">
          <transition name="main" mode="out-in">
            <router-view></router-view>
          </transition>
        </el-main>
        <el-footer>
          <Bottom></Bottom>
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>
<script>
  import layoutAside from './aside/aside'
  import layoutHeader from './header/header'
  import Bottom from './Footer/bottom'
  import langSelect from '../../components/lang/langSelect'

  export default {
    name: 'dc-home',
    components: {
      layoutHeader,
      Bottom,
      langSelect,
      layoutAside
    },
    created(){
      if(sessionStorage.username=='null'||sessionStorage.nickname=='null'){
        this.$message.error('请先登录')
        this.$router.push('/login')
      } 
    }
    
  }
</script>

<style>
   .main-enter, .main-leave-to {
    opacity: 0;
    transform: translateY(30px);

  }
  .main-enter-active {
    transition: all 0.2s;
  }
  .main-leave-active {
    position: absolute;
    transition: all 0.3s;
  }
  .switchStyle .el-switch__label *{
  font-size: 12px !important;
  padding-left: 3px;
}
.switchStyle .el-switch__label {
  position: absolute;
  display: none;
  color: #fff;
}
/*打开时文字位置设置*/
.switchStyle .el-switch__label--right {
  z-index: 1;
  right: -3px;
}
/*关闭时文字位置设置*/
.switchStyle .el-switch__label--left {
  z-index: 1;
  left: 19px;
}
/*显示文字*/
.switchStyle .el-switch__label.is-active {
  display: block;
  padding-bottom: 3px;
}
.switchStyle.el-switch .el-switch__core,
.el-switch .el-switch__label {
  width: 50px !important;
}
.shitchBox .switchStyle .el-switch__label.is-active {
  display: block;
  padding-bottom: 3px;
}

</style>
<style lang="scss">
  * {
    margin: 0px;
    padding: 0px;
  }

  body {
    background-color: #f2f2f2;
    font-size: 14px;
    color: #333333;
  }

  li {
    list-style: none;
  }

  a {
    text-decoration: none;
  }

  $top: top;
  $bottom: bottom;
  $left: left;
  $right: right;
  $leftright: ($left, $right);
  %w100 {
    width: 100%;
  }

  %h100 {
    height: 100%;
  }

  %cursor {
    cursor: pointer;
  }

  html, body, #loyout, .el-container, #asideNav, ul.el-menu {
    @extend %h100;
  }

  @mixin set-value($side, $value) {
    @each $prop in $leftright {
      #{$side}-#{$prop}: $value;
    }
  }

  #elmain {
    background-color: #f0f2f5;
  }


</style>
