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
          <el-table-column fixed="right" label="操作" width="190">
            <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="修改" placement="top">
              <el-button  type="primary"  icon="el-icon-edit" size="mini" @click="modifyClick(scope.row)" circle ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="审核" placement="top">
              <el-button type="warning" class="fa fa-check-square-o" size="mini"  @click="examineClick(scope.row)" circle></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="发货" placement="top">
              <el-button type="success" class="fa fa-paper-plane" :disabled="scope.row.trade_status != 1" size="mini" @click="deliverClick(scope.row)" circle ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除订单" placement="top">
              <div style="display: inline-block;" v-if="scope.row.trade_status == 0 || scope.row.trade_status == 1 || scope.row.trade_status == 4 || scope.row.trade_status == 5  ">
                <el-button type="danger" icon="el-icon-delete" @click="recycleBinClick(scope.row.order_no)" circle size="mini" ></el-button>
              </div>
              <div v-if="scope.row.trade_status == 2 || scope.row.trade_status == 3 " style="display: inline-block;">
                <el-button type="danger" icon="el-icon-delete" @click="tips" circle size="mini"></el-button>
              </div>
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
        <!-- ***** 修改 ****** -->
      <el-dialog title="修改订单" width="50% !important" center :visible.sync="dialogEdit">
        <el-form ref="form" :model="form" :rules="formrules" label-width="100px" size="mini">
          <el-form-item label="收货人信息" style="font-weight: bold;"></el-form-item>
          <el-row :gutter="0">
            <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="姓名" prop="name">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="手机号" prop="iphone">
                <el-input v-model="form.iphone"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="0">
            <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="邮箱">
                <el-input v-model="form.email"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="0">
            <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="省市县" prop="province">
                <el-select v-model="form.province" placeholder="請選取縣市" @change="changeProvince">
                  <el-option v-for="(item,items) in form.citys" :key="items" :label="item.city" :value="items" ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="鄉鎮市區" prop="child">
                <el-select v-model="form.child" placeholder="請選取鄉鎮市區">
                  <el-option v-for="(i,keys) in form.children"  :key="keys" :label="i.name" :value="keys"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="详细地址" prop="addr">
            <el-input type="textarea" placeholder="请输入详细地址" v-model="form.addr"></el-input>
          </el-form-item>
          <el-form-item label="客户留言">
            <el-input type="textarea" placeholder="留言" v-model="form.textarea"></el-input>
          </el-form-item>
          <el-form-item label="订单状态" prop="trade_status" style="font-weight: bold;">
            <el-select v-model="form.trade_status" placeholder="请选择" disabled>
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
            <el-input v-model="form.total_amount" @blur="setPrice"></el-input>
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
            <el-input type="textarea" placeholder="请输入备注" v-model="form.textarearemarks"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="modifySubmit('form')" size="mini">提交</el-button>
        </span>
      </el-dialog>
      <!-- ***** 审核 ****** -->
      <el-dialog title="订单审核" :visible.sync="toExamineVisible" width="30% !important" center>
        <span class="orderlistshenhe">！审核订单</span>
        <span slot="footer" class="dialog-footer">
          <span v-if="tradeStatus == 2 || tradeStatus == 3">
            <el-button type="primary" @click="toBeDelivered" size="mini" v-show="tradeStatusShow = false">审核</el-button>
          </span>
          <span v-if="tradeStatus == 0 ">
            <el-button type="primary" @click="toBeDelivered" size="mini">审核</el-button>
          </span>
          <span v-if="tradeStatus == 5">
            <el-button type="warning" size="mini" @click="setExamine">待审核</el-button>
            <el-button type="primary" size="mini" @click="setToBeDelivered">待发货</el-button>
          </span>
          <span v-if="tradeStatus != 5">
            <el-button type="warning" @click="problemOrder" size="mini">问题订单</el-button>
          </span>
          <el-button type="info" @click="auditCancel" size="mini">取消</el-button>
        </span>
      </el-dialog>
      <!-- ***** 发货 ****** -->
      <el-dialog title="发货设置" :visible.sync="sendVisible" width="30% !important" center>
        <el-form
          :model="sendForm"
          :rules="sendFormRules"
          ref="sendForm"
          size="mini"
          label-width="100px"
        >
          <el-row :gutter="0">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-form-item label="物流公司" prop="value">
                <el-select v-model="sendForm.value" filterable clearable placeholder="--请选择物流--">
                  <el-option
                    v-for="item in sendForm.options"
                    :key="item.delivery_item_id"
                    :label="item.name"
                    :value="item.delivery_item_id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="sendSubmit('sendForm')" size="mini">提交</el-button>
        </span>
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
      isSearch:false,
      searchForm:{
        keywords:"",
        consignee:"",//收货人
        time:"",
        begin_time:"",
        end_time:"",
      },
      toBeExamineNo: "",
      tradeStatus: 2,
      tradeStatusShow: false,
      toExamineVisible:false,
      sendForm:{
        options:[]
      },
      sendVisible:false,
      sendFormRules: {
        value: [
          { required: true, message: "请选择物流公司", trigger: "change" }
        ],
        courierNum: [
          { required: true, message: "请输入快递单号", trigger: "blur" }
        ]
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
      dialogEdit: false,
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
      formrules: {
        name: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        iphone: [
          { required: true, message: "请输入用户电话", trigger: "blur" }
        ],
        province: [{ required: true, message: "請選取縣市", trigger: "blur" }],
        child: [{ required: true, message: "請選取鄉鎮市區", trigger: "blur" }],
        addr: [{ required: true, message: "请输入详细地址", trigger: "blur" }]
      },
      z_fahuo:[],
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
    this.getCompany()
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
      }else{
          myParams={
              page_size:this.pagesize, //每页条数
              page_no:this.pagenum, //翻页页数
          }
      }
      this.AxiosReturn('order/method/get.order.list/',myParams).then(res=>{
        that.tableData=res.data.items
        that.total=res.data.total_result
      })
    },
    //物流公司
    getCompany() {
      this.AxiosReturn("delivery_item/method/get.delivery.company.select/",{}).then(res => {
        this.sendForm.options = res.data; 
      });
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
        this.multipleSelection = JSON.stringify(val)
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
    tips() {
      this.$message({
        message: "无法删除",
        type: "warning"
      });
    },
     // 修改
    modifyClick(row) {
      this.dialogEdit = true;
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
    },
    // 修改提交
    modifySubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.AxiosReturn("order/method/set.order.item/", {
            order_no: this.form.formOrderNo,
            consignee: this.form.name,
            mobile: this.form.iphone,
            email: this.form.email,
            province: this.form.province,
            city: this.form.child,
            address: this.form.addr,
            buyer_remark: this.form.textarea,
            sellers_remark: this.form.textarearemarks
            // get_order_goods: this.form.orderTableData
            // trade_status: this.form.trade_status,
          }).then(res => {
            this.$message({
              message: res.message,
              type: "success"
            });
            this.dialogEdit = false;
            this.tableData = res.items;
            this.getList(this.pagesize, this.pagenum);
            // this.total = res.total_result;
          });
        } else {
          return false;
        }
      });
    },
     //城市选择
    changeProvince(val) {
      for (var i = 0; i < this.form.citys.length; i++) {
        for (var c = 0; c < this.form.citys[i].children.length; c++) {
          if (val == c) {
            return (this.form.children = this.form.citys[c].children);
          }
        }
      }
    },
     // 更改应付金额
    setPrice() {
      this.AxiosReturn("order/method/change.price.order.item/", {
        order_no: this.form.formOrderNo,
        total_amount: this.form.total_amount
      }).then(res => {
        if (res.status === 200) {
          this.$message({
            message: res.message,
            type: "success"
          });
          this.getList(this.pagesize, this.pagenum);
        } else {
          this.$message({
            message: "应付金额修改失败",
            type: "waring"
          });
        }
        if (res.status === 500) {
          this.$message({
            message: res.message,
            type: "error"
          });
        }
      });
    },
     // 审核
    examineClick(row) {
      this.toExamineVisible = true;
      this.toBeExamineNo = row.order_no;
      this.tradeStatus = row.trade_status;
    },
    // 待审核
    toBeDelivered() {
      this.AxiosReturn("order/method/audit.order.item/", {
        order_no: this.toBeExamineNo,
        trade_status: 1
      }).then(res => {
        if (res.status == 200) {
          this.$message({
            message: res.message,
            type: "success"
          });
          this.toExamineVisible = false;
          this.getList(this.pagesize, this.pagenum);
        } else {
          this.$message({
            message: res.message,
            type: "warning"
          });
        }
      });
    },
    // 问题订单
    problemOrder() {
      this.AxiosReturn("order/method/audit.order.item/", {
        order_no: this.toBeExamineNo,
        trade_status: 5
      }).then(res => {
        if (res.status == 200) {
          this.$message({
            message: res.message,
            type: "success"
          });
          this.toExamineVisible = false;
          this.getList(this.pagesize, this.pagenum);
        } else {
          this.$message({
            message: res.message,
            type: "warning"
          });
        }
      });
    },
    // 取消
    auditCancel() {
      this.toExamineVisible = false;
    },
     // 待审核
    setExamine() {
      this.AxiosReturn("order/method/audit.order.item/", {
        order_no: this.toBeExamineNo,
        trade_status: 0
      }).then(res => {
        if(res.status == 200){
          this.$message({
            message: res.message,
            type: "success"
          });
          this.toExamineVisible = false;
          this.getList(this.pagesize, this.pagenum);
        }else{
          this.$message({
            message: res.message,
            type: "warning"
          });
        }
      });
    },
     // 待发货
    setToBeDelivered() {
      this.AxiosReturn("order/method/audit.order.item/", {
        order_no: this.toBeExamineNo,
        trade_status: 1
      }).then(res => {
        if (res.status == 200) {
          this.$message({
            message: res.message,
            type: "success"
          });
          this.toExamineVisible = false;
          this.getList(this.pagesize, this.pagenum);
        } else {
          this.$message({
            message: res.message,
            type: "warning"
          });
        }
      });
    },
     // 发货
    deliverClick(val) {
      this.getOrderGoods = val.get_order_goods;
      this.deliveryStatus = val.delivery_status;
      this.orderTradeStatus = val.trade_status;
      this.deliveryOrderNo = val.order_no;
      this.z_fahuo=val

      // if (val.get_order_goods.length >= 0 &&val.delivery_status == 0 &&val.trade_status == 1){
      //   this.sendVisible = true;
      // }else if(val.delivery_status ==0 && val.trade_status==0){
      //   this.$message({
      //     message: "请先去审核",
      //     type: "warning"
      //   });
      // } else {
      //   this.$message.error("无法发货");
      // }

      if (val.get_order_goods.length >0 &&val.trade_status == 1){
        this.sendVisible = true;
      }else if(val.get_order_goods.length ==0 &&val.trade_status == 1){
        this.$message.warning('订单中没有商品 无法发货');
      } else {
        this.$message.warning("审核过之后才能发货");
      }



    },
    // 将订单放入回收站
    recycleBinClick(orderNo) {
      this.$confirm("此操作将订单放入回收站中, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          this.AxiosReturn("order/method/recycle.order.item/", {
            order_no: orderNo,
            is_recycle: 1
          }).then(res => {
            if (res.status == 200) {
              this.$message({
                type: "success",
                message: "订单放入回收站成功!"
              });
              this.getList(this.pagesize, this.pagenum);
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
     // 发货提交
    sendSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if(this.z_fahuo.get_order_goods.length==0){
            this.$message.warning('订单中没有商品 无法发货')
            return
          }
          let faHuo={
            order_no:this.z_fahuo.order_no,
            order_goods_id:[],
            delivery_item_id:this.sendForm.value
          }
          for(var goods of this.z_fahuo.get_order_goods){
              faHuo.order_goods_id.push(goods.order_goods_id)
          }
          this.AxiosReturn("order/method/delivery.order.item",faHuo).then(res => {
            if (res.status === 200) {
              this.$message({
                message: res.message,
                type: "success"
              });
              this.getList(this.pagesize, this.pagenum, 2);
              this.sendVisible = false;
            }
            if (res.status === 500) {
              this.$message({
                message: res.message,
                type: "warning"
              });
            }
          });
          
        } else {
          return false;
        }
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

