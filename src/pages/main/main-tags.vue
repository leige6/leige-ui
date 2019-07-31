<template>
  <main class="site-content site-content--tabs">
    <!-- 主入口标签页 s -->
    <el-tabs
      v-model="active"
      @tab-click="openTag"
      @edit="menuTag">
      <el-dropdown class="site-tabs__tools" :show-timeout="0">
        <i class="el-icon-arrow-down el-icon--right"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="tabsCloseOtherHandle">关闭其它标签页</el-dropdown-item>
          <el-dropdown-item @click.native="tabsCloseAllHandle">关闭全部标签页</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-tab-pane :key="item.label"
                   v-for="item in tagList"
                   :name="item.value"
                   :closable="!(item.label=='home')">
        <span slot="label" v-if="item.label=='home'"> <i class="icon-home" ></i></span>
        <span slot="label" v-else>{{item.label}}</span>
      </el-tab-pane>
    </el-tabs>
  </main>
</template>

<script>
import { mapGetters } from 'vuex'
import { isURL } from '@/utils/validate'
export default {
  data () {
    return {
      active: ''
    }
  },
  mounted () {
    this.setActive()
  },
  watch: {
    tag () {
      this.setActive()
    }
  },
  computed: {
    ...mapGetters(['tagWel', 'tagList', 'tag']),
    tagLen () {
      return this.tagList.length || 0
    },
    siteContentViewHeight () {
      var documentClientHeight = document.documentElement['clientHeight']
      var height = documentClientHeight - 50 - 30 - 2
      if (this.$route.meta.isTab) {
        height -= 40
        return isURL(this.$route.meta.iframeUrl) ? { height: height + 'px' } : { minHeight: height + 'px' }
      }
      return { minHeight: height + 'px' }
    }
  },
  methods: {
    // 激活当前选项
    setActive () {
      this.active = this.tag.value
    },
    // tabs, 选中tab
    openTag (item) {
      let tag
      if (item.name) {
        tag = this.findTag(item.name).tag
      } else {
        tag = item
      }
      this.$router.push({
        path: this.$router.$dynamicRouter.getPath({
          name: tag.label,
          src: tag.value
        }),
        query: tag.query
      })
    },
    // tabs, 删除tab
    menuTag (value, action) {
      if (action === 'remove') {
        let { tag, key } = this.findTag(value)
        this.$store.commit('DEL_TAG', tag)
        if (tag.value === this.tag.value) {
          tag = this.tagList[key === 0 ? key : key - 1] // 如果关闭本标签让前推一个
          this.openTag(tag)
        }
      }
    },
    // tabs, 关闭其它
    tabsCloseOtherHandle () {
      this.$store.commit('DEL_TAG_OTHER')
    },
    // tabs, 关闭全部
    tabsCloseAllHandle () {
      this.$store.commit('DEL_ALL_TAG')
      this.$router.push({
        path: this.$router.$dynamicRouter.getPath({
          src: this.tagWel.value
        }),
        query: this.tagWel.query
      })
    },
    // tabs, 刷新当前
    tabsRefreshCurrent () {
    },
    findTag (value) {
      let tag, key
      this.tagList.map((item, index) => {
        if (item.value === value) {
          tag = item
          key = index
        }
      })
      return { tag: tag, key: key }
    }
  }
}
</script>
