<template>
  <nav class="site-navbar" :class="'site-navbar--' + navbarLayoutType">
    <div class="site-navbar__header">
      <h1 class="site-navbar__brand" @click="$router.push({ name: 'home' })">
        <a class="site-navbar__brand-lg" href="javascript:;">磊哥平台</a>
        <a class="site-navbar__brand-mini" href="javascript:;">磊哥</a>
      </h1>
    </div>
    <div class="site-navbar__body clearfix">
      <el-menu
        class="site-navbar__menu"
        mode="horizontal">
        <el-menu-item class="site-navbar__switch" index="0" @click="zhedie()">
          <i class="icon-zhedie"></i>
        </el-menu-item>
      </el-menu>
      <el-menu
        class="site-navbar__menu site-navbar__menu--right"
        mode="horizontal">
        <el-menu-item class="site-navbar__fullscren"  index="2">
          <i :class="isFullScren?'icon-tuichuquanping':'icon-quanping'"
             @click="handleScreen"></i>
        </el-menu-item>
        <el-menu-item class="site-navbar__avatar" index="3">
          <el-dropdown :show-timeout="0" placement="bottom">
            <span class="el-dropdown-link">
              <img src="~@/assets/images/avatar.png" :alt="userInfo.username">{{ userInfo.username }}
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="updatePasswordHandle()">修改密码</el-dropdown-item>
              <el-dropdown-item @click.native="logout()">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu-item>
      </el-menu>
    </div>
    <!-- 弹窗, 修改密码 -->
    <update-password v-if="updatePassowrdVisible" ref="updatePassowrd"></update-password>
  </nav>
</template>

<script>
import { fullscreenToggel, listenfullscreen } from '@/utils/util'
import { mapGetters } from 'vuex'
import UpdatePassword from './main-navbar-update-password'
export default {
  data () {
    return {
      mainTabs: [],
      sidebarFold: false,
      navbarLayoutType: 'default',
      updatePassowrdVisible: false
    }
  },
  components: {
    UpdatePassword
  },
  mounted () {
    listenfullscreen(this.setScreen)
  },
  computed: {
    ...mapGetters([
      'userInfo', 'isFullScren'
    ])
  },
  methods: {
    handleScreen () {
      fullscreenToggel()
      this.resetDocumentClientHeight()
    },
    setScreen () {
      this.$store.commit('SET_FULLSCREN')
    },
    // 折叠菜单
    zhedie () {
      this.$store.commit('SET_SIDEBAR_FOLD')
    },
    // 修改密码
    updatePasswordHandle () {
      this.updatePassowrdVisible = true
      this.$nextTick(() => {
        this.$refs.updatePassowrd.init()
      })
    },
    // 退出
    logout () {
      this.$confirm('是否退出系统, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('LogOut').then(() => {
          this.$router.push({ path: '/login' })
        })
      })
    },
    resetDocumentClientHeight () {
      var _this = this
      setTimeout(function () {
        var documentClientHeight = document.documentElement['clientHeight']
        window.onresize = () => {
          documentClientHeight = document.documentElement['clientHeight']
        }
        _this.$store.commit('SET_DOCUMENT_CLIENT_HEIGHT', documentClientHeight)
      }, '100')
    }
  }
}
</script>
