<template>
  <el-dialog
    :title="!dataForm.deptId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="500px"
  >
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="部门名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="上级菜单" prop="parentName">
        <el-popover
          ref="deptListPopover"
          placement="bottom-start"
          v-model="popoverVisible"
          trigger="click">
          <el-tree
            :data="deptList"
            :props="deptListTreeProps"
            node-key="id"
            ref="deptListTree"
            @current-change="deptListTreeCurrentChangeHandle"
            :highlight-current="highlightCurrent"
            :expand-on-click-node="expandClickNode"
            @node-click="deptNodeClick">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.parentName" v-popover:deptListPopover :readonly="true" placeholder="点击选择上级菜单"  class="menu-list__input" > </el-input>
        <span v-if="clearable" @click="deptParentNameClear" class="el-input__suffix"><span class="el-input__suffix-inner"><i class="el-input__icon el-icon-circle-close el-input__clear"></i></span><i class="el-input__icon el-input__validateIcon el-icon-circle-check"></i></span>
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
import { treeDataTranslate } from '@/utils/util'
import {fetchTree, addObj, putObj, getObj} from '@/api/admin/dept'
export default {
  data () {
    return {
      visible: false,
      clearable: false,
      popoverVisible: false,
      highlightCurrent: true,
      expandClickNode: false,
      dataForm: {
        deptId: 0,
        name: '',
        parentId: 0,
        parentName: '',
        sort: 0
      },
      dataRule: {
        name: [
          { required: true, message: '菜单名称不能为空', trigger: 'blur' }
        ],
        parentName: [
          { required: true, message: '上级菜单不能为空', trigger: 'change' }
        ]
      },
      deptList: [],
      deptListTreeProps: {
        label: 'name',
        children: 'children'
      }
    }
  },
  created () {
  },
  methods: {
    init (id) {
      this.dataForm.id = id || 0
      fetchTree().then(({data}) => {
        this.deptList = treeDataTranslate(data.data, 'id')
      }).then(() => {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
      }).then(() => {
        if (!this.dataForm.id) {
          // 新增
          this.dataForm.parentId = 0
          this.deptListTreeSetCurrentNode()
        } else {
          // 修改
          getObj(this.dataForm.id).then(({data}) => {
            console.log(JSON.stringify(data))
            this.dataForm.deptId = data.data.deptId
            this.dataForm.name = data.data.name
            this.dataForm.parentId = data.data.parentId
            this.dataForm.sort = data.data.sort
            this.deptListTreeSetCurrentNode()
          })
        }
      })
    },
    // 菜单树选中
    deptListTreeCurrentChangeHandle (data, node) {
      this.dataForm.parentId = data.id
      this.dataForm.parentName = data.name
    },
    // 菜单树设置当前选中节点
    deptListTreeSetCurrentNode () {
      this.$refs.deptListTree.setCurrentKey(this.dataForm.parentId)
      if (this.dataForm.parentId) {
        this.dataForm.parentName = (this.$refs.deptListTree.getCurrentNode() || {})['name']
        this.clearable = true
      } else {
        this.dataForm.parentName = '一级部门'
        this.clearable = false
      }
    },
    deptNodeClick () {
      this.popoverVisible = false
      this.clearable = true
    },
    deptParentNameClear () {
      this.dataForm.parentId = 0
      this.dataForm.parentName = '一级部门'
      this.$refs.deptListTree.setCurrentKey(this.dataForm.parentId)
      this.clearable = false
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid && !(this.dataForm.deptId)) {
          addObj(this.dataForm).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '添加成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        } else if (valid && (this.dataForm.deptId)) {
          putObj(this.dataForm).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '修改成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
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

<style lang="scss">
  .mod-menu {
    .menu-list__input,
    .icon-list__input {
       > .el-input__inner {
        cursor: pointer;
      }
    }
    &__icon-popover {
      width: 458px;
      overflow: hidden;
    }
    &__icon-inner {
      width: 478px;
      max-height: 258px;
      overflow-x: hidden;
      overflow-y: auto;
    }
    &__icon-list {
      width: 458px;
      padding: 0;
      margin: -8px 0 0 -8px;
      > .el-button {
        padding: 8px;
        margin: 8px 0 0 8px;
        > span {
          display: inline-block;
          vertical-align: middle;
          width: 18px;
          height: 18px;
          font-size: 18px;
        }
      }
    }
    .icon-list__tips {
      font-size: 18px;
      text-align: center;
      color: #e6a23c;
      cursor: pointer;
    }
  }
</style>
