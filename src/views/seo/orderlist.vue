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
       <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全部"   name="0" ></el-tab-pane>
        <el-tab-pane label="待审核" name="1" ></el-tab-pane>
        <el-tab-pane label="已审核" name="2" ></el-tab-pane>
        <el-tab-pane label="已发货" name="3" ></el-tab-pane>
        <el-tab-pane label="已完成" name="4" ></el-tab-pane>
        <el-tab-pane label="已取消/已删除" name="5" ></el-tab-pane>
        <el-tab-pane label="问题订单" name="6" ></el-tab-pane>
      </el-tabs>
      <el-row style="margin-top:5px;">
        <el-table :data="tableData" border  ref="multipleTable"  @selection-change="handleSelectionChange" size="mini" stripe style="margin-top: 15px;">
          <el-table-column type="selection"  width="55"></el-table-column>
          <el-table-column v-if='clos[0].isChecked' label="订单号" prop="order_no" width="185px"></el-table-column>
          <el-table-column v-if='clos[1].isChecked' label="商品信息" width="100px">
              <template slot-scope="scope">
                <el-popover trigger="hover" placement="right-start" width="800">
                    <el-table :data="scope.row.get_order_goods">
                        <el-table-column label="商品ID" prop="goods_code" ></el-table-column>
                        <el-table-column label="商品名称" prop="goods_name" width="120" ></el-table-column>
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
          <el-table-column v-if='clos[10].isChecked' label="SKU" prop='goods_sku'></el-table-column>
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
          <el-table-column v-if='clos[28].isChecked' label="订单状态">
              <template slot-scope="scope">
                <div v-if="scope.row.trade_status == 0" key="status0">
                  <el-tag
                    size="mini"
                    style="padding:0px 3px;  color: rgb(243, 149, 227); background-color: rgb(248, 237, 249); border: 1px solid rgb(243, 178, 251);"
                  >待审核</el-tag>
                </div>
                <div v-if="scope.row.trade_status == 1" key="status1">
                  <el-tag type="warning" size="mini" style="padding:0px 3px;">待发货</el-tag>
                </div>
                <div v-if="scope.row.trade_status == 2" key="status2">
                  <el-tag type="primary" size="mini" style="padding:0px 3px;">已发货</el-tag>
                </div>
                <div v-if="scope.row.trade_status == 3" key="status3">
                  <el-tag type="success" size="mini" style="padding:0px 3px;">已完成</el-tag>
                </div>
                <div v-if="scope.row.trade_status == 5" key="status5">
                  <el-tag type="danger" size="mini" style="padding:0px 3px;">问题订单</el-tag>
                </div>
              </template>
          </el-table-column>
          <el-table-column v-if='clos[29].isChecked' label="风险评估" prop='supplier'></el-table-column>
          <el-table-column v-if='clos[30].isChecked' label="订单备注" prop='sellers_remark'></el-table-column>
          <el-table-column fixed="right" label="操作" width="80">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="showDetail(scope.$index,scope.row)"  style="padding:3px 13px">详情</el-button>
            </template>
          </el-table-column>
        </el-table>

          </el-row>
          <!-- 分页 -->
          <el-pagination
            style="margin-top:15px;"
            @size-change="pageSizeChange($event,'order/method/get.order.list/',{page_size:pagesize,page_no:pagenum,status:audit_status},'items')"
            @current-change="pageNumberChange($event,'order/method/get.order.list/',{page_size:pagesize,page_no:pagenum,status:audit_status},'items')"
            :current-page="pagenum"
            :page-sizes="[10, 30, 50, 100]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
          <el-dialog title="详情"  :visible.sync="drawer_showDetail" width="50%" >
              <el-form ref="form" :model="form" label-width="100px" size="mini">
                <el-form-item label="收货人信息" style="font-weight: bold;"></el-form-item>
                <el-row :gutter="0">
                  <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                    <el-form-item label="姓名" prop="name">
                      <el-input v-model="form.name" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                    <el-form-item label="手机号" prop="iphone">
                      <el-input v-model="form.iphone" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="0">
                  <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                    <el-form-item label="邮箱">
                      <el-input v-model="form.email" disabled></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <!-- <el-row :gutter="0">
                  <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                    <el-form-item label="省市县" prop="province">
                      <el-select v-model="form.province"  disabled placeholder="請選取縣市" @change="changeProvince">
                        <el-option v-for="(item,items) in form.citys" :key="items" :label="item.city" :value="items" ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                    <el-form-item label="鄉鎮市區" prop="child">
                      <el-select v-model="form.child" disabled placeholder="請選取鄉鎮市區">
                        <el-option v-for="(i,keys) in form.children"  :key="keys" :label="i.name" :value="keys"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row> -->
                <el-form-item label="详细地址" prop="addr">
                  <el-input type="textarea" disabled placeholder="请输入详细地址" v-model="form.addr"></el-input>
                </el-form-item>
                <el-form-item label="客户留言">
                  <el-input type="textarea" placeholder="留言" disabled v-model="form.textarea"></el-input>
                </el-form-item>
                <el-form-item label="订单状态" prop="trade_status" style="font-weight: bold;">
                  <el-select v-model="form.trade_status" disabled placeholder="请选择" >
                    <el-option v-for="item in form.tradeStatusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <!-- <el-form-item label="平台" style="font-weight: bold;">
                  <el-select v-model="form.value" filterable clearable placeholder="--请选择物流--">
                    <el-option
                      v-for="item in form.options"
                      :key="item.delivery_item_id"
                      :label="item.name"
                      :value="item.delivery_item_id"
                    ></el-option>
                  </el-select>
                </el-form-item>-->
                <el-form-item label="下单时间" style="font-weight: bold;" prop="create_time">
                  <el-input v-model="form.create_time" disabled></el-input>
                </el-form-item>
                <el-form-item label="订单信息" style="font-weight: bold;"></el-form-item>
                <el-form-item label="代收金额">
                  <el-input v-model="form.total_amount" disabled ></el-input>
                </el-form-item>
                <el-row v-for="(o,list) in form.orderTableData" :key="list" style="background-color: #eaeaea;border-radius: 10px; padding: 12px 35px 3px 1px;margin-bottom: 5px; ">
                  <el-form-item label="商品名" prop="goods_name">
                    <el-input v-model="o.goods_name" disabled></el-input>
                  </el-form-item>
                  <el-form-item label="规格" prop="key_value">
                    <el-input v-model="o.key_value" disabled></el-input>
                  </el-form-item>
                  <el-row>
                    <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                      <el-form-item label="SKU" prop="goods_sku">
                        <el-input v-model="o.goods_sku" disabled></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                      <el-form-item label="数量" prop="qty">
                        <el-input v-model="o.qty" disabled></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-row>
                <el-form-item label="订单备注" style="  font-weight: bold;">
                  <el-input type="textarea" disabled placeholder="请输入备注" v-model="form.textarearemarks"></el-input>
                </el-form-item>
              </el-form>
          </el-dialog>
    </el-card>
    
  </div>
</template>

<script>
import { AxiosReturn ,pageSizeChange,pageNumberChange,myExprotExcel,orderImport} from '../../assets/axios/index'
import MyDatePicker from '../../components/Child/MyDatePicker'
const cityOptions=['订单号','商品信息','网址','产品ID','地区','商品名称','单价','代收金额','件数','规格','SKU','姓名','手机','地址','邮箱','留言','选品人','设计','优化师','下单日期','是否改派订单', '改派单号','运单号', '物流公司',   '运费','采购费',  '汇款金额', '最新状态时间', '订单状态','风险评估', '订单备注']
export default {
  name: "gongdandetail",
  data() {
    return {
      drawer_showDetail:false,
      activeName: '0',
      audit_status:null,
      isSearch:"",
      searchForm:{
        keywords:"",
        consignee:"",//收货人
        time:"",
        begin_time:"",
        end_time:"",
      },
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
        { label: "SKU",prop:"goods_sku",isChecked: true },//10
        { label: "姓名",prop:"supplier",isChecked: true },
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
        { label: "订单状态",prop:"supplier",isChecked: false },
        { label: "风险评估",prop:"supplier",isChecked: false },
        { label: "订单备注",prop:"supplier",isChecked: false },
      ],
      form: {
        formOrderNo: "",
        name: "",
        iphone: "",
        email: "",
        addr: "",
        textarea: "",
        value: "",
        create_time: "",
        textarearemarks: "",
        platform: "",
        orderTableData: [{ goods_name: "" }],
        options: [
          {
            value: 0,
            label: "森鴻"
          },
          {
            value: 1,
            label: "7-11"
          },
          {
            value: 2,
            label: "全家"
          },
          {
            value: 3,
            label: "来尔富"
          },
          {
            value: 4,
            label: "ok便利店"
          },
          {
            value: 5,
            label: "其他"
          }
        ],
        value: 0,
        province: "",
        citys: [],
        child: "",
        children: [],
        trade_status: 0,
        tradeStatusOptions: [
          {
            value: 0,
            label: "待审核"
          },
          {
            value: 1,
            label: "配货中"
          },
          {
            value: 2,
            label: "已发货"
          },
          {
            value: 3,
            label: "已完成"
          },
          {
            value: 4,
            label: "已取消"
          }
        ]
      },
      cities: cityOptions,             //
      checkedCities: ["订单号","商品信息","商品名称","单价","代收金额","件数","规格","SKU","姓名"],
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
    pageSizeChange,
    pageNumberChange,
    orderImport,
    handleClick(tab, event) {
      let st = tab.name
      if (st === this.audit_status) {
        return;
      } else {
        console.log("bianle");
        this.audit_status = st;
      }
      this.pagesize = 10;
      this.pagenum = 1;
      this.getList(this.pagesize, this.pagenum, this.audit_status);
    },
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
        console.log(res)
      })
    },
     //城市选择
    changeProvince(val) {
      // console.log(val);
      for (var i = 0; i < this.form.citys.length; i++) {
        for (var c = 0; c < this.form.citys[i].children.length; c++) {
          if (val == c) {
            return (this.form.children = this.form.citys[c].children);
            // console.log(this.form.children);
          }
        }
      }
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
        this.multipleSelection = val;
    },
    //展示详情
    showDetail(index,row){
        console.log(index,row)
        this.drawer_showDetail=true
        this.form.name = row.consignee;
        this.form.iphone = row.mobile;
        this.form.email = row.email;
        this.form.province = row.province;
        this.form.child = row.city;
        this.form.addr = row.complete_address;
        this.form.textarea = row.buyer_remark;
        this.form.textarearemarks = row.sellers_remark; //卖家备注
        this.form.create_time = row.create_time;
        this.form.orderTableData = row.get_order_goods;
        this.form.trade_status = row.trade_status;
        this.form.orderTableData = row.get_order_goods;
        this.form.formOrderNo = row.order_no;
        this.form.total_amount = row.total_amount;
    }
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

