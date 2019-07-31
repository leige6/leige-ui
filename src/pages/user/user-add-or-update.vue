<template>
  <el-dialog
    :title="!dataForm.userId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="500px">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="用户名" prop="username">
        <el-input  v-model="dataForm.username" placeholder="登录帐号" clearable></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.password" type="password" placeholder="密码" clearable></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="comfirmPassword" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.comfirmPassword" type="password" placeholder="确认密码" clearable></el-input>
      </el-form-item>
      <el-form-item label="所属部门" prop="deptId" >
        <SelectTree
          :props="props"
          :options="deptList"
          :value="dataForm.deptId"
          :clearable="isClearable"
          :accordion="isAccordion"
          @getValue="getValue($event)"/>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="dataForm.phone" placeholder="手机号" clearable></el-input>
      </el-form-item>
      <el-form-item label="角色"  prop="role">
        <el-select v-model="dataForm.role" placeholder="请选择" multiple>
          <el-option
            v-for="item in roleList"
            :key="item.roleId"
            :label="item.roleName"
            :value="item.roleId">
          </el-option>
        </el-select>
       <!-- <el-checkbox-group v-model="dataForm.roleIdList">
          <el-checkbox v-for="role in roleList" :key="role.roleId" :label="role.roleId">{{ role.roleName }}</el-checkbox>
        </el-checkbox-group>-->
      </el-form-item>
      <el-form-item label="状态" size="mini" prop="lockFlag">
        <el-radio-group v-model="dataForm.lockFlag">
          <el-radio :label="'0'">正常</el-radio>
          <el-radio :label="'1'">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {addObj, putObj, getObj} from '@/api/admin/user'
import {fetchTree} from '@/api/admin/dept'
import { fetchRoleList } from '@/api/admin/role'
import { isMobile } from '@/utils/validate'
import SelectTree from '@/components/tree-select/treeSelect.vue'
export default {
  components: {
    SelectTree
  },
  data () {
    var validatePassword = (rule, value, callback) => {
      if (!this.dataForm.id && !/\S/.test(value)) {
        callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    }
    var validateComfirmPassword = (rule, value, callback) => {
      if (!this.dataForm.id && !/\S/.test(value)) {
        callback(new Error('确认密码不能为空'))
      } else if (this.dataForm.password !== value) {
        callback(new Error('确认密码与密码输入不一致'))
      } else {
        callback()
      }
    }
    var validateMobile = (rule, value, callback) => {
      if (!isMobile(value)) {
        callback(new Error('手机号格式错误'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      roleList: [],
      deptList: [],
      isClearable: false, // 可清空（可选）
      isAccordion: true, // 可收起（可选）
      props: {
        value: 'id',
        label: 'name',
        children: 'children'
        // disabled:true
      },
      dataForm: {
        userId: 0,
        username: '',
        password: '',
        comfirmPassword: '',
        deptId: null,
        salt: '',
        phone: '',
        role: [],
        lockFlag: '0'
      },
      dataRule: {
        userName: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        password: [
          { validator: validatePassword, trigger: 'blur' }
        ],
        comfirmPassword: [
          { validator: validateComfirmPassword, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    getValue (value) {
      this.dataForm.deptId = value
    },
    init (id) {
      this.dataForm.userId = id || 0
      this.dataForm.deptId = null
      console.log(this.dataForm.deptId)
      fetchTree().then(response => {
        this.deptList = response.data.data
      }).then(() => {
        fetchRoleList().then(({data}) => {
          this.roleList = data.data
        })
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
      }).then(() => {
        if (this.dataForm.userId) {
          getObj(this.dataForm.userId).then(({data}) => {
            console.log(JSON.stringify(data))
            if (data && data.code === 0) {
              this.dataForm.username = data.data.username
              this.dataForm.salt = data.data.salt
              this.dataForm.phone = data.data.phone
              let list = []
              data.data.roleList.forEach(ele => {
                var roleId = ele.roleId
                list.push(roleId)
              })
              this.dataForm.role = list
              this.dataForm.lockFlag = data.data.lockFlag
              this.dataForm.deptId = data.data.deptId
            }
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid && !(this.dataForm.userId)) {
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
        } else if (valid && (this.dataForm.userId)) {
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
