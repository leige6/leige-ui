<template>
  <el-dialog
    :title="!dataForm.roleId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="500px">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="dataForm.roleName" placeholder="角色名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="角色编码" prop="roleCode">
        <el-input v-model="dataForm.roleCode" placeholder="角色编码" clearable></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.roleDesc" placeholder="备注" clearable></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :disabled="isDisabled">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {addObj, putObj, getObj} from '@/api/admin/role'
export default {
  data () {
    return {
      isDisabled: false,
      visible: false,
      dataForm: {
        roleId: 0,
        roleName: '',
        roleCode: '',
        roleDesc: '',
        dsType: 0
      },
      dataRule: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        roleCode: [
          { required: true, message: '角色编码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init (id) {
      this.dataForm.roleId = id || 0
      this.visible = true
      this.isDisabled = false
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.dataForm.roleName = ''
        this.dataForm.roleCode = ''
        this.dataForm.roleDesc = ''
      })
      if (this.dataForm.roleId) {
        getObj(this.dataForm.roleId).then(({data}) => {
          console.log(JSON.stringify(data))
          if (data && data.code === 0) {
            this.dataForm.roleName = data.data.roleName
            this.dataForm.roleCode = data.data.roleCode
            this.dataForm.roleDesc = data.data.roleDesc
          }
        })
      }
    },
    // 表单提交
    dataFormSubmit () {
      this.isDisabled = true
      this.$refs['dataForm'].validate((valid) => {
        if (valid && !(this.dataForm.roleId)) {
          addObj(this.dataForm).then(({data}) => {
            this.isDisabled = false
            this.$emit('refreshDataList')
            if (data && data.code === 0) {
              this.$message({
                message: '保存成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                }
              })
            }
          })
        } else if (valid && (this.dataForm.roleId)) {
          putObj(this.dataForm).then(({data}) => {
            this.$emit('refreshDataList')
            this.isDisabled = false
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
            }
          })
        }
      })
    }
  }
}
</script>
