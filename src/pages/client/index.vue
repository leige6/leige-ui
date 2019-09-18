<template>
  <basic-container>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.clientId" placeholder="终端编号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="sys_client_add" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="sys_client_del" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
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
        prop="clientId"
        header-align="center"
        align="center"
        width="80"
        label="编号">
      </el-table-column>
      <el-table-column
        prop="clientSecret"
        header-align="center"
        align="center"
        label="密钥">
      </el-table-column>
      <el-table-column
        prop="scope"
        header-align="center"
        align="center"
        label="域">
      </el-table-column>
      <el-table-column
        prop="authorizedGrantTypes"
        header-align="center"
        align="center"
        width="500"
        label="授权模式">
      </el-table-column>
      <el-table-column
        prop="autoapprove"
        header-align="center"
        align="center"
        label="自动放行">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.autoapprove == 'true'"  size="small">是</el-tag>
          <el-tag v-else size="small" type="danger">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="accessTokenValidity"
        header-align="center"
        align="center"
        label="令牌时效">
      </el-table-column>
      <el-table-column
        prop="refreshTokenValidity"
        header-align="center"
        align="center"
        label="刷新时效">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="sys_client_edit" type="text" size="small" @click="addOrUpdateHandle(scope.row.clientId)">修改</el-button>
          <el-button v-if="sys_client_del" type="text" size="small" @click="deleteHandle(scope.row.clientId)">删除</el-button>
          <el-button  type="text" size="small" @click="viewDetail(scope.row.clientId)">查看</el-button>
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
    <!-- 弹窗,查看 -->
    <el-dialog title="查看" :visible.sync="showClientDetail" width="700px">
      <el-form  :model="dataForm"  ref="dataForm" label-width="100px">
        <el-row type="flex">
          <el-form-item label="终端编号" prop="clientId" class="is-required">
            <el-input v-model="dataForm.clientId"  placeholder="请输入终端编号" clearable disabled></el-input>
          </el-form-item>
          <el-form-item label="密钥" prop="clientSecret" class="is-required">
            <el-input v-model="dataForm.clientSecret"  placeholder="请输入终端密钥" clearable disabled></el-input>
          </el-form-item>
        </el-row>
        <el-row type="flex">
          <el-form-item label="域" prop="scope" class="is-required">
            <el-input v-model="dataForm.scope"  placeholder="请输入域" clearable disabled></el-input>
          </el-form-item>
          <el-form-item label="自动放行" size="mini" prop="autoapprove" class="is-required">
            <el-radio-group v-model="dataForm.autoapprove" disabled>
              <el-radio :label="'true'">是</el-radio>
              <el-radio :label="'false'">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row type="flex">
          <el-form-item label="授权模式" prop="authorizedGrantType" class="is-required" >
            <el-select
              v-model="dataForm.authorizedGrantType"
              multiple
              filterable
              allow-create
              disabled
              default-first-option
              size="large"
              style="width:530px"
              placeholder="请选择授权模式">
              <el-option
                key="password"
                label="password"
                value="password">
              </el-option>
              <el-option
                key="refresh_token"
                label="refresh_token"
                value="refresh_token">
              </el-option>
              <el-option
                key="authorization_code"
                label="authorization_code"
                value="authorization_code">
              </el-option>
              <el-option
                key="client_credentials"
                label="client_credentials"
                value="client_credentials">
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row type="flex">
          <el-form-item label="回调地址" prop="webServerRedirectUri">
            <el-input v-model="dataForm.webServerRedirectUri" placeholder="请输入回调地址" clearable disabled></el-input>
          </el-form-item>
          <el-form-item label="权限" prop="authorities">
            <el-input v-model="dataForm.authorities" placeholder="请输入权限" clearable disabled></el-input>
          </el-form-item>
        </el-row>
        <el-row type="flex">
          <el-form-item label="令牌时效" prop="accessTokenValidity">
            <el-input v-model="dataForm.accessTokenValidity" placeholder="请输入令牌时效" clearable disabled></el-input>
          </el-form-item>
          <el-form-item label="刷新时效" prop="refreshTokenValidity">
            <el-input v-model="dataForm.refreshTokenValidity" placeholder="请输入刷新时效" clearable disabled></el-input>
          </el-form-item>
        </el-row>
        <el-row type="flex">
          <el-form-item label="资源ID" prop="resourceIds">
            <el-input v-model="dataForm.resourceIds" placeholder="资源ID" clearable disabled></el-input>
          </el-form-item>
          <el-form-item label="扩展信息" prop="additionalInformation">
            <el-input v-model="dataForm.additionalInformation" placeholder="请输入扩展信息" clearable disabled></el-input>
          </el-form-item>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
  </basic-container>
</template>

<script>
import {mapGetters} from 'vuex'
import {fetchList, delObj, getObj} from '@/api/admin/client'
import AddOrUpdate from './client-add-or-update'
export default {
  data () {
    return {
      dataForm: {
        clientId: '',
        clientSecret: '',
        scope: '',
        authorizedGrantTypes: '',
        authorizedGrantType: [],
        webServerRedirectUri: '',
        authorities: '',
        accessTokenValidity: '',
        refreshTokenValidity: '',
        additionalInformation: '',
        resourceIds: '',
        autoapprove: 'true'
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      showClientDetail: false
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created () {
    this.sys_client_add = this.permissions['sys_client_add']
    this.sys_client_edit = this.permissions['sys_client_edit']
    this.sys_client_del = this.permissions['sys_client_del']
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
      fetchList(Object.assign({
        current: this.pageIndex,
        size: this.pageSize,
        clientId: this.dataForm.clientId
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
      var clientIds = id ? [id] : this.dataListSelections.map(item => {
        return item.clientId
      })
      var idss = clientIds.join(',')
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
    },
    // 多选
    viewDetail (clientId) {
      this.dataForm.clientId = clientId
      this.showClientDetail = true
      getObj(this.dataForm.clientId).then(({data}) => {
        if (data && data.code === 0) {
          this.dataForm.clientId = data.data.clientId
          this.dataForm.clientSecret = data.data.clientSecret
          this.dataForm.scope = data.data.scope
          this.dataForm.authorizedGrantTypes = data.data.authorizedGrantTypes
          this.dataForm.authorizedGrantType = data.data.authorizedGrantTypes.split(',')
          this.dataForm.webServerRedirectUri = data.data.webServerRedirectUri
          this.dataForm.authorities = data.data.authorities
          this.dataForm.accessTokenValidity = data.data.accessTokenValidity
          this.dataForm.refreshTokenValidity = data.data.refreshTokenValidity
          this.dataForm.additionalInformation = data.data.additionalInformation
          this.dataForm.resourceIds = data.data.resourceIds
          this.dataForm.autoapprove = data.data.autoapprove
        }
      })
    }
  }
}
</script>
