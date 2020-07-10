<template>
    <div>
        <el-card>
            <div id='myHeaderBox'>
                <el-input placeholder="请输入用户名"  v-model="queryinfo.username"  @keyup.enter.native="search" size="mini" clearable></el-input>
                <MyDatePicker v-model="queryinfo.create_time" ></MyDatePicker>
                <el-button type="primary" size="mini" icon="el-icon-search" @click="search">搜索</el-button>
                <el-button type="info" icon="el-icon-refresh" size="mini"  v-if='isSearch' @click="resetFun"></el-button>
            </div>

            <el-table :data="dataList" border="" size="mini" stripe style="margin-top: 15px;">
                <el-table-column label="#" type="index"></el-table-column>
                <el-table-column label="用户名" prop="username"></el-table-column>
                <el-table-column label="动作" prop="action"></el-table-column>
                <el-table-column label="访问路径" prop="path"></el-table-column>
                <el-table-column label="IP" prop="ip"></el-table-column>
                <el-table-column label="IP地址" prop="ip_region"></el-table-column>
                <el-table-column label="详情" width="80">
                  <template slot-scope="scope">
                    <el-popover trigger="hover" placement="left-start" width="300">
                        <el-tabs v-model="activeName" @tab-click="handleClick">
                          <el-tab-pane label="请求参数" name="params">{{scope.row.params}}</el-tab-pane>
                          <el-tab-pane label="处理结果" name="result">{{scope.row.result}}</el-tab-pane>
                          <el-tab-pane label="请求头部" name="header">{{scope.row.header}}</el-tab-pane>
                        </el-tabs>
                        
                        <div slot="reference" class="name-wrapper">
                            <el-tag  size="mini"  style="cursor: pointer;" type="warning">详情</el-tag>
                        </div>
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column label="状态" width="60">
                     <template slot-scope="scope">
                        <el-tag v-if="scope.row.status == 0" type="success" size="mini">成功</el-tag>
                        <el-tag v-else-if="scope.row.status == 1" type="danger" size="mini">错误</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="创建日期" prop="create_time"></el-table-column>
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
        </el-card>
        
    </div>

</template>
<script>
import { nowDate,AxiosReturn } from "../../assets/axios/index";
import MyDatePicker from '../../components/Child/MyDatePicker'
export default {
  name: "operationlog",
  components: {
    MyDatePicker
  },
  data() {
    return {
      queryinfo:{
          username:'',
          create_time:"",
          begin_time:"",
          end_time:"",
          page_no: 1, // 当前页
          page_size: 10 // 每页显示的条数
      }, 
      isSearch:false, 
      dataList: [],
      total: 0, //分页总数
      activeName: 'params',
    }
  },
  created: function() {
    this.getList()
  },
  methods: {
    nowDate,
    AxiosReturn,
    // 搜索
    search() {
        this.isSearch=true;
        this.queryinfo.page_no=1;
        this.queryinfo.page_size=10;
        this.getList()
    },
     resetFun(){
        this.isSearch=false;
        for(var qkey in this.queryinfo){
            this.queryinfo[qkey]=""
        }
        this.queryinfo.page_no=1;
        this.queryinfo.page_size=10;
        this.getList()
    },
    // 获取所有列表
    getList() {
      let myParams={}
      if(this.isSearch){
          myParams=this.queryinfo
          if(this.queryinfo.create_time!=""&&this.queryinfo.create_time!=null){
            this.queryinfo.begin_time=Math.round(this.queryinfo.create_time[0]/1000) 
            this.queryinfo.end_time=Math.round(this.queryinfo.create_time[1]/1000) 
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
      this.axios.post("action_log?method=get.action.log.list",myParams).then(function(res) {
          if (res.data.status === 200) {
            let result = res.data.data.items;
            that.dataList = result;
            that.total = res.data.data.total_result;
          }else{
            this.$message.warning(res.message)
          }
        }).catch(function(error) {
          console.log(error);
        });
    },
    // 监听pagesize改变的事件
    handleSizeChange: function(newSize) {
      this.queryinfo.page_size = newSize;
      this.getList();
    },
    // 监听页码值改变的事件
    handleCurrentChange: function(newPage) {
      this.queryinfo.page_no = newPage;
      this.getList();
    },
    handleClick(tab, event) {
      // console.log(tab,'----tab',event ,'*****event' );
    },
   
  }
}
</script>

<style>

</style>

