<template>
    <div>
      <el-card>
        <div id="myHeaderBox">
          <el-input clearable placeholder="请输商品名称货订单号"  @keyup.enter.native="orderSearch"   v-model="searchForm.keywords " size="mini"  ></el-input>
          <el-input clearable placeholder="请输收货人姓名" @keyup.enter.native="orderSearch"  v-model="searchForm.consignee" size="mini"  ></el-input>
          <MyDatePicker v-model="searchForm.time"></MyDatePicker>
          <el-button type="primary" size="mini" icon="el-icon-search" @click="orderSearch">搜索</el-button>
          <el-button type="info" icon="el-icon-refresh" size="mini" v-if='isSearch' @click="resetFun"></el-button>
          <!-- <el-button class="filter-item" size="mini" type="success" @click="orderImport">导出</el-button> -->
        </div>
        <el-table :data="tableData" border  ref="multipleTable"  @selection-change="handleSelectionChange" size="mini" stripe style="margin-top: 15px;">
          <el-table-column type="selection"  width="40"></el-table-column>
          <el-table-column label="订单号" prop="order_no" width="200" show-overflow-tooltip></el-table-column>
          <el-table-column label="运单号" prop="orders_bill_no"></el-table-column>
          <el-table-column label="订单数量" prop="qty"></el-table-column>
          <el-table-column label="订单金额" prop="pay_amount"></el-table-column>
          <el-table-column label="下单时间" prop="create_time" width="140" show-overflow-tooltip></el-table-column>
          <el-table-column label="出库时间" prop="delivery_time" width="140" show-overflow-tooltip></el-table-column>
          <el-table-column label="商品明细" width="100">
            <template slot-scope="scope">
                <el-popover trigger="hover" placement="right-start" width="500">
                    <el-table :data="scope.row.get_order_goods">
                        <el-table-column label="商品ID" prop="goods_code" ></el-table-column>
                        <el-table-column label="商品名称" prop="goods_name" ></el-table-column>
                        <el-table-column label="商品SKU" prop="goods_sku" ></el-table-column>
                        <el-table-column label="规格" prop="key_value" ></el-table-column>
                        <el-table-column label="价格" prop="market_price" ></el-table-column>
                        <el-table-column label="数量" prop="qty" ></el-table-column>
                    </el-table>
                  <div slot="reference" class="name-wrapper" >
                    <el-tag v-if='scope.row.get_order_goods.length===0' size="mini"  type="info" style="cursor: pointer;">暂无商品</el-tag>
                    <el-tag size="mini" v-if='scope.row.get_order_goods.length!=0' type="success"  style="cursor: pointer;">包含{{ scope.row.get_order_goods.length}}种商品</el-tag>
                  </div>
                </el-popover>
              </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="95">
            <template slot-scope="scope">
              <el-button @click="look(scope.row)" type="primary" size="mini" style="padding: 4px 10px;" >查看物流</el-button>
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

        <!-- 查看物流信息 -->
        <el-dialog  title="查看物流信息" center :visible.sync="dialogFormVisible" >
          <el-form :model="form"  ref="form"  size="mini">
          </el-form>
            
        </el-dialog>
        
      </el-card>
    </div>
</template>

<script>
import { AxiosReturn ,myExprotExcel} from '../../assets/axios/index'
import MyDatePicker from '../../components/Child/MyDatePicker'
export default {
  name: "outgoods",
  data() {
    return {
      status :7,
      isSearch:false,
      searchForm:{
        keywords:"",
        consignee:"",//收货人
        time:"",
        begin_time:"",
        end_time:"",
      },
      tableData: [],
      multipleSelection: [], // table 选中的数据
      dialogFormVisible: false,
      form:{},
      // 分页
      total: 15, //总数
      pagenum: 1, // 当前页
      pagesize: 10 // 每页显示
    };
  },
  components:{
    MyDatePicker
  },
  created: function() {
    this.getList();
  },
  methods: {
    AxiosReturn,
    myExprotExcel,
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
          myParams.status=7
          myParams.page_size=this.pagesize
          myParams.page_no=this.pagenum
      }else{
          myParams={
              page_size:this.pagesize, //每页条数
              page_no:this.pagenum, //翻页页数
              status:this.status
          }
      }
      this.AxiosReturn('api/order/method/get.order.list/',myParams).then(res=>{
        that.tableData=res.data.items
        that.total=res.data.total_result
        console.log(res)
      })
    },
    look(val){
      this.dialogFormVisible=true;
       console.log(val)
    },
    //table中checkbox函数
    handleSelectionChange(val) {
        this.multipleSelection = val;
    },
    // 分页
    handleSizeChange(newSize) {
      this.pagesize = newSize;
      this.getList();
    },
    handleCurrentChange(newPage) {
      this.pagenum  = newPage;
      this.getList();
    }
  },
  mounted() {
    
  }
};
</script>

<style scoped>
</style>
