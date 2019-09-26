<template>
  <basic-container>
  <div class="mod-log">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.token" placeholder="请输入token" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%">
      <el-table-column
        type="index"
        header-align="center"
        align="center"
        width="100"
        label="序号">
        <template  slot-scope="scope">
          <span>{{(pageIndex - 1) * pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="user_id"
        header-align="center"
        align="center"
        width="100"
        label="用户ID">
      </el-table-column>
      <el-table-column
        prop="username"
        header-align="center"
        align="center"
        width="200"
        label="用户名">
      </el-table-column>
      <el-table-column
        prop="access_token"
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        label="令牌">
      </el-table-column>
      <el-table-column
        prop="token_type"
        header-align="center"
        align="center"
        width="120"
        label="类型">
      </el-table-column>
      <el-table-column
        prop="expires_in"
        header-align="center"
        align="center"
        width="200"
        label="过期时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="sys_token_del" type="text" size="small" @click="handleDel(scope.row,scope.index)">踢人</el-button>
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
  </div>
    </basic-container>
</template>

<script>
import {mapGetters} from 'vuex'
import {fetchList, delObj} from '@/api/admin/token'
export default {
  data () {
    return {
      dataForm: {
        token: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      selectionDataList: []
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created () {
    this.sys_token_del = this.permissions['sys_token_del']
    this.getDataList()
  },
  methods: {
    formatterParamsColumn (row, coloum) {
      return decodeURIComponent(row.params)
    },
    getDataList (params) {
      this.dataListLoading = true
      fetchList(Object.assign({
        token: this.dataForm.token,
        current: this.pageIndex,
        size: this.pageSize
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
    // 删除
    handleDel (row, index) {
      this.$confirm('是否强制' + row.username + '下线?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return delObj(row.access_token)
      }).then(({data}) => {
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
      }).catch(() => {})
    }
  }
}
</script>
