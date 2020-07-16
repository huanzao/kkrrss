<template>
  <div>
    <el-card>
      <!-- header -->
      <div id='myHeaderBox'>
          <el-input placeholder="请输入产品中文名称"  v-model="queryinfo.keywords"  @keyup.enter.native="search" size="mini" clearable></el-input>
          <!-- <el-select placeholder="审核状态" size="mini" v-model="queryinfo.audit_status" clearable>
            <el-option v-for="items in stateOption" :key="items.value" :label="items.label" :value="items.value" ></el-option>
          </el-select> -->
          <el-select placeholder="认领状态" size="mini" v-model="queryinfo.designer_status" clearable  >
            <el-option label="待认领" value="0"></el-option>
            <el-option label="已认领" value="1"></el-option>
          </el-select>
          <MyDatePicker v-model="queryinfo.createtime" ></MyDatePicker>
          <el-button type="primary" size="mini" icon="el-icon-search" @click="search">搜索</el-button>
          <el-button type="info" icon="el-icon-refresh" size="mini" v-if='isSearch' @click="resetFun"></el-button>
      </div>
      <!-- 产品table -->
      <el-table  size="mini" border stripe ref="multipleTable" :data="claimtableData" tooltip-effect="dark" style="width: 100%;margin-top:15px;" @selection-change="handleSelectionChange">
        <!-- <el-table-column type="selection" width="39"></el-table-column> -->
        <el-table-column label="产品ID" prop="goods_code" width="80" fixed="left"></el-table-column>
        <el-table-column prop="name" label="产品名称" show-overflow-tooltip width="120"></el-table-column>
        <el-table-column label="产品英文名称" prop="ename" show-overflow-tooltip width="100px"></el-table-column>
        <el-table-column prop="supplier" label="采购网站" show-overflow-tooltip width="180">
          <template slot-scope="scope">
            <div v-for="(s,p) in scope.row.supplier" :key="p">{{s.buynetinput}}</div>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="attachment" label="产品图片" width="80">
          <template slot-scope="scope">
            <el-popover placement="bottom" trigger="hover">
              <div v-for="(img,i) in scope.row.attachment" :key="i"></div>
            </el-popover>
          </template>
        </el-table-column> -->
        <el-table-column prop="user_name" label="选品人" width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="designer_name" label="设计" width="100" show-overflow-tooltip></el-table-column>
        <el-table-column label="认领状态" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.designer_status==1" type="success" size="mini">已认领</el-tag>
            <el-tag v-if="scope.row.designer_status==0" type="warning" size="mini">待认领</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="160"></el-table-column>
        <el-table-column prop="audit_time" label="审核时间" :formatter="auditFun" width="160"></el-table-column>
        <el-table-column prop="designer_time" label="认领时间" :formatter="UnixFun" width="160"></el-table-column>
        <el-table-column prop="product_remarks" label="备注" width="120"></el-table-column>
        <el-table-column fixed="right" label="操作" width="180">
          <template slot-scope="scope">
            <el-button @click="RenLingFun(scope.$index,scope.row)" :disabled="scope.row.designer_status==1" type="success" style="padding:3px 6px " size="mini">认领</el-button>
            <el-button @click="claimlook(scope.$index, scope.row)" type="text" size="mini">查看</el-button>
            <el-button @click="addcommodity(scope.$index, scope.row)" :disabled="scope.row.designer_status==0" type="text" size="mini">新建商品</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 查看产品 -->
      <el-dialog title="查看产品" :visible.sync="lookpro" width="60%" center>
        <el-form :model="addRuleFormExamine" ref="addRuleFormExamine" label-width="100px" class="demo-ruleForm" size="mini">
          <el-form-item label="产品名称" prop="newproname">
            <el-input v-model="addRuleFormExamine.examineproname" clearable disabled></el-input>
          </el-form-item>
          <el-form-item label="产品英文名称" prop="ename">
            <el-input v-model="addRuleFormExamine.examineproename" clearable disabled></el-input>
          </el-form-item>
          <el-form-item label="产品ID" prop="newproid">
            <el-input v-model="addRuleFormExamine.examineproid" clearable :disabled="true"></el-input>
          </el-form-item>
          <!-- 供应商信息  start--->
          <el-form-item label="供应商信息">
            <div v-for="(pro,p) in addRuleFormExamine.supplier" :key="p" class="proinfoborder" style="margin-top:15px;">
              <el-row>
                <el-col :span="2">
                  <span class="proidclass">采购网址</span>
                </el-col>
                <el-col :span="10">
                  <el-input placeholder="请输入采购网址" size="mini" v-model="pro.buynetinput"  disabled clearable></el-input>
                </el-col>
              </el-row>
              <el-row style="margin-top:10px;">
                <el-col :span="2">
                  <span class="proidclass">公司名称</span>
                </el-col>
                <el-col :span="4">
                  <el-input placeholder="请输入公司名称" size="mini" v-model="pro.companynameinput" disabled clearable></el-input>
                </el-col>
                <el-col :span="2" style="margin-left:30px">
                  <span class="proidclass">联系人</span>
                </el-col>
                <el-col :span="4">
                  <el-input placeholder="请输入联系人" size="mini"  v-model="pro.contactsinput" disabled clearable></el-input>
                </el-col>
                <el-col :span="2" style="margin-left:30px">
                  <span class="proidclass">电话</span>
                </el-col>
                <el-col :span="4">
                  <el-input placeholder="请输入电话" size="mini" v-model="pro.phoneinput" disabled clearable></el-input>
                </el-col>
              </el-row>
            </div>
          </el-form-item>
          <el-row :gutter="20" style="margin-top:15px;">
            <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="10">
              <el-form-item label="分类选择">
                <el-select v-model="addRuleFormExamine.goods_type_id" disabled size="mini" clearable  placeholder="请选择类别" >
                  <el-option v-for="item in addRuleFormExamine.typeNameListSearch" :key="item.goods_type_id" :label="item.type_name" :value="item.goods_type_id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="规格类型">
            <div>
              <el-table :data="addRuleFormExamine.spec_combo" border size="mini" style="margin-top: 15px;">
                <el-table-column label="型号" prop="key_value" show-overflow-tooltip width="140px"></el-table-column>
                <el-table-column label="SKU" prop="goods_sku"></el-table-column>
                <el-table-column label="价格" prop="price"></el-table-column>
                <el-table-column label="数量" prop="store_qty"></el-table-column>
              </el-table>
            </div>
          </el-form-item>
          <!-- 推荐素材 -->
          <el-form-item label="推荐素材">
            <el-row v-for="(mgroup,m) in addRuleFormExamine.materialgroup" :key="m" style="margin-top:5px" :gutter="24">
              <el-col>
                <el-input size="mini" placeholder="请输入网址" disabled v-model="mgroup.sucai">
                  <template slot="prepend">Http://</template>
                </el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <!-- 产品卖点 -->
          <el-form-item label="产品卖点">
            <el-input type="textarea" placeholder="请输入内容"  v-model="addRuleFormExamine.shelltextarea" maxlength="300" :autosize="{ minRows: 2, maxRows: 4}" show-word-limit disabled></el-input>
          </el-form-item>
          <!-- 备注 -->
          <!-- <el-form-item label="审核建议qweqwe">
            <el-input type="textarea"  v-model="addRuleFormExamine.auditsuggestion" maxlength="300" :autosize="{ minRows: 2, maxRows: 4}" show-word-limit disabled ></el-input>
          </el-form-item>-->
          <el-form-item style="text-align: center;margin-right: 100px;margin-top: 15px;">
            <el-button type="success" size="mini" @click="renling('addRuleFormExamine')">认领产品</el-button>
            <el-button type="info" size="mini" @click="aduitcancel">取 消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 新建商品 -->
      <el-dialog title="新建商品" :visible.sync="newaddcommdity" width="60%" center  @close="addDialogClosed">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm demo-dynamic" size="mini">
          <el-row>
            <el-col :span="8">
              <el-form-item label="产品ID" prop="addproid">
                <el-input v-model="ruleForm.addproid" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="产品名称" prop="addproname">
                <el-input v-model="ruleForm.addproname" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="商品名称" prop="addcomname">
                <el-input v-model="ruleForm.addcomname" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 产品域名 -->
          <el-form-item v-for="(domain, index) in ruleForm.domains" :label="'域名' + index" :key="domain.key" :prop="'domains.' + index + '.v'"  :rules="{ required: true, message: '域名不能为空', trigger: 'blur'}">
            <el-input class="dynamic-platform-value" v-model="domain.v" clearable></el-input>
            <el-button @click.prevent="removeDomain(domain)" type="text">删除</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="addDomain" type="success" plain>新增域名</el-button>
          </el-form-item>
          <!-- 代码 -->
          <el-row>
            <el-col :span="8">
              <el-form-item label="FB像素代码" prop="fbcode">
                <el-input v-model="ruleForm.fbcode" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="谷歌代码">
                <el-input v-model="ruleForm.chromecode" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item>
                <el-button @click="addbeiyongcode" type="primary" plain>新增备用代码</el-button>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item v-for="(beiyong, index) in ruleForm.beiyongs" :label="'备用代码~' + index" :key="beiyong.key" :prop="'beiyongs.' + index + '.v'">
            <el-input class="dynamic-platform-value" v-model="beiyong.v" clearable></el-input>
            <el-button @click.prevent="removebeiyong(beiyong)" size="mini" type="text">删除</el-button>
          </el-form-item>
          <!-- 轮播图 -->
          <el-row :gutter="24">
            <el-col :xs="22" :sm="22" :md="22" :lg="22" :xl="22">
              <el-form-item label="轮播图">
                <el-upload
                  action="http://mmkashop.com/api/v1/upload/method/add.upload.list.html"
                  list-type="picture-card"
                  accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleRemove"
                  :on-exceed="chooseImg"
                  :on-success="handsuccess"
                  :limit="5"
                  :file-list="fileImgList"
                  class="uploadimg"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
                <div class="warncss">格式:jpg、png、jpeg;最多可上传五张;</div>
                <el-dialog :visible.sync="dialogVisible" append-to-body>
                  <img width="100%" :src="dialogImageUrl" alt />
                </el-dialog>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 商品标题 -->
          <el-row>
            <el-col>
              <el-form-item label="商品标题" prop="addprotitle">
                <el-input v-model="ruleForm.addprotitle" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 原价 现价 地区 渠道 -->
          <el-row>
            <el-col :span="6">
              <el-form-item label="原价" prop="addyuanjia">
                <el-input v-model="ruleForm.addyuanjia" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="现价" prop="addnowprice">
                <el-input v-model="ruleForm.addnowprice" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="地区" prop="addregion">
                <el-select v-model="ruleForm.regionvalue" filterable clearable placeholder="请选择地区">
                  <el-option v-for="r in ruleForm.addregion" :key="r.value" :label="r.label" :value="r.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="渠道" prop="addchannel">
                <el-select v-model="ruleForm.channelvalue" filterable clearable placeholder="请选择地区">
                  <el-option v-for="c in ruleForm.addchannel" :key="c.value" :label="c.label" :value="c.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 价格组选择 -->
          <el-row>
            <el-col>
              <el-form-item label="价格组选择" prop="checkpricegroup">
                <el-select v-model="ruleForm.checkpricevalue" filterable clearable  placeholder="请选择价格组"  @change="changePrice"  @clear="choicePrice">
                  <el-option v-for="p in ruleForm.checkpricegroup" :key="p.value" :label="p.label" :value="p.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 捆绑价格组  priceGroupTableData -->
          <div v-show="isShow" class="kunbanggroupclass">
            <el-row>
              <el-col :span="2">
                <el-form-item label="新增">
                  <el-button icon="el-icon-circle-plus-outline" type="success" circle @click="addPriceGroup()" plain size="mini"></el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <div v-for="(price,p) in priceGroupTableData" :key="p">
              <el-row>
                <el-col :span="6">
                  <el-form-item label="按钮描述">
                    <el-input v-model="price.des" size="mini" clearable>{{price.des}}</el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="价格">
                    <el-input v-model="price.price" size="mini" clearable>{{price.price}}</el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="件数">
                    <el-input size="mini" v-model="price.num" clearable>{{price.num}}</el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item label="删除">
                    <el-button  icon="el-icon-delete" type="danger" circle  @click="bindPriceDelete(p)" plain size="mini" ></el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>
          <!-- 是否有赠品 -->
          <el-row>
            <el-col :span="6">
              <el-form-item label="是否有赠品">
                <el-select v-model="is" clearable size="mini" @change="ischoice" placeholder="请选择">
                  <el-option v-for="s in isgroups" :key="s.value" :label="s.label" :value="s.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-show="isValueShow">
              <el-form-item label="SKU">
                <el-input clearable v-model="addendum.isvalue" size="mini"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-show="isValueShow">
              <el-form-item label="数量">
                <el-input clearable v-model="addendum.isnumvalue" size="mini"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 商品描述 -->
          <el-form-item label="商品描述" prop="prodescribe">
            <el-input  type="textarea" :autosize="{ minRows: 3, maxRows: 5}" placeholder="请输入商品描述"  v-model="ruleForm.prodescribe" ></el-input>
          </el-form-item>
          <!-- 商品介绍 富文本 -->
          <el-form-item label="商品介绍">
            <editor-bar v-model="addApprovalForm.content" :isClear="isClear"></editor-bar>
          </el-form-item>
          <!-- 备注 -->
          <el-form-item label="备注" prop="addremarks">
            <el-input type="textarea" :autosize="{ minRows:2, maxRows:4}" v-model="addremarks"></el-input>
          </el-form-item>
          <!-- ********提交******* -->
          <el-form-item style="text-align: center; margin-right: 100px;">
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            <el-button type="info" @click="addcancel">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
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
import { AxiosReturn, UnixDate } from "../../assets/axios/index";
import TheProblem from "../../components/TheProblem";
import MyDatePicker from '../../components/Child/MyDatePicker'
import EditorBar from "../../views/editor/editoritem.vue";
export default {
  name: "renling",
  components: { EditorBar,MyDatePicker },
  data() {
    return {
      // 搜索
      isSearch:false,
      queryinfo: {
        keywords: "",
        audit_status: "1",
        designer_status:null,
        status: "", //是否包邮
        createtime:"",
        begin_time:"",
        end_time:"",
        page_no: 1, // 当前页
        page_size: 10 // 每页显示的条数
      },
      claimsearch: "",
      // 选品
      claimcheckperson: "",
      claimcheckpersonlist: [],
      // 认领状态
      claimcheckstatus: "",
      claimcheckstatuslist: [],
      // 日期
      createtime: "", //时间窗
      addTimeBegin: "",
      addTimeEnd: "",
      claimtableData: [],
      // ------------------------------ 查看产品弹框
      lookpro: false,
      addRuleFormExamine: {
        examineproname: "",
        examineproename: "",
        examineproid: "",
        supplier: [],
        materialgroup: [],
        shelltextarea: "",
        examinexuanpin: "",
        examinecheckperson: "",
        examinebuyaddress: "",
        examinecompanyname: "", //公司名称
        examinefenlei: "", //分类选择
        examinetype: "" //规格
      },
      stateOption: [
        {value: "0",label: "未审核"},
        {value: "1",label: "已审核"},
        {value: "2",label: "待修改"},
        {value: "3",label: "已删除"}
      ],
      // SKU
      skutabledata: [],
      // 推荐素材
      materialgroup: [{ sucai: "" }],
      // 产品卖点
      shelltextarea: "",

      assignvalue: "",
      // 审核建议
      auditsuggestion: "",
      // ------------------------------新建商品
      newaddcommdity: false,
      ruleForm: {
        addproid: "",
        addproname: "",
        addcomname: "",
        //产品域名
        domains: [
          {
            v: ""
          }
        ],
        fbcode: "",
        //谷歌代码
        chromecode: "",
        beiyongs: [
          {
            v: ""
          }
        ],
        addprotitle: "", //商品标题
        addyuanjia: "",
        addnowprice: "",
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
        regionvalue: "",
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
        channelvalue: "",
        prodescribe: "",

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
        ],
        checkpricevalue: ""
      },

      // --------------------------上传图片
      dialogImageUrl: "",
      companyLogo: "",
      // 图片上传
      fileImgList: [],
      formImg: [],
      dialogVisible: false,
      // 价格组******************************************************
      priceGroupTableData: [
        {
          des: "",
          price: "",
          num: ""
        }
      ],
      isvalue: "",
      isShow: false, //根据选择价格组展示不同组合

      is: "", //新建页面是否有赠品
      isValueShow: false,
      addendum: [{ isvalue: "", isnumvalue: "" }],
      isgroups: [
        {
          value: "0",
          label: "否"
        },
        {
          value: "1",
          label: "有"
        }
      ],
      addremarks: "", //备注
      // 富文本编辑器
      addApprovalForm: {
        content: ""
      },
      isClear: false,
      // 新建商品input校验
      rules: {
        addproid: [
          { required: true, message: "请输入产品id", trigger: "blur" }
        ],
        addproname: [
          { required: true, message: "请输入产品名称", trigger: "blur" }
        ],
        addcomname: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        fbcode: [
          { required: true, message: "请输入FB像素代码", trigger: "blur" }
        ],
        // chromecode: [
        //   { required: true, message: "请输入谷歌代码", trigger: "blur" }
        // ],
        addprotitle: [
          { required: true, message: "请输入商品标题", trigger: "blur" }
        ],
        addyuanjia: [
          { required: true, message: "请输入原价", trigger: "blur" }
        ],
        addnowprice: [
          { required: true, message: "请输入现价", trigger: "blur" }
        ],
        addregion: [{ required: true, message: "请选择地区", trigger: "blur" }],
        addchannel: [{ required: true, message: "请选择地区", trigger: "blur" }]
      },
      // 分页--------------------------------------------------------
      total: 0, //总数
      pagenum: 1, // 当前页
      pagesize: 10 // 每页显示的条数
    };
  },
  created: function() {
    this.getAllList();
    this.getSelectionList();
    this.getSelect(); //获取选品分类的数据 select
  },
  methods: {
    AxiosReturn,
    UnixDate,
    UnixFun(row) {
      if (row.designer_time) {
        return this.UnixDate(row.designer_time);
      }
    },
    auditFun(row) {
      if (row.audit_time) {
        return this.UnixDate(row.audit_time);
      }
    },
    resetFun(){
        this.isSearch=false
        for(var qkey in this.queryinfo){
            this.queryinfo[qkey]=""
        }
        this.queryinfo.page_no=1 
        this.queryinfo.page_size=10
        this.queryinfo.audit_status=1
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
          this.queryinfo.audit_status=1
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
              page_size : this.queryinfo.page_size, //每页条数
              page_no : this.queryinfo.page_no, //翻页页数
              audit_status : this.queryinfo.audit_status=1
          }
      }
      let that = this;
      this.AxiosReturn("product/method/get.product.admin.list/",myParams).then(function(res) {
          if (res.status === 200) {
            let result = res.data.items;
            that.claimtableData = result;
            that.total = res.data.total_result;
          }else{
            this.$message.warning(res.message)
          }
        })
    },
    getSelect() {
      let that = this;
      this.AxiosReturn("goods_type/method/get.goods.type.select", {})
        .then(function(res) {
          if (res.status === 200) {
            that.addRuleFormExamine.typeNameListSearch = res.data;
          }else{
            this.$message.warning(res.message)
          }
        })
        
    },
    // 获取选品下拉数据
    getSelectionList() {
      let that = this;
      this.AxiosReturn("admin/method/get.admin.list/", {group_id: 13,status: 1}).then(function(res){
          if (res.status === 200) {
            that.claimcheckpersonlist = res.data.items;
          }else{
            this.$message(res.message)
          }
        })
    },
    // 分页
    handleSizeChange(newSize) {
      this.queryinfo.page_size= newSize;
      this.getAllList();
    },
    handleCurrentChange(newPage) {
      this.queryinfo.page_no=newPage;
      this.getAllList();
    },

    // 全选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 新建商品
    addcommodity(item, value) {
      this.newaddcommdity = true;
      this.ruleForm.addproid = value.product_id;
      this.ruleForm.addproname = value.name;
    },
    // 查看产品
    claimlook(index, val) {
      this.addRuleFormExamine.examineproname = val.name;
      this.addRuleFormExamine.examineproename = val.ename;
      this.addRuleFormExamine.examineproid = val.product_id; //supplier
      this.addRuleFormExamine.supplier = val.supplier; //
      this.addRuleFormExamine.goods_type_id = val.goods_type_id;
      this.addRuleFormExamine.materialgroup = val.material;
      this.addRuleFormExamine.shelltextarea = val.keywords;
      //shelltextarea
      this.AxiosReturn("product/method/get.products.item", {
        product_id: val.product_id
      }).then(res => {
        this.addRuleFormExamine.spec_combo = res.data.getspec_goods;
        this.lookpro = true;
      });
    },
    // 监听 添加对话框的关闭事件 ---清空form表单
    addDialogClosed() {
      this.$refs.ruleForm.resetFields();
    },
    // 认领btn
    RenLingFun(index, row) {
      if (row.audit_status != 1) {
        this.$message.warning("订单只又审核之后才能认领");
        return;
      }
      let RenlingObj = {
        product_id: row.product_id,
        goods_code: row.goods_code,
        designer_name: row.designer_name,
        designer_status: 1,
        designer_id: row.designer_id
      };
      this.$confirm(`设计师你确定要认领<${row.name}>这个产品吗`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.AxiosReturn("product/method/set.products.item", RenlingObj).then(
            res => {
              if (res.status == 200) {
                this.$message.success("认领成功");
                this.getAllList();
              } else {
                this.$message.warning(res.message);
              }
            }
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    renling(formName) {
      let that = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert('....')
        }
      });
    },
    // 取消
    aduitcancel() {
      this.lookpro = false;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 文件列表移除文件时的钩子
    handleRemove(file, fileList) {
    },
    //文件超出个数限制时的钩子
    chooseImg(files, fileList) {
      this.$message.warning(`最多可上传五张`);
    },
    // 上传成功
    handsuccess(response, file, fileList) {
      this.fileImgList = fileList;
      this.formImg = [];
      for (var img of fileList) {
        this.formImg.push(img.response.data[0].url);
      }
    },
    // 提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // alert("submit!");
          let that = this;
          this.AxiosReturn("goods/method/add.goods.item/", {
              product_id: that.ruleForm.addproid, //产品ID
              name: that.ruleForm.addcomname, //商品名称
              domain: that.ruleForm.domains, //产品域名
              fb: that.ruleForm.fbcode, //FB像素代码
              fb1: that.ruleForm.beiyongs, //备用代码
              google: that.ruleForm.chromecode, ///谷歌代码
              attachment: that.formImg, //轮播图
              short_name: that.ruleForm.addprotitle, //商品标题
              shop_price: that.ruleForm.addyuanjia, //原价
              market_price: that.ruleForm.addnowprice, //现价
              region: that.ruleForm.regionvalue, //地区
              channel: that.ruleForm.channelvalue, //渠道
              description: that.ruleForm.prodescribe, //商品描述
              content: that.addApprovalForm.content, //商品介绍
              price_group_id: that.ruleForm.checkpricevalue, //价格组ID
              price_group: that.priceGroupTableData, //价格组（数组）
              addendum_status: that.is, //是否有赠品
              addendum: that.addendum, //增品(数组)
              goods_remarks: that.addremarks //备注
            })
            .then(function(res) {
              if (res.status === 200) {
                that.$message.success(res.message)
                that.newaddcommdity = false;
              }else{
                  this.$message.warning(res.message)
              }
            })
            
        }else{
          return false;
        }
      });
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
        value: "",
        key: Date.now()
      });
    },
    //删除备用代码
    removebeiyong(info) {
      var index = this.ruleForm.beiyongs.indexOf(info);
      if (index !== -1) {
        this.ruleForm.beiyongs.splice(index, 1);
      }
    },
    //上传图片轮播图

    // 捆绑价格组删除
    bindPriceDelete(index) {
      this.priceGroupTableData.splice(index, 1);
    },
    // 捆绑价格组新增
    addPriceGroup() {
      this.priceGroupTableData.push({
        des: "",
        price: "",
        num: ""
      });
    },
    //------------------------------------ 切换价格组合
    changePrice(val) {
      this.isShow = true;
    },
    // Select 清空
    choicePrice() {
      this.isShow = false;
    },

    //-------------------------------- 加购价格组
    // 删除
    addPriceDelete(i) {
      this.addpriceGroupTableData.splice(i, 1);
    },

    // 加购价格组新增btn
    newaddPriceGroup() {
      this.addpriceGroupTableData.push({
        adddes: "",
        addprice: "",
        addnum: ""
      });
    },
    // --------------------------------同规异价组
    // 新增
    newAddDifferentPriceGroup() {
      this.differentpriceGroupTableData.push({
        difdes: "",
        difprice: "",
        difnum: ""
      });
    },
    // 删除
    difDelete(info) {
      this.differentpriceGroupTableData.splice(info, 1);
    },

    // --------------------------------------
    // 新建商品是否有赠品
    ischoice(isc) {
      if (isc == 0) {
        this.isValueShow = false;
      } else if (isc == 1) {
        this.isValueShow = true;
      }
    },
    // 取消按钮
    addcancel() {
      this.newaddcommdity = false;
    }
  },
  mounted() {}
};
</script>

<style scoped>
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
.kunbanggroupclass {
  border: 1px dashed #c1c1cd;
  border-radius: 3px;
  padding: 10px 0px 10px 0;
  margin-bottom: 15px;
}
.warncss {
  line-height: 30px;
  color: #909399;
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
</style>

