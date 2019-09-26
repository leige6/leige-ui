<template>
  <basic-container>
    <div class="mod-log">
      <el-form :inline="true">
        <el-form-item>
           <el-button type="danger" @click="edit()">更新</el-button>
        </el-form-item>
      </el-form>
      <el-alert
        title="路由配置是软件开发人员范畴，不建议非软件开发人员操作"
        type="warning">
      </el-alert>
      <vue-json-editor v-model="json" :show-btns="false"></vue-json-editor>
      </div>
    </basic-container>
</template>

<script>
import vueJsonEditor from 'vue-json-editor'
import {fetchList, putObj} from '@/api/admin/route'

export default {
  data () {
    return {
      json: null
    }
  },

  // 注入vueJsonEditor组件
  components: {
    vueJsonEditor
  },

  created () {
    this.getList()
  },

  methods: {
    getList () {
      fetchList().then(response => {
        let result = response.data.data
        for (var i = 0; i < result.length; i++) {
          let route = result[i]
          if (route.predicates) {
            let predicates = route.predicates
            route.predicates = JSON.parse(predicates)
          }
          if (route.filters) {
            let filters = route.filters
            route.filters = JSON.parse(filters)
          }
        }
        this.json = result
      })
    },
    edit () {
      var _this = this
      this.$confirm('请确保检查无误，是否更新路由？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        putObj(_this.json).then(response => {
          _this.$message({
            message: '更新成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getList()
            }
          })
        })
      })
    }
  }
}
</script>
