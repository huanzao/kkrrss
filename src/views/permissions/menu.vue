<template>
  <div>
    <el-card>
      <el-row>
        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
          <el-select size="mini" v-model="tobMadel" @change="modelChange">
              <el-option value="api" label="api"></el-option>
              <el-option value="home" disabled label="home"></el-option>
              <el-option value="admin" label="admin"></el-option>
          </el-select>
        </el-col>
        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
          <el-button type="primary" @click="addMenu"  size="mini">添加一级菜单</el-button>
        </el-col>
      </el-row>     
      <el-row style="margin-top:15px;">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-table v-if="isTodo" :data="tableData"  row-key="menu_id" lazy  :load="load" :tree-props="{children: 'children', hasChildren: 'hasChildren'}"   >
            <el-table-column label="菜单名称" prop="name"></el-table-column>
            <el-table-column label="模块" prop="module"></el-table-column>
            <el-table-column label="URL" prop='url'></el-table-column>
            <el-table-column label="状态" width="80" class="shitchBox">
                <template slot-scope="scope">
                  <el-switch  class="switchStyle" v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949"  
                      active-value="1" active-text="启用" inactive-value="0" inactive-text="禁用"
                      @change="switchChange($event,scope.$index,scope.row)"
                      >
                  </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="240">
              <template slot-scope="scope">
                <el-button  style="padding: 3px 7px;" type="warning" icon="el-icon-edit" size="mini" @click="EditMenu(scope.$index,scope.row)">编辑</el-button>
                <el-button  style="padding: 3px 7px;" type="danger" icon="el-icon-edit" size="mini" @click="DelMenu(scope.$index,scope.row)">刪除</el-button>
                <el-button  v-if="scope.row.parent_id==0" style="padding: 3px 7px;" type="primary" icon="el-icon-edit" size="mini" @click="addMenu(scope.$index,scope.row)">添加</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-card>
    <el-dialog :title="dialogTitle" :visible.sync="dialogMenuShow" label-width="200px" center @close="formReset">
      <el-form :model="form" :rules="rules" ref="ruleForm" >
        <el-form-item label="菜单上级编号"   label-width="120px">
          <el-input v-if="dialogTitle=='添加一级菜单'||dialogTitle=='编辑一级菜单'" placeholder="一级菜单没有上级" disabled size="mini" style="width:50%" ></el-input>
          <el-select size="mini" v-model="form.parent_id" v-else style="width: 50%;" disabled>
            <el-option v-for="men in MenuSelectArr" :key='men.menu_id' :label="men.name" :value="men.menu_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单名称"  label-width="120px" prop="name" >
          <el-input size="mini" style="width:50%" v-model="form.name" ></el-input>
        </el-form-item>
        <el-form-item label="菜单别名"  label-width="120px" >
          <el-input size="mini" style="width:50%" v-model="form.alias" ></el-input>
        </el-form-item>
        <el-form-item label="菜单图标"  label-width="120px" >
          <el-input size="mini" style="width:50%" v-model="form.icon" ></el-input>
        </el-form-item>
        <el-form-item label="菜单备注"  label-width="120px" >
          <el-input size="mini" style="width:50%" v-model="form.remark" ></el-input>
        </el-form-item>
        <el-form-item label="所属模块"   label-width="120px" prop="module" >
          <el-select size="mini" v-model="form.module" disabled style="width:50%">
            <el-option value="admin"></el-option>
            <el-option value="home"></el-option>
            <el-option value="api"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="链接类型"  label-width="120px" prop="type" >
          <template>
            <el-radio v-model="form.type" label="0">模块</el-radio>
            <el-radio v-model="form.type" label="1">外链</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="状态"  label-width="120px" prop="type" >
          <template>
            <el-radio v-model="form.status" label="0">禁用</el-radio>
            <el-radio v-model="form.status" label="1">启用</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="链接地址"  label-width="120px" >
          <el-input size="mini" style="width:50%" v-model="form.url" ></el-input>
        </el-form-item>
        <el-form-item label="导航菜单"  label-width="120px" >
          <template>
            <el-radio v-model="form.is_navi" label="0">是</el-radio>
            <el-radio v-model="form.is_navi" label="1">否</el-radio>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogMenuShow = false" size="mini">取 消</el-button>
        <el-button type="primary"  @click="submitForm('ruleForm')" size="mini">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {AxiosReturn} from '../../assets/axios/index'
export default {
  name: "quanxian",
  data() {
    return {
      tobMadel:"admin",
      tableData:[],
      isTodo:true,
      MenuSelectArr:[],
      dialogTitle:"",
      dialogMenuShow:false,
      form: {
          parent_id:"",
          name:'',
          alias:'',
          icon :'',
          remark: '',
          module: '',
          type:'0',
          url:'',
          params:'',
          target:'_self',
          is_navi:'1',
          sort:'',
          status:'1',
      },
      rules:{
        name:{ required: true, message: '请输入菜单名称', trigger: 'blur' },
        module :{ required: true, message: '请选择所属模块', trigger: 'blur' },
        type:{ required: true, message: '请选链接类型', trigger: 'change' },
      }
    }
  },
  created(){
    this.getList()
  },
  methods: {
    AxiosReturn,
    switchChange(e,index,row){
        if(row.parent_id==0){
            this.isTodo=false
        }
        this.AxiosReturn('menu/method/set.menu.status',{menu_id:row.menu_id,status:e}).then(res=>{
            if(res.status==200){
                if(e==1){
                  this.$message.success('启用成功')
                }else{
                  this.$message.warning('禁用成功')
                }
            }else{
              this.$message.warning(res.message)
            }
            if(!this.isTodo){
              this.isTodo=true     
            }
        })
    },
    load(tree, treeNode, resolve){
      this.AxiosReturn('menu/method/get.parent.item',{module:this.tobMadel,parent_id:tree.menu_id},true).then(res=>{
          if(res.data){
            resolve(res.data.map(itm=>{
              itm.status=itm.status.toString()
              return itm
            }))
          }else{
            resolve([])
            this.$message('下级暂无数据')
          }
      })
    },
    addMenu(index,row){
          this.form.name='',
          this.form.alias='',
          this.form.icon ='',
          this.form.remark= '',
          this.form.type='0',
          this.form.url='',
          this.form.params='',
          this.form.target='_self',
          this.form.is_navi='1',
          this.form.sort='',
          this.form.status='1',
        this.form.module=this.tobMadel
        if(row){
            this.dialogTitle='添加子菜单'
            this.form.parent_id=row.menu_id
        }else{
            this.dialogTitle='添加一级菜单'
            this.form.parent_id=0
        }
        this.dialogMenuShow=true
    },
    EditMenu(index,row){
        if(row.parent_id==0){
            this.dialogTitle='编辑一级菜单'
        }else{
            this.dialogTitle='编辑子菜单'
        }
        this.form.parent_id=row.parent_id
        this.form.menu_id=row.menu_id
        this.form.name=row.name
        this.form.alias=row.alias
        this.form.icon=row.icon
        this.form.remark=row.remark
        this.form.module=row.module
        this.form.type=row.type.toString()
   
        this.form.url=row.url
        this.form.params=row.params
        this.form.target=row.target
        this.form.is_navi=row.is_navi.toString()
        this.form.sort=row.sort
        this.form.status=row.status.toString()
        this.dialogMenuShow=true
    },
    DelMenu(index,row){
        if(row.parent_id==0){
            this.$confirm(`此操作将刪除${row.name}及其子菜单, 是否继续?`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
                this.AxiosReturn('menu/method/del.menu.item/',{menu_id:row.menu_id}).then(res=>{
                  if(res.status==200){
                    this.$message.success('删除成功')
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
        }else{
            this.isTodo=false
            this.AxiosReturn('menu/method/del.menu.item/',{menu_id:row.menu_id}).then(res=>{
              if(res.status==200){
                this.$message.success('删除成功')
              }else{
                  this.$message.warning(res.message)
              }
              this.isTodo=true
            })
        }
    },
    modelChange(){
      this.getList()
    },
    getList(){
      this.AxiosReturn('menu/method/get.parent.item',{module:this.tobMadel,parent_id:0}).then(res=>{
        this.MenuSelectArr=res.data
        this.tableData=res.data.map(item=>{
          item.status=item.status.toString()
          if(item.children_total==0){
              item.hasChildren=false
          }else{
              item.hasChildren=true
          }
          return item
        })
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let that=this
          this.isTodo=false
          if(this.dialogTitle=='添加子菜单'||this.dialogTitle=='添加一级菜单'){
              this.AxiosReturn('menu/method/add.menu.item',this.form).then(res=>{
                if(res.status==200){
                  this.$message.success('添加成功')
                  this.dialogMenuShow=false
                  that.getList()
                  this.isTodo=true
                }else{
                  this.$message.warning(res.message)
                  this.isTodo=true
                }
              })
          }else{
              this.AxiosReturn('menu/method/set.menu.item',this.form).then(res=>{
                if(res.status==200){
                  this.$message.success('修改成功')
                  this.dialogMenuShow=false
                  this.isTodo=true
                }else{
                  this.$message.warning(res.message)
                  this.isTodo=true
                }
              })
          }
        } else {
          return false;
        }
      });
    },
    formReset(){
      this.$nextTick(()=>{
          this.$refs.ruleForm.resetFields();
      }) 
        
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