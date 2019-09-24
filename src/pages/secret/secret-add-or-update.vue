<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="500px">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label="应用类型" prop="type">
        <el-select v-model="dataForm.type" placeholder="请选择应用类型" clearable>
          <el-option
            v-for="item in typeList"
            :key="item.id"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="appId" prop="appId" >
        <el-input v-model="dataForm.appId"  placeholder="请输入appId" clearable></el-input>
      </el-form-item>
      <el-form-item label="appSecret" prop="appSecret">
        <el-input v-model="dataForm.appSecret" placeholder="请输入appSecret" clearable></el-input>
      </el-form-item>
      <el-form-item label="回调地址" prop="redirectUrl">
        <el-input type="textarea" v-model="dataForm.redirectUrl" clearable></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="remark">
        <el-input type="textarea" v-model="dataForm.remark" clearable></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {addObj, putObj, getObj} from '@/api/admin/secret'
import {fetchDetailList} from '@/api/admin/dict'
export default {
  data () {
    return {
      visible: false,
      typeList: [],
      dataForm: {
        id: 0,
        type: '',
        remark: '',
        appId: '',
        appSecret: '',
        redirectUrl: ''
      },
      dataRule: {
        appId: [
          { required: true, message: 'appId不能为空', trigger: 'blur' }
        ],
        appSecret: [
          { required: true, message: 'appSecret不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created: {
  },
  methods: {
    init (id) {
      this.dataForm.id = id || 0
      console.log(this.dataForm.id)
      this.visible = true
      fetchDetailList({'code': 'app_type'}).then(({data}) => {
        this.typeList = data.data
      })
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
      if (this.dataForm.id) {
        getObj(this.dataForm.id).then(({data}) => {
          console.log(JSON.stringify(data))
          if (data && data.code === 0) {
            this.dataForm.type = data.data.type
            this.dataForm.remark = data.data.remark
            this.dataForm.appId = data.data.appId
            this.dataForm.appSecret = data.data.appSecret
            this.dataForm.redirectUrl = data.data.redirectUrl
          }
        })
      }
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid && !(this.dataForm.id)) {
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
        } else if (valid && (this.dataForm.id)) {
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
