<template>
  <div>
    <el-card>
      <!-- header -->
      <div id="myHeaderBox">
          <el-input placeholder="请输入订单号" size="mini" v-model="queryinfo.order_no" @keyup.enter.native="search" clearable />
          <!-- <el-input placeholder="请输入产品名称" size="mini" v-model="queryinfo.product_name" @keyup.enter.native="search" clearable />
          <el-input placeholder="请输入操作员名称" size="mini" v-model="queryinfo.operator_name" @keyup.enter.native="search" clearable /> -->
          <el-select placeholder="采购状态" size="mini" v-model="queryinfo.stock_purchase_status">
            <el-option label="未采购" value="0"></el-option>
            <el-option label="已采购" value="1"></el-option>
          </el-select>
          <!-- <el-date-picker v-model="queryinfo.create_time " type="date" value-format='yyyy-MM-dd' placeholder="创建日期" size="mini"></el-date-picker> -->
          <el-button type="primary" size="mini" icon="el-icon-search" @click="search">搜索</el-button>
          <el-button type="info" icon="el-icon-refresh" size="mini" v-if='isSearch' @click="resetFun"></el-button>
          <el-button @click="correctiondetails" size="mini" type="primary">修正明细</el-button>
          <el-button type="success" size="mini" @click="toExport">导出</el-button>
      </div>
      <!-- table -->
      <el-row :gutter="0" style="margin-top:15px;">
        <el-table  ref="multipleTable"  :data="buyTableData" tooltip-effect="dark"  style="width: 100%;"  @selection-change="handleSelectionChange"  border :fit="true">
          <el-table-column type="selection" width="40"></el-table-column>
          <el-table-column prop="order_no" label="订单号"  width="220"></el-table-column>
          <el-table-column prop="product_id" label="产品ID" show-overflow-tooltip></el-table-column>
          <el-table-column prop="product_name" label="产品名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="product_url" show-overflow-tooltip label="采购网址"></el-table-column>
          <el-table-column prop="sku_value" label="规格" show-overflow-tooltip></el-table-column>
          <el-table-column prop="product_sku" label="SKU" width="120"></el-table-column>
          <el-table-column prop="total_qty" label="总数量"></el-table-column>
          <el-table-column prop="total_amount" label="总金额"></el-table-column>
          <el-table-column prop="warning" sortable label="预警值"></el-table-column>
          <el-table-column prop="cumulative" label="累计修正"></el-table-column>
          <el-table-column  label="采购状态" width="80">
            <template  slot-scope="scope">
               <el-tag type="success" v-if="scope.row.stock_purchase_status == 1" size="mini" style="padding:0px 8px;">已采购</el-tag>
               <el-tag type="danger" v-if="scope.row.stock_purchase_status == 0" size="mini" style="padding:0px 8px;">未采购</el-tag>
            </template>

          </el-table-column>
          <el-table-column fixed="right" label="操作" width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.stock_purchase_status == 0">
                <el-button @click="purchaseBtn(scope.row)" type="primary" size="mini" style="padding:3px 8px;" >采购</el-button>
              </span>
              <el-button @click="modify(scope.row)" type="warning" size="mini" style="padding:3px 8px;">修改</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <!-- 分页 -->
      <div class="block" style="margin-top: 15px;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryinfo.page_no"
          :page-sizes="[15, 30, 50, 100]"
          :page-size="queryinfo.page_size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
      <!-- 采购弹框 -->
      <el-dialog title="采购" center :visible.sync="dialogFormVisible">
        <el-form :model="form" size="mini">
          <el-form-item label="产品ID"  :label-width="formLabelWidth">
            <el-input v-model="form.product_id" disabled></el-input>
          </el-form-item>
          <el-form-item label="产品名称" :label-width="formLabelWidth">
            <el-input v-model="form.product_name" disabled></el-input>
          </el-form-item>
          <el-form-item label="采购订单号" :label-width="formLabelWidth">
            <el-input v-model="form.purchase_order_no"></el-input>
          </el-form-item>
          <el-form-item label="预警值" :label-width="formLabelWidth">
            <el-input v-model="form.warning"></el-input>
          </el-form-item>

          <el-form-item label="产品SKU" :label-width="formLabelWidth">
            <el-table :data="form.product_sku" border height="200" :summary-method="getSummaries" show-summary @cell-dblclick="celledit" >
              <el-table-column prop="sku_value" label="规格" width="180"></el-table-column>
              <el-table-column prop="store_sku" label="SKU"></el-table-column>
              <el-table-column prop="store_qty" label="库存"></el-table-column>
              <el-table-column  label="采购单价" >
                <template slot-scope="scope">
                  <el-input size="mini" type="number" v-if="scope.row.isEdit" v-model="scope.row.purchase_price" @input="handldStock(scope.$index, scope.row)" @blur="blurBtn($event)"></el-input>
                  <span v-else>{{scope.row.purchase_price}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="inNumber" label="采购数量">
                <template slot-scope="scope">
                  <el-input size="mini" type="number" v-if="scope.row.isEdit" v-model="scope.row.purchase_number" @input="handldStock(scope.$index, scope.row)" @blur="blurBtn"></el-input>
                  <span v-else>{{scope.row.purchase_number}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="inPrice" label="采购金额">
                <template slot-scope="scope">
                  <!-- <el-input size="mini" v-if="scope.row.isEdit" v-model="scope.row.purchase_total" @change="handldStock(scope.$index, scope.row)" @blur="blurBtn"></el-input> -->
                  <span>{{scope.row.purchase_total}}</span>
                </template>

              </el-table-column>
            </el-table>           
          </el-form-item>

          <el-form-item label="备注" style="margin-top:15px" :label-width="formLabelWidth">
            <el-input style="display:inline" type="textarea" :autosize="{ minRows: 2, maxRows: 4}"  placeholder="请输入备注"  v-model="form.warehousing_remarks"></el-input>
          </el-form-item>
     
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="buygoodsSend" size="mini">提交</el-button>
          <el-button type="info" @click="dialogFormVisible = false" size="mini">取消</el-button>
        </div>
      </el-dialog>
      <!-- 修改弹框 -->
      <el-dialog title="修改" center :visible.sync="modifydialogVisible">
        <el-form :model="modifyForm" :rules="rules" size="mini">
          <el-form-item label="产品ID" :label-width="formLabelWidth">
            <el-input v-model="modifyForm.product_id  " disabled></el-input>
          </el-form-item>
          <el-form-item label="产品名称" :label-width="formLabelWidth">
            <el-input v-model="modifyForm.product_name" disabled></el-input>
          </el-form-item>
          <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-form-item label="规格" :label-width="formLabelWidth">
                <el-input v-model="modifyForm.sku_value" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="SKU" :label-width="formLabelWidth">
            <el-input v-model="modifyForm.product_sku" disabled></el-input>
          </el-form-item>
          <el-form-item label="预警值" :label-width="formLabelWidth">
            <el-input v-model="modifyForm.warning" clearable></el-input>
          </el-form-item>
          <el-row >
            <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
              <el-form-item label="库存" :label-width="formLabelWidth">
                <el-input v-model="modifyForm.qty" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
              <el-form-item label="累计修正" :label-width="formLabelWidth">
                <el-input v-model="modifyForm.cumulative" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
              <el-form-item label="修正值" :label-width="formLabelWidth">
                <el-input v-model="modifyForm.correct" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="修正原因"  prop="stock_purchase_remarks"  :label-width="formLabelWidth" >
            <el-input  type="textarea"  :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入修正原因" v-model="modifyForm.stock_purchase_remarks" ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="modifySubmission" size="mini">提交</el-button>
          <el-button type="info" @click="modifydialogVisible = false" size="mini">取消</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { AxiosReturn } from "../../assets/axios/index";
export default {
  name: "buygoods",
  data() {
    return {
      isSearch:false,
      glob_index:"",
      queryinfo:{
          order_no:"",
          product_name:"",
          operator_name:"",
          stock_purchase_status:"", 
          up_time:""
      },
      buyTableData: [],
      dialogFormVisible: false,  
      form: {
        warehousing_qty:0,//  采购总数量 ,
        total_purchase_amount:0,//   采购总额 ,单独提交出来
        stock_purchase_id:null,
        product_id:null,
        product_name:'',
        purchase_order_no:'',
        warning:null,
        warehousing_remarks:"",
        product_sku:[],
      },
      formLabelWidth: "120px",
      buyDialogTableData: [
        {
          specifications: "黑色M",
          sku: "TX000000",
          stock: "10",
          unitPrice: "3.11",
          inNumber: "9",
          inPrice: "1"
        },
        {
          specifications: "黑色M",
          sku: "TX000000",
          stock: "10",
          unitPrice: "3.11",
          inNumber: "6",
          inPrice: "3"
        },
        {
          specifications: "黑色M",
          sku: "TX000000",
          stock: "10",
          unitPrice: "3.11",
          inNumber: "10",
          inPrice: "6"
        }
      ],
      modifyForm: {
        product_id:null,
        product_name:"",
        warning:null,
        sku_value:'',
        product_sku: "",
        qty:null,
        cumulative:null,
        correct:null,
        stock_purchase_remarks:'',
      },
      rules: {
        stock_purchase_remarks: [
          { required: true, message: "请填写修正原因", trigger: "blur" }
        ]
      },
      modifydialogVisible: false,
      isShow:false,
      // 分页------------------------
      total: 0, //总数
    };
  },
  created: function() {
    this.getAllList();
  },
  methods: {
    AxiosReturn,
    resetFun(){
        this.isSearch=false
        for(var qkey in this.queryinfo){
            this.queryinfo[qkey]=""
        }
        this.queryinfo.page_no=1 
        this.queryinfo.page_size=15
        this.getAllList()
    },
    // 搜索
    search() {
        this.isSearch=true
        this.queryinfo.page_no=1 
        this.queryinfo.page_size=15
        this.getAllList()
    },
    // 获取所有列表
    getAllList() {
      let myParams={}
      if(this.isSearch){
          myParams=this.queryinfo
      }else{
          myParams={
              page_size: this.queryinfo.page_size, //每页条数
              page_no: this.queryinfo.page_no //翻页页数
          }
      }
      let that = this;
      this.axios
        .post("stock_purchase/method/get.stock.admin.list/",myParams).then(function(res) {
          if (res.data.status === 200) {
            // console.log(res.data.data);
            let result = res.data.data.items;
            that.buyTableData = result;
            that.total = res.data.data.total_result;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    // 修正明细
    correctiondetails() {
      this.$message({
        showClose: true,
        message: "暂时未开通，敬请期待"
      });
    },
    // 导出
    toExport() {
      this.$message({
        showClose: true,
        message: "暂时未开通，敬请期待"
      });
    },
    // 采购
    purchaseBtn(val) {
      this.dialogFormVisible = true;
      this.AxiosReturn("stock_purchase/method/get.stock.item",{product_id:val.product_id}).then(res=>{
        // console.log(res,'res*********')
        this.form.product_id = res.data.product_id;
        this.form.product_name = res.data.product_name;
        this.form.purchase_order_no = res.data.order_no;
        this.form.warning = res.data.warning;
        this.form.product_sku = res.data.product_sku;
        this.form.stock_purchase_id =res.data.stock_purchase_id;
        this.form.product_sku.map(item => {
          var p=(Math.random()*10).toFixed(2)
          var n=Math.floor(Math.random()*10)
          this.$set(item, "purchase_price", p);
          this.$set(item, "purchase_number", n);
          this.$set(item, "purchase_total", (p*n).toFixed(2));
          this.$set(item, "isEdit", false);
        });
      })

    },
    // 双击单元格编辑
    celledit(row, column){
      for(var ke in this.form.product_sku){
          if(this.form.product_sku[ke].product_sku_id==row.product_sku_id){
            this.form.product_sku[ke].isEdit=true
            this.glob_index=ke
          }else{
            this.form.product_sku[ke].isEdit=false
          }
      }
    },
    // 双击单元格失去焦点事件
    blurBtn(e){
      // console.log(e)
      this.form.product_sku[this.glob_index].isEdit = false;
    },
    // 采购弹框提交
    buygoodsSend() {
      this.AxiosReturn("warehousing/method/add.warehousing.item",this.form).then(res=>{
          if (res.status === 200) {
              console.log(res.data.data);
              this.$message({
                message: res.message,
                type: "success",
              });
              this.dialogFormVisible = false;
              this.getAllList();
            }else if(res.status === 500){
              this.$message({
                type: "error",
                message: res.message
              });
            }else{
              this.$message({
                type: "error",
                message: '采购提交失败'
              });
            } 
      })
    },
    // 修改
    modify(val) {
      this.modifydialogVisible = true;
      // this.modifyForm = val;
      this.modifyForm.product_id = val.product_id;
      this.modifyForm.product_name = val.product_name;
      this.modifyForm.warning = val.warning;
      this.modifyForm.sku_value = val.sku_value;
      this.modifyForm.product_sku = val.product_sku;
      this.modifyForm.qty = val.qty;
      this.modifyForm.cumulative = val.cumulative;
      this.modifyForm.correct = val.correct;
      this.modifyForm.stock_purchase_remarks = val.stock_purchase_remarks;
    },
    // 修改提交
    modifySubmission() {
       this.AxiosReturn("stock_purchase/method/set.stock.item/",this.modifyForm).then(res=>{
          if (res.status === 200) {
              // console.log(res.data);
              this.$message({
                message: res.message,
                type: "success",
              });
              this.modifydialogVisible = false;
              this.getAllList();
            }else if(res.status === 500){
                this.$message({
                  type: "error",
                  message: res.message
                });
            }else{
                this.$message({
                  type: "error",
                  message: '修改失败'
                });
            }
      })
    },
    handldStock(index, row) {
      this.form.product_sku[index].purchase_total=this.form.product_sku[index].purchase_price*this.form.product_sku[index].purchase_number
    },
    // 全选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      let caigouNum=0
      let caigouPrice=0
      this.form.warehousing_qty=0
      this.form.total_purchase_amount=0
      for(var d of data){
        caigouNum+=d.purchase_number*1
        caigouPrice+=d.purchase_total*1
      }
      this.form.warehousing_qty=caigouNum
      this.form.total_purchase_amount=caigouPrice.toFixed(2)

      columns.forEach((column, index) => {
        // console.log('遍历啦',column,index)
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (index === 4) {
          sums[index] = caigouNum+' 件';
          return;
        }
        if (index === 5) {
          sums[index] = caigouPrice.toFixed(2)+' 元';
          return;
        }
      });
      return sums;
    },
    // 分页
    handleSizeChange(newSize) {
      this.queryinfo.page_size = newSize;
      this.getAllList();
    },
    handleCurrentChange(newPage) {
      this.queryinfo.page_no  = newPage;
      this.getAllList();
    }
  }
};
</script>

<style scoped>
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
.el-table td,
.el-table th {
  padding: 0 0;
}
.el-footer {
  height: 0 !important;
}
</style>