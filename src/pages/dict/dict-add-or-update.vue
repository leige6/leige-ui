<template>
  <el-dialog
    :title="!dataForm.userId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="500px">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="字典名称" prop="name" class="is-required">
        <el-input  v-model="dataForm.name" placeholder="字典名称" clearable></el-input>
      </el-form-item>
      <el-form-item v-if="type" label="字典编码" prop="code" class="is-required">
        <el-input v-model="dataForm.code"  placeholder="字典编码" clearable></el-input>
      </el-form-item>
      <el-form-item  v-else label="字典值" prop="value" class="is-required">
        <el-input v-model="dataForm.value"  placeholder="字典值" clearable></el-input>
      </el-form-item>
      <el-form-item  label="排序" prop="sort">
        <el-input-number v-model="dataForm.sort" controls-position="right" :min="0" label="排序"></el-input-number>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {addObj, addDetailObj, putObj, putDetailObj, getObj, getDetailObj, validateCode} from '@/api/admin/dict'
export default {
  data () {
    var validateCo = (rule, value, callback) => {
      validateCode({'code': value, 'id': this.dataForm.id}).then(({data}) => {
        console.log(JSON.stringify(data))
        if (data && data.data) {
          callback()
        } else if (data && !(data.data)) {
          callback(new Error('编码已存在'))
        }
      })
    }
    return {
      visible: false,
      type: 1,
      dataForm: {
        id: 0,
        name: '',
        value: '',
        code: '',
        dictId: 0,
        sort: 1
      },
      dataRule: {
        name: [
          { required: true, message: '字典名称不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '字典编码不能为空', trigger: 'blur' },
          { validator: validateCo, trigger: 'blur' }
        ],
        value: [
          { required: true, message: '字典值不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init (id, type, dictId) {
      this.dataForm.id = id || 0
      this.dataForm.dictId = dictId || 0
      this.visible = true
      this.type = type
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
      if (this.dataForm.id && this.type) {
        getObj(this.dataForm.id).then(({data}) => {
          console.log(JSON.stringify(data))
          if (data && data.code === 0) {
            this.dataForm.name = data.data.name
            this.dataForm.code = data.data.code
            this.dataForm.sort = data.data.sort
          }
        })
      } else if (this.dataForm.id && !this.type) {
        getDetailObj(this.dataForm.id).then(({data}) => {
          console.log(JSON.stringify(data))
          if (data && data.code === 0) {
            this.dataForm.name = data.data.name
            this.dataForm.value = data.data.value
            this.dataForm.sort = data.data.sort
          }
        })
      }
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid && !(this.dataForm.id)) {
          if (this.type) {
            addObj(this.dataForm).then(({data}) => {
              let param = {
                type: this.type
              }
              this.$emit('refreshDataList', param)
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
          } else {
            addDetailObj(this.dataForm).then(({data}) => {
              let param = {
                type: this.type
              }
              this.$emit('refreshDataList', param)
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
          }
        } else if (valid && (this.dataForm.id)) {
          if (this.type) {
            putObj(this.dataForm).then(({data}) => {
              let param = {
                type: this.type
              }
              this.$emit('refreshDataList', param)
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
          } else {
            putDetailObj(this.dataForm).then(({data}) => {
              let param = {
                type: this.type
              }
              this.$emit('refreshDataList', param)
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
        }
      })
    }
  }
}
</script>
