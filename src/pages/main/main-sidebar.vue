<template>
  <aside class="site-sidebar site-sidebar--dark">
    <div class="site-sidebar__inner">
      <el-menu unique-opened
        :default-active="nowTagValue"
        :collapse="sidebarFold"
        :collapseTransition="false"
        class="site-sidebar__menu">
        <el-submenu index="demo">
          <template slot="title">
            <!--<icon-svg name="shoucang" class="site-sidebar__menu-icon"></icon-svg>-->
            <span>demo</span>
          </template>
          <el-menu-item index="/demo-echarts" @click="$router.push({ name: 'demo-echarts' })">
           <!-- <icon-svg name="tubiao" class="site-sidebar__menu-icon"></icon-svg>-->
            <span slot="title">echarts</span>
          </el-menu-item>
          <el-menu-item index="/demo-ueditor" @click="$router.push({ name: 'demo-ueditor' })">
           <!-- <icon-svg name="editor" class="site-sidebar__menu-icon"></icon-svg>-->
            <span slot="title">ueditor</span>
          </el-menu-item>
        </el-submenu>
        <sub-menu
          v-for="me in menu"
          :key="me.id"
          :menu="me">
        </sub-menu>
      </el-menu>
    </div>
  </aside>
</template>

<script>
import { mapGetters } from 'vuex'
import SubMenu from './main-sidebar-sub-menu'
export default {
  data () {
    return {
    }
  },
  components: {
    SubMenu
  },
  created () {
    this.$store.dispatch('GetMenu').then(data => {
      if (data.length === 0) return
      this.$router.$dynamicRouter.formatRoutes(data, true)
    })
  },
  computed: {
    ...mapGetters(['menu', 'sidebarFold']),
    nowTagValue: function () {
      return this.$router.$dynamicRouter.getValue(this.$route)
    }
  },
  methods: {
  }
}
</script>
