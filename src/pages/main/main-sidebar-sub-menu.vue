<template>
  <el-submenu
    v-if="menu.children && menu.children.length >= 1"
    :index="menu.path"
    :popper-class="'site-sidebar--' + sidebarLayoutSkin + '-popper'">
    <template slot="title">
      <!--<icon-svg :name="menu.icon || ''" class="site-sidebar__menu-icon"></icon-svg>-->
      <i :class="menu.icon"></i>
      <span>{{ menu.name }}</span>
    </template>
    <sub-menu
      v-for="item in menu.children"
      :key="item.id"
      :menu="item">
    </sub-menu>
  </el-submenu>
  <el-menu-item v-else :index="menu.path" @click="open(menu)">
    <!--<icon-svg :name="menu.icon || ''" class="site-sidebar__menu-icon"></icon-svg>-->
    <i :class="menu.icon"></i>
    <span>{{ menu.name }}</span>
  </el-menu-item>
</template>

<script>
import SubMenu from './main-sidebar-sub-menu'
export default {
  name: 'sub-menu',
  data () {
    return {
      sidebarLayoutSkin: 'dark'
    }
  },
  props: {
    menu: {
      type: Object,
      required: true
    }
  },
  components: {
    SubMenu
  },
  computed: {
  },
  methods: {
    // 通过menuId与动态(菜单)路由进行匹配跳转至指定路由
    open (item) {
      this.$router.push({
        path: this.$router.$dynamicRouter.getPath({
          name: item['label'],
          src: item['path']
        }),
        query: item.query
      })
    }
  }
}
</script>
