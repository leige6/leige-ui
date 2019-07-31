<template>
  <div class="basic-container">
    <el-card :body-style="siteContentViewHeight" ref="eCard">
      <slot></slot>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { isURL } from '@/utils/validate'
export default {
  name: 'basicContainer',
  props: {
    block: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters([
      'documentClientHeight'
    ]),
    siteContentViewHeight () {
      var height = this.documentClientHeight - 90 - 30 - 2
      if (this.$route.meta.isTab) {
        height -= 40
        return isURL(this.$route.meta.iframeUrl) ? { height: height + 'px' } : { minHeight: height + 'px' }
      }
      return { minHeight: height + 'px' }
    }
  }
}
</script>

<style lang="scss">
.basic-container {
  padding: 8px 10px;
  border-radius: 10px;
  box-sizing: border-box;
  .el-card {
    width: 100%;
    height: 100%;
    border: 1px solid #ebeef5;
    background-color: #fff;
    color: #303133;
    -webkit-transition: .3s;
    transition: .3s;
  }
}
</style>
