<template>
  <div>
    <el-card>
      <div id='myHeaderBox'>
          <el-input placeholder="请输入产品名称"  v-model="queryinfo.keywords"  @keyup.enter.native="search" size="mini" clearable></el-input>
          <el-select placeholder="审核状态" size="mini" v-model="queryinfo.audit_status" clearable>
            <el-option v-for="items in stateOption" :key="items.value" :label="items.label" :value="items.value" ></el-option>
          </el-select>
          
          <MyDatePicker v-model="queryinfo.createtime" ></MyDatePicker>
          <el-button type="primary" size="mini" icon="el-icon-search" @click="search">搜索</el-button>
          <el-button type="info" icon="el-icon-refresh" size="mini"  v-if='isSearch' @click="resetFun"></el-button>
          <el-button type="success" size="mini" @click="newProducts">新增产品</el-button>
      </div>
      <!-- 商品列表区域 S-->
      <!-- stripe 隔行变色 -->
      <el-table :data="dataList" border="" size="mini" stripe style="margin-top: 15px;">
        <el-table-column label="产品ID" prop="goods_code" width="80px"></el-table-column>
        <el-table-column label="产品名称" prop="name" show-overflow-tooltip width="140px"></el-table-column>
        <el-table-column label="产品英文名称" prop="ename" show-overflow-tooltip width="140px"></el-table-column>
        <el-table-column label="采购网站" prop="supplier[0].buynetinput" show-overflow-tooltip></el-table-column>
        <el-table-column label="选品人" prop="user_name" width="90px"></el-table-column>
        <el-table-column label="设计" prop="designer_name" width="90px"></el-table-column>
        <el-table-column label="审核状态" prop="audit_status" width="90px">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.audit_status==0" type="primary" size="mini">待审核</el-tag>
            <el-tag v-else-if="scope.row.audit_status==1" type="success" size="mini">已审核</el-tag>
            <el-tag v-else-if="scope.row.audit_status==2" type="warning" size="mini">待修改</el-tag>
            <el-tag v-else-if="scope.row.audit_status==3" type="danger" size="mini">已删除</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建日期" prop="create_time" width="180px"></el-table-column>
        <el-table-column label="备注" prop="product_remarks" width="180px"></el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              style="padding: 3px;"
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="showAreasCateDialog(scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              style="padding:3px;"
              icon="el-icon-delete"
              @click="removelist(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 S-->
      <!-- 分页 -->
      <div class="block" style="margin-top: 15px;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryinfo.page_no"
          :page-sizes="[10, 30, 50, 100]"
          :page-size="queryinfo.page_size" 
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
    <!-- 新增产品弹框 +++编辑产品弹框 -->
    <el-dialog :title="dailogTitle" :visible.sync="centerDialogVisible" width="50%" center @close="addDialogClosed">
      <!-- -----------  add pro   ---------- -->
      <el-form :model="addRuleForm" :rules="addRules" ref="addRuleForm" label-width="100px" class="demo-ruleForm" size="mini">
        <el-form-item label="产品名称" prop="name">
          <el-input v-model="addRuleForm.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="产品英文名称" prop="ename">
          <el-input v-model="addRuleForm.ename" clearable></el-input>
        </el-form-item>
        <!-- #A锚点 -->
        <!-- <el-form-item label="产品ID" prop="newproid">
          <el-input v-model="addRuleForm.newproid" clearable :disabled="true"></el-input>
        </el-form-item>-->
        <el-form-item label="选品人" prop="selection_id">
          <el-select placeholder="请选择选品人" v-model="addRuleForm.selection_id" clearable>
            <el-option
              v-for="person in selectionpersondata"
              :key="person.admin_id"
              :label="person.nickname"
              :value="person.admin_id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 供应商信息  start--->
        <el-form-item label="供应商信息">
          <el-button type="success" @click="addproinfo()">+</el-button>
        </el-form-item>
        <div
          v-for="(pro,p) in addRuleForm.supplier"
          :key="p"
          class="proinfoborder"
          style="margin-top:15px;"
        >
          <el-row>
            <el-col :span="2">
              <span class="proidclass">采购网址</span>
            </el-col>
            <el-col :span="10">
              <el-input placeholder="请输入采购网址" size="mini" v-model="pro.buynetinput" clearable></el-input>
            </el-col>
          </el-row>
          <el-row style="margin-top:10px;">
            <el-col :span="2">
              <span class="proidclass">公司名称</span>
            </el-col>
            <el-col :span="4">
              <el-input placeholder="请输入公司名称" size="mini" v-model="pro.companynameinput" clearable></el-input>
            </el-col>
            <el-col :span="2" style="margin-left:30px">
              <span class="proidclass">联系人</span>
            </el-col>
            <el-col :span="4">
              <el-input placeholder="请输入联系人" size="mini" v-model="pro.contactsinput" clearable></el-input>
            </el-col>
            <el-col :span="2" style="margin-left:30px">
              <span class="proidclass">电话</span>
            </el-col>
            <el-col :span="4">
              <el-input placeholder="请输入电话" size="mini" v-model="pro.phoneinput" clearable></el-input>
            </el-col>
            <el-col :span="2" style="margin-left:30px">
              <el-button type="danger" size="mini" @click="handleDelete(p)">删除</el-button>
            </el-col>
          </el-row>
        </div>
        <!-- 供应商信息  end -->
        <!-- 分类选择  start-->
        <el-row :gutter="20" style="margin-top:15px;">
          <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="10">
            <el-form-item label="分类选择" prop="goods_type_id">
              <el-select
                v-model="addRuleForm.goods_type_id"
                :disabled="dailogTitle=='编辑产品'"
                size="mini"
                clearable
                placeholder="请选择类别"
                @change="getSpecList"
              >
                <el-option
                  v-for="item in typeNameListSearch"
                  :key="item.goods_type_id"
                  :label="item.type_name"
                  :value="item.goods_type_id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!--分类选择 end -->
        <!--  规格类型----- 添加   -->
        <el-form-item label="规格类型"  v-if="dailogTitle=='新增产品'" class="proinfoborder proidclass">
          <div v-for="(s,i) in specTypeName" :key="i">
            <div>{{s.name}}</div>
            
            <el-checkbox-group
              v-model="s.checkedBox"
              style="padding-left:20px"
              @change="handleCheckedCitiesChange"
            >
              <el-checkbox
                v-for="(spec,index_Item) in s.spec_item"
                :label="s.spec_item[index_Item].item_name+'*-*'+s.spec_item[index_Item].spec_item_id"
                :key="index_Item"
                @change="getIndex(i)"
              >
                <span>{{ s.spec_item[index_Item].item_name}}</span>
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form-item>
        <!-- <el-button @click="create_Teable" size="mini" type="primary" :disabled="someLength">生成sku表格</el-button> -->
        <div style="height:300px;border: 1px dashed #c1c1cd;border-radius: 5px; background-color: white; #333;overflow-y: scroll;" v-if="createSKUHtml&&dailogTitle=='新增产品'" >
          <div style="display:flex;border:none;height:25px;line-height:25px;">
            <p style="width: 130px;" v-for="(title,t_index) in skuTitle" :key="t_index" >{{title.split('*-*')[0]}}</p>
          </div>
          <div>
            <div v-for="(item,indexss) in mySKUTable" :key="indexss" class="skuTableCss">
              <p v-for="(sm,keydd) in item" :key="keydd" style="width:130px">
                <span v-if="keydd<item.length-3">{{sm.split('*-*')[0]}}</span>
                <span v-if="keydd===item.length-3">
                  <input  style="width:80%" type="text" class="skuTableInput" v-model="mySKUTable[indexss][keydd]">
                </span>
                <span v-if="keydd>=item.length-2">
                  <input  style="width:80%" type="number" class="skuTableInput" v-model="mySKUTable[indexss][keydd]">
                </span>
              </p>
            </div>
          </div>
        </div>
        <div v-if="dailogTitle=='编辑产品'">
            <el-table :data="addRuleForm.spec_combo" border="" size="mini"  style="margin-top: 15px;"  >
              <el-table-column label="型号" prop="key_value" show-overflow-tooltip width="140px"></el-table-column>
              <el-table-column label="SKU" >
                  <template slot-scope="scope">
                      <input style="width:80%" type="text" class="skuTableInput" v-model="scope.row.goods_sku">
                  </template>
              </el-table-column>
              <el-table-column label="价格">
                  <template slot-scope="scope">
                      <input style="width:80%" type="text" class="skuTableInput" v-model="scope.row.price">
                  </template>
              </el-table-column>
              <el-table-column label="数量">
                  <template slot-scope="scope">
                      <input style="width:80%" type="text" class="skuTableInput" v-model="scope.row.store_qty">
                  </template>
              </el-table-column>
            </el-table>
        </div>
        <!-- 推荐素材 -->
        <el-form-item label="推荐素材" style="margin-top:15px;">
          <el-button type="success" @click="material()">+</el-button>
        </el-form-item>
        <el-form-item>
          <el-row
            v-for="(mgroup,m) in addRuleForm.material"
            :key="m"
            style="margin-top:5px"
            :gutter="24"
          >
            <el-col :span="21">
              <el-input size="mini" placeholder="请输入网址" v-model="mgroup.sucai">
                <template slot="prepend">Http://</template>
              </el-input>
            </el-col>
            <el-col :span="2">
              <el-button type="danger" size="mini" @click="materialDelete(m)">删除</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <!-- 产品卖点 -->
        <el-form-item label="产品卖点">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="addRuleForm.keywords"
            maxlength="300"
            :autosize="{ minRows: 2, maxRows: 4}"
            show-word-limit
          ></el-input>
        </el-form-item>
        <!-- 备注 -->
        <el-form-item label="备注">
          <el-input
            type="textarea"
            placeholder="请输入备注"
            v-model="addRuleForm.product_remarks"
            maxlength="300"
            :autosize="{ minRows: 2, maxRows: 4}"
            show-word-limit
          ></el-input>
        </el-form-item>
        <!-- 提交/取消 -->
        <el-form-item style="text-align: center;margin-right: 100px;margin-top: 15px;">
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForReview('addRuleForm')">提交审核</el-button>
        </el-form-item>
      </el-form>
      <!-- ----------- add pro  ---------- -->
    </el-dialog>
    <!-- //////////////////////////////////////////////////////////////////////////////////////// -->
  </div>
</template>

<script>
import TheProblem from "../../components/TheProblem";
import { nowDate,AxiosReturn } from "../../assets/axios/index";
import MyDatePicker from '../../components/Child/MyDatePicker'
// import { setTimeout } from 'timers';
let data = [
  {
    propertyList: [
      {
        name: "份数大小",
        value: "大"
      }
    ],
    inventory: "0",
    discount: "0",
    price: "0"
  }
];
export default {
  name: "productList",
  components: {
    TheProblem,
    MyDatePicker
  },
  data() {
    return {
      isSearch:false,
      data: [],
      dailogTitle: "",
      // 新增产品
      addRuleForm: {
        name: "", //产品名称 #A锚点
        ename: "", //产品英文名称
        selection_id: "", //选品人
        content: "详情页",
        attachment: ["//image_1.jpg"], // 商品相册
        // create_time:"",
        supplier: [
          {
            buynetinput: "", //采购网址
            companynameinput: "", //公司名称
            contactsinput: "", //联系人
            phoneinput: ""
          }
        ], //供应商信息
        goods_type_id: "", //分类编号id
        material: [{ sucai: "" }], //素材
        keywords: "", //关键词 -- > 产品卖点
        product_remarks: "", //备注
        is_postage: 1,
        goods_spec_item: [] //SKU规格
      },
      // 搜索
      // 审核状态
      state: "",
      stateOption: [
        {value: "0",label: "未审核"},
        {value: "1",label: "已审核"},
        {value: "2",label: "待修改"},
        {value: "3",label: "已删除"}
      ],
      // 选品
      xuanpindata: [],
      // 商品列表
      dataList: [],
      centerDialogVisible: false,
      edit: false,
      //弹框  选品人
      selectionperson: "",
      selectionpersondata: [],
      value: "",
      valueunit: "",
      // -----------------
      // SKU
      UpLoadqaq: [],
      sku_zhognjiajian: [],
      isCreated: false,
      skuTitle: [],
      skuEnd: [],
      skuInput: [],
      mySKUTable: [],
      someLength: true,
      createSKUHtml: false,
      // 编辑sku
      skutabledataEdit: [],
      // 推荐素材
      materialgroup: [{ sucai: "" }],
      // 产品卖点
      shelltextarea: "",
      product_remarks: "",
      // pagenum: 1, //当前页数
      total: 0, //总数
      // pagesize: 10, // 每页显示的条数
      // 日期
      createtime: "",
      queryinfo: {
        keywords: "",
        audit_status: "",
        status: "", //是否包邮
        createtime:"",
        begin_time:"",
        end_time:"",
        page_no: 1, // 当前页
        page_size: 10 // 每页显示的条数
      },
      addRules: {
        name: [{ required: true, message: "请输入产品名称", trigger: "blur" }],
        // newproid: [{ required: true, message: "请输入产品ID", trigger: "blur" }],
        selection_id: [
          { required: true, message: "请选择选品人", trigger: "change" }
        ],
        // addvalueunit: [
        //   { required: true, message: "请选择计量单位", trigger: "change" }
        // ],
        goods_type_id:[
          { required: true, message: "请选择分类", trigger: "change" }
        ]
      },
      typeNameListSearch: [],
      isIndeterminate: true, //设置 indeterminate 状态，只负责样式控制
      specTypeName: [], //所有多选
      index: "",
      addRulesEdit: {
        nameEdit: [
          { required: true, message: "请输入产品名称", trigger: "blur" }
        ],
        selectionpersonEdit: [
          { required: true, message: "请选择选品人", trigger: "change" }
        ],
        goodsTypeIdEdit: [
          { required: true, message: "请选择分类", trigger: "change" }
        ]
      },
      typeNameListSearchEdit: [],
      isIndeterminateEdit: true, //设置 indeterminate 状态，只负责样式控制
      specTypeNameEdit: [] //所有多选
    };
  },
  created: function() {
    this.getAllList()
    this.getSelectionList() // 获取选品下拉数据
    this.getSelect()
  },
  methods: {
    nowDate,
    AxiosReturn,
    getIndex(i) {
      this.index = i;
    },
    resetFun(){
        this.isSearch=false
        for(var qkey in this.queryinfo){
            this.queryinfo[qkey]=""
        }
        this.queryinfo.page_no=1 
        this.queryinfo.page_size=10
        this.getAllList()
    },
    // 搜索
    search() {
        this.isSearch=true
        this.queryinfo.page_no=1 
        this.queryinfo.page_size=10
        this.getAllList()
    },
    // 获取所有列表
    getAllList() {
      let myParams={}
      if(this.isSearch){
          myParams=this.queryinfo
          if(this.queryinfo.createtime!=""&&this.queryinfo.createtime!=null){
            this.queryinfo.begin_time=Math.round(this.queryinfo.createtime[0]/1000) 
            this.queryinfo.end_time=Math.round(this.queryinfo.createtime[1]/1000) 

          }else{
            this.queryinfo.begin_time=""
            this.queryinfo.end_time=""
          }
      }else{
          myParams={
              page_size: this.queryinfo.page_size, //每页条数
              page_no: this.queryinfo.page_no //翻页页数
          }
      }
      
      let that = this;
      this.AxiosReturn("product/method/get.product.admin.list",myParams).then(function(res) {
          if (res.status === 200) {
            let result = res.data.items;
            that.dataList = result;
            that.total = res.data.total_result;
          }else{
            this.$message.warning(res.message)
          }
        })
    },
    // 监听pagesize改变的事件
    handleSizeChange: function(newSize) {
      this.queryinfo.page_size = newSize;
      this.getAllList();
    },
    // 监听页码值改变的事件
    handleCurrentChange: function(newPage) {
      this.queryinfo.page_no = newPage;
      this.getAllList();
    },
    // 获取选品下拉数据
    getSelectionList() {
      let that = this;
      this.AxiosReturn("admin/method/get.admin.list/", {
          group_id: 13,
          status: 1
        }).then(function(res) {
          if (res.status === 200) {
            that.xuanpindata = res.data.items;
            that.selectionpersondata = res.data.items;
          }else{
            this.$message.warning(res.message)
          }
        })
    },
    // 获取类别
    getSelect() {
      let that = this;
      this.AxiosReturn("goods_type/method/get.goods.type.select", {}).then(function(res) {
          if (res.status === 200) {
            that.typeNameListSearch = res.data;
            that.typeNameListSearchEdit = res.data;
          }else{
            this.$message.warning(res.message)
          }
        })
    },
    // 监听 添加用户对话框的关闭事件 ---清空form表单
    aDialogClosed() {
      this.$refs.addRuleForm.resetFields();
    },
    // 新增产品btn
    newProducts() {
      //点击添加是将数据form表单初始化
      this.addRuleForm.ename=""
      this.addRuleForm.supplier=[{buynetinput: "",companynameinput: "",contactsinput: "",phoneinput: ""}]
      this.specTypeName=[]
      this.addRuleForm.material=[{ sucai: "" }]
      this.addRuleForm.product_remarks=""
      this.addRuleForm.keywords=""
      this.createSKUHtml = false

      this.dailogTitle = "新增产品"
      this.centerDialogVisible = true
    },
    //编辑--------------------------------------------------
    // 编辑btn
    showAreasCateDialog(row) {
      let that=this
      this.dailogTitle = "编辑产品";
      this.edit = true;
      this.addRuleForm.product_id = row.product_id;
      this.addRuleForm.name = row.name;
      this.addRuleForm.ename = row.ename;
      this.addRuleForm.selection_id = row.selection_id; //选品人
      // this.addRuleForm.content=row.
      this.addRuleForm.attachment = [] // 商品相册
      this.addRuleForm.supplier = row.supplier //供应商信息
      this.addRuleForm.goods_type_id=row.goods_type_id //分类编号id
      this.addRuleForm.material = row.material //素材
      this.addRuleForm.keywords = row.keywords; //关键词 -- > 产品卖点
      this.addRuleForm.product_remarks = row.product_remarks; //备注
      //获取分类选择的数据
      // this.getSpecList(row.goods_type_id)
      // this.AxiosReturn("spec?method=get.goods.spec.list",{goods_type_id:row.goods_type_id}).then(res=>{
      //   
      // })
      //获取 一条数据 cao
      this.AxiosReturn("product/method/get.products.item",{product_id:row.product_id}).then(res=>{
        that.addRuleForm.spec_combo=res.data.getspec_goods
        console.log('///SKU--JSOn ',that.addRuleForm.spec_combo)
        that.centerDialogVisible = true;
      })
    },
    
    //递归函数
    arrp(arr) {
      if (arr.length == 1) {
        return arr[0]; //最终合并成一个
      } else {
        //有两个子数组就合并
        let arrySon = [];
        //将组合放到新数组中
        arr[0].forEach((item, index) => {
          arr[1].forEach((item1, index1) => {
            arrySon.push([].concat(arr[0][index], arr[1][index1]));
          });
        });
        // 新数组并入原数组,去除合并的前两个数组
        arr[0] = arrySon;
        arr.splice(1, 1);
        // 递归
        return this.arrp(arr);
      }
    },
    // 获取产品分类规格列表
    getSpecList(pp) {
      let program={}
      if(pp){
        program={goods_type_id:pp}
      }else{
        program={goods_type_id: that.addRuleForm.goods_type_id}
      }
      let that = this;
      this.AxiosReturn("spec?method=get.goods.spec.list",program).then(function(res) {
          if (res.status === 200) {
            that.skuTitle = [];
            that.UpLoadqaq = [];
            that.specTypeName = res.data.spec_config;
            if(that.specTypeName.length==0){
                that.$message('该分类下暂无，规格，如果需要请去产品分类中添加')
            }
            that.someLength = true;
            that.createSKUHtml = false;
            that.mySKUTable = [];
            localStorage.sku = [];
            that.isCreated = false;
            for (let i in that.specTypeName) {
              that.skuTitle.push(
                that.specTypeName[i].name + "*-*" + that.specTypeName[i].name
              );
            }
            that.skuTitle.push(
              "sku*-*goods_sku",
              "单价*-*price",
              "库存*-*store_qty"
            );
            that.specTypeName.map(item => {
              that.$set(item, "checkedAll", false);
              that.$set(item, "checkedBox", []);
            });
          }else{
            this.$message.warning(res.message)
          }
        })
        
    },
    // 单选
    handleCheckedCitiesChange(value){
      if (this.isCreated) {
        console.log("qwqsaas", JSON.parse(localStorage.sku));
        this.UpLoadqaq = JSON.parse(localStorage.sku);
      }
      this.isCreated = false;
      this.UpLoadqaq[this.index] = value;
      localStorage.sku = JSON.stringify(this.UpLoadqaq);
      if (this.UpLoadqaq.length === this.specTypeName.length) {
        //表格的生成与显示
        let notEmpty = 0;
        for (var eItem of this.UpLoadqaq) {
          if (eItem.length == 0) notEmpty++;
        }
        if (notEmpty == 0) {
          this.someLength = false;
          this.create_Teable();
        } else {
          this.someLength = true;
          this.createSKUHtml = false;
          this.mySKUTable = [];
        }
      } else {
        this.someLength = true;
        this.createSKUHtml = false;
        this.mySKUTable = [];
      }
    },
    create_Teable() {
      this.isCreated = true;
      // this.mySKUTable = [];
      const ZZARR = this.UpLoadqaq;
      let newSKUTable=[]

      if (ZZARR.length > 1) {
        newSKUTable = this.arrp(ZZARR);
      } else if (ZZARR.length == 1) {
        ZZARR[0].map(item => {
          var q = new Array();
          q[0] = item;
          console.log(item, q);
          newSKUTable.push(q);
        });
      }

      newSKUTable.map(item => {
        item.push("", "", "")
        return item;
      });
      console.log('这个样子',newSKUTable)
      if(this.mySKUTable.length>0){
        var s_num=newSKUTable.length-3
        let _this=this
            for(var L in newSKUTable ){
              let len_for=newSKUTable[0].length-3
              for(var s=0;s<_this.mySKUTable.length;s++){
                var same=true
                for(var i=0;i<len_for;i++){
                    if(newSKUTable[L][i]!=_this.mySKUTable[s][i]){
                        same=false
                        break
                    }
                }
                if(same){
                  newSKUTable[L]=_this.mySKUTable[s]
                }
              }
          }
          _this.mySKUTable=newSKUTable
      }else{
          console.log('都是这里吗')
          this.mySKUTable=newSKUTable
      }

      this.createSKUHtml = true;
    },
//啊啊啊啊啊啊啊啊啊啊啊啊啊啊 实在不行我就退到这里
    // 新增弹框提交
    submitForReview(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let that = this;
          // this.addRuleForm.create_time=this.nowDate()
          if (this.dailogTitle == "新增产品") {
            let keyObjData = [];
            console.log(that.mySKUTable);
            for (var L = 0; L < that.mySKUTable.length; L++) {
              var sObj = {};
              sObj.key_value = "";
              sObj.key_name = [];
              that.skuTitle.map((it, ind) => {
                sObj.id=ind
                if (ind === that.skuTitle.length - 3) {
                  sObj.goods_sku = that.mySKUTable[L][ind];
                } else if (ind === that.skuTitle.length - 2) {
                  sObj.price = that.mySKUTable[L][ind];
                } else if (ind === that.skuTitle.length - 1) {
                  sObj.store_qty = that.mySKUTable[L][ind];
                } else {
                  console.log("??", that.mySKUTable[L][ind],it);
                  sObj.key_value +=it.split("*-*")[0] +":" +that.mySKUTable[L][ind].split("*-*")[0] +",";
                  sObj.key_name.push(that.mySKUTable[L][ind].split("*-*")[1]);
                }
              });
              sObj.bar_code = "zidingyi00";
              sObj.key_value = sObj.key_value.substr(
                0,
                sObj.key_value.length - 1
              );
              keyObjData.push(sObj);
            }
            console.log("----> 最终状态", keyObjData);
            that.addRuleForm.spec_combo = keyObjData;
            console.log(that.addRuleForm);
            //判断sku不能为空，不能重复
            let oldSKU=that.addRuleForm.spec_combo
            let newSku=[]
            for(var s=0;s<oldSKU.length;s++){
                if(oldSKU[s].goods_sku==""){
                    break
                }else{
                    newSku.push(oldSKU[s].goods_sku)
                }
            }
            if(oldSKU.length!=newSku.length){
              this.$message.warning('SKU 不能为空')
              return
            }
            var repeatqw = Array.from(new Set(newSku.filter(function (item, index, self) {
              return self.indexOf(item) !== index
            })))
            if(repeatqw.length>0){
              var msg=""
              for(var m of repeatqw){
                msg += m+' '
              }
              this.$message.warning(`SKU ${msg}重复出现，(sku不能重复)`)
              return
            }

            this.AxiosReturn("goods/method/add.products.item/",that.addRuleForm).then(function(res){
                console.log(res)
                if (res.status === 200) {
                  that.$message({
                    message: res.message,
                    type: "success"
                  });
                  that.centerDialogVisible = false;
                  that.getAllList();
                }else{
                  that.$message.warning(res.message)
                }
              })
              .catch(function(error) {
                console.log(error);
              });
          } else if (this.dailogTitle === "编辑产品") {
            
            //判断sku不能为空，不能重复
            let oldSKU=that.addRuleForm.spec_combo
            let newSku=[]
            for(var s=0;s<oldSKU.length;s++){
                if(oldSKU[s].goods_sku==""){
                    break
                }else{
                    newSku.push(oldSKU[s].goods_sku)
                }
            }
            if(oldSKU.length!=newSku.length){
              this.$message.warning('SKU 不能为空')
              return
            }
            var repeatqw = Array.from(new Set(newSku.filter(function (item, index, self) {
              return self.indexOf(item) !== index
            })))
            if(repeatqw.length>0){
              var msg=""
              for(var m of repeatqw){
                msg += m+' '
              }
              this.$message.warning(`SKU ${msg}重复出现，(sku不能重复)`)
              return
            }
            this.AxiosReturn("product/method/set.product.item", that.addRuleForm).then(function(res) {
                if (res.status === 200) {
                  console.log(res);
                  that.$message({
                    message: res.message,
                    type: "success"
                  });
                  that.centerDialogVisible = false;
                  that.getAllList();
                }else{
                  that.$message.warning(res.message)
                }
              })
              .catch(function(error) {
                console.log(error);
              });
          }
        } else {
          return false;
        }
      });
    },
    addDialogClosed() {
      this.$refs.addRuleForm.resetFields();
    },
    // 采购网址添加
    addproinfo() {
      this.addRuleForm.supplier.push({
        buynetinput: "", //采购网址
        companynameinput: "",
        contactsinput: "",
        phoneinput: ""
      });
    },
    // 推荐素材添加
    material() {
      this.addRuleForm.material.push({
        sucai: ""
      });
    },

    // 推荐素材添加删除
    materialDelete(index) {
      this.addRuleForm.material.splice(index, 1);
    },
    // 删除
    handleDelete(index) {
      this.addRuleForm.supplier.splice(index, 1);
    },
    // ----------------------------------------------
    // 删除
    removelist(row) {
      // console.log(row.name)
      this.$confirm(`确定要删除 ' ${row.name} ' 产品吗`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let that = this;
          this.AxiosReturn("product/method/del.products.list/", {
              product_id: row.product_id,
              is_delete: 1
            })
            .then(function(res) {
              // console.log(res);
              if (res.status === 200) {
                that.getAllList();
                that.$message({
                  message: res.message,
                  type: "success",
                  duration: 3000
                });
              } else if (res.status === 500) {
                that.$message({
                  message: res.message,
                  type: "warning",
                  duration: 3000
                });
              }
            })
            .catch(function(error) {
              console.log(error);
            });
          
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
      
    }
  },
  computed: {
    specList() {
      let result = [];
      data.forEach(item => {
        item.propertyList.forEach(property => {
          let target = result.find(spec => {
            return spec.name === property.name;
          });
          if (!target) {
            result.push({
              name: property.name,
              valueList: [{ name: property.value }]
            });
          } else {
            if (
              !target.valueList.find(value => value.name === property.value)
            ) {
              target.valueList.push({ name: property.value });
            }
          }
        });
      });
      return result;
    }
  },
  mounted() {}
};
</script>

<style scoped >
.skuTableCss {
  display: flex;
  height: 30px;
  line-height: 30px;
  background-color: #e1f0ff;
}
.skuTableCss + div {
  border-top: 1px dashed rgb(193, 193, 205);
  /* border-top: 1px dashed #fff; */
}
.skuTableInput {
  outline-style: none;
  border: 1px solid #ccc;
  border-radius: 3px;
  font-size: 14px;
  font-weight: 500;
  font-family: "Microsoft soft";
}
.skuTableInput:focus {
  border-color: #66afe9;
  outline: 0;
  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
    0 0 8px rgba(102, 175, 233, 0.6);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
    0 0 8px rgba(102, 175, 233, 0.6);
}
.proidclass {
  font-size: 15px;
  font-weight: bold;
}
.proinfoborder {
  border: 1px dashed #c1c1cd;
  border-radius: 3px;
  padding: 10px 0px 10px 0;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.mydivBox div > p {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  border: 1px solid #333;
}
</style>
