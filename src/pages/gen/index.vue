<template>
  <basic-container>
  <div class="mod-gen">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.tableName" placeholder="表名称" clearable></el-input>
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
          prop="tableName"
          header-align="center"
          align="center"
          label="表名称">
        </el-table-column>
        <el-table-column
          prop="tableComment"
          header-align="center"
          align="center"
          label="表注释">
        </el-table-column>
        <el-table-column
          prop="engine"
          header-align="center"
          align="center"
          label="索引">
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
            <el-button type="text" size="small" @click="genHandle(scope.row.tableName)">生成</el-button>
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
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate"></add-or-update>
  </div>
  </basic-container>
</template>

<script>
import {fetchList} from '@/api/admin/gen'
import AddOrUpdate from './gen-add-or-update'
export default {
  data () {
    return {
      dataForm: {
        tableName: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      selectionDataList: [],
      addOrUpdateVisible: false
    }
  },
  created () {
    this.getDataList()
  },
  components: {
    AddOrUpdate
  },
  methods: {
    getDataList (params) {
      this.dataListLoading = true
      fetchList(Object.assign({
        descs: 'create_time',
        current: this.pageIndex,
        size: this.pageSize,
        tableName: this.dataForm.tableName
      }, params)).then(({data}) => {
        if (data && data.code === 0) {
          this.dataList = data.data.records
          console.log(this.dataList)
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
    // 生成代码模块
    genHandle (tableName) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(tableName)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
