<template>
  <div>
    <el-card>
      <div id='myHeaderBox'>
          <el-input size="mini" placeholder="请输入商品ID" v-model="queryinfo.goods_code" @keyup.enter.native="search"  clearable />
          <el-select size="mini" v-model="queryinfo.score" clearable >
              <el-option label="好评" value="1"></el-option>
              <el-option label="中评" value="2"></el-option>
              <el-option label="差评" value="3"></el-option>
          </el-select>
          <el-select size="mini"  placeholder="是否显示"  v-model="queryinfo.is_show" clearable >
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
          </el-select>
          <el-button type="primary" size="mini" icon="el-icon-search" @click="search">搜索</el-button>
          <el-button type="info" icon="el-icon-refresh" size="mini"  v-if='isSearch' @click="resetFun"></el-button>
      </div>
      <el-row style="margin-top:15px">
        <el-table border=""  ref="multipleTable" :data="commentData" tooltip-effect="dark" style="width: 100%" >
          <el-table-column prop="goods_comment_id" label="ID" width="70"></el-table-column>
          <el-table-column label="图片" width="80">
            <template slot-scope="scope">
              <div v-if="scope.row.image!=undefined&&scope.row.image.length>0" @click='ImgLookFun(scope.row.image)'  style="padding:2px;cursor: pointer;">
                    <img  slot="reference" :src="scope.row.image[scope.row.image.length-1]" style="width:80px">
              </div>
              <div v-else>--</div>
            </template>
          </el-table-column>
          <el-table-column prop="goods_name" label="商品名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="goods_code" label="商品ID" show-overflow-tooltip></el-table-column>
          <el-table-column prop="reviewer" label="评论人" width="120"></el-table-column>
          <el-table-column label="满意度" width="145">
            <template slot-scope="scope">
              <el-rate v-model="scope.row.score" disabled ></el-rate>
            </template>
          </el-table-column>
          <el-table-column prop="content" label="内容"></el-table-column>
          <el-table-column label="评价时间" prop="create_time"></el-table-column>
          <el-table-column label="是否显示" prop="is_show" width="80">
            <template slot-scope="scope">
              <!-- <el-tooltip :content="scope.row.is_show==1?'显示':'不显示'" placement="top"> -->
                <el-switch
                  class="switchStyle"
                  v-model="scope.row.is_show"
                  active-color="#13ce66"
                  inactive-color="#808080"
                  @change='IsShow_Change(scope.$index,scope.row)'
                  active-value="1"
                  active-text="显示"
                  inactive-value="0"
                  inactive-text="隐藏">
                </el-switch>
              <!-- </el-tooltip> -->
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160">
            <template slot-scope="scope">
              <el-button type="primary" style="padding: 3px;" size="mini" icon="el-icon-edit"  @click="editComment(scope.$index,scope.row)" >编辑</el-button>
              <el-button type="danger" size="mini" style="padding: 3px;" icon="el-icon-delete" @click="deleteComment(scope.row.goods_name,scope.row.goods_comment_id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <!-- 分页 -->
      <el-row style="margin-top:15px;">
        <el-col>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryinfo.page_no"
            :page-sizes="[10, 30, 50, 100]"
            :page-size="queryinfo.page_size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </el-col>
      </el-row>
    </el-card>
    <!-- 编辑 -->
    <el-dialog title="编辑" :visible.sync="editCommentVisible" width="1120px">
      <el-form :model="editForm" label-width="100px">
        <el-row :gutter="0">
          <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="10">
            <el-form-item label="商品评价编号">
              <el-input size="mini" clearable v-model="editForm.goods_comment_id" disabled ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="10">
            <el-form-item label="商品名称">
              <el-input size="mini"  clearable v-model="editForm.goods_name" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="10">
            <el-form-item label="评论人" prop="reviewer">
              <el-input size="mini"  clearable v-model="editForm.reviewer"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="10">
            <el-form-item label="满意度" prop="satisfaction">
              <div class="block" style="padding: 11px 0px;">
                <el-rate v-model="editForm.score"></el-rate>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
              <el-form-item label="是否匿名" >
                <el-radio v-model="editForm.is_show" label="1">是</el-radio>
                <el-radio v-model="editForm.is_show" label="0">否</el-radio>
              </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :xs="22" :sm="22" :md="22" :lg="22" :xl="22">
            <el-form-item label="上传图片">
              <el-upload
                action="http://mmkashop.com/api/v1/upload/method/add.upload.list.html"
                multiple
                list-type="picture-card"
                accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF"
                :before-upload="beforeUpload"
                :on-preview="handlePictureCardPreview"
                :on-success="handsuccessComment"
                :on-exceed="handleExceed"
                :limit="4"
                :file-list="fileImgList"
                class="uploadimg"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
              <div class="warncss">格式:jpg、png、jpeg;最多可上传四张;</div>
              <el-dialog :visible.sync="dialogVisible" append-to-body>
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="评论内容">
        <el-input type="textarea" v-model="editForm.content"></el-input>
      </el-form-item>
      </el-form>
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCommentVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="editUploadFunc" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <ImgLook  :imgList='imgListArr' ></ImgLook>
  </div>
</template>

<script>
import { AxiosReturn } from '../../assets/axios/index'
import ImgLook from '../../components/Child/ImgLook'
import {mapState ,mapMutations} from 'vuex'
export default {
  components:{ImgLook},
  name: "pinglunguanli",
  data() {
    return {
      isSearch:false,
      queryinfo:{
          goods_code:"",
          score:"",
          is_show:"",
          page_no:1,
          page_size:10,
      },
      fileImgListComment:[],
      imgListArr:[],
      commentData: [{ goodId: 111 }],
      isShowYes: true,
      isShowNo: false,
      multipleSelection: [],
      editCommentVisible: false,
      editForm: {
        order_goods_id:"",
        goods_name:"",
        reviewer:"",
        is_show:'0',
        type:'0',
        ip_address:"",
        content:"",
        image:"",
        score:0,
      },
      // 图片上传
      fileImgList: [],
      dialogVisible: false,
      dialogImageUrl: "",
      // 分页--------------------------------------------------------
      total: 0, //总数
    };
  },
  created: function() {
    this.getList();
  },
  computed:{
        ...mapState(["imgLookshow"])
  },
  methods: {
    ...mapMutations(['setImgLookShow']),
    AxiosReturn,
    ImgLookFun(arr){
        this.setImgLookShow(true)
        this.imgListArr=arr
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

    // 获取评论列表
    getList() {
      let myParams={}
      if(this.isSearch){
          myParams=this.queryinfo
          console.log(myParams)
      }else{
          myParams={
              page_size : this.queryinfo.page_size, //每页条数
              page_no : this.queryinfo.page_no, //翻页页数
          }
      }
      let that = this;
      this.axios.post("api/goods_comment/method/get.goods.comment.list",myParams).then(function(res) {
          console.log(res)
          if (res.data.status === 200) {
            that.total = res.data.data.total_result;
            if(res.data.data.items){
                let response = res.data.data.items;
                that.commentData = response.map(item=>{
                  item.is_show=item.is_show.toString()
                  return item
                })
            }else{
                that.commentData=[]
            }
            
          }
        }).catch(function(error) {
          that.$message({
            message: error,
            type: "error",
            center: true
          });
        });
    },
     // 分页
    handleSizeChange(newSize) {
      this.queryinfo.page_size=newSize;
      this.getList();
    },
    handleCurrentChange(newPage) {
      this.queryinfo.page_no = newPage;
      this.getList();
    },
    // 是否显示
    IsShow_Change(index,row){
        let that=this
        var idarr=[]
        idarr.push(row.goods_comment_id)
        this.AxiosReturn('api/goods_comment/method/set.goods.comment.show',{goods_comment_id:idarr,is_show:row.is_show}).then(res=>{
          if(res.status==200){
            this.$message.success('设置成功')
          }else{
            this.$message.warning(res.message)
            if(row.is_show==1){
                that.commentData[index].is_show='0'
            }else{
              that.commentData[index].is_show='1'
            }
          }
        })
    },

    // 编辑
    editComment(index,row) {
        this.editForm.goods_comment_id=row.goods_comment_id
        this.editForm.goods_name=row.goods_name
        this.editForm.reviewer=row.reviewer
        this.editForm.is_show=row.is_show
        this.editForm.type=row.type
        this.editForm.ip_address=row.ip_address
        this.editForm.content=row.content
        this.editForm.image=row.image
        this.editForm.score=row.score*1
        this.fileImgList=[]
        for(var i in row.image){
            this.fileImgList.push({name:i+'jpg',url:row.image[i]})
        }
        this.editCommentVisible = true;
    },
    editUploadFunc(){
        this.AxiosReturn('api/goods_comment/method/set.goods.comment',this.editForm).then(res=>{
          if(res.status==200){
            this.$message.success('编辑成功')
            this.editCommentVisible = false
            this.getList()
          }else{
            this.$message.warning(res.message)
          }
        })
    },
    // 删除
    deleteComment(text,id) {
         this.$confirm(`确定删除 ' ${text} ' 的这条评论吗`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.AxiosReturn('api/goods_comment/method/del.goods.comment.item',{goods_comment_id:id}).then(res=>{
              if(res.status===200){
                this.$message.success('删除成功')
                this.getList()
              }else{
                this.$message.warning(res.message)
              }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    // 上传图片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handsuccessComment(response, file, fileList) {
      this.fileImgList = fileList;
      this.editForm.image=[]
      for(var img of fileList){
        if(img.response){
            this.editForm.image.push(img.response.data[0].url)
        }else{
            this.editForm.image.push(img.url)
        }
      }
    },
    beforeUpload (file) { return new Promise((resolve, reject) => {
        let isLt2M = file.size / 1024 / 1024 < 4 // 判定图片大小是否小于4MB
        if (isLt2M) {
          resolve(file)
        }
        console.log(file) // 压缩到400KB,这里的400就是要压缩的大小,可自定义
        imageConversion.compressAccurately(file, 400).then(res => { // console.log(res)
         resolve(res)
        })
      })
    },
    handleExceed(files, fileList) {//图片上传超过数量限制
      this.$message.warning('上传图片不能超过4张!');
    },
  },
};
</script>

<style scoped>
.warncss {
  line-height: 30px;
  color: #909399;
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
.el-button--mini.is-circle {
  padding: 5px;
}
.el-upload--picture-card {
  width: 50px;
  height: 50px;
  line-height: 58px;
}

.el-upload-list--picture-card .el-upload-list__item {
  width: 100px;
  height: 100px;
}
</style>