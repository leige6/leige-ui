<template>
  <basic-container>
  <div class="mod-menu">
    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <el-button v-if="sys_menu_add" type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="dataList"
      row-key="id"
      border
      style="width: 100%; ">
      <el-table-column
        prop="name"
        header-align="center"
        min-width="150"
        label="名称" >
      </el-table-column>
      <el-table-column
        prop="parentName"
        header-align="center"
        align="center"
        width="120"
        label="上级菜单">
        <template slot-scope="scope">
          <span v-if="scope.row.parentName == null" >无</span>
          <span v-else >{{scope.row.parentName}}</span>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="图标">
        <template slot-scope="scope">
          <i :class="scope.row.icon || ''"></i>
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        header-align="center"
        align="center"
        label="类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type == 0" size="small" type="success">菜单</el-tag>
          <el-tag v-else-if="scope.row.type == 1" size="small" type="info">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="sort"
        header-align="center"
        align="center"
        label="排序">
      </el-table-column>
      <el-table-column
        prop="path"
        header-align="center"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
        label="菜单URL">
        <template slot-scope="scope">
        <span v-if="scope.row.path == null" >--</span>
        <span v-else >{{scope.row.path}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="code"
        header-align="center"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
        label="权限标识">
        <template slot-scope="scope">
          <span v-if="scope.row.code == null" >--</span>
          <span v-else >{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="sys_menu_edit" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button v-if="sys_menu_del" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
  </basic-container>
</template>

<script>
import {mapGetters} from 'vuex'
import {fetchMenuTree, delObj} from '@/api/admin/menu'
import AddOrUpdate from './menu-add-or-update'
import { treeDataTranslate } from '@/utils/util'
export default {
  data () {
    return {
      dataForm: {},
      dataList: [],
      dataListLoading: false,
      addOrUpdateVisible: false
    }
  },
  components: {
    AddOrUpdate
  },
  created () {
    this.sys_menu_add = this.permissions['sys_menu_add']
    this.sys_menu_edit = this.permissions['sys_menu_edit']
    this.sys_menu_del = this.permissions['sys_menu_del']
    this.getDataList()
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      fetchMenuTree().then(({data}) => {
        console.log(JSON.stringify(data))
        this.dataList = treeDataTranslate(data.data, 'id')
        this.dataListLoading = false
      })
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 删除
    deleteHandle (id) {
      this.$confirm(`确定对[id=${id}]进行[删除]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delObj(id).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList()
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      }).catch(() => {})
    }
  }
}
</script>
