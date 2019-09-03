<template>
  <el-dialog
    :title="!dataForm.menuId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="500px">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="类型" prop="type">
        <el-radio-group v-model="dataForm.type">
          <el-radio v-for="(type, index) in dataForm.typeList" :label="index" :key="index">{{ type }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="dataForm.typeList[dataForm.type] + '名称'" prop="name">
        <el-input v-model="dataForm.name" :placeholder="dataForm.typeList[dataForm.type] + '名称'"></el-input>
      </el-form-item>
      <el-form-item label="上级菜单" prop="parentName">
        <el-popover
          ref="menuListPopover"
          placement="bottom-start"
          v-model="popoverVisible"
          trigger="click">
          <el-tree
            :data="menuList"
            :props="menuListTreeProps"
            node-key="id"
            ref="menuListTree"
            @current-change="menuListTreeCurrentChangeHandle"
            :default-expand-all="false"
            :highlight-current="highlightCurrent"
            :expand-on-click-node="expandClickNode"
            @node-click="menuNodeClick">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.parentName" v-popover:menuListPopover :readonly="true" placeholder="点击选择上级菜单" class="menu-list__input"></el-input>
        <span v-if="clearable" @click="menuParentNameClear" class="el-input__suffix"><span class="el-input__suffix-inner"><i class="el-input__icon el-icon-circle-close el-input__clear"></i></span><i class="el-input__icon el-input__validateIcon el-icon-circle-check"></i></span>
      </el-form-item>
      <el-form-item v-if="dataForm.type === 0" label="菜单路由" prop="path">
        <el-input v-model="dataForm.path" placeholder="路由不能以斜杠开头，正确格式如: user/index"></el-input>
      </el-form-item>
      <el-form-item v-if="dataForm.type === 1" label="授权标识" prop="permission">
        <el-input v-model="dataForm.permission" placeholder="多个用逗号分隔, 如: user:list,user:create"></el-input>
      </el-form-item>
      <el-form-item v-if="dataForm.type === 0" label="路由缓冲"
                    prop="keepAlive">
        <el-switch v-model="dataForm.keepAlive"
                   active-color="#13ce66"
                   inactive-color="#dcdfe6"
                   :active-value='"0"'
                   :inactive-value='"1"'>
        </el-switch>
      </el-form-item>
      <el-form-item  label="排序" prop="sort">
        <el-input-number v-model="dataForm.sort" controls-position="right" :min="0" label="排序"></el-input-number>
      </el-form-item>
      <el-form-item v-if="dataForm.type === 0" label="菜单图标" prop="icon">
        <el-row>
          <el-col :span="22">
            <el-input v-model="dataForm.icon"  placeholder="菜单图标名称" class="icon-list__input"></el-input>
          </el-col>
          <el-col :span="2" class="icon-list__tips">
            <el-tooltip placement="top" effect="light">
              <div slot="content">全站推荐使用SVG Sprite, 详细请参考:<a href="//github.com/daxiongYang/renren-fast-vue/blob/master/src/icons/index.js" target="_blank">icons/index.js</a>描述</div>
              <i class="el-icon-warning"></i>
            </el-tooltip>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()"  :disabled="isDisabled">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { treeDataTranslate } from '@/utils/util'
import {fetchMenuTree, addObj, putObj, getObj} from '@/api/admin/menu'
export default {
  data () {
    var validateUrl = (rule, value, callback) => {
      if (this.dataForm.type === 1 && !/\S/.test(value)) {
        callback(new Error('菜单URL不能为空'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      clearable: false,
      highlightCurrent: true,
      expandClickNode: false,
      popoverVisible: false,
      isDisabled: false,
      dataForm: {
        menuId: undefined,
        type: 0,
        typeList: ['菜单', '按钮'],
        name: '',
        parentId: -1,
        parentName: '',
        component: '',
        keepAlive: '1',
        path: '',
        permission: '',
        sort: 0,
        icon: '',
        iconList: []
      },
      dataRule: {
        name: [
          { required: true, message: '菜单名称不能为空', trigger: 'blur' }
        ],
        parentName: [
          { required: true, message: '上级菜单不能为空', trigger: 'change' }
        ],
        url: [
          { validator: validateUrl, trigger: 'blur' }
        ]
      },
      menuList: [],
      menuListTreeProps: {
        label: 'name',
        children: 'children'
      }
    }
  },
  created () {
  },
  methods: {
    init (id) {
      this.dataForm.menuId = id || 0
      this.isDisabled = false
      fetchMenuTree().then(({data}) => {
        this.menuList = treeDataTranslate(data.data, 'id')
      }).then(() => {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
      }).then(() => {
        if (!this.dataForm.menuId) {
          // 新增
          this.dataForm.parentId = -1
          this.dataForm.sort = 0
          this.dataForm.path = ''
          this.menuListTreeSetCurrentNode()
        } else {
          // 修改
          getObj(this.dataForm.menuId).then(({data}) => {
            console.log(JSON.stringify(data))
            this.dataForm.menuId = data.data.menuId
            this.dataForm.type = parseInt(data.data.type)
            this.dataForm.name = data.data.name
            this.dataForm.parentId = data.data.parentId
            this.dataForm.path = data.data.path
            this.dataForm.permission = data.data.permission
            this.dataForm.sort = data.data.sort
            this.dataForm.icon = data.data.icon
            this.dataForm.keepAlive = data.data.keepAlive
            this.menuListTreeSetCurrentNode()
          })
        }
      })
    },
    // 菜单树选中
    menuListTreeCurrentChangeHandle (data, node) {
      this.dataForm.parentId = data.id
      this.dataForm.parentName = data.name
    },
    // 菜单树设置当前选中节点
    menuListTreeSetCurrentNode () {
      this.$refs.menuListTree.setCurrentKey(this.dataForm.parentId)
      if (this.dataForm.parentId != -1) {
        this.dataForm.parentName = (this.$refs.menuListTree.getCurrentNode() || {})['name']
        this.clearable = true
      } else {
        this.dataForm.parentName = '一级菜单'
        this.clearable = false
      }
    },
    // 图标选中
    iconActiveHandle (iconName) {
      this.dataForm.icon = iconName
    },
    menuNodeClick () {
      this.popoverVisible = false
      this.clearable = true
    },
    menuParentNameClear () {
      this.dataForm.parentId = -1
      this.dataForm.parentName = '一级菜单'
      this.$refs.menuListTree.setCurrentKey(this.dataForm.parentId)
      this.clearable = false
    },
    // 表单提交
    dataFormSubmit () {
      this.isDisabled = true
      this.$refs['dataForm'].validate((valid) => {
        if (valid && !(this.dataForm.menuId)) {
          addObj(this.dataForm).then(({data}) => {
            this.isDisabled = false
            if (data && data.code === 0) {
              this.$message({
                message: '保存成功',
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
        } else if (valid && (this.dataForm.menuId)) {
          putObj(this.dataForm).then(({data}) => {
            this.isDisabled = false
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
        } else {
          this.isDisabled = false
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
