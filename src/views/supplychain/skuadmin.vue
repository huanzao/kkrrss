<template>
  <div>
    <el-card>
      <div id="myHeaderBox">
        <el-input placeholder="请输入产品名称" size="mini"  v-model="searchForm.product_name" @keyup.enter.native="searchFun" clearable></el-input>
        <el-input  placeholder="请输入产品SKU"  size="mini"  v-model="searchForm.sku_value"  @keyup.enter.native="searchFun"  clearable ></el-input>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="searchFun">搜索</el-button>
        <el-button type="info" icon="el-icon-refresh" size="mini" v-if="isSearch" @click="resetFun"></el-button>
        <el-button class="filter-item" size="mini" type="success" @click="orderImport">导出</el-button>
      </div>
      <el-table :data="skudataList" border size="mini" @selection-change="handleSelectionChange" stripe style=" margin-top: 15px;">
         <el-table-column type="selection"  width="55"></el-table-column>
        <el-table-column label="SKU-ID" prop="product_sku_id" width="100"></el-table-column>
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
        <el-table-column label="产品名称" prop="product_name"></el-table-column>
        <el-table-column label="SKU" prop="product_sku" width="120"></el-table-column>
        <el-table-column label="中文规格" prop="sku_value" width="260"></el-table-column>
        <el-table-column label="进货价格" prop="price" width="90"></el-table-column>
        <el-table-column label="单位" prop="product_unit" width="80"></el-table-column>
        <el-table-column label="库存" prop="store_qty" width="80"></el-table-column>
        <el-table-column label="预警值" prop="warning"></el-table-column>
        <el-table-column label="累计修改值" prop="cumulative" width="100"></el-table-column>
        <el-table-column label="备注" prop="product_remarks"></el-table-column>
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
  </div>
</template>

<script>
import { AxiosReturn, myExprotExcel } from "../../assets/axios/index";
export default {
  name: "skuadmin",
  data() {
    return {
      isSearch: false,
      searchForm: {
        //搜索
        product_name: "",
        sku_value: ""
      },
      skudataList:[],
      skudataListsku: [
        { label: "SKU-ID",prop:"product_sku_id"},
        { label: "产品ID",prop:"goods_code"},
        { label: "产品名称",prop:"product_name"},
        { label: "SKU",prop:"product_sku"},
        { label: "中文规格",prop:"sku_value"},
        { label: "进货价格",prop:"price"},
        { label: "单位",prop:"product_unit"},
        { label: "库存",prop:"store_qty"},
        { label: "预警值",prop:"warning"},
        { label: "累计修改值",prop:"cumulative"},
        { label: "备注",prop:"product_remarks"},
      ],
      multipleSelection: [], // table 选中的数据
      pagenum: 1, //当前页数
      pagesize: 10, // 每页显示的条数
      total: 0 //总数
    };
  },
  created: function() {
    this.getTableList();
  },
  methods: {
    AxiosReturn,
    myExprotExcel,
    getTableList() {
      let myparams = {};
      let that = this;
      if (this.isSearch == true) {
        myparams = this.searchForm;
        myparams.page_size = this.pagesize;
        myparams.page_no = this.pagenum;
      } else {
        myparams = {
          page_size: this.pagesize,
          page_no: this.pagenum
        };
      }
      this.AxiosReturn("productSku/method/get.sku.list", myparams).then(res => {
        console.log(res);
        if (res.status === 200) {
          let result = res.data.items;
          that.skudataList = result;
          that.total = res.data.total_result;
        } else {
          that.$message.warning(res.message);
        }
      });
    },
    searchFun() {
      this.pagesize = 10;
      this.pagenum = 1;
      this.isSearch = true;
      this.getTableList();
    },
    resetFun() {
      this.searchForm.product_name = "";
      this.searchForm.sku_value = "";
      this.pagesize = 10;
      this.pagenum = 1;
      this.isSearch = false;
      this.getTableList();
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
    // 导出
    orderImport() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning("请先选择要导出的数据");
        return;
      }
      let headArr = [];
      let keyArr = [];
      console.log(this.skudataListsku)
      for (var i of this.skudataListsku) {
        headArr.push(i.label);
        keyArr.push(i.prop);
      }
      console.log(headArr, keyArr, )
      this.myExprotExcel(headArr, keyArr, "sku", "multipleSelection");
    },
    //table中checkbox函数
    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = val;
    }
  },
  mounted() {}
};
</script>

<style scoped>
</style>
