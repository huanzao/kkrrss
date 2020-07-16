<template>
  <div>
    <el-header id="header">
      <span class="hideAside" @click="collapse">
        <i class="fa fa-indent fa-lg"></i>
      </span>
      <ul class="personal">
        <li class="fullScreen" @click="fullScreen">
          <el-tooltip class="item" effect="dark" content="全屏" placement="bottom">
            <i class="fa fa-arrows-alt fa-lg"></i>
          </el-tooltip>
        </li>
        <li>{{nickname}}</li>
        <li>
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{username}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="rePassward">修改密码</el-dropdown-item>
              <el-dropdown-item command="reloadMenu">重载菜单</el-dropdown-item>
              <el-dropdown-item command="clear">清空缓存</el-dropdown-item>
              <el-dropdown-item command="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
        <li class="icon">
          <img :src="avatar">
        </li>
      </ul>
    </el-header>
    <el-dialog  title="修改密码" width="700px" :visible.sync="visible" destroy-on-close  @close="closeCallback">
      <div >
        <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
          <el-form-item label="原密码" prop="password_old">
            <el-input type="password" size="mini" v-model="ruleForm2.password_old"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" size="mini" v-model="ruleForm2.password"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="password_confirm">
            <el-input type="password" size="mini" v-model="ruleForm2.password_confirm"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"  size="mini" @click="submitForm('ruleForm2')">提交</el-button>
            <el-button  size="mini" @click="resetForm('ruleForm2')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import langSelect from "../../../components/lang/langSelect";
import {AxiosReturn} from '../../../assets/axios'
export default {
  name: "Header",
  components: {langSelect },
  data() {
    return {
      isfullScreen: true,
      avatar: "../../../../static/images/kelogo.jpg",
      username: "",
      nickname: "",
      visible: false,
      ruleForm2: {
        client_id:localStorage.cf73b1,// integer 是 gt:0 1 账号编号
        password:"",// string 是 min:6 admin666 密码
        password_confirm:"", //string 是 min:6 admin666 确认密码
        password_old:""// string 是 min:6 admin888 原始密码
      },
      rules2: {
        password_old: [
          { required:true,message:'请输入原始密码',trigger:"blur"}
        ],
        password: [
          {required:true,message:'请输入新密码',trigger:"blur"},
          { min: 6,message: '密码长度最小是六位', trigger: 'blur' }
        ],
        password_confirm: [
          {required:true,message:'请确认密码',trigger: "blur" }
        ]
      }
    };
  },
  created: function() {
    this.username = window.sessionStorage.getItem("username");
    this.nickname = window.sessionStorage.getItem("nickname");
  },
  methods: {
    AxiosReturn,
    collapse() {
      this.$store.dispatch("collapse");
    },
    fullScreen() {
      if (this.isfullScreen) {
        var docElm = document.documentElement;
        if (docElm.requestFullscreen) {
          docElm.requestFullscreen();
        } else if (docElm.mozRequestFullScreen) {
          docElm.mozRequestFullScreen();
        } else if (docElm.webkitRequestFullScreen) {
          docElm.webkitRequestFullScreen();
        } else if (elem.msRequestFullscreen) {
          elem.msRequestFullscreen();
        }
        this.isfullScreen = false;
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
        this.isfullScreen = true;
      }
    },
    handleCommand(command) {
      if (command === "logout") {
        sessionStorage.username=null
        sessionStorage.nickname=null
        sessionStorage.token=null
        sessionStorage.defActive=null
        sessionStorage.auth_m=null
        this.$router.push('/login')
      }
      if (command === "rePassward") {
        this.visible = true;
      }
      if (command === "reloadMenu") {
        this.AxiosReturn('menu/method/get.menu.auth.list',{module:'admin'}).then(res=>{
          if(res.status == 200){
            this.$message.success('重载菜单成功')
          }else{
            this.$message.warning('重载菜单失败')
          }
        })
      }
      if (command === "clear") {
        this.AxiosReturn('index/method/clear.cache.all').then(res=>{
          if(res.status == 200){
            this.$message.success('清除缓存成功')
          }else{
            this.$message.warning('清除缓存失败')
          }
        })
        
      }

    },
    closeCallback(){
      this.$refs.ruleForm2.resetFields()
    },
    submitForm(formName) {
      let that = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.AxiosReturn('admin/method/set.admin.password',this.ruleForm2).then(res=>{
            if(res.status==200){
              this.visible=false
              this.$message.success('密码修改成功，即将返回登页面')
              setTimeout(()=>{
                  Cookies.remove("token");
                  location.reload();
              },1500)
            }
          })
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
<style scoped>
.demo-ruleForm {
  width: 460px;
  padding-top: 25px;
}

.card {
  width: 560px;
  padding-bottom: 15px;
  margin: 0px auto;
}
</style>
<style lang="scss">
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

html,
body,
#app,
.el-container,
#asideNav,
ul.el-menu {
  @extend %h100;
}

@mixin set-value($side, $value) {
  @each $prop in $leftright {
    #{$side}-#{$prop}: $value;
  }
}

#header {
  background: #fff;
  max-height: 50px;
  line-height: 50px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  .hideAside {
    @extend %cursor;
  }
  .personal {
    display: flex;
    flex-direction: row;
    li {
      @include set-value(margin, 13px);
      font-size: 12px;
    }
    .fullScreen {
      @extend %cursor;
    }
    .el-dropdown-link {
      @extend %cursor;
    }
    .icon img {
      margin-#{$top}: 7px;
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      border-radius: 5px;
      width: 40px;
      height: 40px;
    }
  }
}
</style>
