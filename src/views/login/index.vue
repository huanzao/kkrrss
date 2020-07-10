<template>
  <div id="login">
    <div class="loginConbox">
      <div class="loginBox">
        <div class="loginCon">
          <p class="title">科瑞森后台管理系统</p>
          <el-card shadow="always" class="login-module" v-if="smdl">
            <div slot="header" class="clearfix formTitlt">
              <span>密码登录</span>
              <span class="titIconbox">
                <i class="iconfont xu-saomadenglu2 fa-lg iconcolor"></i>
                <i
                  class="iconfont xu-saomadenglu01 el-icon--right fa-lg pointer"
                  @click="smdl = !smdl"
                ></i>
              </span>
            </div>
            <el-form
              :model="loginForm"
              ref="loginFormRef"
              :rules="loginFormRules"
              status-icon
              label-width="100px"
              class="demo-ruleForm"
            >
              <el-form-item>
                <el-input
                  type="text"
                  v-model="loginForm.username"
                  auto-complete="off"
                  placeholder="请输入登录账号"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-input
                  type="password"
                  v-model="loginForm.password"
                  auto-complete="off"
                  placeholder="请输入登录密码"
                  @keyup.enter.native="submitForm"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button class="subBtn" type="primary" @click="submitForm" >登录</el-button>
              </el-form-item>
              <!-- <p class="smalltxt">
                <router-link class="a" to="#">忘记密码</router-link>
                <router-link class="a" to="#">忘记会员名</router-link>
                <router-link class="a" to="#">免费注册</router-link>
              </p>-->
            </el-form>
          </el-card>
          <el-card shadow="always" class="login-module" v-else>
            <div slot="header" class="clearfix formTitlt">
              <span>扫码登录</span>
              <span class="titIconbox">
                <i class="iconfont xu-mimadenglu1 fa-lg iconcolor"></i>
                <i
                  class="iconfont xu-imagevector el-icon--right fa-lg pointer"
                  @click="smdl = !smdl"
                ></i>
              </span>
            </div>
            <div class="ewmbox">
              <div class="ewm">
                <img src="https://img.alicdn.com/tfscom/TB1ivYYyHvpK1RjSZFqwu3XUVXa.png">
              </div>
              <div class="ewmicon">
                <i class="iconfont xu-saomadenglu fa-2x iconcolor"></i>
                <p>打开 微信 扫一扫登录</p>
              </div>
              <!-- <p class="smalltxt">
                <router-link class="a" to="#">免费注册</router-link>
              </p>-->
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import httpService from "../../http/http.js";
// import { URL } from "../../http/httpsService.js";
import axios from "axios";
export default {
  data() {
    return {
      smdl: true,
      loginForm: {
        username: "djesse",
        password: "123djesse"
        // username: "test1",
        // password: "123123"
      },
      // 表单验证
      loginFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
          // { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入用户密码", trigger: "blur" }
          // { min: 6, max: 18, message: "长度在 6 到 18 个字符", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    sessionStorage.token='f33ff2af33dfa9f7dc32b458c55f3aef'
  },
  methods: {
    submitForm() {
      let that = this;
      if (that.loginForm.username === "" || that.loginForm.password === "") {
        that.$message({
          showClose: true,
          message: "账号或密码不能为空",
          type: "error"
        });
        return false;
      } else {
        
        this.axios.post("api/admin/method/login.admin.user", {
            username: that.loginForm.username,
            password: that.loginForm.password,
            platform: 1
          }).then(function(res) {
            console.log('登录数据',res.data);
            if (res.data.status === 200) {
              that.axios.post('api/menu/method/get.menu.auth.list',{module:'admin'}).then(res=>{
                console.log('登录玩立刻请求',res)
              })

              that.$notify({
                title: '登录成功',
                message: `欢迎回来${res.data.data.admin.nickname}`,
                type: 'success',
                duration:2000
              })
              localStorage.cf73b1=res.data.data.admin.admin_id //有用
              window.sessionStorage.setItem(
                "username",
                res.data.data.admin.username
              );
              window.sessionStorage.setItem(
                "nickname",
                res.data.data.admin.nickname
              );
              window.sessionStorage.setItem(
                "group_id",
                res.data.data.admin.group_id
              );
              window.sessionStorage.token_expires = ("token_expires",res.data.data.token.token_expires)
              
              that.$router.push({ path: "/main" })
            } else if (res.data.status === 401) {
              that.$router.push({ path: "/login" });
            } else if (res.data.status === 500) {
              that.$message({
                showClose: true,
                message: res.data.message,
                type: "error"
              });
            }
          })
          .catch(function(error) {
            console.log(error);
          });
       
      }
    }
  },
  
};
</script>
<style lang="scss">
#login {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-image: url(../../assets/star.jpg);
  background-position: center center;
  background-repeat: no-repeat;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  background-size: cover;
  .header {
    height: 60px;
    position: relative;
    .logo {
      margin-left: 30px;
      width: 500px;
      height: 40px;
      padding-top: 10px;
      img {
        height: 100%;
      }
    }
  }

  .loginBox {
    .iconcolor {
      color: #409eff;
    }

    .loginCon {
      margin: auto;
      margin-bottom: 9rem;

      .el-card__header {
        border-bottom: 0px;
      }
      .title {
        font-size: 36px;
        font-weight: 600;
        color: #ffffff;
        width: 500px;
        margin-top: 0px;
        &:first-child {
          font-size: 34px;
          margin-top: 50px;
          margin-bottom: 30px;
          text-align: center;
        }
      }
      .login-module {
        width: 75%;
        margin-top: 60px;
        border: none;
        margin: auto;
        border-radius: 5px;
        width: 350px;
        background: #fff;
        border: 1px solid #eaeaea;
        -webkit-box-shadow: 0 0 25px #cac6c6;
        box-shadow: 0 0 25px #cac6c6;

        .formTitlt {
          font-size: 18px;
          font-weight: 400;

          .titIconbox {
            float: right;

            .pointer {
              cursor: pointer;
            }
          }
        }

        .smalltxt {
          text-align: right;

          .a {
            text-decoration: none;
            color: #999999;
            font-size: 12px;
            margin-left: 8px;
          }
        }
      }

      .el-form-item__content {
        margin-left: 0px !important;

        .subBtn {
          width: 100%;
        }
      }
    }

    .el-input__inner,
    .el-button,
    .el-card,
    .el-message {
      border-radius: 0px !important;
    }

    .el-form-item__content .ico {
      position: absolute;
      top: 0px;
      left: 0px;
      z-index: 999;
      width: 40px;
      height: 39px;
      text-align: center;
      border-right: 1px solid #ccc;
    }

    .ewmbox {
      width: 100%;
      height: 215px;
      margin-top: -25px;

      .ewm {
        width: 140px;
        height: 140px;
        margin: 20px auto;

        p {
          font-size: 12px;
          padding-left: 40px;
          margin: 0;
        }
      }

      .ewmicon {
        width: 140px;
        margin: 20px auto 0;

        .iconfont {
          float: left;
        }

        p {
          font-size: 12px;
          padding-left: 40px;
          margin: 0;
        }
      }
    }
  }
}
</style>
