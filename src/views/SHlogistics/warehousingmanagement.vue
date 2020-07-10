<template>
  <div>
    <el-card>
      <!-- header -->
      <div id='myHeaderBox'>
          <el-input placeholder="请输入采购单号"  size="mini"  v-model="detailsSearch"  @clear="resetFun" @keyup.enter.native="serachDetailsBtn" clearable ></el-input>
          <el-button type="primary" size="mini" icon="el-icon-search" @click="serachDetailsBtn">搜索</el-button>
          <el-button type="info" icon="el-icon-refresh" size="mini" v-if='isSearch' @click="resetFun"></el-button>
          <el-col :xs="1" :sm="1" :md="1" :lg="1" :xl="1" :offset="18">
            <el-button type="success" size="mini" @click="toExport">导出</el-button>
          </el-col>
      </div>
      <!-- table -->
      <el-row :gutter="0" style="margin-top:15px;">
        <el-table ref="multipleTable" :data="detailsTableData"  tooltip-effect="dark" style="width: 100%;" @selection-change="handleSelectionChange" border :fit="true">
          <el-table-column type="selection" width="40"></el-table-column>
          <el-table-column prop="po_no" label="采购单号" width="150"></el-table-column>
          <el-table-column prop="product_id" label="产品ID"></el-table-column>
          <el-table-column prop="product_name" label="产品名称" show-overflow-tooltip width="200"></el-table-column>
          <el-table-column prop="total_purchase_amount" label="采购金额"></el-table-column>
          <el-table-column prop="warehousing_qty" label="采购数量"></el-table-column>
          <el-table-column prop="supplier_no" label="运单号" show-overflow-tooltip width="200"></el-table-column>
          <el-table-column prop="supplier_name" label="物流公司" width="200" show-overflow-tooltip></el-table-column>
          <el-table-column fixed="right" label="操作" width="80">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" plain    @click="modifyBtn(scope.$index, scope.row,'ck')" style="padding:3px 13px">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>

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
      <!-- 采购明细修改 -->
      <el-dialog :title="sh_Look" center :visible.sync="dialogFormVisible" @close="addDialogClosed">
        <el-form :model="form"  ref="form" :rules="rules" size="mini">
 
          <el-form-item label="产品ID"  :label-width="formLabelWidth">
            <el-input v-model="form.product_id" disabled></el-input>
          </el-form-item>
  
          <el-form-item label="产品名称" :label-width="formLabelWidth">
            <el-input v-model="form.product_name" disabled></el-input>
          </el-form-item>
      
          <el-form-item label="运单号" prop="supplier_no" :label-width="formLabelWidth">
            <el-input v-model="form.supplier_no" clearable :disabled="sh_Look=='查看'"></el-input>
          </el-form-item> 
    
          <el-form-item label="物流公司" prop="supplier_name" :label-width="formLabelWidth">
            <el-input  v-model="form.supplier_name" clearable :disabled="sh_Look=='查看'"></el-input>
          </el-form-item>
  
          <el-form-item label="采购订单号" :label-width="formLabelWidth">
            <el-input v-model="form.purchase_order_no" disabled></el-input>
          </el-form-item>

          <el-form-item label="采购单号" :label-width="formLabelWidth">
            <el-input v-model="form.po_no" disabled></el-input>
          </el-form-item>
      

          <el-form-item label="预警值" :label-width="formLabelWidth">
            <el-input v-model="form.warning" disabled></el-input>
          </el-form-item>
           
          <el-form-item label='产品信息' :label-width="formLabelWidth">
            <el-table :data="form.product_sku" border height="200"  :summary-method="getSummaries"  show-summary  >
              <el-table-column prop="sku_value" label="规格" width="180"></el-table-column>
              <el-table-column prop="product_sku" label="SKU"></el-table-column>
              <el-table-column prop="store_qty" label="库存"></el-table-column>
              <el-table-column prop="purchase_price" label="采购单价"></el-table-column>
              <el-table-column prop="purchase_number" label="采购数量"></el-table-column>
              <el-table-column prop="purchase_total" label="采购金额"></el-table-column>
            </el-table>
          </el-form-item>

          <el-form-item label="备注"  :label-width="formLabelWidth">
            <el-input style="display:inline" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入备注" v-model="form.warehousing_remarks" :disabled="sh_Look=='查看'"></el-input>
          </el-form-item>

        </el-form>
       
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { AxiosReturn,  myExprotExcel} from "../../assets/axios/index";
export default {
  name: "warehousingmanagement",
   data() {
    return {
      sh_Look:'',
      isLook:true,
      isSearch:false,
      detailsSearch: "",
      detailsTableData: [],
      dialogFormVisible: false,
      form: {},
      rules: {
        supplier_no: [
          { required: true, message: "请输入运单号", trigger: "blur" }
        ],
        supplier_name: [
          { required: true, message: "请输入物流公司", trigger: "blur" }
        ],

      },
      formLabelWidth: "120px",
      buyDialogTableData: [],
      multipleSelection: [], // table 选中的数据
      // 分页-------------------
      total: 0, //总数
      pagenum: 1, // 当前页
      pagesize: 10 // 每页显示的条数
    };
  },
  created: function() {
    this.getAllList();
  },
  methods: {
    AxiosReturn,
    myExprotExcel,
    resetFun(){
      this.pagesize=10
      this.pagenum=1
      this.isSearch=false
      this.detailsSearch=null
      this.getAllList()
    },
    // 获取所有列表
    getAllList() {
      let params={
          page_size: this.pagesize, //每页条数
          page_no: this.pagenum ,//当前页
          warehousing_status:1
      }
      if(this.isSearch){
        params.po_no=this.detailsSearch
      }else{
        params.po_no=null
      }
      let that = this
      this.AxiosReturn("warehousing/method/get.warehousing.admin.list", params).then(res => {
        that.detailsTableData = res.data.items;
        that.total = res.data.total_result;
      });
    },

    // 搜索
    serachDetailsBtn() {
      this.pagesize=10
      this.pagenum=1
      this.isSearch=true
      this.getAllList()
    },
    // 导出
    toExport() {
      this.$message({
        showClose: true,
        message: "暂时未开通，敬请期待"
      });
    },
    // 全选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 修改/查看
    modifyBtn(index,val,title) {
      if(title=='ck'){
          this.sh_Look="查看"
      }
      this.dialogFormVisible = true;
      // console.log(index+ '---index',val+'---val',title+'---title')
      this.form =val;
      this.buyDialogTableData = val.product_sku;
      this.form.supplier_no = val.supplier_no;
      this.form.supplier_name = val.supplier_name;
      this.form.warehousing_remarks = val.warehousing_remarks;
      this.form.warehousing_id = val.warehousing_id;
    },
    getSummaries(param) {
      const { columns, data } = param;
      // console.log(param);
      let caigouNum=0
      let caigouPrice=0
      this.form.warehousing_qty=0
      this.form.total_purchase_amount=0
      for(var d of data){
        caigouNum+=d.purchase_number*1
        caigouPrice+=d.purchase_total*1
      }
      this.form.warehousing_qty=caigouNum
      this.form.total_purchase_amount=caigouPrice
      const sums = [];
      columns.forEach((column, index) => {
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
    addDialogClosed() {
      this.$refs.form.resetFields();
    },
    // 分页
    handleSizeChange(newSize) {
      this.pagesize = newSize;
      this.getAllList();
    },
    handleCurrentChange(newPage) {
      this.pagenum  = newPage;
      this.getAllList();
    }

  },
};
</script>

<style scoped>
</style>

