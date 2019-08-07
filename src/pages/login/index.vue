<template>
    <div>
       <div class="head"></div>
       <div class="middle">
         <img :src="loginCenterBg" class="login-center-layout">
         <div class="content">
            <img :src="loginComputer" class="login-computer">
            <div class="login-form">
              <el-card class="login-form-layout">
                <el-form autoComplete="on"
                         :model="loginForm"
                         :rules="loginRules"
                         ref="loginForm"
                         label-position="left">
                  <h2 class="login-title color-main">管理员登陆</h2>
                  <el-form-item prop="username">
                    <el-input name="username"
                              type="text"
                              v-model="loginForm.username"
                              autoComplete="on"
                              placeholder="请输入用户名">
                      <i slot="prefix"
                         class="icon-username"></i>
                    </el-input>
                  </el-form-item>
                  <el-form-item prop="password">
                    <el-input name="password"
                              :type="pwdType"
                              @keyup.enter.native="handleLogin"
                              v-model="loginForm.password"
                              autoComplete="on"
                              placeholder="请输入密码">
                      <i slot="prefix"
                         class="icon-mima"></i>
                      <i class="icon-xianshimima"
                         slot="suffix"
                         @click="showPwd"></i>
                    </el-input>
                  </el-form-item>
                  <el-form-item prop="code">
                    <el-row :span="24">
                      <el-col :span="16">
                        <el-input name="code"
                                  @keyup.enter.native="handleLogin"
                                  :maxlength="code.len"
                                  v-model="loginForm.code"
                                  auto-complete="off"
                                  placeholder="请输入验证码">
                          <i slot="prefix"
                             class="icon-yanzhengma"></i>
                        </el-input>
                      </el-col>
                      <el-col :span="8">
                        <div class="login-code">
                          <img :src="code.src"
                               class="login-code-img"
                               @click="refreshCode"
                               />
                          <!-- <i class="icon-shuaxin login-code-icon" @click="refreshCode"></i> -->
                        </div>
                      </el-col>
                    </el-row>

                  </el-form-item>
                  <el-form-item style="margin-bottom: 30px">
                    <el-button style="width: 100%" type="primary" :loading="loading" @click.native.prevent="handleLogin">
                      登录
                    </el-button>
                  </el-form-item>
                </el-form>
              </el-card>
            </div>
         </div>
       </div>
       <div class="foot">
         <div class="foot-inner">
           <p class="foot-content">
             所有方：北京磊哥科技有限公司
           </p>
           <p class="foot-content foot-second">
             <a href="http://www.miibeian.gov.cn/" target="_blank">京ICP备 09007032</a>
             Copyright ©2018-2019 lolabc.cn, All Rights Reserved.
           </p>
         </div>
       </div>
    </div>
</template>

<script>
import { randomLenNum } from '@/utils/util'
import loginCenterBg from '@/assets/images/login_center_bg.png'
import loginComputer from '@/assets/images/login-computer.png'
export default {
  name: 'login',
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456',
        code: '',
        redomStr: ''
      },
      code: {
        src: '/code',
        value: '',
        len: 4
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度最少为6位', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { min: 4, max: 4, message: '验证码长度为4位', trigger: 'blur' }
        ]
      },
      loading: false,
      pwdType: 'password',
      loginCenterBg,
      loginComputer
    }
  },
  created () {
    this.refreshCode()
  },
  methods: {
    refreshCode () {
      this.loginForm.code = ''
      this.loginForm.randomStr = randomLenNum(this.code.len, true)
      this.code.src = `${this.codeUrl}?randomStr=${this.loginForm.randomStr}`
    },
    showPwd () {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('LoginByUsername', this.loginForm).then(() => {
            this.loading = false
            this.$router.push({path: '/'})
            this.refreshCode()
          }).catch(() => {
            this.loading = false
            this.refreshCode()
          })
        } else {
          console.log('参数验证不合法！')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.head{
   height: 200px;
}
  .middle{
    position: relative;
    display: table-cell;
    vertical-align: middle;
    height: 400px;
    width: auto;
    background: #5981d8;
    .login-center-layout{
      width: auto;
      max-width: 100%;
      max-height: 100%;
      min-width: 1000px;
    }
    .content{
      position: absolute;
      width: 1000px;
      height: 100%;
      margin: 0 auto;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      .login-computer{
        position: absolute;
        top: 18%;
      }
      .login-form{
        position: absolute;
        top:-32%;
        right: 0;
        width: 360px;
        margin: 140px auto;
        .login-title{
          text-align: center;
        }
      }
    }
  }
  .foot{
    position: absolute;
    width: 100%;
    min-width: 1000px;
    height: 100px;
    bottom: 0;
    background: #f5f5f5;
    .foot-inner{
      width: 1000px;
      margin: 0 auto;
      line-height: 18px;
      .foot-content{
        text-align: center;
        font-size: 12px;
        color: #555;
      }
      .foot-second{
        color:#999;
        font-weight: 400;
        a::after{
          content: "|";
          padding: 0 4px;
        }
      }
    }
  }
</style>
