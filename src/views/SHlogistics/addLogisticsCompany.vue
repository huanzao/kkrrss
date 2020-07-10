<template>
    <div>
    <el-card>
      <div id='myHeaderBox'>
          <el-input placeholder="请输入快递公司名称"  size="mini"  v-model="inputSearch"  @clear="resetFun" @keyup.enter.native="search" clearable ></el-input>
          <el-button type="primary" size="mini" icon="el-icon-search" @click="search">搜索</el-button>
          <el-button type="info" icon="el-icon-refresh" size="mini" v-if='isSearch' @click="resetFun"></el-button>
          <el-button type="success" @click="centerDialogVisible = true" size="mini">新增快递公司</el-button>
      </div>
      <el-table :data="categoryData" border="" size="mini" stripe style=" margin-top: 15px;" >
        <el-table-column label="快递公司编号" prop="delivery_item_id"></el-table-column>
        <el-table-column label="快递公司名称" prop="name"></el-table-column>
        <el-table-column label="快递公司编码" prop="code"></el-table-column>
         <el-table-column label="快递KEY编码" prop="wl_code"></el-table-column>
         <el-table-column  label="快递公司类型">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type ==0" type="primary" size="mini">热门 </el-tag>
            <el-tag v-else-if="scope.row.type ==1" type="success" size="mini">国内</el-tag>
            <el-tag v-else-if="scope.row.type ==2" type="warning" size="mini">国外</el-tag>
            <el-tag v-else-if="scope.row.type ==3" type="danger" size="mini">转运</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="140">
          <template slot-scope="scope">
            <el-button style="padding: 3px;"  type="primary"  size="mini" icon="el-icon-edit" @click="confirmEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" style="padding:3px;" icon="el-icon-delete" @click="handleDelete(scope.row)" >删除</el-button>
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
    <!-- 新增快递公司 -->
    <el-dialog title="新增快递公司" :visible.sync="centerDialogVisible" width="30%"  center @close="addDialogClosed">
      <el-form :model="ruleForm" :rules="rules"   ref="ruleForm"  label-width="100px" size="mini"  class="demo-ruleForm">

        <el-form-item label="公司名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>

        <el-form-item label="公司编码" prop="code">
          <el-input v-model="ruleForm.code"></el-input>
        </el-form-item >

        <el-form-item label="KEY编码" prop="wl_code">
          <el-input v-model="ruleForm.wl_code"></el-input>
        </el-form-item >

         <el-form-item label="公司类型" prop="type">
          <el-select placeholder="请选择快递公司类型 " size="mini" v-model="ruleForm.type" clearable @clear="getCompanyList"  >
            <el-option v-for="items in typeOption" :key="items.value" :label="items.label" :value="items.value" ></el-option>
          </el-select>
        </el-form-item >

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>
    <!-- 编辑快递公司信息 -->
    <el-dialog title="编辑快递公司信息" :visible.sync="dialogVisibleEdit" width="30%" center>
      <el-form :model="ruleFormEdit" :rules="rulesEdit" ref="ruleFormEdit" label-width="100px" size="mini" class="demo-ruleForm">
          <el-form-item label="公司名称" prop="name">
          <el-input v-model="ruleFormEdit.name"></el-input>
        </el-form-item>

        <el-form-item label="公司编码" prop="code">
          <el-input v-model="ruleFormEdit.code"></el-input>
        </el-form-item >

        <el-form-item label="KEY编码" prop="wl_code">
          <el-input v-model="ruleFormEdit.wl_code"></el-input>
        </el-form-item >

         <el-form-item label="公司类型" prop="type">
          <el-select placeholder="请选择快递公司类型 " size="mini" v-model="ruleFormEdit.type" clearable @clear="getCompanyList"  >
            <el-option v-for="items in typeOption" :key="items.value" :label="items.label" :value="items.value" ></el-option>
          </el-select>
        </el-form-item >
        <el-form-item style="text-align: center;margin-right: 100px;">
          <el-button type="primary" @click="submitFormEdit('ruleFormEdit')">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { AxiosReturn } from "../../assets/axios/index";
export default {
  name: "addLogisticsCompany",
  data() {
    return {
      isSearch:false,
      centerDialogVisible: false,
      categoryData: [],
      pagenum: 1, //当前页数
      total: 0, //总数
      pagesize: 10, // 每页显示的条数
      ruleForm: {
        name : "",
        code : "",
        wl_code  :"",
        type :null,
      },
      rules: {
        name: [
          { required: true, message: "请输入快递公司名称", trigger: "blur" }
        ],
        code: [
          { required: true, message: "请输入快递公司编码", trigger: "blur" }
        ],
        wl_code: [
          { required: true, message: "请输入快递公司key", trigger: "blur" }
        ],
        type:[{ required: true, message: "请输入快递公司类型", trigger: "change" }]

      },
      // 快递公司类型
      typeOption: [
        {
          value: 0,
          label: "热门"
        },
        {
          value: 1,
          label: "国内"
        },
        {
          value: 2,
          label: "国外"
        },
        {
          value: 3,
          label: "转运"
        }
      ],
      dialogVisibleEdit: false,
      typeNameListEdit: [],
      ruleFormEdit: {
        name : "",
        code : "",
        wl_code  :"",
        type :null,
        delivery_item_id:null
      },
      rulesEdit: {
        name: [
          { required: true, message: "请输入快递公司名称", trigger: "blur" }
        ],
        code: [
          { required: true, message: "请输入快递公司编码", trigger: "blur" }
        ],
        wl_code: [
          { required: true, message: "请输入快递公司key", trigger: "blur" }
        ],
        type:[{ required: true, message: "请输入快递公司类型", trigger: "change" }]
      },
      inputSearch: ""
    };
  },
   created: function() {
    this.getCompanyList();
  },
  methods: {
    AxiosReturn,
    resetFun(){
        this.pagesize=10
        this.pagenum=1
        this.isSearch=false
        this.inputSearch=null
        this.getCompanyList()
    },
    search(){
        this.pagesize=10
        this.pagenum=1
        this.isSearch=true
        this.getCompanyList()
    },
    getCompanyList() {
      let params={
          page_size: this.pagesize, //每页条数
          page_no: this.pagenum //翻页页数
      }
      if(this.isSearch){
        params.name=this.inputSearch
      }else{
        params.name=null
      }
      let that = this;
      this.axios.post("delivery_item/method/get.delivery.company.list/",params).then(function(res) {
          console.log(res);
          if (res.data.status === 200) {
            let result = res.data.data.items;
            that.categoryData = result;
            that.total = res.data.data.total_result;
          }
        }).catch(function(error) {
          console.log(error);
        });
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let that = this;
          this.axios
            .post("delivery_item/method/add.delivery.company.item/", {
              name : that.ruleForm.name,
              code : that.ruleForm.code,
              wl_code :that.ruleForm.wl_code,
              type :that.ruleForm.type,
            })
            .then(function(res) {
              if (res.data.status === 200) {
                // console.log(res);
                that.centerDialogVisible = false;
                that.getCompanyList();
                that.ruleForm.name = "";
                that.ruleForm.code = "";
                that.ruleForm.wl_code = "";
                that.resetFun.type = '';
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        } else {
          return false;
        }
      });
    },
    // 删除
    handleDelete(index) {
        var arr=[]
        arr.push(index.delivery_item_id)
      this.$confirm(`确定要删除' ${index.name} '快递公司吗`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.AxiosReturn("delivery_item/method/del.delivery.company.list/", {
            delivery_item_id :arr
          }).then(res => {
              console.log(res)
            if (res.status === 200) {
                this.$message({
                    type: "success",
                    message: res.message
                });
                this.getCompanyList();
            } else if (res.status === 500) {
                this.$message({
                    type: "info",
                    message: res.message
                });
            }else{
                this.$message({
                    type: "error",
                    message: '删除失败'
                });

            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 编辑弹框
    confirmEdit(row) {
      console.log(row);
      this.dialogVisibleEdit = true;
      this.ruleFormEdit.name = row.name;
      this.ruleFormEdit.code = row.code;
      this.ruleFormEdit.wl_code = row.wl_code;
      this.ruleFormEdit.type = row.type;
      this.ruleFormEdit.delivery_item_id = row.delivery_item_id;
    },
    // 编辑提交
    submitFormEdit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let that = this;
          this.axios
            .post("delivery_item/method/set.delivery.company.item/", {
              delivery_item_id: that.ruleFormEdit.delivery_item_id,
              name: that.ruleFormEdit.name,
              code: that.ruleFormEdit.code,
              wl_code :that.ruleFormEdit.wl_code ,
              type :that.ruleFormEdit.type ,

            })
            .then(function(res) {
              if (res.data.status === 200) {
                // console.log(res);
                that.$message({
                  message: res.data.message,
                  type: "success"
                });
                that.dialogVisibleEdit = false;
                that.getCompanyList();
                
              }else if(res.data.status === 500){
                   that.$message({
                    message: res.data.message,
                    type: "warnig"
                  });

              }else{
                  that.$message({
                    message: '提交失败',
                    type: "error"
                  });
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        } else {
          return false;
        }
      });
    },
    // 监听 添加对话框的关闭事件 ---清空form表单
    addDialogClosed() {
      this.$refs.ruleForm.resetFields();
    },
    // 分页
    handleSizeChange(val) {
      this.pagesize = val;
      this.getCompanyList();
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getCompanyList();
    },
  },
  mounted() {}
};
</script>

<style>
.el-dialog {
  width: 50% !important;
}
</style>
