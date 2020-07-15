<template>
  <div>
    <el-card>
      <div id='myHeaderBox'>
          <el-input placeholder="请输入类别名称"  size="mini"  v-model="inputSearch"  @clear="resetFun" @keyup.enter.native="search" clearable ></el-input>
          <el-button type="info" icon="el-icon-refresh" size="mini"  v-if='isSearch' @click="resetFun"></el-button>
          <el-button type="success" @click="centerDialogVisible = true" size="mini">+ 新增产品类别</el-button>
      </div>
      <el-table :data="categoryData" border="" size="mini" stripe style=" margin-top: 15px;">
        <el-table-column label="类别名称" prop="type_name"></el-table-column>
        <el-table-column label="类别代码" prop="type_code"></el-table-column>
        <el-table-column label="操作" width="140">
          <template slot-scope="scope">
            <el-button style="padding: 3px;" type="primary" size="mini" icon="el-icon-edit" @click="confirmEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" style="padding:3px;" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
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
    <!-- 新增产品类别 -->
    <el-dialog title="新增产品类别" :visible.sync="centerDialogVisible" width="30%"  center>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" size="mini" class="demo-ruleForm">
        <el-form-item label="类别名称" prop="type_name">
          <el-input v-model="ruleForm.type_name"></el-input>
        </el-form-item>
        <el-form-item label="类别代码" prop="type_code">
          <el-input v-model="ruleForm.type_code"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 编辑 -->
    <el-dialog title="编辑产品分类" :visible.sync="dialogVisibleEdit" width="50%" center>
      <el-form :model="ruleFormEdit" :rules="rulesEdit" ref="ruleForm" label-width="100px" size="mini" class="demo-ruleForm" >
        <el-form-item label="类别名称" prop="type_name">
          <el-input v-model="ruleFormEdit.type_name" clearable></el-input>
        </el-form-item>
        <el-form-item label="类别代码" prop="category">
          <el-input v-model="ruleFormEdit.category" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitFormEdit('ruleForm')">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { AxiosReturn } from "../../assets/axios/index";
export default {
  name: "productCategory",
  data() {
    return {
      isSearch:"",
      centerDialogVisible: false,
      categoryData: [],
      pagenum: 1, //当前页数
      total: 0, //总数
      pagesize: 10, // 每页显示的条数
      ruleForm: {
        type_name: "",
        type_code: ""
      },
      rules: {
        type_name: [
          { required: true, message: "请输入产品类别名称", trigger: "blur" }
        ],
        type_code: [
          { required: true, message: "请输入产品类别代码", trigger: "blur" }
        ]
      },
      dialogVisibleEdit: false,
      typeNameListEdit: [],
      ruleFormEdit: {
        type_name: "", //类别名称
        category: "", //规格名称
        goods_type_id: 0
      },
      rulesEdit: {
        type_name: [
          { required: true, message: "请输入类别名称", trigger: "blur" }
        ],
        category: [{ required: true, message: "请填写类别", trigger: "blur" }]
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
        params.type_name=this.inputSearch
      }else{
        params.type_name=null
      }
      let that = this;
      this.AxiosReturn("goods_type/method/get.goods.type.list/",params).then(function(res) {
          console.log(res);
          if (res.status === 200) {
            // console.log(res.data.data.items);
            let result = res.data.items;
            that.categoryData = result;
            that.total = res.data.total_result;
          }
        }).catch(function(error) {
          console.log(error);
        });
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let that = this;
          this.AxiosReturn("goods_type/method/add.goods.type.item", {
              type_name: that.ruleForm.type_name,
              type_code: that.ruleForm.type_code
            })
            .then(function(res) {
              if (res.data.status === 200) {
                // console.log(res);
                that.centerDialogVisible = false;
                that.getCompanyList();
                that.ruleForm.type_name = "";
                that.ruleForm.type_code = "";
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
      this.$confirm(`确定要删除 ' ${index.type_name} ' 类别吗`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.AxiosReturn("goods_type/method/del.goods.type.list", {
            goods_type_id: index.goods_type_id
          }).then(res => {
            // console.log(res,1111111111111)
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
      // console.log(row);
      this.dialogVisibleEdit = true;
      this.ruleFormEdit.type_name = row.type_name;
      this.ruleFormEdit.category = row.type_code;
      this.ruleFormEdit.goods_type_id = row.goods_type_id;
    },
    // 编辑提交
    submitFormEdit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let that = this;
          this.AxiosReturn("goods_type/method/set.goods.type.item/", {
              goods_type_id: that.ruleFormEdit.goods_type_id,
              type_name: that.ruleFormEdit.type_name,
              type_code: that.ruleFormEdit.category
            })
            .then(function(res) {
              if (res.status === 200) {
                // console.log(res);
                that.$message({
                  message: res.message,
                  type: "success"
                });
                that.dialogVisibleEdit = false;
                that.getCompanyList();
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

<style scoped>
</style>
