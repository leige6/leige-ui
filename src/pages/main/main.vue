<template>
  <div
    class="site-wrapper"
    :class="{ 'site-sidebar--fold': sidebarFold }"
    v-loading.fullscreen.lock="loading"
    element-loading-text="拼命加载中">
    <template v-if="!loading">
      <main-navbar />
      <main-sidebar />
      <div class="site-content__wrapper" :style="{ 'min-height': documentClientHeight + 'px' }">
        <main-tags />
        <keep-alive>
          <router-view v-if="$route.meta.$keepAlive"/>
        </keep-alive>
        <router-view v-if="!$route.meta.$keepAlive"/>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import MainNavbar from './main-navbar'
import MainSidebar from './main-sidebar'
import MainTags from './main-tags'
export default {
  data () {
    return {
      loading: true,
      isNeedRefresh: true
    }
  },
  components: {
    MainNavbar,
    MainSidebar,
    MainTags
  },
  computed: {
    ...mapGetters([
      'sidebarFold', 'documentClientHeight'
    ])
  },
  created () {

  },
  mounted () {
    this.resetDocumentClientHeight()
    this.loading = false
  },
  methods: {
    // 重置窗口可视高度
    resetDocumentClientHeight () {
      var documentClientHeight = document.documentElement['clientHeight']
      window.onresize = () => {
        documentClientHeight = document.documentElement['clientHeight']
      }
      this.$store.commit('SET_DOCUMENT_CLIENT_HEIGHT', documentClientHeight)
    }
  }
}
</script>
