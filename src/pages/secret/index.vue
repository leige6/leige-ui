<template>
  <basic-container>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-select v-model="dataForm.type" placeholder="应用类型" clearable>
          <el-option
            v-for="item in typeList"
            :key="item.id"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="sys_secret_add" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="sys_secret_del" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      :row-class-name="tableRowClassName"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        width="80"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="type"
        header-align="center"
        align="center"
        label="应用名称">
      </el-table-column>
      <el-table-column
        prop="appId"
        header-align="center"
        align="center"
        label="appId">
      </el-table-column>
      <el-table-column
        prop="appSecret"
        header-align="center"
        align="center"
        label="appSecret">
      </el-table-column>
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        label="描述">
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
          <el-button v-if="sys_secret_edit" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button v-if="sys_secret_del" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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
  </div>
  </basic-container>
</template>

<script>
import {mapGetters} from 'vuex'
import {fetchList, delObj} from '@/api/admin/secret'
import {fetchDetailList} from '@/api/admin/dict'
import AddOrUpdate from './secret-add-or-update'
export default {
  data () {
    return {
      dataForm: {
        type: ''
      },
      typeList: [],
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created () {
    this.sys_secret_add = this.permissions['sys_secret_add']
    this.sys_secret_edit = this.permissions['sys_secret_edit']
    this.sys_secret_del = this.permissions['sys_secret_del']
    this.getDataList()
  },
  components: {
    AddOrUpdate
  },
  activated () {
  },
  methods: {
    // 获取数据列表
    getDataList (params) {
      this.dataListLoading = true
      fetchDetailList({'code': 'app_type'}).then(({data}) => {
        this.typeList = data.data
      })
      fetchList(Object.assign({
        current: this.pageIndex,
        size: this.pageSize,
        type: this.dataForm.type
      }, params)).then(response => {
        this.dataList = response.data.data.records
        console.log(JSON.stringify(this.dataList))
        this.totalPage = response.data.data.total
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
    // 删除
    deleteHandle (id, params) {
      var userIds = id ? [id] : this.dataListSelections.map(item => {
        return item.userId
      })
      var idss = userIds.join(',')
      this.$confirm(`确定对[id=${idss}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delObj(idss).then(({data}) => {
          this.getDataList()
          if (data && data.code === 0) {
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
