<template>
  <div>
    <el-card>
      <el-row :gutter="5">
        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
          <el-select v-model="warehouseValue" clearable filterable size="mini" placeholder="请选择仓库">
            <el-option
              v-for="item in warehouseOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
          <el-input v-model="inputVal.systemSku" size="mini" placeholder="物流SKU" clearable></el-input>
        </el-col>
        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
          <el-input v-model="inputVal.customerSku" size="mini" placeholder="产品SKU" clearable></el-input>
        </el-col>
        <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
          <el-input v-model="inputVal.chineseName" size="mini" placeholder="中文品名" clearable></el-input>
        </el-col>
        <el-col :xs="1" :sm="1" :md="1" :lg="1" :xl="1">
          <el-button @click="queryVal" size="mini" type="success" plain>查询</el-button>
        </el-col>
        <el-col :xs="1" :sm="1" :md="1" :lg="1" :xl="1">
          <el-button @click="resetVal" size="mini" type="primary" plain>重置</el-button>
        </el-col>
        <el-col :xs="1" :sm="1" :md="1" :lg="1" :xl="1">
          <el-button type="primary" size="mini" @click="myExprotExcel(ExcelHeaderArr,ExcelKeyArr,'库存管理')">导出</el-button>
        </el-col>
      </el-row>
      <!-- table -->
      <el-row :gutter="0" style="margin-top:15px;">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%;"
          @selection-change="handleSelectionChange"
          border=""
          :fit="true"
        >
          <el-table-column type="selection" width="40"></el-table-column>
          <el-table-column prop="systemSku" label="物流SKU" show-overflow-tooltip width="130"></el-table-column>
          <el-table-column prop="customerSku" label="产品SKU" show-overflow-tooltip width="130"></el-table-column>
          <el-table-column prop="chineseName" label="中文品名" width="160"></el-table-column>
          <el-table-column prop="englishName" label="英文品名" width="160"></el-table-column>
          <el-table-column prop="color" label="颜色" width="100"></el-table-column>
          <el-table-column prop="size" label="尺码" width="100"></el-table-column>
          <el-table-column
            prop="specifications"
            label="规格"
            width="110"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column prop="inWarehouseNum" label="在仓数量" width="100"></el-table-column>
          <el-table-column prop="stayInWarehouseNum" label="待入库数量" width="100"></el-table-column>
          <el-table-column prop="warehouse" label="仓库" width="100"></el-table-column>
          <el-table-column fixed="right" label="操作" width="160">
            <template slot-scope="scope">
              <el-button
                @click="warehousingDetails(scope.row)"
                type="primary"
                plain
                size="mini"
                style="padding:2px 6px;"
              >入库明细</el-button>
              <!-- deliveryDetails -->
              <el-button
                @click="deliveryDetails(scope.row)"
                type="success"
                plain
                size="mini"
                style="padding:2px 6px;"
              >出库明细</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <!-- 分页 -->
      <el-row style="margin-top:15px;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 30, 50, 100]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400"
        ></el-pagination>
      </el-row>
      <!-- 入库 -->
      <el-dialog title="1 " :visible.sync="warehousingDetailsVisible">
        <div slot="title">
          <span class="title-detail">入库明细 | {{toSystemSku}}</span>
        </div>
        <el-table :data="warehousingDetailsData" border="">
          <el-table-column prop="chineseName" label="中文品名"></el-table-column>
          <el-table-column prop="color" label="颜色" width="200"></el-table-column>
          <el-table-column prop="size" label="尺码" width="200"></el-table-column>
          <el-table-column prop="specifications" label="规格" width="200"></el-table-column>
        </el-table>
        <!--  -->
        <el-table
          :data="tableDataTwo"
          border=""
          height="200"
          :summary-method="getSummaries"
          show-summary
          sum-text="已入库数量"
          style="width: 100%;margin-top:15px;"
        >
          <el-table-column prop="logisticsNo" label="快递/物流单号"></el-table-column>
          <el-table-column prop="wms" label="WMS" width="180"></el-table-column>
          <el-table-column prop="stockInQuantity" label="入库数量"></el-table-column>
          <!-- <el-table-column prop="remainingQuantity" label="剩余数量"></el-table-column> -->
          <el-table-column prop="state" label="状态"></el-table-column>
        </el-table>
        <!--  -->
        <!-- <el-table :data="warehousingDetailsData" border="" style="margin-top:15px;">
          <el-table-column prop="receivedQuantity" label="已入库数量"></el-table-column>
          <el-table-column prop="stayInWarehouseNum" label="待入库数量"></el-table-column>
        </el-table>-->
        <el-row style="margin-top:15px;">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-button
              type="primary"
              size="mini"
              style="width:100%;"
              v-clipboard:copy="copymessage"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
            >复制快递/物流单号</el-button>
          </el-col>
        </el-row>
      </el-dialog>
      <!-- 出库 -->
      <el-dialog title="1 " :visible.sync="deliveryDetailsVisible">
        <div slot="title">
          <span class="title-detail">出库明细 | {{outSystemSku}}</span>
        </div>
        <el-table :data="deliveryDetailsData" border="">
          <el-table-column prop="chineseName" label="中文品名"></el-table-column>
          <el-table-column prop="color" label="颜色" width="200"></el-table-column>
          <el-table-column prop="size" label="尺码" width="200"></el-table-column>
          <el-table-column prop="specifications" label="规格" width="200"></el-table-column>
        </el-table>
        <el-table
          :data="deliveryDetailstableDataTwo"
          border=""
          height="200"
          show-summary
          :summary-method="getSum"
          sum-text="已确认数量"
          style="width: 100%;margin-top:15px;"
        >
          <el-table-column prop="orderNo" label="订单号" width="180"></el-table-column>
          <el-table-column prop="waybillNo" label="运单号"></el-table-column>
          <el-table-column prop="orderNumber" label="订单量"></el-table-column>
          <el-table-column prop="state" label="状态"></el-table-column>
        </el-table>
        <el-row style="margin-top:15px;">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-button
              type="primary"
              size="mini"
              style="width:100%;"
              v-clipboard:copy="copyOrderMessage"
              v-clipboard:success="onCopyOrder"
              v-clipboard:error="onErrorOrder"
            >复制订单号</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import VueClipboard from "vue-clipboard2";
import Vue from "vue";
Vue.use(VueClipboard);
import { myExprotExcel } from "../../assets/axios/index";
export default {
  name: "inventorymanagement",
  data() {
    return {
      //导出Excel
      ExcelHeaderArr:['物流SKU','产品SKU','中文','英文',],
      ExcelKeyArr:['systemSku','customerSku','chineseName','englishName'],
      // 选择仓库
      warehouseValue: "",
      warehouseOptions: [
        {
          value: "0",
          label: "深圳仓库"
        },
        {
          value: "1",
          label: "印尼仓库"
        },
        {
          value: "2",
          label: "广州仓库"
        },
        {
          value: "3",
          label: "寮步仓库"
        },
        {
          value: "4",
          label: "台湾仓库"
        }
      ],
      inputVal: {
        systemSku: "",
        customerSku: "",
        chineseName: ""
      },
      tableData: [
        {
          systemSku: "SH00102139",
          customerSku: "4556",
          chineseName: "彈力磁浮鞋",
          englishName: "",
          color: "blue",
          size: "mini",
          specifications: "M",
          inWarehouseNum: "6",
          stayInWarehouseNum: "8",
          warehouse: "寮步仓库",
          logisticsNo: "557004839136495"
        },
        {
          systemSku: "SH00102141",
          customerSku: "XZ041708",
          chineseName: "空調扇",
          englishName: "",
          color: "黑色",
          size: "",
          specifications: "",
          inWarehouseNum: "6",
          stayInWarehouseNum: "8",
          warehouse: "寮步仓库",
          logisticsNo: "773032515987183"
        }
      ],
      multipleSelection: [],
      // 分页
      currentPage: 1,
      // 入库明细弹框
      warehousingDetailsVisible: false,
      warehousingDetailsData: [
        {
          systemSku: "",
          chineseName: "",
          color: "",
          size: "",
          specifications: "",
          receivedQuantity: "",
          stayInWarehouseNum: ""
        }
      ],

      tableDataTwo: [
        {
          wms: "SHI0020963",
          logisticsNo: "YT2043573389055",
          stockInQuantity: "2",
          // remainingQuantity: "0",
          state: "已入库"
        },
        {
          wms: "SHI0020963",
          logisticsNo: "YT20435733999",
          stockInQuantity: "1",
          // remainingQuantity: "0",
          state: "待入库"
        },
        {
          wms: "SHI0020963",
          logisticsNo: "YT2043573666",
          stockInQuantity: "6",
          // remainingQuantity: "0",
          state: "已入库"
        }
      ],
      // 出库明细
      deliveryDetailsVisible: false,
      deliveryDetailsData: [
        {
          systemSku: "",
          chineseName: "",
          color: "",
          size: "",
          specifications: ""
        }
      ],
      deliveryDetailstableDataTwo: [
        {
          orderNo: "CR15844829411741",
          waybillNo: "8534756705",
          orderNumber: "2",
          state: "已出库"
        },
        {
          orderNo: "CR1584482941199",
          waybillNo: "8534756705",
          orderNumber: "2",
          state: "已出库"
        }
      ],
      toSystemSku: "",
      outSystemSku: "",
      copymessage: "", //复制快递/物流单号
      copyOrderMessage: "" //复制订单号
    };
  },
  methods: {
    //倒出Excel
    myExprotExcel,
    // 查询
    queryVal() {},
    // 重置
    resetVal() {
      this.warehouseValue = "";
      this.inputVal.systemSku = "";
      this.inputVal.customerSku = "";
      this.inputVal.chineseName = "";
    },
    // 全选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    warehousingDetails(value) {
      this.warehousingDetailsVisible = true;

      for (var w = 0; w < this.warehousingDetailsData.length; w++) {
        this.warehousingDetailsData[w].systemSku = value.systemSku;
        this.toSystemSku = this.warehousingDetailsData[w].systemSku;
        this.warehousingDetailsData[w].chineseName = value.chineseName;
        this.warehousingDetailsData[w].color = value.color;
        this.warehousingDetailsData[w].size = value.size;
        this.warehousingDetailsData[w].specifications = value.specifications;
        this.warehousingDetailsData[w].stayInWarehouseNum =
          value.stayInWarehouseNum;
        this.warehousingDetailsData[w].logisticsNo = value.logisticsNo;
        this.incopy();
      }
    },

    deliveryDetails(value) {
      this.deliveryDetailsVisible = true;
      for (var d = 0; d < this.deliveryDetailsData.length; d++) {
        this.deliveryDetailsData[d].systemSku = value.systemSku;
        this.outSystemSku = this.deliveryDetailsData[d].systemSku;
        this.deliveryDetailsData[d].chineseName = value.chineseName;
        this.deliveryDetailsData[d].color = value.color;
        this.deliveryDetailsData[d].size = value.size;
        this.deliveryDetailsData[d].specifications = value.specifications;
      }
      this.outCopy();
    },
    // 入库复制物流单号
    incopy() {
      let arrcopy = [];
      for (var c = 0; c < this.tableDataTwo.length; c++) {
        arrcopy.push(this.tableDataTwo[c].logisticsNo);
        this.copymessage = arrcopy;
      }
    },
    // 出库复制订单号
    outCopy() {
      let outarr = [];
      for (var c = 0; c < this.deliveryDetailstableDataTwo.length; c++) {
        outarr.push(this.deliveryDetailstableDataTwo[c].orderNo);
        this.copyOrderMessage = outarr;
      }
    },
    // 入库复制快递/物流单号
    onCopy(e) {
      // 复制成功
      this.$message({
        message: "复制成功！",
        type: "success"
      });
    },
    onError(e) {
      // 复制失败
      this.$message({
        message: "复制失败！",
        type: "error"
      });
    },
    // 出库复制订单号
    onCopyOrder(e) {
      // 复制成功
      this.$message({
        message: "复制成功！",
        type: "success"
      });
    },
    onErrorOrder(e) {
      // 复制失败
      this.$message({
        message: "复制失败！",
        type: "error"
      });
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (index === 1) {
          sums[index] = "";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          // sums[index] += " 元";
        } else {
          // sums[index] = "N/A";
        }
      });

      return sums;
    },
    getSum(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (index === 1) {
          sums[index] = "";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
        }
      });

      return sums;
    },
    // 分页
    handleSizeChange(val) {
    },
    handleCurrentChange(val) {
    }
  },
  mounted() {}
};
</script>

<style scoped>
.title-detail {
  line-height: 24px;
  font-size: 18px;
  color: #303133;
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