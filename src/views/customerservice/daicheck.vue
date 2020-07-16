<template>
  <div>
    <el-card>
      <div id="myHeaderBox">
        <el-input clearable placeholder="请输入商品名称"  @keyup.enter.native="orderSearch"   v-model="searchForm.keywords" size="mini"  ></el-input>
        <el-input clearable placeholder="请输入收货人姓名" @keyup.enter.native="orderSearch"  v-model="searchForm.consignee" size="mini"  ></el-input>
        <MyDatePicker v-model="searchForm.time"></MyDatePicker>
        <el-button type="primary" size="mini" icon="el-icon-search" @click="orderSearch">搜索</el-button>
        <el-button type="info" icon="el-icon-refresh" size="mini" v-if='isSearch' @click="resetFun"></el-button>
        <el-button class="filter-item" size="mini" type="success" @click="orderImport">导出</el-button>
        <div>
            <el-popover placement="bottom" width="120" trigger="click">
              <template>
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll"  @change="handleCheckAllChange" >全选</el-checkbox>
                <div style="margin: 15px 0;"></div>
                <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange" id='myshow'>
                  <el-checkbox v-for="(city,ckey) in cities" :label="city" :key="ckey">{{city}}</el-checkbox>
                </el-checkbox-group>
              </template>
              <el-button slot="reference" type="warning" size="mini"  class="filter-item" >显示</el-button>
            </el-popover>
        </div>
      </div>
      <el-row style="margin-top:5px;">
        <el-table :data="tableData" border  ref="multipleTable"  @selection-change="handleSelectionChange" size="mini" stripe style="margin-top: 15px;">
          <el-table-column type="selection"  width="55"></el-table-column>
          <el-table-column v-if='clos[0].isChecked' label="订单号" prop="order_no" width="185px"></el-table-column>
          <el-table-column v-if='clos[1].isChecked' label="商品信息" width="100px">
              <template slot-scope="scope">
                <el-popover trigger="hover" placement="right-start" width="500">
                    <el-table :data="scope.row.get_order_goods">
                        <el-table-column label="商品ID" prop="goods_code" ></el-table-column>
                        <el-table-column label="商品名称" prop="goods_name" ></el-table-column>
                        <el-table-column label="SKU" prop="goods_sku" ></el-table-column>
                        <el-table-column label="规格" prop="key_value" ></el-table-column>
                        <el-table-column label="价格" prop="shop_price" ></el-table-column>
                        <el-table-column label="数量" prop="qty" ></el-table-column>
                    </el-table>
                  <div slot="reference" class="name-wrapper" >
                    <el-tag v-if='scope.row.get_order_goods.length===0' size="mini"  type="info" style="cursor: pointer;">暂无商品</el-tag>
                    <el-tag size="mini" v-if='scope.row.get_order_goods.length!=0' type="success"  style="cursor: pointer;">包含{{ scope.row.get_order_goods.length}}种商品</el-tag>
                  </div>
                </el-popover>
              </template>
          </el-table-column>
          <!-- bbbbbbbbb -->
          <el-table-column v-if='clos[2].isChecked' label="网址" prop="name" show-overflow-tooltip width="80px"></el-table-column>
          <el-table-column v-if='clos[3].isChecked' label="产品ID" prop="product_id" show-overflow-tooltip width="100px"></el-table-column>
          <el-table-column v-if='clos[4].isChecked' label="地区" prop='city'></el-table-column>
          <el-table-column v-if='clos[5].isChecked' label="商品名称"></el-table-column>
          <el-table-column v-if='clos[6].isChecked' label="单价"></el-table-column>
          <el-table-column v-if='clos[7].isChecked' label="代收金额" prop='total_amount'></el-table-column>
          <el-table-column v-if='clos[8].isChecked' label="数量" prop='qty'></el-table-column>
          <el-table-column v-if='clos[9].isChecked' label="规格" prop='key_value'></el-table-column>
          <el-table-column v-if='clos[10].isChecked' label="订单状态" prop='trade_status' :formatter="status_source"></el-table-column>
          <el-table-column v-if='clos[11].isChecked' label="姓名" prop='consignee'></el-table-column>
          <el-table-column v-if='clos[12].isChecked' label="手机" prop='mobile'></el-table-column>
          <el-table-column v-if='clos[13].isChecked' label="地址" prop='complete_address'></el-table-column>
          <el-table-column v-if='clos[14].isChecked' label="邮箱" prop='email'></el-table-column>
          <el-table-column v-if='clos[15].isChecked' label="留言" prop='buyer_remark'></el-table-column>
          <el-table-column v-if='clos[16].isChecked' label="选品人" prop='supplier'></el-table-column>
          <el-table-column v-if='clos[17].isChecked' label="设计" prop='supplier'></el-table-column>
          <el-table-column v-if='clos[18].isChecked' label="优化师" prop='supplier'></el-table-column>
          <el-table-column v-if='clos[19].isChecked' label="下单日期" prop='create_time' show-overflow-tooltip></el-table-column>
          <el-table-column v-if='clos[20].isChecked' label="是否改派订单" prop='supplier' width="100"></el-table-column>
          <el-table-column v-if='clos[21].isChecked' label="改派单号" prop='supplier'></el-table-column>
          <el-table-column v-if='clos[22].isChecked' label="运单号" prop='supplier'></el-table-column>
          <el-table-column v-if='clos[23].isChecked' label="物流公司" prop='supplier'></el-table-column>
          <el-table-column v-if='clos[24].isChecked' label="运费" prop='delivery_fee'></el-table-column>
          <el-table-column v-if='clos[25].isChecked' label="采购费" prop='supplier'></el-table-column>
          <el-table-column v-if='clos[26].isChecked' label="汇款金额" prop='total_amount'></el-table-column>
          <el-table-column v-if='clos[27].isChecked' label="最近更新" prop='update_time'></el-table-column>
          <el-table-column v-if='clos[28].isChecked' label="风险评估" prop='supplier'></el-table-column>
          <el-table-column v-if='clos[29].isChecked' label="订单备注" prop='sellers_remark'></el-table-column>
          <el-table-column fixed="right" label="操作" width="120">
            <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="success" size="mini" style="padding:3px 13px" >审核</el-button>
                <el-tooltip class="item" effect="dark" content="删除订单" placement="top">
                  <el-button type="danger" icon="el-icon-delete" @click="recycleBinClickList(scope.row.order_no)" circle size="mini" ></el-button>
                </el-tooltip>
            </template>
          </el-table-column>
        </el-table>

          </el-row>
          <!-- 分页 -->
          <el-pagination
            style="margin-top:15px;"
            @size-change="pageSizeChange"
            @current-change="pageNumberChange"
            :current-page="pagenum"
            :page-sizes="[10, 30, 50, 100]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
    </el-card>
       <!-- 审核 -->
      <el-dialog title="审核" :visible.sync="dialogFormVisible">
        <el-form ref="form" :model="form" label-width="80px" size="mini">
          <el-row :gutter="0">
            <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
              <el-form-item label="订单号" prop="orderNum">
                <el-input v-model="form.orderNum" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="0">
            <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
              <el-form-item label="姓名">
                <el-input v-model="form.Name" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
              <el-form-item label="手机">
                <el-input v-model="form.mobilePhone" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
              <el-form-item label="邮箱">
                <el-input v-model="form.mailbox" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="0">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-form-item label="地址">
                <el-input v-model="form.address" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="0">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-form-item label="留言">
                <el-input
                  v-model="form.leavingMessage"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="0">
            <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
              <el-form-item label="代收金额">
                <el-input v-model="form.collectionAmount" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="0">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-form-item label>
                <el-table :data="form.comId" border style="width: 100%">
                  <el-table-column prop="goods_name" label="商品名称"></el-table-column>
                  <el-table-column prop="goods_code" label="商品ID"></el-table-column>
                  <el-table-column prop="key_value" label="规格" width="180"></el-table-column>
                  <el-table-column prop="goods_sku" label="SKU" width="180"></el-table-column>
                  <el-table-column prop="qty" label="数量"></el-table-column>
                </el-table>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="0">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-form-item label="备注">
                <el-input
                  v-model="form.remarks"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item style="text-align: center;margin-right: 80px;">
            <el-button @click="passExamine" type="success" size="mini">{{shenhesure}}</el-button>
            <el-button @click="problemOrder" type="warning" size="mini">问题订单</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="recycleBinClick" circle></el-button>
            <el-button type="info" @click="dialogFormVisible = false" size="mini" style="margin-left:10px">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
  </div>
</template>

<script>
import { AxiosReturn,myExprotExcel,orderImport} from '../../assets/axios/index'
import MyDatePicker from '../../components/Child/MyDatePicker'
const cityOptions=['订单号','商品信息','网址','产品ID','地区','商品名称','单价','代收金额','件数','规格','订单状态','姓名','手机','地址','邮箱','留言','选品人','设计','优化师','下单日期','是否改派订单', '改派单号','运单号', '物流公司',   '运费','采购费',  '汇款金额', '最新状态时间','风险评估', '订单备注']
export default {
  name: "gongdandetail",
  data() {
    return {
      audit_status:1,
      dialogFormVisible:false,
      isSearch:false,
      searchForm:{
        keywords:"",
        consignee:"",//收货人
        time:"",
        begin_time:"",
        end_time:"",
      },
      form: {
        orderNum: "",
        comId: [],
        comName: "",
        Name: "",
        mobilePhone: "",
        mailbox: "",
        address: "",
        leavingMessage: "",
        collectionAmount: "",
        number: "",
        sku: "",
        tableData: [
          {
            specifications: "",
            sku: "",
            num: ""
          }
        ],
        remarks: ""
      },
      shenhesure: "审核通过",
      deleteShenhe: "删除",
      searchOptions: {
        // 地区
        orderAddressOption: [
          {
            value: "-1",
            label: "全部地区"
          },
          {
            value: "0",
            label: "台湾"
          }
        ],
        // 地区
        orderAddressOption: [
          {
            value: "-1",
            label: "全部地区"
          },
          {
            value: "0",
            label: "台湾"
          }
        ],
        // 渠道
        orderChannelOption: [
          {
            value: "-1",
            label: "全部渠道"
          },
          {
            value: "0",
            label: "1688"
          },
          {
            value: "1",
            label: "1699"
          },
          {
            value: "2",
            label: "1666"
          }
        ],
        // 选品人
        orderSelectionPersonOption: [
          {
            value: "-1",
            label: "全部"
          },
          {
            value: "0",
            label: "马"
          }
        ],
        // 设计
        orderDesignOption: [
          {
            value: "-1",
            label: "全部"
          },
          {
            value: "0",
            label: "小王"
          }
        ],
        // 优化师
        orderOptimizerOption: [
          {
            value: "-1",
            label: "全部"
          },
          {
            value: "0",
            label: "小王"
          },
          {
            value: "1",
            label: "小马"
          },
          {
            value: "2",
            label: "小李"
          }
        ]
      },
      // 所有的list
      checkAll: false,                 //
      isIndeterminate: true,           //bbbbbbbbb
      clos:[
        { label: "订单号",prop:"order_no",isChecked: true }, //0
        { label: "商品信息",prop:"get_order_goods",isChecked: true },
        { label: "网址",prop:"name",isChecked: false },
        { label: "产品ID",prop:"product_id",isChecked: false },
        { label: "地区",prop:"city",isChecked: false },
        { label: "商品名称",prop:"goods_name",isChecked: true },//5
        { label: "单价",prop:"goods_amount",isChecked: true },
        { label: "代收金额",prop:"total_amount",isChecked: true },
        { label: "件数",prop:"qty", isChecked: true },
        { label: "规格",prop:"key_value",isChecked: true },
        { label: "订单状态",prop:"trade_status",isChecked: true },//10
        { label: "姓名",prop:"consignee",isChecked: true },
        { label: "手机",prop:"tel",isChecked: false },
        { label: "地址",prop:"address",isChecked: false },
        { label: "邮箱",prop:"email",isChecked: false },
        { label: "留言",prop:"supplier",isChecked: false },//15
        { label: "选品人",prop:"supplier",isChecked: false },
        { label: "设计",prop:"supplier",isChecked: false },
        { label: "优化师",prop:"supplier",isChecked: false },
        { label: "下单日期",prop:"create_time",isChecked: false },
        { label: "是否改派订单",prop:"supplier",isChecked: false },//20
        { label: "改派单号",prop:"supplier",isChecked: false },
        { label: "运单号",prop:"supplier",isChecked: false },
        { label: "物流公司",prop:"supplier",isChecked: false },
        { label: "运费",prop:"supplier",isChecked: false },
        { label: "采购费",prop:"supplier",isChecked: false },//25
        { label: "汇款金额",prop:"supplier",isChecked: false },
        { label: "最新状态时间",prop:"supplier",isChecked: false },
        { label: "风险评估",prop:"supplier",isChecked: false },
        { label: "订单备注",prop:"supplier",isChecked: false },
      ],
      cities: cityOptions,             //
      checkedCities: ["订单号","商品信息","商品名称","单价","代收金额","件数","规格","订单状态","姓名"],
      tableData:[],
      multipleSelection:[],// table 选中的数据
      // 分页
      total: 15, //总数
      pagenum: 1, // 当前页
      pagesize: 10 // 每页显示
    };
  },
  created: function() {
    this.getList();
  },
  methods: {
    AxiosReturn,
    myExprotExcel,
    // 分页
    pageSizeChange(value){
        this.pagesize=value
        this.getList()
    },
    pageNumberChange(value){
        this.pagenum=value
        this.getList()
    },
    orderImport,
    
    // 搜索
    orderSearch() {
      this.isSearch=true
      this.pagenum=1 
      this.pagesize=10
      this.getList()
    },
    resetFun(){
      this.isSearch=false
      for(var qkey in this.searchForm){
          this.searchForm[qkey]=""
      }
      this.pagenum=1 
      this.pagesize=10
      this.getList()
    },
    getList(){
      let that = this
      let myParams={}

      if(this.isSearch){
          myParams=this.searchForm
          if(this.searchForm.time!=""&&this.searchForm.time!=null){
            this.searchForm.begin_time=Math.round(this.searchForm.time[0]/1000) 
            this.searchForm.end_time=Math.round(this.searchForm.time[1]/1000) 
          }else{
            this.searchForm.begin_time=""
            this.searchForm.end_time=""
          }
          myParams.page_size=this.pagesize
          myParams.page_no=this.pagenum
          myParams.status=this.audit_status
      }else{
          myParams={
              page_size:this.pagesize, //每页条数
              page_no:this.pagenum, //翻页页数
              status:this.audit_status
          }
      }
      this.AxiosReturn('order/method/get.order.list/',myParams).then(res=>{
        that.tableData=res.data.items
        that.total=res.data.total_result
      })
    },
   
    //全选函数---显示全部列
    handleCheckAllChange(val) {
      this.checkedCities = val ? cityOptions : [];
      this.isIndeterminate = false;
      this.clos.map((item, key) => {
        item.isChecked = val;
      });
    },
    //单选函数---显示单个列
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate =checkedCount > 0 && checkedCount < this.cities.length;
      this.clos.map((item, key) => {
          item.isChecked = false;
          for (var it of value) {
            if (it === item.label) {
              item.isChecked = true;
            }
          }
        })
    },
    //table中checkbox函数
    handleSelectionChange(val) {
        this.multipleSelection = JSON.stringify(val);
    },
    status_source(row){
        if(row.trade_status == 0){
          return <el-tag size="mini" style="padding:0px 3px;  color: rgb(243, 149, 227); background-color: rgb(248, 237, 249); border: 1px solid rgb(243, 178, 251);">待审核</el-tag>
        }else if(row.trade_status == 1){
          return  <el-tag type="warning" size="mini" style="padding:0px 3px;">待发货</el-tag>
        }else if(row.trade_status == 2){
          return  <el-tag type="primary" size="mini" style="padding:0px 3px;">已发货</el-tag>
        }else if(row.trade_status == 3){
          return  <el-tag type="success" size="mini" style="padding:0px 3px;">已完成</el-tag>
        }else if(row.trade_status == 4){
          return <el-tag type="info" size="mini" style="padding:0px 3px;">删除</el-tag>
        }else if(row.trade_status == 5){
          return <el-tag type="danger" size="mini" style="padding:0px 3px;">问题订单</el-tag>
        }
    },
    recycleBinClickList(val) {
      this.$confirm("此操作将订单放入回收站中, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.AxiosReturn("order/method/recycle.order.item/", {
            order_no: val,
            is_recycle: 1
          }).then(res => {
            if (res.status == 200) {
              this.$message({
                type: "success",
                message: "订单放入回收站成功!"
              });
              this.dialogFormVisible = false;
              this.getList(this.pagesize, this.pagenum, 1);
            } else {
              this.$message({
                type: "error",
                message: res.message
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    // 审核
    handleClick(row) {
      this.dialogFormVisible = true;
      this.form.orderNum = row.order_no;
      this.form.comId = row.get_order_goods;
      // this.form.comName = row.comName;
      this.form.Name = row.consignee;
      this.form.mobilePhone = row.mobile;
      this.form.mailbox = row.email;
      this.form.address = row.address;
      this.form.leavingMessage = row.buyer_remark;
      this.form.collectionAmount = row.total_amount;
      this.form.number = row.number;
      this.form.sku = row.sku;
      for (var info = 0; info < this.form.tableData.length; info++) {
        this.form.tableData[info].specifications = row.specifications;
        this.form.tableData[info].sku = row.sku;
        this.form.tableData[info].num = row.num;
      }
      this.form.remarks = row.sellers_remark;
    },
    passExamine() {
      this.AxiosReturn("order/method/audit.order.item/", {
        order_no: this.form.orderNum,
        trade_status: 1
      }).then(res => {
        if (res.status == 200) {
          this.$message({
            message: res.message,
            type: "success"
          });
          this.shenhesure = "待发货";
          this.dialogFormVisible = false;
          this.getList(this.pagesize, this.pagenum, 1);
        } else {
          this.$message({
            message: res.message,
            type: "warning"
          });
        }
      });
    },
    problemOrder() {
      this.AxiosReturn("order/method/audit.order.item/", {
        order_no: this.form.orderNum,
        trade_status: 5
      }).then(res => {
        if (res.status == 200) {
          this.$message({
            message: res.message,
            type: "success"
          });
          this.dialogFormVisible = false;
          this.getList(this.pagesize, this.pagenum, 1);
        } else {
          this.$message({
            message: res.message,
            type: "warning"
          });
        }
      });
    },
    // 将订单放入回收站
    recycleBinClick() {
      this.$confirm("此操作将订单放入回收站中, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          this.AxiosReturn("order/method/recycle.order.item/", {
            order_no: this.form.orderNum,
            is_recycle: 1
          }).then(res => {
            if (res.status == 200) {
              this.$message({
                type: "success",
                message: "订单放入回收站成功!"
              });
              this.dialogFormVisible = false;
              this.getList(this.pagesize, this.pagenum, 1);
            } else {
              this.$message({
                type: "error",
                message: res.message
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
  },
  components:{
    MyDatePicker
  },
};
</script>
<style>

el-dialog__body {
  text-align: center !important;
}
.box {
  width: 400px;
}
.top {
  text-align: center;
}
.left {
  float: left;
  width: 60px;
}
.right {
  float: right;
  width: 60px;
}
.bottom {
  clear: both;
  text-align: center;
}
.item {
  margin: 4px;
}
.left .el-tooltip__popper,
.right .el-tooltip__popper {
  padding: 8px 10px;
}
.el-table td,
.el-table th {
  padding: 0 0;
}
.el-footer {
  height: 0 !important;
}
</style>

