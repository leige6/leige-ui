<template>
  <el-dialog
    :title="!dataForm.clientId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="700px">
    <el-form  :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-row type="flex">
        <el-form-item label="终端编号" prop="clientId" class="is-required">
          <el-input v-model="dataForm.clientId"  placeholder="请输入终端编号" clearable></el-input>
        </el-form-item>
        <el-form-item label="密钥" prop="clientSecret" class="is-required">
          <el-input v-model="dataForm.clientSecret"  placeholder="请输入终端密钥" clearable></el-input>
        </el-form-item>
      </el-row>
      <el-row type="flex">
        <el-form-item label="域" prop="scope" class="is-required">
          <el-input v-model="dataForm.scope"  placeholder="请输入域" clearable></el-input>
        </el-form-item>
        <el-form-item label="自动放行" size="mini" prop="autoapprove" class="is-required">
          <el-radio-group v-model="dataForm.autoapprove">
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
            <el-input v-model="dataForm.webServerRedirectUri" placeholder="请输入回调地址" clearable></el-input>
          </el-form-item>
        <el-form-item label="权限" prop="authorities">
          <el-input v-model="dataForm.authorities" placeholder="请输入权限" clearable></el-input>
        </el-form-item>
      </el-row>
      <el-row type="flex">
          <el-form-item label="令牌时效" prop="accessTokenValidity">
            <el-input v-model="dataForm.accessTokenValidity" placeholder="请输入令牌时效" clearable></el-input>
          </el-form-item>
        <el-form-item label="刷新时效" prop="refreshTokenValidity">
          <el-input v-model="dataForm.refreshTokenValidity" placeholder="请输入刷新时效" clearable></el-input>
        </el-form-item>
      </el-row>
      <el-row type="flex">
        <el-form-item label="资源ID" prop="resourceIds">
          <el-input v-model="dataForm.resourceIds" placeholder="资源ID" clearable></el-input>
        </el-form-item>
        <el-form-item label="扩展信息" prop="additionalInformation">
          <el-input v-model="dataForm.additionalInformation" placeholder="请输入扩展信息" clearable></el-input>
        </el-form-item>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {addObj, putObj, getObj, validateCode} from '@/api/admin/client'
export default {
  data () {
    const validateCo = (rule, value, callback) => {
      validateCode({'newCode': value, 'oldCode': this.oldClientId}).then(({data}) => {
        console.log(JSON.stringify(data))
        if (data && data.data) {
          callback()
        } else if (data && !(data.data)) {
          callback(new Error('终端编码已存在'))
        }
      })
    }
    const validateNum = (rule, value, callback) => {
      console.log('1111111')
      let patter = /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/
      let Regex = new RegExp(patter)
      if (value && !Regex.test(value)) {
        callback(new Error('请输入合法数值'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      isClearable: false, // 可清空（可选）
      oldClientId: '',
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
      dataRule: {
        clientId: [
          { required: true, message: '终端编码不能为空', trigger: 'blur' },
          { validator: validateCo, trigger: 'blur' }
        ],
        clientSecret: [
          { required: true, message: '终端密钥不能为空', trigger: 'blur' }
        ],
        scope: [
          { required: true, message: '域不能为空', trigger: 'blur' }
        ],
        authorizedGrantType: [
          { required: true, message: '授权模式请选择', trigger: 'blur' }
        ],
        accessTokenValidity: [
          { validator: validateNum, trigger: 'blur' }
        ],
        refreshTokenValidity: [
          { validator: validateNum, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init (id) {
      console.log(id)
      this.oldClientId = id || ''
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
      if (this.oldClientId) {
        getObj(this.oldClientId).then(({data}) => {
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
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        this.dataForm.authorizedGrantTypes = this.dataForm.authorizedGrantType.join(',')
        console.log(this.dataForm.authorizedGrantTypes)
        if (valid && !(this.oldClientId)) {
          addObj(this.dataForm).then(({data}) => {
            this.$emit('refreshDataList')
            console.log(JSON.stringify(data))
            if (data && data.code === 0) {
              this.$message({
                message: '保存成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        } else if (valid && (this.oldClientId)) {
          putObj(this.dataForm).then(({data}) => {
            this.$emit('refreshDataList')
            console.log(JSON.stringify(data))
            if (data && data.code === 0) {
              this.$message({
                message: '修改成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      })
    }
  }
}
</script>
