<template>
  <div>
    <el-card>
      <div id="myHeaderBox">
          <el-select v-model="goodsTypeId" size="mini" clearable filterable  @clear="resetFun" @change="search"  placeholder="请选择类别名称" >
            <el-option v-for="item in typeNameListSearch" :key="item.goods_type_id" :label="item.type_name" :value="item.goods_type_id"></el-option>
          </el-select>
          <el-button type="info" icon="el-icon-refresh" size="mini"  v-if='isSearch' @click="resetFun"></el-button>
          <el-button type="success " size="mini" @click="AddListRow">新增产品分类</el-button>
      </div>
      <el-table :data="tableData"  border=""   style="width:100%;margin-top: 15px;"  stripe  class="tb-edit"  highlight-current-row size="mini">
        <el-table-column width="40" type="index"></el-table-column>
        <!-- <el-table-column label="类别代码" width="100">
          <template slot-scope="scope">{{scope.row.spec_id}}</template>
        </el-table-column>-->
        <el-table-column label="类别名称" prop="get_goods_type.type_name" ></el-table-column>
        <el-table-column label="规格名称" prop="name"></el-table-column>
        <el-table-column label="规格类型">
          <template slot-scope="scope">
            <span v-for="(lay,l) in scope.row.spec_item" :key="l">{{ lay }} </span>
            
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template slot-scope="scope">
            <el-button
              style="padding: 3px;"
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="confirmEdit(scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              style="padding:3px;"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
            >删除</el-button>
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
      <!--  新增产品分类  弹框-->
      <el-dialog title="新增产品分类" :visible.sync="centerDialogVisible" width="30%" center>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          size="mini"
          class="demo-ruleForm"
        >
          <el-form-item label="类别名称" prop="type_name">
            <el-select v-model="ruleForm.type_name " clearable placeholder="请选择活类别名称">
              <el-option
                v-for="item in typeNameList"
                :key="item.goods_type_id"
                :label="item.type_name"
                :value="item.goods_type_id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="规格名称" prop="category">
            <el-input v-model="ruleForm.category"></el-input>
          </el-form-item>
          <el-form-item label="规格类型" prop="dynamicTags">
            <el-tag
              :key="tag"
              v-for="tag in dynamicTags"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)"
            >{{tag}}</el-tag>
            <el-input
              class="input-new-tag"
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            ></el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">
              <span>+ 规格类型</span>
            </el-button>
          </el-form-item>
          <el-form-item label="温馨提示">
            <span style="color:#f56c6c">( 规格类型输入值不能重复 )</span>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 编辑 -->
      <el-dialog title="编辑产品分类" :visible.sync="dialogVisibleEdit" width="50%" center>
        <el-form
          :model="ruleFormEdit"
          :rules="rulesEdit"
          ref="ruleForm"
          label-width="100px"
          size="mini"
          class="demo-ruleForm"
        >
          <el-form-item label="类别名称" prop="type_name">
            <el-select v-model="ruleFormEdit.type_name " clearable placeholder="请选择活类别名称">
              <el-option
                v-for="item in typeNameListEdit"
                :key="item.goods_type_id"
                :label="item.type_name"
                :value="item.goods_type_id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="规格名称" prop="category">
            <el-input v-model="ruleFormEdit.category" clearable></el-input>
          </el-form-item>
          <el-form-item label="规格类型" prop="dynamicTagsEdit">
            <el-tag
              :key="tag"
              v-for="tag in dynamicTagsEdit"
              closable
              :disable-transitions="false"
              @close="handleCloseEdit(tag)"
            >{{tag}}</el-tag>
            <el-input
              class="input-new-tag"
              v-if="inputVisibleEdit"
              v-model="inputValueEdit"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirmEdit"
              @blur="handleInputConfirmEdit"
            ></el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInputEdit">
              <span>+ 规格类型</span>
            </el-button>
          </el-form-item>
          <el-form-item label="温馨提示">
            <span style="color:#f56c6c">( 规格类型输入值不能重复 )</span>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitFormEdit('ruleForm')">提交</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { AxiosReturn } from "../../assets/axios/index";
export default {
  name: "fenlei",
  data() {
    return {
      isSearch:false,
      typeNameListSearch: [],
      goodsTypeId: '',
      tableData: [],
      spec_item: [],
      edit: false,
      pagenum: 1, //当前页数
      total: 0, //总数
      pagesize: 10, // 每页显示的条数
      centerDialogVisible: false,
      ruleForm: {
        type_name: "", //类别名称
        category: "" //规格名称
      },
      rules: {
        type_name: [
          { required: true, message: "请输入类别名称", trigger: "change" }
        ],
        category: [{ required: true, message: "请填写类别", trigger: "blur" }]
      },
      dynamicTags: [], //规格类型
      inputVisible: false,
      inputValue: "",
      typeNameList: [],
      ruleFormEdit: {
        type_name: "", //类别名称
        category: "" //规格名称
      },
      rulesEdit: {
        type_name: [
          { required: true, message: "请输入类别名称", trigger: "change" }
        ],
        category: [{ required: true, message: "请填写类别", trigger: "blur" }]
      },
      dialogVisibleEdit: false, //编辑弹框
      dynamicTagsEdit: [],
      inputVisibleEdit: false,
      inputValueEdit: "",
      typeNameListEdit: [],
      spec_id: 0,
      goods_type_id: 0
    };
  },
  created: function() {
    this.getList();
    this.getSelect();
  },
  methods: {
     AxiosReturn,
    // 获取所有列表
    getList() {
      let that = this;
      this.AxiosReturn("spec/method/get.goods.spec.page/", {
          page_size: this.pagesize, //每页条数
          page_no: this.pagenum //翻页页数
        }).then(function(res) {
          // console.log(res)
          if (res.status === 200) {
            console.log(res.data);
            that.tableData = res.data.items;
            that.total = res.data.total_result;
            // console.log(that.tableData);
            for (var l = 0; l < that.tableData.length; l++) {
              that.spec_item = that.tableData[l].spec_item;
              // 逗号分割数组
              // var str = that.spec_item.join("，");
              // that.spec_item = str;
              // console.log(that.spec_item);
            }
          }
        }).catch(function(error) {
          console.log(error);
        });
    },
     // 搜索
    search() {
      this.isSearch=true
      let that = this;
      this.AxiosReturn("spec/method/get.goods.spec.page/", {
          page_size: that.pagesize, //每页条数
          page_no: that.pagenum, //翻页页数
          goods_type_id: that.goodsTypeId
        }).then(function(res) {
          if (res.status === 200) {
            console.log(res);
            that.tableData = res.data.items;
            that.total = res.data.total_result;
          }
          for (var l = 0; l < that.tableData.length; l++) {
            that.spec_item = that.tableData[l].spec_item;
          }
        }).catch(function(error) {
          console.log(error);
        });
    },
    resetFun(){
        this.pagesize=10
        this.pagenum=1
        this.goodsTypeId=""
        this.isSearch=false
        this.getList()
    },
    // 分页
    handleSizeChange(val) {
      this.pagesize = val;
      if(this.isSearch){
          this.search()
      }else{
        this.getList();
      }
      
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      if(this.isSearch){
          this.search()
      }else{
        this.getList();
      }
    },
    getSelect() {
      let that = this;
      this.AxiosReturn("goods_type/method/get.goods.type.select", {}).then(function(res) {
          if (res.status === 200) {
            console.log('---------------',res);
            that.typeNameListSearch = res.data;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    // tag 新增规格类型
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
        // console.log(this.dynamicTags);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    // 新增产品分类
    AddListRow() {
      this.centerDialogVisible = true;
      let that = this;
      this.AxiosReturn("goods_type/method/get.goods.type.select", {})
        .then(function(res) {
          if (res.status === 200) {
            // console.log(res);
            that.typeNameList = res.data;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    // 提交新增产品分类
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let that = this;
          this.AxiosReturn("spec/method/add.goods.spec.item/", {
              goods_type_id: that.ruleForm.type_name,
              name: that.ruleForm.category,
              spec_item: that.dynamicTags
            })
            .then(function(res) {
              if (res.status === 200) {
                // console.log(res);
                that.$message({
                  message: res.message,
                  type: "success"
                });
                that.getList();
                that.centerDialogVisible = false;
                that.ruleForm.type_name = "";
                that.ruleForm.category = "";
                that.dynamicTags = [];
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
      // console.log(index)
      this.$confirm(`确定要删除 ' ${index.get_goods_type.type_name} -- ${index.name} ' 规格类型吗`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.AxiosReturn("spec/method/del.goods.spec.list/", {
            spec_id: index.spec_id
          }).then(res => {
            // console.log(res,1111111111111)
            if (res.status === 200) {
              this.$message({
                type: "success",
                message: res.message
              });
              this.getList();
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
      this.ruleFormEdit.type_name = row.get_goods_type.type_name;
      this.ruleFormEdit.category = row.name;
      this.dynamicTagsEdit = row.spec_item;
      this.spec_id = row.spec_id;
      this.goods_type_id = row.goods_type_id;
      let that = this;
      this.AxiosReturn("goods_type/method/get.goods.type.select", {})
        .then(function(res) {
          if (res.data.status === 200) {
            that.typeNameListEdit = res.data;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    
    // 编辑弹框内容
    handleCloseEdit(tag) {
      this.dynamicTagsEdit.splice(this.dynamicTagsEdit.indexOf(tag), 1);
    },
    showInputEdit() {
      this.inputVisibleEdit = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirmEdit() {
      let inputValue = this.inputValueEdit;
      if (inputValue) {
        this.dynamicTagsEdit.push(inputValue);
      }
      this.inputVisibleEdit = false;
      this.inputValueEdit = "";
    },
    // 编辑提交
    submitFormEdit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let that = this;
          this.AxiosReturn("spec/method/set.goods.spec.item/", {
              goods_type_id: that.goods_type_id,
              name: that.ruleFormEdit.category,
              spec_item: that.dynamicTagsEdit,
              spec_id: that.spec_id
            }).then(function(res) {
              if (res.status === 200) {
                console.log(res);
                that.$message({
                  message: res.message,
                  type: "success"
                });
                that.dialogVisibleEdit = false;
                that.getList();
                that.ruleForm.type_name = "";
                that.ruleForm.category = "";
                that.dynamicTags = [];
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
  }
};
</script>

<style scoped>
/* .edit-input {
  padding-right: 100px;
} */
/* .cancel-btn {
  position: absolute;
  right: 5px;
  top: 10px;
} */
.tb-edit .el-input {
  display: none;
}
.tb-edit .current-row .el-input {
  display: block;
}
.tb-edit .current-row .el-input + span {
  display: none;
}
</style>
<style>
.el-table-add-row {
  margin-top: 10px;
  width: 100%;
  height: 34px;
  border: 1px dashed #c1c1cd;
  border-radius: 3px;
  cursor: pointer;
  justify-content: center;
  display: flex;
  line-height: 34px;
}

.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  /* margin-left: 10px; */
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>


