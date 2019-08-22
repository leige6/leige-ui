<template>
  <basic-container>
  <div class="mod-log">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.createBy" placeholder="用户名／用户操作" clearable></el-input>
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
        prop="createBy"
        header-align="center"
        align="center"
        label="用户名">
      </el-table-column>
      <el-table-column
        prop="title"
        header-align="center"
        align="center"
        label="用户操作">
      </el-table-column>
      <el-table-column
        prop="method"
        header-align="center"
        align="center"
        width="150"
        :show-overflow-tooltip="true"
        label="请求方法">
      </el-table-column>
      <el-table-column
        prop="params"
        header-align="center"
        align="center"
        width="200"
        :show-overflow-tooltip="true"
        :formatter="formatterParamsColumn"
        label="请求参数">
      </el-table-column>
      <el-table-column
        prop="time"
        header-align="center"
        align="center"
        width="100"
        label="执行时长">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.time <= 100"  size="small">{{scope.row.time}}ms</el-tag>
          <el-tag v-else size="small" type="danger">{{scope.row.time}}ms</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="remoteAddr"
        header-align="center"
        align="center"
        width="150"
        label="IP地址">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        width="180"
        label="创建时间">
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
import {fetchList} from '@/api/admin/log'
export default {
  data () {
    return {
      dataForm: {
        createBy: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      selectionDataList: []
    }
  },
  created () {
    this.getDataList()
  },
  methods: {
    formatterParamsColumn (row, coloum) {
      return decodeURIComponent(row.params)
    },
    getDataList (params) {
      this.dataListLoading = true
      fetchList(Object.assign({
        descs: 'create_time',
        current: this.pageIndex,
        size: this.pageSize,
        createBy: this.dataForm.createBy
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
    }
  }
}
</script>
