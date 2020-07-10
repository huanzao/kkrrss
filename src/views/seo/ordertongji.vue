<template>
    <div>
        <el-row :gutter="20">
          <el-col :span="18" >
            <el-card  class="grid-content bg-purple">
                  <el-table :data="tableData" id='tableTongji'  @cell-click='myClick' :highlight-current-row='true'>
                    <el-table-column label="ID" prop="id"></el-table-column>
                    <el-table-column label="产品ID" prop="productID"></el-table-column>
                    <el-table-column label="产品名称" prop="name"></el-table-column>
                    <el-table-column label="总订单数" prop="total"></el-table-column>
                    <el-table-column label="待审核" prop="dSH"></el-table-column>
                    <el-table-column label="问题订单" prop="question"></el-table-column>
                    <el-table-column label="待发货" prop="dFH"></el-table-column>
                    <el-table-column label="已发货" prop="yFh"></el-table-column>
                    <el-table-column label="已完成" prop="ready"></el-table-column>
                    <el-table-column label="订购数量" prop="orderNum"></el-table-column>
                    <el-table-column label="订购金额" prop="money"></el-table-column>
                  </el-table>
                  <!-- <el-pagination
                    style="margin-top:15px;"
                    @size-change="pageSizeChange($event,'order/method/get.order.list/',{page_size:pagesize,page_no:pagenum,status:audit_status},'items')"
                    @current-change="pageNumberChange($event,'order/method/get.order.list/',{page_size:pagesize,page_no:pagenum,status:audit_status},'items')"
                    :current-page="pagenum"
                    :page-sizes="[10, 30, 50, 100]"
                    :page-size="pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                  ></el-pagination> -->
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card >
                <div :id="mychar" class="charBox"></div>
            </el-card>
            
          </el-col>
        </el-row>
    </div>
</template>

<script>
import echarts from 'echarts'
import { AxiosReturn ,pageSizeChange,pageNumberChange,myExprotExcel} from '../../assets/axios/index'
export default {
  name: "ordertongji",
  data() {
    return {
        screenWidth: document.body.clientWidth,   // 这里是给到了一个默认值 （这个很重要）
        mychar:'charID',
        pageChar:null,
        tableData: [
          {id:'200327340',productID:'200327340',name:'鐵鍋',total:598, dSH:1,question:33,dFH:494,yFh:0,ready:70,    orderNum:872, money:940056},
          {id:'200427745',productID:'200427745',name:'調節老花鏡',total:828,dSH:0,question:35,dFH:569,yFh:0,	ready:224,	orderNum:1810,	money:857144},
          {id:'190819538',productID:'190819538',name:'電視盒',total:407,dSH:249,question:4,dFH:64,yFh:56,	ready:34,	orderNum:510,	money:816130},
          {id:'191112237',productID:'191112237',name:'高領長袖',total:890,dSH:549,question:18,dFH:302,yFh:0,	ready:21,	orderNum:3315,	money:805900},
          {id:'191202190',productID:'191202190',name:'玩具車',total:536,dSH:47,question:36,dFH:400,yFh:0,ready:53,	orderNum:991,	money:803760}
        ],
        getIndex:0,
        total: 15, //总数
        pagenum: 1, // 当前页
        pagesize: 10 // 每页显示
        
    };
  },
  mounted() {
      this.initCharQ(this.tableData[0])
      const that = this
      window.onresize = () => {
          return (() => {
              window.screenWidth = document.body.clientWidth
              that.screenWidth = window.screenWidth
          })()
      }
  },
  beforeDestroy() {
    if (!this.pageChar) {
      return
    }
    this.pageChar.dispose()
    this.pageChar = null
  },
  watch: {
      screenWidth (val) {
          if (!this.timer) {
              this.screenWidth = val
              this.timer = true
              let that = this
              setTimeout(function () {
                  // that.screenWidth = that.$store.state.canvasWidth
                  that.initCharQ(that.tableData[0])
                  that.timer = false
              }, 400)
          }
      }
  },
  methods:{
    AxiosReturn,
    myExprotExcel,
    // 分页
    pageSizeChange,
    pageNumberChange,
    myClick(row){
        this.initCharQ(row)
    },
    initCharQ(row){
          this.chart = echarts.init(document.getElementById(this.mychar))
          this.chart.setOption({
              title: {
                  text: `产品《${row.name}》的统计图`,
                  subtext: `共${row.total}个`,
                  left: 'center'
              },
              tooltip: {
                  trigger: 'item',
                  formatter: '{a} <br/>{b} : {c} ({d}%)'
              },
              legend: {
                  orient: 'vertical',
                  left: 'left',
                  data: [ '待审核', '问题订单', '待发货', '已发货','已完成']
              },
              color : [ '#1bd1a5', '#ff2d51', '#1685a9', 'green', '#00bc12'],
              series: [
                  {
                      name: row.name,
                      type: 'pie',
                      radius: '55%',
                      center: ['50%', '60%'],
                      data: [
                          {value: row.dSH, name: '待审核'},
                          {value: row.question, name: '问题订单'},
                          {value: row.dFH, name: '待发货'},
                          {value: row.yFh, name: '已发货'},
                          {value: row.ready, name: '已完成'},
                      ],
                      emphasis: {
                          itemStyle: {
                              shadowBlur: 10,
                              shadowOffsetX: 0,
                              shadowColor: 'rgba(0, 0, 0, 0.5)'
                          }
                      }
                  }
              ]
          })
      }
  }
  
};
</script>

<style scoped>
  #charID{
    width: 100%;
    height: 500px;
  }
  
</style>  
