<template>
  <div>
    <el-card>
      <!-- header -->
      <div id='myHeaderBox' >
          <el-input placeholder="产品关键词搜索"  v-model="queryinfo.keywords"  @keyup.enter.native="search" size="mini" clearable></el-input>
          <el-select placeholder="审核状态" size="mini" v-model="queryinfo.audit_status" clearable>
            <el-option v-for="items in stateOption" :key="items.value" :label="items.label" :value="items.value" ></el-option>
          </el-select>
          <MyDatePicker v-model="queryinfo.createtime" ></MyDatePicker>
          <el-button type="primary" size="mini" icon="el-icon-search" @click="search">搜索</el-button>
          <el-button type="info" icon="el-icon-refresh" size="mini"   v-if='isSearch' @click="resetFun"></el-button>
      </div>
      <!-- table -->
      <el-table :data="tableData" border="" size="mini" style="width: 100%;margin-top:15px;">
        <el-table-column label="产品ID">
          <template slot-scope="scope">{{ scope.row.goods_code}}</template>
        </el-table-column>
        <el-table-column prop="name" label="产品名称" show-overflow-tooltip></el-table-column>
         <el-table-column prop="supplier" label="采购网站" show-overflow-tooltip width="180">
          <template slot-scope="scope">
            <div v-for="(s,p) in scope.row.supplier" :key="p">{{s.buynetinput}}</div>
          </template>
        </el-table-column>
       
        <el-table-column prop="user_name" label="选品人" show-overflow-tooltip></el-table-column>
        <el-table-column prop="designer_name" label="设计"></el-table-column>
        <el-table-column prop="audit_status" label="审核状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.audit_status==0" type="primary" size="mini">待审核</el-tag>
            <el-tag v-else-if="scope.row.audit_status==1" type="success" size="mini">已审核</el-tag>
            <el-tag v-else-if="scope.row.audit_status==2" type="warning" size="mini">待修改</el-tag>
            <el-tag v-else-if="scope.row.audit_status==3" type="danger" size="mini">已删除</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="audit_name" label="审核人" show-overflow-tooltip></el-table-column>
        <el-table-column prop="create_time" label="创建时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="audit_time" label="审核日期" :formatter="UnixFun" show-overflow-tooltip></el-table-column>
        <el-table-column prop="product_remarks" label="备注" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="82">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" plain v-if="scope.row.audit_status==0||scope.row.audit_status==2"  @click="handleEdit(scope.$index, scope.row,'sh')" style="padding:3px 13px">审核</el-button>
            <el-button size="mini" type="success" plain v-else  @click="handleEdit(scope.$index, scope.row,'ck')" style="padding:3px 13px">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
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
      <!-- ////////////////////// -->
      <!-- 审核弹框 -->
      <el-dialog :title="sh_Look" :visible.sync="shenheedit" width="60%" center>
        <el-row>
          <el-col :span="2">
            <span class="proidclass">产品名称</span>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple">
              <el-input size="mini" v-model="shenheForm.name" :disabled="true"></el-input>
            </div>
          </el-col>
          <el-col :span="2" style="margin-left:30px;">
            <span class="proidclass">产品ID</span>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple">
              <el-input size="mini" v-model="shenheForm.product_id " :disabled="true"></el-input>
            </div>
          </el-col>
          <el-col :span="2"  style="margin-left:30px;">
            <span class="proidclass">选品人</span>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple">
              <el-input size="mini" v-model="shenheForm.people" :disabled="true"></el-input>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top:15px">
          
        </el-row>
        <!-- 供应商信息  -->
        <el-row style="margin-top:15px;">
          <el-col :span="2">
            <span class="proidclass" style="color:#909399;">供应商信息</span>
          </el-col>
        </el-row>
        <div style="margin-top:15px;">
          <div
            v-for="(pro,p) in shenheForm.supplier"
            :key="p.index"
            class="proinfoborder"
            style="margin-top:15px;"
          >

            <el-row>
            <el-col :span="2">
              <span class="proidclass">采购网址</span>
            </el-col>
            <el-col :span="10">
              <el-input placeholder="请输入采购网址" size="mini" :disabled="true" v-model="pro.buynetinput" clearable></el-input>
            </el-col>
          </el-row>
          <el-row style="margin-top:10px;">
            <el-col :span="2">
              <span class="proidclass">公司名称</span>
            </el-col>
            <el-col :span="4">
              <el-input placeholder="请输入公司名称" size="mini" :disabled="true" v-model="pro.companynameinput" clearable></el-input>
            </el-col>
            <el-col :span="2" style="margin-left:30px">
              <span class="proidclass">联系人</span>
            </el-col>
            <el-col :span="4">
              <el-input placeholder="请输入联系人" size="mini" :disabled="true" v-model="pro.contactsinput" clearable></el-input>
            </el-col>
            <el-col :span="2" style="margin-left:30px">
              <span class="proidclass">电话</span>
            </el-col>
            <el-col :span="4">
              <el-input placeholder="请输入电话" size="mini" :disabled="true" v-model="pro.phoneinput" clearable></el-input>
            </el-col>
          </el-row>
          </div>
        </div>
        <!-- 分类选择 -->
        <el-row style="margin-top:15px">
          <el-col :span="2">
            <span class="proidclass">分类选择</span>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple">
              <el-select size="mini" :disabled="true" v-model="seOpt_Show" >
                  <el-option v-for="(opItem,opIndex) in selectOptions" :key="opIndex" :value="opItem.goods_type_id" :label="opItem.type_name"></el-option>
              </el-select>
            </div>
          </el-col>
        </el-row>
        <!-- sku -->
        <el-row :gutter="20" style="margin-top:15px;">
          <el-col :span="2">
            <span class="proidclass">SKU</span>
          </el-col>
          <el-col :span="20">
            <el-table size="mini" :data="skutabledata"  border="" style="width: 100%">
              <el-table-column prop="key_value" label="型号" width="180"></el-table-column>
              <el-table-column prop="goods_sku" label="SKU" width="180"></el-table-column>
              <el-table-column prop="price" label="单价" width="80"></el-table-column>
              <el-table-column prop="store_qty" label="数量"></el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <!-- 推荐素材 -->
        <el-row style="margin-top:15px;">
          <el-col :span="2">
            <span class="proidclass">推荐素材</span>
          </el-col>
          <el-col :span="20" >
            <el-input size="mini" v-for="(s_item,sm) in shenheForm.material" :key='sm' v-model="s_item.sucai"  :disabled="true">
              <template size="mini" slot="prepend">Http://</template>
            </el-input>
          </el-col>
        </el-row>
        <!-- 卖点 -->
        <el-row style="margin-top:15px;">
          <el-col :span="2">
            <span class="proidclass">产品卖点</span>
          </el-col>
          <el-col :span="20">
            <el-input
            :disabled="sh_Look=='查看'"
              type="textarea"
              v-model="shenheForm.keywords"
              maxlength="100"
              :autosize="{ minRows: 2, maxRows: 4}"
              show-word-limit
              size="mini"
            ></el-input>
          </el-col>
        </el-row>
        <!-- 指派 -->
        <el-row style="margin-top:15px;">
          <el-col :span="2">
            <span class="proidclass">产品指派</span>
          </el-col>
          <el-col :span="6">
            <el-select size="mini" v-model="assignvalue" clearable placeholder="请选择">
              <el-option
              :disabled="sh_Look=='查看'"
                v-for="item in assignlist"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
        </el-row>
        <!-- 审核建议 -->
        <el-row style="margin-top:15px;">
          <el-col :span="2">
            <span class="proidclass">审核建议</span>
          </el-col>
          <el-col :span="20">
            <el-input
              size="mini"
              type="textarea"
              :disabled="sh_Look=='查看'"
              v-model="shenheForm.audit_opinion"
              maxlength="100"
              :autosize="{ minRows: 2, maxRows: 4}"
            ></el-input>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" type="success" @click="auditpass" v-if="globelType=='sh'">审核通过</el-button>
          <el-button size="mini" type="warning" @click="auditwating "  v-if="globelType=='sh'">待修改</el-button>
          <el-button size="mini" type="danger" @click="auditdelete " v-if="globelType=='sh'" >删除</el-button>
          <el-button size="mini" type="info" @click="aduitcancel" v-if="globelType=='sh'">取 消</el-button>
          <el-button size="mini" type="info" @click="aduitcancel" style="width:150px" v-if="globelType=='ck'">取 消</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {UnixDate,AxiosReturn} from '../../assets/axios/index'
import  MyDatePicker from '../../components/Child/MyDatePicker'
export default {
  name: "shenhe",
  data() {
    return {
      globelIndex:"",
      globelType:"",
      searchMain: "", //搜索
      sh_Look:'',
      isSearch:false,
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
      stateOption: [
        {value: "0",label: "未审核"},
        {value: "1",label: "已审核"},
        {value: "2",label: "待修改"},
        {value: "3",label: "已删除"}
      ],
      // 选品
      checkpersonlist: [
        {value: "0", label:"小米"},
        {value: "1", label:"小王"},
        {value: "2", label:"小董"},
        {value: "3", label:"小马"}
      ],
      checkperson: "",
      // 审核状态
      checkstatus: "",
      checkstatuslist: [
        {value: "0",label: "待审核"},
        {value: "1",label: "已审核"},
        {value: "2",label: "待修改"},
        {value: "3",label: "已删除"}
      ],
      // 列表数据
      tableData: [],
      multipleSelection: [],
      currentPage: 1, ///默认页数
      // 审核弹框
      shenheedit: false,
      value: "",
      // 弹框
      examineproname: "",
      examineproid: "",
      examinexuanpin: "",
      examinecheckperson: "",
      examinebuyaddress: "",
      examinecompanyname: "", //公司名称
      examinetype: "", //规格
      //分类选择
      selectOptions:[],
      seOpt_Show:"",
      // SKU
      skutabledata: [],
      // 推荐素材
      materialgroup: [{ sucai: "" }],
      // 产品卖点
      shelltextarea: "",
      // 指派给设计
      assignlist: [
        {
          value: "0",
          label: "小王"
        },
        {
          value: "1",
          label: "小明"
        }
      ],
      assignvalue: "",
      // 审核提交表单
      shenheForm:{
          product_id:'',
          people:"",
          material:"",
          keywords:"",
          addTimeBegin: "1",//产品编号
          key_name : "1_3", //商品规格键名
          key_value :"max:60 颜色:黑色 CPU:I5", //商品规格值
          price :"5400",// 商品价格
          store_qty :"60",//商品库存
          audit_status:"",//状态
          audit_name:"",
          audit_time:"",
          audit_opinion :""

      },
      auditsuggestion: "",
      pagenum: 1, //当前页数
      total: 0, //总数
      pagesize: 10, // 每页显示的条数
    };
  },
  created: function() {
    this.getList()
    this.getSelect()//分类选择数据
  },
  components:{
    MyDatePicker
  },
  methods: {
    UnixDate,
    AxiosReturn,
    UnixFun(row){
        if(row.designer_time){
          return this.UnixDate(row.designer_time)
        }
    },
    getSelect() {
      let that = this;
      this.axios
        .post("api/goods_type/method/get.goods.type.select", {})
        .then(function(res) {
          if (res.data.status === 200) {
            console.log(res);
            that.selectOptions=res.data.data
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    resetFun(){
        this.isSearch=false
        for(var qkey in this.queryinfo){
            this.queryinfo[qkey]=""
        }
        this.queryinfo.page_no=1 
        this.queryinfo.page_size=10
        this.getList()
    },
    // 搜索
    search() {
        this.isSearch=true
        this.queryinfo.page_no=1 
        this.queryinfo.page_size=10
        this.getList()
    },
    getList() {
      let myParams={}
      console.log('this.isSearch---',this.isSearch)
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
      console.log(myParams)
      let that = this;
      this.axios.post("api/product/method/get.product.admin.list",myParams).then(function(res) {
          // console.log(res);
          if (res.data.status === 200) {
            console.log(res.data.data);
            that.tableData = res.data.data.items;
            that.total = res.data.data.total_result;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //分页
    handleSizeChange(val) {
      this.queryinfo.page_size= val;
      // console.log(`每页 ${val} 条`);
      this.getList();
    },
    handleCurrentChange(val) {
      this.queryinfo.page_no= val;
      this.getList();
      // console.log(`当前页: ${val}`);
    },
    // 审核
    handleEdit(index, row,val) {
      let that=this
      console.log(val)
      if(val=='sh'){
          this.sh_Look="审核"
      }else{
          this.sh_Look="查看"
      }
      
      this.globelIndex=index
      this.globelType=val
      this.seOpt_Show=row.goods_type_id
      this.examineproname = row.proname;
      this.examineproid = row.proid;
      this.examinexuanpin = row.checkperson;
      this.examinebuyaddress = row.buyaddress;
      this.shenheForm.name=row.name
      this.shenheForm.supplier=row.supplier
      this.shenheForm.people=row.user_name
      this.shenheForm.material=row.material
      this.shenheForm.keywords=row.keywords
      this.shenheForm.audit_opinion=row.audit_opinion
      this.shenheForm.product_id=row.product_id
      this.AxiosReturn("api/product/method/get.products.item",{product_id:row.product_id}).then(res=>{
        that.skutabledata=res.data.getspec_goods
        console.log(that.skutabledata)
        that.shenheedit = true; 
      })
    },
    // 审核通过btn
    auditpass() {
      this.ShenHe(1)
    },
    // 待修改btn
    auditwating() {
      this.ShenHe(2)
    },
    // 删除btn
    auditdelete() {
      this.ShenHe(3)
    },
    // 取消
    aduitcancel() {
      this.shenheedit = false;
    },
    ShenHe(status){
      this.shenheForm.audit_status=status
      let _this=this
      this.axios
        .post("api/product/method/set.product.item/",_this.shenheForm)
        .then(function(res) {
          console.log(res);
          if (res.data.status === 200) {
            console.log(res.data.data);
            _this.tableData[_this.globelIndex].audit_status=res.data.data.audit_status
            _this.shenheedit=false
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  },
};
</script>

<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.proidclass {
  font-size: 15px;
  font-weight: bold;
  /* text-align: center;
  height: 100%;
  line-height: 40px; */
}
.proinfoborder {
  border: 1px dashed #c1c1cd;
  border-radius: 3px;
  padding: 10px 0px 10px 0;
}
</style>
