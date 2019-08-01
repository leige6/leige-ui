<template>
  <basic-container>
  <div class="mod-menu">
    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <el-button v-if="sys_dept_add" type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="dataList"
      row-key="id"
      border
      :row-class-name="tableRowClassName"
      style="width: 100%; ">
      <el-table-column
        type="index"
        header-align="center"
        align="center"
        width="100"
        label="序号">
      </el-table-column>
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
        label="上级部门">
        <template slot-scope="scope">
          <span v-if="scope.row.parentName == null" >无</span>
          <span v-else >{{scope.row.parentName}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="sort"
        header-align="center"
        align="center"
        label="排序">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        width="180"
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="updateTime"
        header-align="center"
        align="center"
        width="180"
        label="更新时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="sys_dept_edit" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button v-if="sys_dept_del" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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
import {fetchTree, delObj} from '@/api/admin/dept'
import AddOrUpdate from './dept-add-or-update'
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
  computed: {
    ...mapGetters(['permissions'])
  },
  created () {
    this.sys_dept_add = this.permissions['sys_dept_add']
    this.sys_dept_edit = this.permissions['sys_dept_edit']
    this.sys_dept_del = this.permissions['sys_dept_del']
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      fetchTree().then(({data}) => {
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
              message: '删除成功',
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
    },
    tableRowClassName ({row, rowIndex}) {
      if (rowIndex % 4 === 1) {
        return 'warning-row'
      } else if (rowIndex % 4 === 3) {
        return 'success-row'
      }
      return ''
    }
  }
}
</script>
