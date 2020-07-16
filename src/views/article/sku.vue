<template>
  <div>
    <el-card>
      <div id="myHeaderBox">
          <el-input placeholder="请输入产品名称" size="mini" v-model="searchForm.product_name"   @keyup.enter.native="searchFun"  clearable ></el-input>
          <el-input placeholder="请输入产品SKU" size="mini" v-model="searchForm.product_sku"  @keyup.enter.native="searchFun"  clearable ></el-input>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="searchFun">搜索</el-button>
          <el-button type="info" icon="el-icon-refresh" size="mini" v-if='isSearch'  @click="resetFun"></el-button>
          <el-button type="success" @click="centerDialogVisible = true" size="mini">新增赠品SKU</el-button>
      </div>
      <el-table :data="skudataList" border="" size="mini" stripe style=" margin-top: 15px;">
        <el-table-column label="SKU-ID" prop="product_sku_id" width="100px"></el-table-column>
        <el-table-column label="产品ID">
          <template slot-scope="scope">
            <div v-if="scope.row.goods_code == '' || scope.row.goods_code == null">
                赠品
            </div>
            <div v-else>
                {{scope.row.goods_code}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="产品名称" prop="product_name" ></el-table-column>
        <el-table-column label="SKU" prop="product_sku" width="120px"></el-table-column>
        <el-table-column label="中文规格" prop="sku_value" width="260px"></el-table-column>
        <!-- <el-table-column label="厂家SKU" prop="changjiasku" width="120px"></el-table-column> -->
        <el-table-column label="进货价格" prop="price" width="90px"></el-table-column>
        <el-table-column label="单位" prop="product_unit" width="80px"></el-table-column>
        <el-table-column label="库存" prop="store_qty" width="80px"></el-table-column>
        <el-table-column label="预警值" prop="warning" ></el-table-column>
        <el-table-column label="累计修改值" prop="cumulative" ></el-table-column>
        <el-table-column label="备注" prop="product_remarks" ></el-table-column>
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
    <!--  新增赠品SKU  弹框-->
    <el-dialog title="新增赠品SKU" :visible.sync="centerDialogVisible" width="50%" center  @close="addDialogClosed">
      <el-form  :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" >
        <!-- <el-form-item label="产品ID" prop="proid">
          <el-input v-model="ruleForm.proid" :disabled="true" size="mini"></el-input>
        </el-form-item> -->
        <el-form-item label="产品名称" prop="proname">
          <el-input v-model="ruleForm.proname" placeholder="请输入产品名称" size="mini"  clearable></el-input>
        </el-form-item>
        <el-form-item label="SKU" prop="prosku">
          <el-input v-model="ruleForm.prosku" @blur="isOnly" clearable placeholder="请输入SKU" size="mini"> </el-input>
        </el-form-item>
        <el-form-item label="中文规格" prop="prochina">
          <el-input v-model="ruleForm.prochina" placeholder="请输入中文规格" clearable size="mini"></el-input>
        </el-form-item>
        <el-form-item label="厂家SKU" prop="storeSku">
          <el-input v-model="ruleForm.storeSku" placeholder="请输入厂家SKU" clearable size="mini"></el-input>
        </el-form-item>
        <el-form-item label="进货价格" prop="price">
          <el-input v-model="ruleForm.price" placeholder="请输入进货价格" clearable size="mini"></el-input>
        </el-form-item>
        <el-form-item label="单位" prop="productUnit">
          <el-input v-model="ruleForm.productUnit" placeholder="请输入产品计量单位" clearable size="mini"></el-input>
        </el-form-item>
        <el-form-item label="库存" prop="storeQty">
          <el-input v-model="ruleForm.storeQty" placeholder="请输入库存" clearable size="mini"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input type="textarea" v-model="ruleForm.remarks" placeholder="请输入备注" clearable size="mini"></el-input>
        </el-form-item>
        <el-form-item style="text-align: center; margin-right: 100px;">
          <el-button @click="centerDialogVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="send('ruleForm')" size="mini">立即创建</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { AxiosReturn } from "../../assets/axios/index"

export default {
  name: "Sku",
  data() {
    return {
      isSearch:false,
      searchForm:{ //搜索
          product_name:"",
          product_sku:""
      },
      skudataList: [],
      centerDialogVisible: false,
      pagenum: 1, //当前页数
      pagesize: 10, // 每页显示的条数
      total: 0, //总数
      ruleForm: {
        proname: "",
        prosku: "",
        prochina: "",
        storeSku: "",
        price: "",
        productUnit: "",
        storeQty: "",
        proid: "000000", //产品id
        remarks: "" //备注
      },
      rules: {
        proname: [
          { required: true, message: "请输入产品名称", trigger: "blur" }
        ],
        prosku: [{ required: true, message: "请输入SKU", trigger: "blur" }],
        prochina: [
          { required: true, message: "请输入中文规格", trigger: "blur" }
        ],
        storeSku: [
          { required: true, message: "请输入厂家SKU", trigger: "blur" }
        ],
        storeQty: [{ required: true, message: "请输入库存", trigger: "blur" }],
        price: [{ required: true, message: "请输入进货价格", trigger: "blur" }],
        productUnit: [
          { required: true, message: "请输入产品计量单位", trigger: "blur" }
        ],
        productUnit: [
          { required: true, message: "请输入库存", trigger: "blur" }
        ],
        remarks: [
          { required: true, message: "请输入备注", trigger: "blur" }
        ]
      }
    };
  },
  created: function() {
    this.getTableList();
  },
  methods: {
    AxiosReturn,
    getTableList(){
        let myparams={}
        let that=this
        if(this.isSearch==true){
          myparams=this.searchForm
          myparams.page_size=this.pagesize
          myparams.page_no=this.pagenum
        }else{
          myparams={
            page_size:this.pagesize,
            page_no:this.pagenum,
          }
        }
        this.AxiosReturn('productSku/method/get.sku.list',myparams).then(res=>{
            if (res.status === 200) {
              let result = res.data.items;
              that.skudataList = result;
              that.total = res.data.total_result;
            }else{
              that.$message.warning(res.message) 
            }
        })
    },
    searchFun(){
      this.pagesize=10
      this.pagenum=1
      this.isSearch=true
      this.getTableList()
    },
    resetFun(){
      this.searchForm.product_name=""
      this.searchForm.product_sku=""
      this.pagesize=10
      this.pagenum=1
      this.isSearch=false
      this.getTableList() 
    },
    // 分页
    handleSizeChange(val) {
      this.pagesize = val;
      this.getTableList();
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getTableList();
    },
    send(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let that = this;
          this.AxiosReturn("productSku/method/add.product.sku.item", {
              product_id: this.ruleForm.proid,
              product_name: this.ruleForm.proname,
              product_sku: this.ruleForm.prosku,
              sku_value: this.ruleForm.prochina,
              store_sku: this.ruleForm.storeSku,
              price: this.ruleForm.price,
              product_unit: this.ruleForm.productUnit,
              store_qty: this.ruleForm.storeQty,
              product_remarks: this.ruleForm.remarks
            }).then(function(res) {
              if (res.status === 200) {
                that.$message({
                  message: res.message,
                  type: "success",
                  duration: 3000
                });
                that.centerDialogVisible = false;
                that.getTableList();
              } else {
                if (res.status != 200) {
                  that.$message({
                    message: res.message,
                    type: "warning",
                    duration: 3000
                  });
                }
              }
            })
        } else {
          return false;
        }
      });
    },
    // 监听新增sku对话框的关闭事件 ---清空form表单
    addDialogClosed() {
      this.$refs.ruleForm.resetFields();
    },
    //  检验输入的SKU是否唯一
    isOnly() {
      let that = this;
      this.AxiosReturn("productSku/method/unique.product.sku/", {product_sku: that.ruleForm.prosku}).then(function(res) {
          if (res.status === 200) {
            this.$message.success(res.message)
          } else if (res.status === 500) {
            that.$message({
              message: res.message,
              type: "warning",
              duration: 3000
            });
          }
        })
    }
  },
};
</script>

<style scoped>
.proidclass {
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  height: 100%;
  line-height: 40px;
}
</style>
