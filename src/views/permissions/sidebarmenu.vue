<template>
  <div>
    <el-card>
      <el-row>
        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
            <el-select size="mini" v-model="roleVal" @change="roleChange">
                <el-option v-for="r in RoleArr" :key="r.group_id" :value="r.group_id" :label="r.name"></el-option>
            </el-select>
        </el-col>
      </el-row>     
      <el-row style="margin-top:15px;">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-table :data="tableData"  row-key="menu_id" lazy  :load="load" :tree-props="{children: 'children', hasChildren: 'hasChildren'}"   >
            <el-table-column label="菜单名称" prop="name"></el-table-column>
            <el-table-column label="模块" prop="module"></el-table-column>
            <el-table-column label="URL" prop='url'></el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-card>
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
      RoleArr:[],
      roleVal:"",
    }
  },
  created(){
    this.AxiosReturn('auth_group/method/get.auth.group.list',{page_size:100,page_no:1}).then(res=>{
          this.RoleArr=res.data.items
          console.log('--------',this.RoleArr)
      })
  },
  methods: {
    AxiosReturn,
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
    roleChange(){
        this.AxiosReturn('menu/method/get.menu.auth.list',{module:this.tobMadel}).then(res=>{
          console.log(res)
          this.tableData=res.data.map(item=>{
            if(item.children_total==0){
                item.hasChildren=false
            }else{
                item.hasChildren=true
            }
            return item
          })
          console.log(this.tableData)
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