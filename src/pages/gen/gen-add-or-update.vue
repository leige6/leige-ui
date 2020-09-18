<template>
  <el-dialog
    title="生成代码配置"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="700px">
    <el-form :model="dataForm"  ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-row type="flex">
        <el-form-item label="表名" prop="tableName">
          <el-input  v-model="dataForm.tableName" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="包名" prop="packageName">
          <el-input v-model="dataForm.packageName"  placeholder="请输入包名" clearable></el-input>
        </el-form-item>
      </el-row>
      <el-row type="flex">
        <el-form-item label="作者" prop="author">
          <el-input v-model="dataForm.author"  placeholder="请输入作者" clearable></el-input>
        </el-form-item>
        <el-form-item label="模块" prop="moduleName">
          <el-input v-model="dataForm.moduleName"  placeholder="请输入模块" clearable></el-input>
        </el-form-item>
      </el-row>
      <el-row type="flex">
        <el-form-item label="表前缀" prop="tablePrefix">
          <el-input v-model="dataForm.tablePrefix"  placeholder="请输入表前缀" clearable></el-input>
        </el-form-item>
        <el-form-item label="注释" prop="comments">
          <el-input v-model="dataForm.comments"  placeholder="请输注释" clearable></el-input>
        </el-form-item>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">生成</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { handleDown } from '@/api/admin/gen'
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        tableName: '',
        packageName: '',
        author: '',
        moduleName: '',
        tablePrefix: '',
        comments: ''
      }
    }
  },
  methods: {
    init (tableName) {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
      this.dataForm.tableName = tableName || ''
    },
    // 表单提交
    dataFormSubmit () {
      handleDown(this.dataForm).then(({data}) => {})
    }
  }
}
</script>
