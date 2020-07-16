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
            <el-table-column prop="status" label="是否上架" width="80">
              <template slot-scope="scope">
                <!-- <el-tooltip :content="scope.row.status == 1?'上架':'下架'" placement="top"> -->
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
                      @change="isShelf(scope.row,scope.$index)"
                    ></el-switch>
                  </div>
                <!-- </el-tooltip> -->
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
            <el-table-column label="认领状态" width="100">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.optimizer_status==1" type="success" size="mini">已认领</el-tag>
                <el-tag v-if="scope.row.optimizer_status==0" type="warning" size="mini">未认领</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="create_time" show-overflow-tooltip label="创建时间" width="140"></el-table-column>
            <el-table-column
              prop="create_time"
              show-overflow-tooltip
              label="认领时间"
              :formatter="UnixFun"
              width="140"
            ></el-table-column>
            <el-table-column prop="goods_remarks" show-overflow-tooltip label="备注"></el-table-column>
            <el-table-column fixed="right" label="操作" width="200">
              <template slot-scope="scope">
                <el-button
                  @click="claimClick(scope.$index,scope.row)"
                  :disabled="scope.row.optimizer_status==1 || scope.row.status  == 0"
                  type="success"
                  style="padding:3px "
                  size="mini"
                  icon="el-icon-success"
                >认领</el-button>
                <el-button
                  @click="editClick(scope.row,scope.row.goods_id)"
                  style="padding: 3px;"
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                >编辑</el-button>
                <el-button
                  @click="commentClick(scope.$index,scope.row)"
                  style="padding: 3px;"
                  type="warning"
                  size="mini"
                  icon="el-icon-edit-outline"
                >评论</el-button>
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
          :page-sizes="[10, 15, 50, 100]"
          :page-size="queryinfo.page_size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>

      <!-- ******************** 编辑商品 *********************** -->
      <el-dialog
        title="编辑商品"
        :visible.sync="isShowEdtiPro"
        width="60%"
        center
        @close="editDialogClosed"
      >
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm demo-dynamic"
          size="mini"
        >
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
                <el-input v-model="ruleForm.name" clearable></el-input>
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
                <el-input v-model="ruleForm.fb"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="谷歌代码" prop="google">
                <el-input v-model="ruleForm.google"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-button @click="addbeiyongcode" type="primary" plain>新增备用代码</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item
            v-for="(b, index) in ruleForm.fb1"
            :label="'备用代码~' + index"
            :key="b.key"
            :prop="'fb1.' + index + '.v'"
          >
            <el-input class="dynamic-platform-value" v-model="b.v"></el-input>
            <el-button @click.prevent="removebeiyong(b)" type="text" size="mini">删除</el-button>
          </el-form-item>
          <!-- 轮播图 -->
          <el-row :gutter="24">
            <el-col :xs="22" :sm="22" :md="22" :lg="22" :xl="22">
              <el-form-item label="轮播图11111">
                <el-upload
                  action="http://mmkashop.com/api/v1/upload/method/add.upload.list.html"
                  multiple
                  accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF"
                  list-type="picture-card"
                  :on-preview="handlePictureCardPreviewEdit"
                  :on-remove="handleRemoveEdit"
                  :on-exceed="chooseImg"
                  :on-success="handsuccess"
                  :limit="5"
                  :file-list="fileImgListEdit"
                  class="uploadimg"
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
                <el-input v-model="ruleForm.short_name" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 原价 现价 地区 渠道 -->
          <el-row>
            <el-col :span="6">
              <el-form-item label="原价" prop="market_price">
                <el-input v-model="ruleForm.market_price"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="现价" prop="shop_price">
                <el-input v-model="ruleForm.shop_price"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="地区" prop="region">
                <el-select v-model="ruleForm.region" filterable clearable placeholder="请选择地区">
                  <el-option
                    v-for="r in info.addregion"
                    :key="r.value"
                    :label="r.label"
                    :value="r.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="渠道" prop="channel">
                <el-select v-model="ruleForm.channel" filterable clearable placeholder="请选择渠道">
                  <el-option
                    v-for="c in info.addchannel"
                    :key="c.value"
                    :label="c.label"
                    :value="c.value"
                  ></el-option>
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
                >
                  <el-option
                    v-for="p in info.checkpricegroup"
                    :key="p.value"
                    :label="p.label"
                    :value="p.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <div v-if="ruleForm.price_group_id>0 ">
            <div v-show="isShow" class="kunbanggroupclass">
              <el-row>
                <el-col :span="2">
                  <el-form-item label="新增">
                    <el-button
                      icon="el-icon-circle-plus-outline"
                      type="success"
                      circle
                      @click="addPriceGroup()"
                      plain
                      size="mini"
                    ></el-button>
                  </el-form-item>
                </el-col>
              </el-row>
              <div v-show="isShow = true">
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
                        <el-button
                          icon="el-icon-delete"
                          type="danger"
                          circle
                          @click="bindPriceDelete(p)"
                          plain
                          size="mini"
                        ></el-button>
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
                <el-select
                  v-model="ruleForm.addendum_status"
                  clearable
                  @change="ischoice"
                  placeholder="请选择"
                >
                  <el-option v-for="s in isgroups" :key="s.value" :label="s.label" :value="s.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <div v-if="ruleForm.addendum_status== 1">
              <el-col :span="6">
                <el-form-item label="SKU">
                  <el-input clearable v-model="ruleForm.addendum.isnumvalue" size="mini"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="数量">
                  <el-input clearable v-model="ruleForm.addendum.isvalue" size="mini"></el-input>
                </el-form-item>
              </el-col>
            </div>
          </el-row>
          <!-- 商品描述 -->
          <el-row>
            <el-col>
              <el-form-item label="商品描述" prop="description">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 3, maxRows: 5}"
                  placeholder="请输入商品描述"
                  v-model="ruleForm.description"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 商品介绍 富文本 -->
          <el-row>
            <el-col :xs="23" :sm="23" :md="23" :lg="23" :xl="23">
              <el-form-item label="商品介绍">
                <editor-bar v-model="ruleForm.content" :isClear="isClear"></editor-bar>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 备注 -->
          <el-row>
            <el-col>
              <el-form-item label="备注" prop="goods_remarks">
                <el-input
                  type="textarea"
                  :autosize="{ minRows:2, maxRows:4}"
                  v-model="ruleForm.goods_remarks"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item style="text-align: center;margin-right: 100px !important;">
            <el-button type="primary" @click="submitEdit">提交</el-button>
            <el-button type="info" @click="editCancel">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <!-- ******************* 评论 **************** -->
      <el-dialog title="添加评论" :visible.sync="isShowEvaluate" width="50%" center>
        <el-card>
          <el-form
            :model="commentRuleForm"
            :rules="commentRules"
            ref="commentRuleForm"
            label-width="100px"
            class="demo-ruleForm"
            size="mini"
          >
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
                    multiple
                    accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF"
                    list-type="picture-card"
                    :on-preview="handlePictureCardPreviewComment"
                    :on-remove="handleRemoveComment"
                    :on-exceed="chooseImgComment"
                    :on-success="handsuccessComment"
                    :limit="4"
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
      <!-- ------------- 评论编辑弹窗 ------------ -->
      <el-dialog title="评论编辑" :visible.sync="isShowPingLunEdit" width="80%" center append-to-body>
        <el-card>
          <el-form ref="pingLunEditform" :model="pingLunEditform" label-width="100px">
            <el-row :gutter="0">
              <el-col :xs="5" :sm="5" :md="5" :lg="5" :xl="5">
                <el-form-item label="商品ID" prop="shopID">
                  <el-input v-model="pingLunEditform.shopID" disabled clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="商品名称" prop="shopName">
                  <el-input v-model="pingLunEditform.shopName" disabled clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="5" :sm="5" :md="5" :lg="5" :xl="5">
                <el-form-item label="评论人" prop="shopperson">
                  <el-input v-model="pingLunEditform.shopperson" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="5" :sm="5" :md="5" :lg="5" :xl="5">
                <el-form-item label="满意度" prop="shopmanyi">
                  <el-input v-model="pingLunEditform.shopmanyi" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="0">
              <el-col :xs="5" :sm="5" :md="5" :lg="5" :xl="5">
                <el-form-item label="评价时间" prop="shopTime">
                  <el-input v-model="pingLunEditform.shopTime" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="5" :sm="5" :md="5" :lg="5" :xl="5">
                <el-form-item label="是否显示">
                  <el-switch v-model="pingLunEditform.isShowBtnEdit"></el-switch>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="0">
              <el-col :xs="23" :sm="23" :md="23" :lg="23" :xl="23">
                <el-form-item label="上传图片">
                  <el-upload
                    action="https://www.mocky.io/v2/5185415ba171ea3a00704eed/posts/"
                    accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF"
                    list-type="picture-card"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove"
                    :limit="4"
                    :file-list="fileImgList"
                    class="uploadimg"
                  >
                    <i class="el-icon-plus"></i>
                  </el-upload>
                  <div class="warncss">格式:jpg、png、jpeg;最多可上传四张;</div>
                  <el-dialog :visible.sync="dialogVisible" append-to-body>
                    <img width="100%" :src="dialogImageUrl" alt />
                  </el-dialog>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="0">
              <el-col :xs="23" :sm="23" :md="23" :lg="23" :xl="23">
                <el-form-item label="留言" prop="leavingMessage">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    v-model="pingLunEditform.leavingMessage"
                    placeholder="请输入留言"
                    clearable
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="0">
              <el-col>
                <el-form-item>
                  <el-button type="primary" @click="pingLunSubBtn">提交</el-button>
                  <el-button type="info" @click="pingLunCancel">取消</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </el-dialog>

      <!-- ************************** 批量添加评论 ************************ -->
      <el-dialog title="批量添加评论" :visible.sync="isShowBatchAdd" width="80%" center>
        <el-card>
          <el-form>
            <el-row :gutter="24">
              <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
                <div class="grid-content bg-purple">
                  <el-input placeholder="请输入搜索内容" v-model="batchsearch" clearable>
                    <el-button slot="append" icon="el-icon-search" @click="batchsearchBtn"></el-button>
                  </el-input>
                </div>
              </el-col>
              <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
                <el-form-item label="添加评论" prop="batchAddPingLun">
                  <el-button type="success" size="mini" @click="batchAddBtn">+</el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-table
                height="500"
                border
                :data="batchData"
                style="width: 100% ;"
                class="tb-edit"
                highlight-current-row
                @cell-dblclick="celledit"
              >
                <el-table-column prop="batchcomId" label="商品ID" width="120">
                  <template slot-scope="scope">
                    <el-input
                      size="small"
                      v-model="scope.row.batchcomId"
                      @change="handBatchComId(scope.$index,scope.row)"
                      clearable
                    ></el-input>
                    <span>{{scope.row.batchcomId}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="batchcomName" label="商品名称" width="230">
                  <template slot-scope="scope">
                    <el-input
                      size="small"
                      v-model="scope.row.batchcomName"
                      @change="handBatchComName(scope.$index,scope.row)"
                      clearable
                    ></el-input>
                    <span>{{scope.row.batchcomName}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="batchcommentator" label="评论人" width="130">
                  <template slot-scope="scope">
                    <el-input
                      size="small"
                      v-model="scope.row.batchcommentator"
                      @change="handBatchCommentator(scope.$index,scope.row)"
                      clearable
                    ></el-input>
                    <span>{{scope.row.batchcommentator}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="batchstar" label="满意度" width="100">
                  <template slot-scope="scope">
                    <el-input
                      size="small"
                      v-model="scope.row.batchstar"
                      @change="handBatchStar(scope.$index,scope.row)"
                      clearable
                    ></el-input>
                    <span>{{scope.row.batchstar}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="batchmessage" show-overflow-tooltip label="留言" width="320">
                  <template slot-scope="scope">
                    <el-input
                      size="small"
                      v-model="scope.row.batchmessage"
                      @focus="handBatchMessage(scope.$index,scope.row)"
                      clearable
                    ></el-input>
                    <span>{{scope.row.batchmessage}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="batchimgUrl" label="上传图片" width="180">
                  <template slot-scope="scope">
                    <el-upload
                      ref="upload"
                      action="https://www.mocky.io/v2/5185415ba171ea3a00704eed/posts/"
                      list-type="picture-card"
                      accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF"
                      :on-preview="batchhandlePictureCardPreview"
                      :on-remove="function(file,fileList){return batchhandleRemove(file,fileList,scope.$index)}"
                      :on-success="function(file,fileList){return handleSuccess(file,fileList,scope.$index)}"
                      :on-error="function(file,fileList){return handleError(file,fileList,scope.$index)}"
                      :limit="1"
                      :file-list="batchfileImgList[scope.$index]"
                      class="uploadimg"
                    >
                      <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog :visible.sync="batchdialogShow" append-to-body>
                      <img width="100%" :src="scope.row.batchimgUrl" />
                    </el-dialog>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="80">
                  <template slot-scope="scope">
                    <el-button
                      @click="batchcDeleteBtn(scope.row,scope.$index)"
                      type="danger"
                      plain
                      size="mini"
                    >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
          </el-form>
        </el-card>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { AxiosReturn, UnixDate } from "../../assets/axios/index";
import MyDatePicker from "../../components/Child/MyDatePicker";
import EditorBar from "../../views/editor/editoritem.vue";
export default {
  name: "prolist",
  components: { EditorBar, MyDatePicker },
  data() {
    return {
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
      total: 0, //总数
      // 日期
      tableData: [],
      tableDomains: [],
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
      // -----------------------------------评论
      isShowEvaluate: false,

      evaluteMultipleSelection: [],
      pingLunCurrentPage: 0,
      isShowPingLunEdit: false, //是否显示评论编辑弹窗
      pingLunEditform: {
        shopId: "00",
        shopName: "",
        shopperson: "",
        shopmanyi: "",
        leavingMessage: "",
        shopTime: "",
        isShowBtnEdit: ""
      },
      // --------------------------评论编辑上传图片
      dialogImageUrl: "",
      // companyLogo: "",
      fileImgList: [],
      dialogVisible: false,
      // --------------------------批量添加评论
      batchsearch: "",
      isShowBatchAdd: false,
      batchAddPingLun: "",
      batchData: [
        {
          batchcomId: "",
          batchcomName: "",
          batchcommentator: "",
          batchstar: "",
          batchmessage: "",
          batchimgUrl: ""
        }
      ],
      batchfileImgList: [],
      batchdialogShow: false,
      curRowIndex: null,
     
      // ---------------------------编辑当前页是否有赠品
      isValueShow: false,
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
        score: 0
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
    UnixDate,
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
      let that = this;
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
      this.AxiosReturn("goods/method/get.goods.admin.list",myParams).then(function(res) {
          if (res.status === 200) {
            that.tableData = res.data.items;
            that.total = res.data.total_result;
          }else{
            this.$message.warning(res.message)
          }
        })
    },
    // 解决遍历的域名值不出来问题
    fn(d) {
      return d.v;
    },
    // 搜索
    serachrenling() {},
    isShelf(row, index) {
      this.AxiosReturn("goods/method/set.shelves.goods.list", {
          goods_id: row.goods_id,
          status: row.status
        }).then(res => {
          if (res.status == 200) {
            this.$message({
              message: "设置成功",
              type: "success",
              center: true
            });
            this.getList();
          } else {
            this.$message({
              message: "设置失败",
              type: "warnig"
            });
          }
        })
    },
    // 认领
    claimClick(index, row) {
      if (row.optimizer_status != 1) {
        let RenlingObj = {
          goods_id: row.goods_id,
          goods_code: row.goods_code,
          optimizer_status: 1
        };
        this.$confirm(`优化师' ${row.optimizer}' 你确定要认领<${row.name}>这个商品吗`,"提示",{
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.AxiosReturn("goods/method/set.goods.itemop/", RenlingObj).then(res => {
                if (res.status == 200) {
                  this.$message.success("认领成功");
                  this.getList();
                } else {
                  this.$message.warning(res.message);
                }
              }
            );
          }).catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      } else {
        this.$message.warning("该商品无法认领");
      }
    },
    UnixFun(row) {
      if (row.optimizer_time) {
        return this.UnixDate(row.optimizer_time);
      }
    },
    // 评论
    commentClick(index, row) {
      this.commentRuleForm.content = "";
      this.fileImgListComment = [];
      this.commentRuleForm.goods_id = row.goods_id;
      this.commentRuleForm.goods_name = row.name;
      this.isShowEvaluate = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.AxiosReturn("goods_comment/method/add.goods.comment.item/",
            this.commentRuleForm
          ).then(res => {
            if (res.status == 200) {
              this.$message.success("评论添加成功");
              this.isShowEvaluate = false;
            } else {
              this.$message.warning(res.message);
            }
          });
        }
      });
    },
    // 分页
    handleSizeChange(val) {
      this.queryinfo.page_size = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.queryinfo.page_no = val;
      this.getList();
    },
    // ---------------------------------编辑弹框
    // 编辑
    editClick(row, i) {
      this.priceGroupsChange = {
        index: row.price_group_id,
        arr: row.price_group
      };
      this.priceGroupTableData = row.price_group;
      this.fileImgListEdit = [];
      for (var i in row.attachment) {
        this.fileImgListEdit.push({
          name: i + ".jpg",
          url: "http://" + row.attachment[i]
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
      this.AxiosReturn("goods/method/set.goods.item/", {
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
        }).then(function(res) {
          if (res.status === 200) {
            that.$message({
              message: res.message,
              type: "success",
              center: true
            });
            that.isShowEdtiPro = false;
            that.getList();
          } else{
            that.$message.warning(res.message);
          }
        })
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
      this.editformimg = [];
      for (var img of fileList) {
        if (img.response) {
          this.editformimg.push(img.response.data[0].url);
        } else {
          this.editformimg.push(img.url.split("http://")[1]);
        }
      }
    },
    //文件超出个数限制时的钩子
    chooseImg(files, fileList) {
      this.$message.warning(`最多可上传五张`);
    },
    // 上传成功
    handsuccess(response, file, fileList) {
      this.fileImgListEdit = fileList;

      this.editformimg = [];
      for (var img of fileList) {
        if (img.response) {
          this.editformimg.push(img.response.data[0].url);
        } else {
          this.editformimg.push(img.url.split("http://")[1]);
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
        this.priceGroupTableData = [];
      }
    },

    // 当前页是否有赠品
    ischoice(isc) {
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
    },
    //文件超出个数限制时的钩子
    chooseImgComment(files, fileList) {
      this.$message.warning(`最多可上传四张`);
    },
    // 上传成功
    handsuccessComment(response, file, fileList) {
      this.fileImgListComment = fileList;
      this.commentRuleForm.image = [];
      for (var img of fileList) {
        this.commentRuleForm.image.push(img.response.data[0].url);
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    
    // 评价编辑
    pingLuneditBtn(rowedit) {
      this.isShowPingLunEdit = true;
    },
    //上传图片评论
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 文件列表移除文件时的钩子
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    pingLunSubBtn() {
      console.log(11);
    },
    pingLunCancel() {
      this.isShowPingLunEdit = false;
    },
    // -----------------------------------------------批量添加评论
    // 批量添加评论btn
    batchAdd() {
      this.isShowBatchAdd = true;
    },
    // 评论导入
    importInfo() {
      this.$message({
        showClose: true,
        message: "暂时未开通，敬请期待"
      });
    },
    // 批量添加评论搜素
    batchsearchBtn() {
      console.log(123);
    },
    // 批量添加评论+添加一行
    batchAddBtn() {
      this.batchData.push({
        batchcomId: "",
        batchcomName: "",
        batchcommentator: "",
        batchstar: "",
        batchmessage: "",
        batchimgUrl: ""
      });
    },
    // 批量添加评论删除
    batchcDeleteBtn(i, index) {
      console.log(i, "**", index);
      var index = this.batchData.indexOf(i);
      // console.log(index, "------");
      if (index !== -1) {
        this.batchData.splice(index, 1);
        // // 删除的时候要把fileList清除,否则页面已上传的文件不会被清空
        // this.batchfileImgList.splice(index, 1);
        //  this.$refs['upload'].clearFiles();
        // for (var i = 0; i < this.batchData.length; i++) {
        //   this.batchData[i].batchimgUrl = "fileList.url";
        // }
      }
      //  this.$refs['upload'].clearFiles();
    },
    celledit(row, column, cell, event) {
      // console.log(row, column, 111);
    },
    handBatchComId(index, row) {
      // console.log(index, row, "商品ID");
    },
    handBatchComName(index, row) {
      // console.log(index, row, "商品名称");
    },
    handBatchCommentator(index, row) {
      // console.log(index, row, "评论人");
    },
    handBatchStar(index, row) {
      // console.log(index, row, "满意度");
    },
    handBatchMessage(index, row) {
      // console.log(index, row, "留言");
    },
    //  批量添加评论上传图片
    batchhandlePictureCardPreview(file) {
      for (var i = 0; i < this.batchData.length; i++) {
        this.batchData[i].batchimgUrl = file.url;
      }
      this.batchdialogShow = true;
    },

    batchhandleRemove(file, fileList, index) {
    },
    // 图片上传
    handleSuccess(file, fileList, index) {
      this.$message({
        showClose: true,
        message: "图片上传成功",
        type: "success"
      })


      for (var i = 0; i < this.batchData.length; i++) {
        this.batchData[i].batchimgUrl = fileList.url;
      }
    },
    handleError(file, fileList, index) {
      this.$message({
        showClose: true,
        message: "图片上传失败",
        type: "error"
      });
    }
  },
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
