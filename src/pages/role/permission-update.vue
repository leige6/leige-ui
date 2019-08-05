<template>
  <el-dialog
    title="授权"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="500px">
    <el-form  ref="dataForm" @keyup.enter.native="updatePermession(roleId, roleCode)" label-width="80px">
      <el-form-item size="mini" label="授权">
        <el-tree
          :data="menuList"
          :props="menuListTreeProps"
          node-key="id"
          ref="menuTree"
          :default-expand-all="isExpandAll"
          :default-checked-keys="menuIdList"
          show-checkbox>
        </el-tree>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="updatePermession(roleId, roleCode)">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {fetchMenuTree, fetchMenuByRoid} from '@/api/admin/menu'
import {permissionUpd} from '@/api/admin/role'
export default {
  data () {
    return {
      visible: false,
      isExpandAll: false,
      menuList: [],
      menuIdList: [],
      menuListTreeProps: {
        label: 'name',
        children: 'children'
      },
      roleId: 0,
      roleCode: ''
    }
  },
  methods: {
    init (id) {
      this.roleId = id || 0
      fetchMenuTree().then(({data}) => {
        this.menuList = data.data
      }).then(() => {
        this.visible = true
        this.$nextTick(() => {
          this.$refs.menuTree.setCheckedKeys([])
        })
      }).then(() => {
        if (this.roleId) {
          fetchMenuByRoid(this.roleId).then(({data}) => {
            console.log(JSON.stringify(data))
            this.menuIdList = data
            // 解析出所有的太监节点
            this.menuIdList = this.resolveAllEunuchNodeId(this.menuList, this.menuIdList, [])
          })
        }
      })
    },
    resolveAllEunuchNodeId (json, idArr, temp) {
      for (let i = 0; i < json.length; i++) {
        const item = json[i]
        // 存在子节点，递归遍历;不存在子节点，将json的id添加到临时数组中
        if (item.children && item.children.length !== 0) {
          this.resolveAllEunuchNodeId(item.children, idArr, temp)
        } else {
          temp.push(idArr.filter(id => id === item.id))
        }
      }
      return temp
    },
    // 表单提交
    updatePermession (roleId, roleCode) {
      this.menuIds = ''
      this.menuIds = this.$refs.menuTree.getCheckedKeys().join(',').concat(',').concat(this.$refs.menuTree.getHalfCheckedKeys().join(','))
      console.log(JSON.stringify(this.menuIds))
      permissionUpd(roleId, this.menuIds).then(({data}) => {
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
}
</script>
