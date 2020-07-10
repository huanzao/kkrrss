<template>
  <div>
    <el-card>
      <div id="myHeaderBox">
          <el-input placeholder="请输入用户名称" v-model="queryInfo.account " @keyup.enter.native="UserSearch"  clearable  size="mini" />
          <el-select size="mini"  placeholder="用户角色" v-model="queryInfo.group_id" clearable filterable >
              <el-option v-for="(role,r) in roleArr" :key="r" :label="role.name" :value="role.group_id" ></el-option>
          </el-select>
          <el-button type="primary" size="mini" icon="el-icon-search" @click="UserSearch">搜索</el-button>
          <el-button type="info" icon="el-icon-refresh" size="mini" v-if='isSearch' @click="resetFun"></el-button>
          <el-button type="primary" @click="addUserFun" size="mini">添加用户</el-button>
      </div>
      <el-table :data="tableData" border="" stripe style="margin-top:15px;">
        <el-table-column prop="admin_id" label="员工ID"></el-table-column>
        <el-table-column prop="username" label="用户"></el-table-column>
        <el-table-column prop="get_auth_group.name" label="角色"></el-table-column>
        <el-table-column prop="nickname" label="昵称"></el-table-column>
        <el-table-column prop="last_ip" label="最后登录ip"></el-table-column>
        <el-table-column prop="create_time" label="创建时间"></el-table-column>
        <el-table-column label="状态" width="80" class="shitchBox">
              <template slot-scope="scope">
                <el-switch 
                    class="switchStyle"
                    v-model="scope.row.status" 
                    active-color="#13ce66" 
                    inactive-color="#ff4949"  
                    active-value="1"
                    active-text="启用"
                    inactive-value="0"
                    inactive-text="禁用"
                    @change="isShelf($event,scope.row,scope.$index)"
                    >
                </el-switch>
              </template>
          </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button style="padding: 3px 7px;"  type="primary" icon="el-icon-edit" size="mini" @click="editFun(scope.$index,scope.row)" >编辑</el-button>
            <el-button style="padding: 3px 7px;"  type="warning" size="mini" @click="resetPassword(scope.$index,scope.row)" >修改密码</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="deleteFun(scope.row.username,scope.row.admin_id,scope.$index)" ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
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
    <!-- 添加用户的对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="addDialogVisible" width="50%" center @close="addDialogClosed">
      <!-- 内容主体 -->
      <el-form :model="addUserForm" ref="addUserFormRef" :rules="addUserFormRules" label-width="100px" >
        <el-form-item label="账号" prop="username">
          <el-input  size="mini"  v-model="addUserForm.username" :disabled="dialogTitle=='编辑用户' || dialogTitle=='修改密码'" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="dialogTitle=='添加用户' || dialogTitle=='修改密码' ">
          <el-input  size="mini" type="password" v-model="addUserForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password_confirm" v-if="dialogTitle=='添加用户'">
          <el-input  size="mini" type="password"  v-model="addUserForm.password_confirm" placeholder="请确认密码"></el-input>
        </el-form-item>
        <el-form-item label="分配角色" prop="group_id" v-if="dialogTitle=='添加用户' || dialogTitle=='编辑用户' ">
          <el-select  size="mini" clearable v-model="addUserForm.group_id" filterable allow-create default-first-option placeholder="请选择角色" >
            <el-option v-for="item in roleArr" :key="item.group_id"  :label="item.name" :value="item.group_id" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" v-if="dialogTitle=='添加用户' || dialogTitle=='编辑用户' ">
          <template>
            <el-radio v-model="addUserForm.status" label="1">启用</el-radio>
            <el-radio v-model="addUserForm.status" label="0">禁用</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname" v-if="dialogTitle=='添加用户' || dialogTitle=='编辑用户' ">
          <el-input size="mini" v-model="addUserForm.nickname" placeholder="请输入昵称"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="uploadFun(addUserForm)" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {AxiosReturn} from '../../assets/axios/index'
export default {
  name: "userlist",
  data() {
    return {
      isSearch:false,
      queryInfo:{
          account:"",
          group_id:"",
          page_no:"",
          page_size:""
      },
      // 添加用户对话框
      addDialogVisible: false,
      dialogTitle:"",
      roleArr:[],//角色select-option 数据
      // 用户添加
      addUserForm: {
        userid:"",
        username:"",
        password:"",
        password_confirm:"",
        group_id:"",
        nickname:"",
        status:"1"
      },
      // 用户添加表单验证规则
      addUserFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {min: 4, max: 20,message: "用户名的长度在4～20个字",trigger: "blur"}
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 18,
            message: "用户密码的长度在6～18个字",
            trigger: "blur"
          }
        ],
        password_confirm: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 18,
            message: "用户密码的长度在6～18个字",
            trigger: "blur"
          }
        ],
        group_id: [{ required: true, message: "请选择角色", trigger: "blur" }],
        nickname: [{ required: true, message: "请填写昵称", trigger: "blur" }],
      },
      tableData: [],
      // 分页------------------------
      total: 0, //总数
      pagenum: 1, // 当前页
      pagesize: 10 // 每页显示的条数
    };
  },
  created(){
    this.getUserList();
    this.AxiosReturn('api/auth_group/method/get.auth.group.list',{page_size:10000,page_no: 1}).then(res=>this.roleArr=res.data.items)
  },
  methods: {
    AxiosReturn,
    // 搜索
    UserSearch() {
      this.isSearch=true
      this.pagenum=1 
      this.pagesize=10
      this.getUserList()
    },
    resetFun(){
      this.isSearch=false
      this.queryInfo.account=""
      this.queryInfo.group_id=""
      this.pagenum=1 
      this.pagesize=10
      this.getUserList()
    },
    getUserList() {
      let that = this;
      let params={}
      if(this.isSearch){
        params=this.queryInfo
      }
      params.page_no=this.pagenum
      params.page_size=this.pagesize
      this.AxiosReturn("api/admin/method/get.admin.list",params).then(res=>{
            console.log(res)
            if(!res.data.items){
              this.$message('暂无数据')
              that.tableData=[]
            }else{
              that.tableData = res.data.items.map(it=>{
                  console.log(it.status)
                  it.status=it.status.toString()
                  return it
              })
            }
            that.total = res.data.total_result;
      })
    },
    // 监听 添加用户对话框的关闭事件 ---清空form表单
    addDialogClosed() {
      this.$refs.addUserFormRef.resetFields();
    },
    //打开添加用户窗口
    addUserFun(){
        this.dialogTitle='添加用户'
        this.addDialogVisible=true
        this.addUserForm.client_id=null
        this.addUserForm.username=''
        this.addUserForm.password=''
        this.addUserForm.password_confirm=''
        this.addUserForm.group_id=''
        this.addUserForm.nickname=''
        this.addUserForm.status=null
    },
    //打开编辑页面窗口
    editFun(index,row){
        this.dialogTitle='编辑用户'
        this.addUserForm.client_id=row.admin_id
        this.addUserForm.username=row.username
        this.addUserForm.group_id=row.group_id
        this.addUserForm.nickname=row.nickname
        this.addUserForm.status=row.status
        this.addDialogVisible=true
        
    },
    resetPassword(index,row){
        this.dialogTitle='修改密码'
        this.addUserForm.client_id=row.admin_id
        this.addUserForm.username=row.username
        this.addUserForm.password=''
        this.addDialogVisible=true
        
    },
    // 添加用户--编辑用户  提交
    uploadFun(addUserForm) {
      // 提交请求前，表单预验证
      this.$refs.addUserFormRef.validate(async valid => {
          if (valid) {
              let that=this
              let api=""
              let msg=""
              if(this.dialogTitle==='编辑用户'){
                  api="api/admin/method/set.admin.item"
                  msg='编辑成功'
              }else if(this.dialogTitle==='添加用户'){
                  api="api/admin/method/add.admin.item"
                  msg='添加成功'
              }else if(this.dialogTitle==='修改密码'){
                  api="api/admin/method/reset.admin.item/"
                  msg='修改密码成功'
              }
              this.AxiosReturn(api,that.addUserForm).then(res=>{
                  console.log(res)
                  if(res.status==200){
                      that.$message.success(res.message)
                      this.addDialogVisible = false;
                      this.getUserList();
                  }else{
                    that.$message.warning(res.message)
                  }
              })
          } else {
            return false;
          }
      });
    },
    // 删除用户
    deleteFun(msg,id,index) {
         this.$confirm(`你确定要删除用户：${msg}吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let delArr=[]
          delArr.push(id)
          this.AxiosReturn('api/admin/method/del.admin.list',{client_id:delArr}).then(res=>{
            console.log(res)
            if(res.status===200){
                this.$message.success('删除成功!');
                this.tableData.splice(index,1)
            }else{
                this.$message.warning(res.message)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    isShelf(e, row, index) {
      // console.log(e,'e***************', row, index)
      let arrs = [];
      arrs.push(row.admin_id)
      // console.log(arrs,'arrs数组')
      this.axios
        .post("api/admin/method/set.admin.status/", {
          client_id: arrs,
          status: e 
        })
        .then(res => {
          if (res.data.status == 200) {

            if(e == 1){
                this.$message.success('启用成功');
            }else{
                this.$message.warning('禁用成功');
            }
            
            this.getUserList();
          }
        })
        .catch(err => {
          this.$message({
            type: "info",
            message: res.data.message
          });
        });
    },
    // 监听 pagesize改变的事件
    handleSizeChange(newSize) {
      this.pagesize = newSize;
      this.getUserList();
    },
    // 监听 页码值 改变事件
    handleCurrentChange(newSize) {
      this.pagenum = newSize;
      this.getUserList();
    }
  }
}
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