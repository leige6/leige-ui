<template>
  <basic-container>
  <div class="mod-role">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.roleName" placeholder="角色名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="sys_role_add" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="sys_role_del" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="roleId"
        header-align="center"
        align="center"
        width="80"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="roleName"
        header-align="center"
        align="center"
        label="角色名称">
      </el-table-column>
      <el-table-column
        prop="roleCode"
        header-align="center"
        align="center"
        label="角色编码">
      </el-table-column>
      <el-table-column
        prop="roleDesc"
        header-align="center"
        align="center"
        label="备注">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        width="180"
        label="创建时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="sys_role_edit" type="text" size="small" @click="addOrUpdateHandle(scope.row.roleId)">修改</el-button>
          <el-button v-if="sys_role_del" type="text" size="small" @click="deleteHandle(scope.row.roleId)">删除</el-button>
          <el-button v-if="sys_role_perm" type="text" size="small" @click="permissonUpdate(scope.row.roleId)">授权</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <!-- 弹窗,授权 -->
    <permisson-update v-if="permissonUpdateVisible" ref="permissonUpdate" ></permisson-update>
  </div>
  </basic-container>
</template>

<script>
import {mapGetters} from 'vuex'
import {fetchList, delObj} from '@/api/admin/role'
import AddOrUpdate from './role-add-or-update'
import PermissonUpdate from './permission-update'
export default {
  data () {
    return {
      dataForm: {
        roleName: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      permissonUpdateVisible: false
    }
  },
  components: {
    AddOrUpdate,
    PermissonUpdate
  },
  created () {
    this.sys_role_add = this.permissions['sys_role_add']
    this.sys_role_edit = this.permissions['sys_role_edit']
    this.sys_role_del = this.permissions['sys_role_del']
    this.sys_role_perm = this.permissions['sys_role_perm']
    this.getDataList()
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  methods: {
    // 获取数据列表
    getDataList (params) {
      this.dataListLoading = true
      fetchList(Object.assign({
        current: this.pageIndex,
        size: this.pageSize,
        roleName: this.dataForm.roleName
      }, params)).then(({data}) => {
        if (data && data.code === 0) {
          this.dataList = data.data.records
          this.totalPage = data.data.total
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
      })
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    permissonUpdate (id) {
      this.permissonUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.permissonUpdate.init(id)
      })
    },
    // 删除
    deleteHandle (id) {
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.roleId
      })
      var idss = ids.join(',')
      this.$confirm(`确定对[id=${idss}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delObj(idss).then(({data}) => {
          if (data && data.code === 0) {
            this.getDataList()
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1500
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
