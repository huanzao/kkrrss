<template>
  <div>
    <el-card>
      <!-- 搜索 添加 -->
      <el-row :gutter="10">
        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
          <el-button type="primary" @click="myAdd" size="mini">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <el-table :data="tableData" border="" stripe style="margin-top:15px;">
        <!-- 索引列 -->
        <el-table-column label="#" prop="group_id"></el-table-column>
        <el-table-column label="角色名称" prop="name"></el-table-column>
        <el-table-column label="角色描述" prop="description"></el-table-column>
        <el-table-column label="状态" width="80" class="shitchBox">
            <template slot-scope="scope">
              <el-switch  class="switchStyle" v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949"  
                  active-value="1" active-text="启用" inactive-value="0" inactive-text="禁用"
                  @change="switchChange($event,scope.$index,scope.row)"
                  >
              </el-switch>
            </template>
        </el-table-column>
        <el-table-column label="操作" width="245">
          <template slot-scope="scope">
            <el-button style="padding: 3px 7px;" type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.$index,scope.row)" >编辑</el-button>
            <el-button style="padding: 3px 7px;" type="danger" icon="el-icon-delete" size="mini" @click="removeRoleById(scope.row.name,scope.row.group_id,scope.$index)" >删除</el-button>
            <el-button style="padding: 3px 7px;" type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.$index,scope.row)" >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="margin-top: 15px;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagenum"
          :page-sizes="[10, 30, 50, 100]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog :title="roleDialogTitle" center :visible.sync="dialogVisible" width="40%">
      <el-form :model="RoleForm" ref="RoleFormRef" :rules="RoleFormRules" label-width="100px" >
        <el-form-item label="角色名称" prop="name">
          <el-input size="mini" v-model="RoleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="排序:" prop="orderId">
          <el-input-number size="mini" :min="1" controls-position="right" v-model="RoleForm.sort"></el-input-number>
        </el-form-item>
        <el-form-item label="状态:" v-if="roleDialogTitle=='添加角色'">
          <div>
            <el-radio v-model="RoleForm.status" label="1">启用</el-radio>
            <el-radio v-model="RoleForm.status" label="0">禁用</el-radio>
          </div>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input size="mini" type="textarea" v-model="RoleForm.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="UpLoadRoles" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限 -->
    <el-dialog :title="quanxianTitle" center :visible.sync="setRightDialogVisible" width="50%">
        <el-form :model="auth_form" ref="auth_formRef" :rules="RoleFormRules" label-width="100px" >
          <el-form-item label="模块">
            <el-select v-model="auth_form.module" size="mini"  @change="ModeChange" placeholder="请输入模块名称" >
                <el-option value="admin" label="admin"></el-option>
                <el-option value="api" label="api"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="权限"></el-form-item>
          <el-form-item style="margin-right:100px" >
              <div style="display:flex;justify-content: space-around;">
                <div v-show="auth_form.module=='admin'">
                  <h5>菜单展示</h5>
                    <el-tree :data="menuArr" lazy show-checkbox 
                      ref="tree_menu_auth" node-key="menu_id" :props="treeProps" :load="Menu_loadNode"  :default-checked-keys='defaultMenuArr'></el-tree>
                </div>
                <div v-show="auth_form.module=='api'" >
                  <h5>功能权限</h5>
                    <el-tree :data="authArr" lazy show-checkbox 
                      ref="tree_api_auth" node-key="menu_id"  :props="treeProps" :load="Auth_loadNode"  :default-checked-keys='defaultAuthArr'></el-tree>
                </div>
              </div>
          </el-form-item>
        </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="allotRights" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {AxiosReturn} from '../../assets/axios/index'
export default {
  name: "rolelsit",
  data() {
    return {
      roleDialogTitle:"添加角色",
      globelIdex:0,
      dialogVisible: false,
      // 所有角色列表
      pagesize:30,
      pagenum:1,
      total:0,
      tableData:[],
      // 添加角色表单
      RoleForm: {
        name:"",
        description:"",
        sort:"",
        status:"1"
      },
      auth_form:{
        module:"admin", 
        group_id:"",
        name:"",
        menu_auth:[],
        log_auth:[]
      },
      isAdd_auth:false,
     
      //   添加角色表单验证
      RoleFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" }
        ]
      },
      //   编辑角色信息
      editRoleForm: {
        roleName: "",
        roleDesc: ""
      },
      editRoleDialogVisible: false,
      editRoleFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" }
        ]
      },
      // 分配权限框
      setRightDialogVisible: false,
      quanxianTitle:"",
      //   默认选中节点ID值
      treeProps: {
        label: "name",
        children: "children",
        isLeaf:''
        
      },
      authArr:[], //功能接口数据
      menuArr:[], //菜单接口数据
      defaultMenuArr:[],
      defaultAuthArr:[],
      Allquanxian:[]
    };
  },
  created(){
    this.getArrs('api')
    this.getArrs('admin')
  },
  mounted(){
    this.getList()
  },
  methods: {
    AxiosReturn,
    getList(){
      this.AxiosReturn('auth_group/method/get.auth.group.list',{page_size: this.pagesize,page_no:this.pagenum}).then(res=>{
          this.tableData=res.data.items.map(res=>{
            res.status=res.status.toString()
            return res
          })
          this.total=res.data.total_result
      })
    },
    Menu_loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve(this.menuArr);
      }
      if (node.level > 1) return resolve([])
      if(node.data.hasChildren){
          this.AxiosReturn('menu/method/get.parent.item',{module:'admin',parent_id:node.data.menu_id},true).then(res=>{
              resolve(res.data)
          })
      }else{
        resolve([])
      }
    },
    Auth_loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve(this.authArr);
      }
      if (node.level > 1) return resolve([]);
      this.AxiosReturn('menu/method/get.parent.item',{module:'api',parent_id:node.data.menu_id},true).then(res=>{
          resolve(res.data)
      })
    },
    getArrs(modules){
      this.AxiosReturn('menu/method/get.parent.item',{module:modules,parent_id:0}).then(res=>{
        let result= res.data.map(item=>{
          item.status=item.status.toString()
          if(item.children_total==0){
              item.hasChildren=false
          }else{
              item.hasChildren=true
          }
          return item
        })
        if(modules=='admin'){
          this.menuArr=result
        }else if(modules=='api'){
          this.authArr=result
        }
      })
    },
    handleSizeChange(value){
        this.pagesize=value
        this.getList()
    },
    handleCurrentChange(value){
        this.pagenum=value
        this.getList()
    },
    // 添加角色对话框的关闭// 添加角色
    myAdd(){
      this.RoleForm={
        name:"",
        description:"",
        sort:"",
        status:"1"
      },
        this.roleDialogTitle='添加角色'
        this.dialogVisible=true
    },
    switchChange(e,index,row){
        let par={
            group_id:row.group_id,
            status:e
        }
        this.AxiosReturn('auth_group/method/set.auth.group.item/',par).then(res=>{
            if(res.status==200){
                if(e==1){
                  this.$message.success('启用成功')
                }else{
                  this.$message.warning('禁用成功')
                }
            }else{
              this.$message.warning(res.message)
            }
        })
    },
    // 编辑角色
    showEditDialog(index,row) {
      this.globelIdex=index
        this.RoleForm.name=row.name
        this.RoleForm.description=row.description
        this.RoleForm.sort=row.sort
        this.RoleForm.status=row.status.toString()
        this.RoleForm.group_id=row.group_id 
        this.roleDialogTitle='编辑'
        this.dialogVisible=true
    },
    UpLoadRoles() {
      this.$refs.RoleFormRef.validate(async valid => {
          if (!valid) return
          if(this.roleDialogTitle=="添加角色"){
              this.AxiosReturn('auth_group/method/add.auth.group.item/',this.RoleForm).then(res=>{
                  this.$message.success('添加成功')
                  this.getList()
              })
          }else{
              this.AxiosReturn('auth_group/method/set.auth.group.item/',this.RoleForm).then(res=>{
                  this.$message.success('修改成功')
                  this.getList()
              })
          }
          this.dialogVisible=false
      });
    },
    // 删除角色
    removeRoleById(title,id,index) {
        this.$confirm(`确定要删除 ' ${title} ' 这一角色吗`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.AxiosReturn('auth_group/method/del.auth.group.item/',{group_id:id}).then(res=>{
              if(res.status==200){
                  this.$message.success('删除成功!')
                  this.tableData.splice(index,1)
              }else{
                  this.$message.warning(res.message)
              }
            })
        })
    },
    // 获取角色权限
    showSetRightDialog(index,role) {
      let that=this
      this.auth_form.module='admin'
      this.AxiosReturn('auth_rule/method/get.auth.rule.list',{group_id:role.group_id }).then(res=>{
        that.Allquanxian=res.data
        if(res.data){
          let my_whitch=""
          for(var m in res.data){
            if(res.data[m].module=='admin'){
                  my_whitch=m
            }
          }
          if(my_whitch){
              that.isAdd_auth=true
              that.defaultMenuArr=res.data[my_whitch].menu_auth
              that.$nextTick(() => {
                that.$refs.tree_menu_auth.setCheckedKeys(that.defaultMenuArr);
              })
              that.auth_form.menu_auth=res.data[my_whitch].menu_auth
              that.auth_form.log_auth=res.data[my_whitch].log_auth
              that.auth_form.rule_id=res.data[my_whitch].rule_id
          }else{
              that.isAdd_auth=false
              that.isAdd_auth=false
              that.defaultMenuArr=[]
              that.$nextTick(() => {
                that.$refs.tree_menu_auth.setCheckedKeys(that.defaultMenuArr);
              })
          }
        }else{
          that.isAdd_auth=false
          that.defaultMenuArr=[]
          that.$nextTick(() => {
            that.$refs.tree_menu_auth.setCheckedKeys(that.defaultMenuArr);
          })
        }
        that.auth_form.group_id=role.group_id,
        that.auth_form.name=role.name,
        that.quanxianTitle=`对角色${role.name}进行权限分配`
        that.setRightDialogVisible = true
      })
    },
    //模块切换
    ModeChange(v){
        let my_whitch=""
        for(var m in this.Allquanxian){
          if(this.Allquanxian[m].module==v){
                my_whitch=m
          }
        }
        if(my_whitch){
            this.isAdd_auth=true

            this.defaultMenuArr=this.Allquanxian[my_whitch].menu_auth
            this.defaultAuthArr=this.Allquanxian[my_whitch].log_auth
            this.auth_form.menu_auth=this.Allquanxian[my_whitch].menu_auth
            this.auth_form.log_auth=this.Allquanxian[my_whitch].log_auth
            this.auth_form.rule_id=this.Allquanxian[my_whitch].rule_id

            if(this.auth_form.module=='api'){
              this.$nextTick(() => {
                this.$refs.tree_api_auth.setCheckedKeys(this.Allquanxian[my_whitch].log_auth)
              })
            }else if(this.auth_form.module=='admin'){
              this.$nextTick(() => {
                this.$refs.tree_menu_auth.setCheckedKeys(this.Allquanxian[my_whitch].menu_auth)
              })
            }
        }else{
            this.isAdd_auth=false
            my_whitch=0
        }
        this.defaultMenuArr=this.Allquanxian[my_whitch].menu_auth
        this.defaultAuthArr=this.Allquanxian[my_whitch].log_auth
        this.auth_form.menu_auth=this.Allquanxian[my_whitch].menu_auth
        this.auth_form.log_auth=this.Allquanxian[my_whitch].log_auth
        this.auth_form.rule_id=this.Allquanxian[my_whitch].rule_id
        this.$refs.tree_menu_auth.setCheckedKeys(this.Allquanxian[my_whitch].menu_auth)
    },
    // 分配权限---提交
    allotRights() {

      this.auth_form.menu_auth=this.$refs.tree_menu_auth.getCheckedKeys()
      this.auth_form.log_auth=this.$refs.tree_api_auth.getCheckedKeys()
      
      let that=this
      let api=""
      if(this.isAdd_auth){
          api='auth_rule/method/set.auth.rule.item'  //编辑
      }else{
          api='auth_rule/method/add.auth.rule.item'  //添加
      }
      this.AxiosReturn(api,this.auth_form).then(res=>{
        if(res.status===200){
            that.$message.success('设置成功')
            that.setRightDialogVisible=false
        }else{
            that.$message.warning(res.message)
        }
      })
    },
  }
};
</script>

<style scoped>
</style>
<style>
.el-table td,
.el-table th {
  padding: 0 0;
}
.el-footer {
  height: 0 !important;
}
.el-button--mini.is-circle {
  padding: 5px;
}
</style>