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
          <el-table-column prop="product_name" label="产品名称" show-overflow-tooltip width="130"></el-table-column>
          <el-table-column prop="total_purchase_amount" label="采购金额"></el-table-column>
          <el-table-column prop="warehousing_qty" label="采购数量"></el-table-column>
          <el-table-column prop="supplier_no" label="运单号" show-overflow-tooltip width="210"></el-table-column>
          <el-table-column prop="supplier_name" label="物流公司" show-overflow-tooltip width="200"></el-table-column>
          <el-table-column prop="operator_name" label="采购人" width="120"></el-table-column>
          <el-table-column prop="create_time" label="采购时间" show-overflow-tooltip width="160"></el-table-column>
          <el-table-column prop="warehousing_remarks" show-overflow-tooltip label="备注"></el-table-column>

          
          <el-table-column  label="上传状态">
            <template slot-scope="scope">
              <div v-if="scope.row.warehousing_status == 0">
                <el-tag type="danger" size="mini">未入库</el-tag>
              </div>
               <div v-if="scope.row.warehousing_status == 1">
                <el-tag type="primary" size="mini">已入库</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="warehousing_time" label="入库时间" show-overflow-tooltip width="160" :formatter="UnixFun"></el-table-column>
          <el-table-column  label="采购状态">
            <template slot-scope="scope">
              <div v-if="scope.row.procurement_status == 0">
                <el-tag type="success" size="mini">未撤消</el-tag>
              </div>
               <div v-if="scope.row.procurement_status == 1">
                <el-tag type="info" size="mini">已撤消</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="130">
            <template slot-scope="scope">
              <el-button  @click="modifyBtn(scope.$index, scope.row,'sh')" type="warning" size="mini" style="padding:3px 8px;">修改</el-button>
              <el-button size="mini" type="primary" @click="modifyBtn(scope.$index, scope.row,'ck')" style="padding:3px 13px">查看</el-button>
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

          <el-form-item :label-width="formLabelWidth">
            <span slot="label" ><span style="color:red">*</span> 运单号</span>
            <el-input v-model="form.supplier_no" clearable :disabled="sh_Look=='查看'"></el-input>
          </el-form-item>

          <el-form-item :label-width="formLabelWidth">
            <span slot="label" ><span style="color:red">*</span> 物流公司</span>
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
        <div slot="footer" class="dialog-footer" v-if="sh_Look=='采购明细修改'">
          <!-- <el-button type="primary" @click="uploadInfo" size="mini">上传信息</el-button> -->
          <el-button type="primary" @click="subBtn" size="mini"  v-show="isLook" :disabled="form.procurement_status == 1">提交</el-button>
          <el-button type="warning" @click="revoke" size="mini"  v-show="isLook" :disabled="form.warehousing_status == 1">撤消</el-button>
          <el-button type="info" @click="dialogFormVisible = false" size="mini"  v-show="isLook">取消</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { AxiosReturn,UnixDate,  myExprotExcel} from "../../assets/axios/index";
export default {
  name: "stock",
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
          { required: true,}
        ],
        supplier_name: [
          { required: true,}
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
    UnixDate,
    UnixFun(row) {
      if (row.warehousing_time) {
        return this.UnixDate(row.warehousing_time);
      }
    },
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
          page_no: this.pagenum //当前页
      }
      if(this.isSearch){
        params.po_no=this.detailsSearch
      }else{
        params.po_no=null
      }
      let that = this
      this.AxiosReturn("warehousing/method/get.warehousing.admin.list", params).then(res => {
        console.log(res, 9999999);
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
      const headerArr=['采购单号','产品ID','产品名称','采购金额','采购数量','运单号','物流公司','采购人','采购时间','备注',]
      const keyArr=['po_no','product_id','product_name','total_purchase_amount','warehousing_qty','supplier_no','supplier_name','operator_name','create_time','warehousing_remarks',]
      this.myExprotExcel(headerArr,keyArr,'采购明细','detailsTableData')
    },
    // 全选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 修改
    modifyBtn(index,val,title) {
      if(title=='sh'){
          this.sh_Look="采购明细修改"
      }else{
          this.sh_Look="查看"
      }

     
      this.form =val;
      
      try {
        console.log(val.product_sku.length)
      } catch (error) {
        console.log(error)
        if(error){
          console.log('shi--null')
          this.form.product_sku=[]
        }else{
          console.log('bushishi--null')
          this.form.product_sku=val.product_sku;
        }
      }
      
      console.log('this.form.product_sku',this.form.product_sku,val.product_sku)
      this.form.supplier_no = val.supplier_no;
      this.form.supplier_name = val.supplier_name;
      this.form.warehousing_remarks = val.warehousing_remarks;
      this.form.warehousing_id = val.warehousing_id;
      this.dialogFormVisible = true;
    },
     // 修改提交
    subBtn() {
      let params = {
        supplier_name:'',
        supplier_no:'',
        warehousing_remarks:'',
        warehousing_id:null,
        warehousing_status:1,
      }
      if(this.form.supplier_no==""||this.form.supplier_no=="null"){
          this.$message.warning('运单号不能为空')
          return
      }else if(this.form.supplier_name==""||this.form.supplier_name=="null"){
          this.$message.warning('物流公司不能为空')
          return
      }

      params.supplier_no = this.form.supplier_no;
      params.supplier_name = this.form.supplier_name;
      params.warehousing_remarks = this.form.warehousing_remarks;
      params.warehousing_id = this.form.warehousing_id;
      this.AxiosReturn("warehousing/method/set.warehousing.item",params).then(res=>{
        // console.log(res)
          if (res.status === 200) {
              console.log(res.data);
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
                  message: '修改失败'
                });
            }
      })
    },
    // 撤销
    revoke() {
      let params = {
        supplier_name:'',
        supplier_no:'',
        warehousing_remarks:'',
        warehousing_id:null,
        procurement_status:1,
      }
      params.supplier_no = this.form.supplier_no;
      params.supplier_name = this.form.supplier_no;
      params.warehousing_remarks = this.form.warehousing_remarks;
      params.warehousing_id = this.form.warehousing_id;
      this.AxiosReturn("warehousing/method/set.warehousing.item",params).then(res=>{
        // console.log(res)
          if (res.status === 200) {
              console.log(res.data);
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
                  message: '修改失败'
                });
            }
      })
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
    // 上传信息
    uploadInfo() {
      this.dialogFormVisible = false;
    },
    addDialogClosed() {
      // this.$refs.form.resetFields();
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
<style>
.el-table td,
.el-table th {
  padding: 0 0;
}
.el-footer {
  height: 0 !important;
}
</style>
