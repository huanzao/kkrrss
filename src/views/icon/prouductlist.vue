<template>
  <div>
    <el-card>
      <div id='myHeaderBox'>
            <el-input size="mini" placeholder="请输入商品关键词" v-model="queryinfo.keywords"  @keyup.enter.native="search"  clearable />
            <el-select size="mini" clearable v-model="queryinfo.status" placeholder="请选择商品状态" >
                <el-option label="下架" value="0"></el-option>
                <el-option label="上架" value="1"></el-option>
            </el-select>
            <!-- <MyDatePicker v-model="queryinfo.time"></MyDatePicker> -->
            <el-button type="primary" size="mini" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button type="info" icon="el-icon-refresh" size="mini"  v-if='isSearch' @click="resetFun"></el-button>
      </div>
      <!-- table -->
      <el-row style="margin-top:15px;">
        <el-col>
          <el-table size="mini" :data="tableData" stripe border style="width: 100%">
            <el-table-column prop="goods_code" label="商品ID" width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="name" label="商品名称" width="160" show-overflow-tooltip></el-table-column>
            <el-table-column label="域名" width="160" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-for="(d,item) in scope.row.domain" :key="item">
                  <span>{{fn(d)}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="region" label="地区" width="100">
              <template slot-scope="scope">
                <div v-if="scope.row.region ==1">
                  <span>台湾</span>
                </div>
                <div v-if="scope.row.region ==2">
                  <span>香港</span>
                </div>
                <div v-if="scope.row.region ==3">
                  <span>越南</span>
                </div>
                <div v-if="scope.row.region ==4">
                  <span>泰国</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="channel" label="渠道" width="100">
              <template slot-scope="scope">
                <div v-if="scope.row.channel ==0">
                  <span>FB</span>
                </div>
                <div v-if="scope.row.channel ==1">
                  <span>谷歌</span>
                </div>
                <div v-if="scope.row.channel ==2">
                  <span>雅虎</span>
                </div>
                <div v-if="scope.row.channel ==3">
                  <span>抖音</span>
                </div>
                <div v-if="scope.row.channel ==4">
                  <span>快手</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="user_name" label="选品人" width="120"></el-table-column>
            <el-table-column prop="product.designer_name" label="设计" width="120"></el-table-column>
            <el-table-column prop="optimizer" label="优化师" width="120"></el-table-column>
            <!-- <el-table-column prop="is_delete " label="是否在线" width="80">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.is_delete ==0" type="success" size="mini">在线</el-tag>
                <el-tag v-else-if="scope.row.is_delete ==1" type="danger" size="mini">不在线</el-tag>
              </template>
            </el-table-column>-->

            <!-- status integer 是 1 上下架状态 0=下架 1=上架 -->
            <el-table-column prop="status" label="是否上架" width="120">
              <template slot-scope="scope">
                <div v-if="scope.row.is_delete ==0">
                  <el-switch
                    class="switchStyle"
                    v-model="scope.row.status"
                    active-color="#13ce66"
                    inactive-color="#808080"
                    :active-value="1"
                    active-text="上架"
                    :inactive-value="0"
                    inactive-text="下架"
                    @change="isShelf($event,scope.row,scope.$index)"
                  ></el-switch>
                </div>
                <div v-if="scope.row.is_delete ==1">
                  <el-switch
                    class="switchStyle"
                    v-model="scope.row.status"
                    active-color="#13ce66"
                    inactive-color="#808080"
                    :active-value="1"
                    active-text="上架"
                    :inactive-value="0"
                    inactive-text="下架"
                    disabled
                  ></el-switch>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="create_time" show-overflow-tooltip label="创建时间" width="140"></el-table-column>
            <el-table-column prop="goods_remarks" show-overflow-tooltip label="备注"></el-table-column>
            <el-table-column fixed="right" label="操作" width="200">
              <template slot-scope="scope">
                <!-- <el-button @click="claimClick(scope.row)" type="success" style="padding:3px 6px " size="mini" >认领</el-button> -->
                <el-button @click="editClick(scope.row,scope.row.goods_id,'edit')" style="padding: 3px;" type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                <el-button @click="editClick(scope.row,scope.row.goods_id,'copy')" style="padding: 3px;" type="success" icon="el-icon-document-copy" size="mini">复制</el-button>
                <el-button @click="commentClick(scope.$index,scope.row)" style="padding: 3px;" type="warning" size="mini" icon="el-icon-edit-outline">评论</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
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
      <!-- ******************** 编辑商品 *********************** -->
      <el-dialog :title="sh_Look" :visible.sync="isShowEdtiPro" width="60%"  center @close="editDialogClosed" >
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm demo-dynamic" size="mini">
          <el-row>
            <el-col :span="6">
              <el-form-item label="产品ID" prop="product_id">
                <el-input v-model="ruleForm.product_id" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="产品名称" prop="name">
                <el-input v-model="ruleForm.product.name" clearable disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="商品名称" prop="name">
                <el-input v-model="ruleForm.name" clearable :disabled="sh_Look=='复制'"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="商品ID" prop="goods_code">
                <el-input v-model="ruleForm.goods_code" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 产品域名 -->
          <el-form-item 
            v-for="(d, index) in ruleForm.domain"
            :label="'域名' + index" 
            :key="d.key"
            :prop="'domains.' + index + '.v'"
            :rules="{ required: true, message: '域名不能为空', trigger: 'blur'}"
          >
            <el-input class="dynamic-platform-value" v-if="ruleForm.domains != ''" v-model="d.v" clearable></el-input>
            <el-button @click.prevent="removeDomain(d)" type="text" plain size="mini">删除</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="addDomain" type="success" plain>新增域名</el-button>
          </el-form-item>
          <!-- 代码 -->
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="FB像素代码" prop="fb">
                <el-input v-model="ruleForm.fb" :disabled="sh_Look=='复制'"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="谷歌代码" prop="google">
                <el-input v-model="ruleForm.google" :disabled="sh_Look=='复制'"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-button @click="addbeiyongcode" type="primary" plain :disabled="sh_Look=='复制'">新增备用代码</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item  v-for="(b, index) in ruleForm.fb1" :label="'备用代码~' + index" :key="b.key" :prop="'fb1.' + index + '.v'">
            <el-input class="dynamic-platform-value" v-model="b.v" :disabled="sh_Look=='复制'"></el-input>
            <el-button @click.prevent="removebeiyong(b)" size="mini" :disabled="sh_Look=='复制'" type="text">删除</el-button>
          </el-form-item>
          <!-- 轮播图 -->
          <el-row :gutter="24">
            <el-col :xs="22" :sm="22" :md="22" :lg="22" :xl="22">
              <el-form-item label="轮播图">
                <el-upload
                  action="http://mmkashop.com/api/v1/upload/method/add.upload.list.html"
                  multiple
                  list-type="picture-card"
                  :on-preview="handlePictureCardPreviewEdit"
                  :on-remove="handleRemoveEdit"
                  :on-exceed="chooseImg"
                  :on-success="handsuccess"
                  :limit="5"
                  :file-list="fileImgListEdit"
                  class="uploadimg"
                  :disabled="sh_Look=='复制'"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
                <div class="warncss">格式:jpg、png、jpeg;最多可上传五张;</div>
                <el-dialog :visible.sync="dialogVisibleEdit" append-to-body>
                  <img width="100%" :src="dialogImageUrlEdit" alt />
                </el-dialog>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 商品标题 -->
          <el-row>
            <el-col>
              <el-form-item label="商品标题" prop="short_name">
                <el-input v-model="ruleForm.short_name" clearable :disabled="sh_Look=='复制'"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 原价 现价 地区 渠道 -->
          <el-row>
            <el-col :span="6">
              <el-form-item label="原价" prop="market_price">
                <el-input v-model="ruleForm.market_price" :disabled="sh_Look=='复制'"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="现价" prop="shop_price">
                <el-input v-model="ruleForm.shop_price" :disabled="sh_Look=='复制'"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="地区" prop="region">
                <el-select v-model="ruleForm.region" filterable clearable placeholder="请选择地区" :disabled="sh_Look=='复制'">
                  <el-option v-for="r in info.addregion" :key="r.value" :label="r.label" :value="r.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="渠道" prop="channel">
                <el-select v-model="ruleForm.channel" filterable clearable placeholder="请选择渠道" :disabled="sh_Look=='复制'">
                  <el-option v-for="c in info.addchannel" :key="c.value" :label="c.label" :value="c.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 价格组选择 -->
          <el-row>
            <el-col>
              <el-form-item label="价格组选择" prop="price_group_id">
                <el-select
                  v-model="ruleForm.price_group_id"
                  filterable
                  clearable
                  placeholder="请选择价格组"
                  @change="changePrice(ruleForm.price_group_id,priceGroupTableData)"
                  :disabled="sh_Look=='复制'"
                >
                  <el-option v-for="p in info.checkpricegroup" :key="p.value" :label="p.label" :value="p.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <div v-if="ruleForm.price_group_id>0 ">
            <div v-show="isShow" class="kunbanggroupclass">
              <el-row>
                <el-col :span="2">
                  <el-form-item label="新增">
                    <el-button icon="el-icon-circle-plus-outline"  type="success"  circle @click="addPriceGroup()"  plain size="mini" :disabled="sh_Look=='复制'"></el-button>
                  </el-form-item>
                </el-col>
              </el-row>
              <div v-show="isShow = true">
                <div v-for="(price,p) in priceGroupTableData" :key="p">
                  <el-row>
                    <el-col :span="6">
                      <el-form-item label="按钮描述">
                        <el-input v-model="price.des" size="mini" clearable :disabled="sh_Look=='复制'">{{price.des}}</el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="5">
                      <el-form-item label="价格">
                        <el-input v-model="price.price" size="mini" clearable :disabled="sh_Look=='复制'">{{price.price}}</el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="5">
                      <el-form-item label="件数">
                        <el-input size="mini" v-model="price.num" clearable :disabled="sh_Look=='复制'">{{price.num}}</el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="2">
                      <el-form-item label="删除">
                        <el-button icon="el-icon-delete" type="danger" circle  @click="bindPriceDelete(p)" plain size="mini" :disabled="sh_Look=='复制'"></el-button>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </div>
          </div>
          <!-- 是否有赠品 -->
          <el-row>
            <el-col :span="6">
              <el-form-item label="是否有赠品" prop="addendum_status">
                <el-select v-model="ruleForm.addendum_status"  clearable @change="ischoice" placeholder="请选择" :disabled="sh_Look=='复制'">
                  <el-option v-for="s in isgroups" :key="s.value" :label="s.label" :value="s.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <div v-if="ruleForm.addendum_status== 1">
              <el-col :span="6">
                <el-form-item label="SKU">
                  <el-input clearable v-model="ruleForm.addendum.isnumvalue" size="mini" :disabled="sh_Look=='复制'"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="数量">
                  <el-input clearable v-model="ruleForm.addendum.isvalue" size="mini" :disabled="sh_Look=='复制'"></el-input>
                </el-form-item>
              </el-col>
            </div>
          </el-row>
          <!-- 商品描述 -->
          <el-row>
            <el-col>
              <el-form-item label="商品描述" prop="description">
                <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" placeholder="请输入商品描述" v-model="ruleForm.description" :disabled="sh_Look=='复制'"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 商品介绍 富文本 -->
          <el-row>
            <el-col :xs="23" :sm="23" :md="23" :lg="23" :xl="23">
              <el-form-item label="商品介绍">
                <editor-bar v-model="ruleForm.content" :isClear="isClear" :disabled="sh_Look=='复制'"></editor-bar>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 备注 -->
          <el-row>
            <el-col>
              <el-form-item label="备注" prop="goods_remarks">
                <el-input type="textarea" :autosize="{ minRows:2, maxRows:4}" v-model="ruleForm.goods_remarks" :disabled="sh_Look=='复制'"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item style="text-align: center;margin-right: 100px !important;">
            <el-button type="primary" @click="submitEdit" v-if="sh_Look=='编辑'" v-show="copyBtn==true">提交</el-button>
            <el-button type="primary" @click="submitCopy" v-if="sh_Look=='复制'" v-show="copyBtn">复制</el-button>

            <el-button type="info" @click="editCancel">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- ******************* 评论 **************** -->
      <el-dialog title="添加评论" :visible.sync="isShowEvaluate" width="50%" center>
        <el-card>
          <el-form :model="commentRuleForm" :rules="commentRules" ref="commentRuleForm" label-width="100px" class="demo-ruleForm" size="mini">
            <el-row>
              <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item label="商品ID">
                  <el-input v-model="commentRuleForm.goods_id" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item label="商品名称">
                  <el-input v-model="commentRuleForm.goods_name" disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item label="评论人">
                  <el-input v-model="commentRuleForm.reviewer"></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item label="满意度" prop="score">
                  <div class="block" style="padding: 5px 0px;">
                    <el-rate v-model="commentRuleForm.score"></el-rate>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item label="是否匿名">
                  <el-radio v-model="commentRuleForm.is_show" label="1">是</el-radio>
                  <el-radio v-model="commentRuleForm.is_show" label="0">否</el-radio>
                </el-form-item>
              </el-col>
              <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                <el-form-item label="评价类型" prop="score">
                  <div class="block" style="padding: 5px 0px;">
                    <el-select v-model="commentRuleForm.type" size="mini">
                      <el-option value="0" label="主评"></el-option>
                      <el-option value="1" label="主回"></el-option>
                      <el-option value="2" label="主评"></el-option>
                      <el-option value="3" label="追回"></el-option>
                    </el-select>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 上传评论图片 -->
            <el-row>
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <el-form-item label="上传评论图片">
                  <el-upload
                    action="http://mmkashop.com/api/v1/upload/method/add.upload.list.html"
                    list-type="picture-card"
                    accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF"
                    :on-preview="handlePictureCardPreviewComment"
                    :on-remove="handleRemoveComment"
                    :on-exceed="chooseImgComment"
                    :on-success="handsuccessComment"
                    :limit="4"
                    multiple
                    :file-list="fileImgListComment"
                    class="uploadimg"
                  >
                    <i class="el-icon-plus"></i>
                  </el-upload>
                  <div class="warncss">格式:jpg、png、jpeg;最多可上传四张;</div>
                  <el-dialog :visible.sync="dialogVisibleComment" append-to-body>
                    <img width="100%" :src="dialogImageUrlComment" alt />
                  </el-dialog>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="评论内容">
              <el-input type="textarea" v-model="commentRuleForm.content"></el-input>
            </el-form-item>
            <el-form-item style="text-align: center;margin-right: 100px !important;">
              <el-button type="primary" @click="submitForm('commentRuleForm')">立即创建</el-button>
              <el-button @click="resetForm('commentRuleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { AxiosReturn } from "../../assets/axios/index";
import MyDatePicker from "../../components/Child/MyDatePicker";
import EditorBar from "../../views/editor/editoritem.vue";
export default {
  name: "prouductlist",
  components: { EditorBar, MyDatePicker },
  data() {
    return {
      sh_Look:'',
      copyBtn:true,
      isSearch:false,
      queryinfo:{
          keywords:"",
          status:"",
          page_no :1,
          page_size :10,
          time:"",
          create_time:"",
          update_time:""
      },
      // 日期
      addTimeBegin: "",
      addTimeEnd: "",
      editFormImg: [],
      tableData: [],
      tableDomains: [],
      currentPage: 1, //当前页
      // -------------------------编辑
      isShowEdtiPro: false,
      priceGroupsChange: {
        index: "",
        arr: ""
      },
      ruleForm: {
        goods_id: 1,
        addcomname: "",
        product_id: "",
        product: {
          name: "1111"
        },
        fbcode: "",
        chromecode: "",
        beiyongs: [],
        domains: [],
        addprotitle: "",
        addyuanjia: "",
        addnowprice: "",
        regionvalue: "",
        channel: "",
        checkpricevalue: "",
        description: "", //商品描述
        content: "", //商品介绍
        goods_remarks: "" //备注
      },
      fileImgListEdit: [],
      info: {
        // 地区
        addregion: [
          {
            value: "1",
            label: "台湾"
          },
          {
            value: "2",
            label: "香港"
          },
          {
            value: "3",
            label: "越南"
          },
          {
            value: "4",
            label: "泰国"
          }
        ],
        // 渠道
        addchannel: [
          {
            value: "0",
            label: "FB"
          },
          {
            value: "1",
            label: "谷歌"
          },
          {
            value: "2",
            label: "雅虎"
          },
          {
            value: "3",
            label: "抖音"
          },
          {
            value: "4",
            label: "快手"
          }
        ],
        // 价格组
        checkpricegroup: [
          {
            value: "1",
            label: "捆绑价格组"
          },
          {
            value: "2",
            label: "加购价格组"
          },
          {
            value: "3",
            label: "同规异价组"
          }
        ]
      },

      rules: {
        product_id: [
          { required: true, message: "请输入产品id", trigger: "blur" }
        ],
        product_name: [
          { required: true, message: "请输入产品名称", trigger: "blur" }
        ],
        goods_code: [
          { required: true, message: "请输入商品id", trigger: "blur" }
        ],
        addcomname: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        fb: [{ required: true, message: "请输入FB像素代码", trigger: "blur" }],
        google: [
          { required: true, message: "请输入谷歌代码", trigger: "blur" }
        ],
        short_name: [
          { required: true, message: "请输入商品标题", trigger: "blur" }
        ],
        market_price: [
          { required: true, message: "请输入原价", trigger: "blur" }
        ],
        shop_price: [
          { required: true, message: "请输入现价", trigger: "blur" }
        ],
        region: [{ required: true, message: "请选择地区", trigger: "blur" }],
        channel: [{ required: true, message: "请选择渠道", trigger: "blur" }],
        price_group_id: [
          { required: true, message: "请选择价格组", trigger: "blur" }
        ],
        addendum_status: [
          {
            required: true,
            message: "请选择是否有赠品",
            trigger: "change"
          }
        ]
      },
      // 编辑商品上传图片--轮播图
      dialogImageUrlEdit: "",

      dialogVisibleEdit: false,
      // 价格组
      priceGroupTableData: [
        {
          des: "",
          price: "",
          num: ""
        }
      ],

      isShow: false, //根据选择价格组展示不同组合
      // isshowzengpin: false, //有赠品展示
      skuvalue: "", //是否有赠品SKU
      skunumvalue: "", //sku数量
      is: 0, //新建页面是否有赠品
      isgroups: [
        {
          value: 0,
          label: "否"
        },
        {
          value: 1,
          label: "有"
        }
      ],
      addendum: [],
      addremarks: "", //备注
      // 富文本编辑器
      addApprovalForm: {
        content: ""
      },
      isClear: false,
      isShowEvaluate: false,//评论
      // --------------------------评论编辑上传图片
      dialogImageUrl: "",
      fileImgList: [],
      dialogVisible: false,
      total: 0, //分页总数
      isValueShow: false,//编辑当前页是否有赠品
      // ---------------------------评论
      commentRuleForm: {
        goods_id: "",
        order_goods_id: "",
        goods_name: "",
        reviewer: "",
        is_show: "0",
        type: "0",
        ip_address: "",
        content: "",
        image: "",
        score: 0,
        goods_code:"",
      },
      commentRules: {
        score: [{ required: true, message: "请输入产品ID", trigger: "blur" }]
      },
      // 上传评价图片
      dialogImageUrlComment: "",
      dialogVisibleComment: false,
      fileImgListComment: [],
      isGift: ""
    };
  },
  created: function() {
    this.getList();
  },
  methods: {
    AxiosReturn,
     resetFun(){
        this.isSearch=false
        for(var qkey in this.queryinfo){
            this.queryinfo[qkey]=""
        }
        this.queryinfo.page_no=1 
        this.queryinfo.page_size=10
        this.queryinfo.audit_status=1
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
      if(this.isSearch){
          this.queryinfo.audit_status=1
          myParams=this.queryinfo
          if(this.queryinfo.time!=""&&this.queryinfo.time!=null){

            this.queryinfo.begin_time=Math.round(this.queryinfo.time[0]/1000) 
            this.queryinfo.end_time=Math.round(this.queryinfo.time[1]/1000) 

          }else{
            this.queryinfo.begin_time=""
            this.queryinfo.end_time=""
          }
      }else{
          myParams={
              page_size : this.queryinfo.page_size, //每页条数
              page_no : this.queryinfo.page_no, //翻页页数
              audit_status : this.queryinfo.audit_status=1
          }
      }

      let that = this;
      this.axios.post("api/goods/method/get.goods.admin.list",myParams).then(function(res) {
          if (res.data.status === 200) {
            that.tableData = res.data.data.items;
            that.total = res.data.data.total_result;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
     // 分页
    handleSizeChange(val) {
      this.queryinfo.page_size= val;
      this.getList();
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.queryinfo.page_no = val;
      this.getList();
      // console.log(`当前页: ${val}`);
    },
    // 解决遍历的域名值不出来问题
    fn(d) {
      return d.v;
    },
    // 搜索
    serachrenling() {},
    isShelf(e, row, index) {
      this.axios
        .post("api/goods/method/set.shelves.goods.list", {
          goods_id: row.goods_id,
          status: e ? 1 : 0
        })
        .then(res => {
          if (res.data.status == 200) {

            if(e){
                this.$message.success('商品上架成功');
            }else{
                this.$message('商品下架成功');
            }
            
            this.getList();
          }
        })
        .catch(err => {
          this.$message({
            type: "info",
            message: res.data.message
          });
          // console.log("切换状态失败");e
          let newData = e;
          newData = newData === 1 ? 0 : 1; //恢复 原状态
        });
    },
    // 认领
    claimClick(row) {
      // console.log(row);
    },
    // 评论
    commentClick(index, row) {
      this.commentRuleForm.content = "";
      this.fileImgListComment = [];
      this.commentRuleForm.goods_id = row.goods_id;
      this.commentRuleForm.goods_name = row.name;
      this.commentRuleForm.goods_code = row.goods_code;
      this.isShowEvaluate = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.AxiosReturn(
            "api/goods_comment/method/add.goods.comment.item/",
            this.commentRuleForm
          ).then(res => {
            // console.log(res);
            if (res.status == 200) {
              this.$message.success("评论添加成功");
              this.isShowEvaluate = false;
            } else {
              this.$message.warning(res.message);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // ---------------------------------编辑弹框
    // 编辑
    editClick(row, i,title) {
      if(title=='edit'){
          this.sh_Look="编辑"
      }else{
          this.sh_Look="复制"
      }
      this.priceGroupsChange = {
        index: row.price_group_id,
        arr: row.price_group
      };
      this.priceGroupTableData = row.price_group;
      this.fileImgListEdit = [];
      for (var i in row.attachment) {
        this.fileImgListEdit.push({
          name: i + ".jpg",
          url: row.attachment[i]
        });
      }
      this.ruleForm = row;
      this.isShowEdtiPro = true;
      this.ruleForm.domains = row.domain;
      this.ruleForm.beiyongs = row.fb1;
      this.isGift = row.addendum;
    },
    submitEdit() {
      let that = this;
      this.axios
        .post("api/goods/method/set.goods.item/", {
          goods_id: that.ruleForm.goods_id, //商品ID
          name: that.ruleForm.name, //商品名称
          domain: that.ruleForm.domains, //域名
          fb: that.ruleForm.fb, //fb
          google: that.ruleForm.google, //谷歌
          fb1: that.ruleForm.beiyongs, //备用
          attachment: that.editformimg, //轮播图
          short_name: that.ruleForm.short_name, //商品标题
          market_price: that.ruleForm.market_price, //原价
          shop_price: that.ruleForm.shop_price, //现价
          region: that.ruleForm.region, //区域
          channel: that.ruleForm.channel, //渠道
          price_group_id: that.ruleForm.price_group_id, //价格组ID
          price_group: that.priceGroupTableData, //价格组（数组）
          addendum_status: that.ruleForm.addendum_status, //增品状态（0否1有）
          addendum: that.ruleForm.addendum, //增品(数组)
          description: that.ruleForm.description, ///商品描述
          content: that.ruleForm.content, //商品详情描述(介绍)
          goods_remarks: that.ruleForm.goods_remarks //备注
        })
        .then(function(res) {
          if (res.data.status === 200) {
            that.$message({
              message: res.data.message,
              type: "success",
              center: true
            });
            that.isShowEdtiPro = false;
            that.getList();
          } else if (res.data.status === 500) {
            that.$message({
              message: res.data.message,
              type: "warning",
              center: true
            });
          } else {
            that.$message({
              message: "提交失败",
              type: "error"
            });
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    submitCopy(){
      let that = this;
      this.axios
        .post("api/goods/method/copy.goods.item/", {
          goods_id: that.ruleForm.goods_id, //商品ID
          domain: that.ruleForm.domains, //域名
        })
        .then(function(res) {
          if (res.data.status === 200) {
            that.$message({
              message: res.data.message,
              type: "success",
              center: true
            });
            that.isShowEdtiPro = false;
            that.getList();
          } else if (res.data.status === 500) {
            that.$message({
              message: res.data.message,
              type: "warning",
              center: true
            });
          } else {
            that.$message({
              message: "复制失败",
              type: "error"
            });
          }
        })
        .catch(function(error) {
          console.log(error);
        });

    },
    //编辑关闭
    editDialogClosed() {
      this.isShowEdtiPro = false;
      this.getList();
    },
    // 编辑弹窗取消
    editCancel() {
      this.isShowEdtiPro = false;
    },
    // 域名刪除
    removeDomain(item) {
      var index = this.ruleForm.domains.indexOf(item);
      if (index !== -1) {
        this.ruleForm.domains.splice(index, 1);
      }
    },
    // 新增域名
    addDomain() {
      this.ruleForm.domains.push({
        v: "",
        key: Date.now()
      });
    },

    //新增备用代码
    addbeiyongcode() {
      this.ruleForm.beiyongs.push({
        v: "",
        key: Date.now()
      });
      // if (this.ruleForm.beiyongs.length != "") {

      // }
    },
    //删除备用代码
    removebeiyong(info) {
      // console.log(info);
      var index = this.ruleForm.beiyongs.indexOf(info);
      if (index !== -1) {
        this.ruleForm.beiyongs.splice(index, 1);
      }
    },
    //上传图片轮播图 *******************************
    handlePictureCardPreviewEdit(file) {
      this.dialogImageUrlEdit = file.url;
      this.dialogVisibleEdit = true;
    },
    // 文件列表移除文件时的钩子
    handleRemoveEdit(file, fileList) {
      // console.log(file, fileList);

      this.editformimg = [];
      for (var img of fileList) {
        if (img.response) {
          this.editformimg.push(img.response.data[0].url);
        } else {
          this.editformimg.push(img.url);
        }
      }
    },
    //文件超出个数限制时的钩子
    chooseImg(files, fileList) {
      // console.log("文件超出个数限制时的钩子");
      this.$message.warning(`最多可上传五张`);
    },
    // 上传成功
    handsuccess(response, file, fileList) {
      // console.log(file, fileList);
      this.fileImgListEdit = fileList;

      this.editformimg = [];
      for (var img of fileList) {
        if (img.response) {
          this.editformimg.push(img.response.data[0].url);
        } else {
          this.editformimg.push(img.url);
        }
      }
    },

    // 捆绑价格组新增
    addPriceGroup() {
      this.priceGroupTableData.push({
        des: "",
        price: "",
        num: ""
      });
    },
    // 捆绑价格组删除
    bindPriceDelete(index) {
      this.priceGroupTableData.splice(index, 1);
    },
    //------------------------------------ 切换价格组合
    changePrice(val, arr) {
      if (val == this.priceGroupsChange.index) {
        this.priceGroupTableData = this.priceGroupsChange.arr;
      } else {
        // this.isShow = true;
        this.priceGroupTableData = [];
        // console.log(val, arr);
      }
    },

    // 当前页是否有赠品
    ischoice(isc) {
      // console.log(isc);
      if (isc === 0) {
        this.isValueShow = false;
        this.ruleForm.addendum = "";
      } else if (isc === 1) {
        this.isValueShow = true;
        this.ruleForm.addendum = this.isGift;
      }
    },
    // -------------------------------------评论弹窗
    //上传评论图片 *******************************
    handlePictureCardPreviewComment(file) {
      this.dialogImageUrlComment = file.url;
      this.dialogVisibleComment = true;
    },
    // 文件列表移除文件时的钩子
    handleRemoveComment(file, fileList) {
      // console.log(file, fileList);
    },
    //文件超出个数限制时的钩子
    chooseImgComment(files, fileList) {
      // console.log("文件超出个数限制时的钩子");
      this.$message.warning(`最多可上传四张`);
    },
    // 上传成功
    handsuccessComment(response, file, fileList) {
      // console.log('上传成功',file, fileList);
      this.fileImgListComment = fileList;
      this.commentRuleForm.image = [];

      for (var img of fileList) {
        this.commentRuleForm.image.push(img.response.data[0].url);
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //上传图片评论
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
  }
};
</script>

<style scoped>
.warncss {
  line-height: 30px;
  color: #909399;
}
.kunbanggroupclass {
  border: 1px dashed #c1c1cd;
  border-radius: 3px;
  padding: 10px 0px 10px 0;
  margin-bottom: 15px;
}
.dynamic-platform-value {
  margin-right: 10px;
  width: 300px;
}
</style>
<style>
.el-upload--picture-card {
  width: 45px !important;
  height: 45px !important;
  line-height: 52px !important;
}
.el-upload-list--picture-card .el-upload-list__item {
  width: 80px !important;
  height: 80px !important;
}
.tb-edit .el-input {
  display: none;
}
.tb-edit .current-row .el-input {
  display: block;
}
.tb-edit .current-row .el-input + span {
  display: none;
}
</style>
