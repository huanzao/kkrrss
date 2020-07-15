<template>
   <el-card>
       <el-form ref="form" :model="form" label-width="150px" class="demo-ruleForm" size="mini">
            <el-divider>基础设置</el-divider>
            <el-form-item label="商城名称">
                <el-input v-model="form.name[0]" clearable placeholder="商城名称"></el-input>
                <div class="help-block">商城名称，将显示在前台顶部欢迎信息等位置</div>
            </el-form-item>
            <el-form-item label="商城标题">
                <el-input v-model="form.title[0]" clearable placeholder="商城标题"></el-input>
                <div class="help-block">商城标题，将显示在前台顶部欢迎信息等位置</div>
            </el-form-item>
            <el-form-item label="商城关键词">
                <el-input v-model="form.keywords[0]" clearable placeholder="商城关键词"></el-input>
                <div class="help-block">商城关键词，有利于对整站的SEO优化</div>
            </el-form-item>
            <el-form-item label="商城描述">
                <el-input v-model="form.description[0]" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="商城描述"></el-input>
                <div class="help-block">商城描述，将显示在前台顶部欢迎信息等位置</div>
            </el-form-item>
             <el-form-item label="商城LOGO">
                <el-upload
                  action="http://mmkashop.com/api/v1/upload/method/add.upload.list.html"
                  list-type="picture-card"
                  accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleRemove"
                  :on-exceed="chooseImg"
                  :on-success="handsuccess"
                  :limit="1"
                  :file-list="shopLogoImg"
                  class="uploadimg"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
                <div class="help-block">默认商城LOGO，通用头部显示，最佳显示尺寸为240*60像素</div>
                <el-dialog :visible.sync="dialogVisible" append-to-body>
                  <img width="100%" :src="dialogImageUrl" alt />
                </el-dialog>
            </el-form-item>
            <el-form-item label="方形LOGO">
                <el-upload
                  action="http://mmkashop.com/api/v1/upload/method/add.upload.list.html"
                  list-type="picture-card"
                  accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF"
                  :on-preview="handlePictureCardPreview_zz"
                  :on-remove="handleRemove_zz"
                  :on-exceed="chooseImg_zz"
                  :on-success="Squresuccess_zz"
                  :limit="1"
                  :file-list="ShopSquare_logo"
                  class="uploadimg"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
                <div class="help-block">方形商城LOGO，通用移动端居多，最佳显示尺寸为80*80像素</div>
                <el-dialog :visible.sync="dialogVisible" append-to-body>
                  <img width="100%" :src="dialogImageUrl" alt />
                </el-dialog>
            </el-form-item>
            <el-form-item label="发货信息">
                <el-input v-model="form.information[0]" type="textarea" :autosize="{ minRows: 3, maxRows: 5}" placeholder="发货信息"></el-input>
                <div class="help-block">打印发货单时预留的信息</div>
            </el-form-item>

            <el-divider>状态设置</el-divider>
            <el-form-item label="是否开启首页">
                <template>
                  <el-radio v-model="form.open_index" label="1">是</el-radio>
                  <el-radio v-model="form.open_index" label="0">否</el-radio>
                </template>
            </el-form-item>
            <el-form-item label="是否开启移动页">
                <template>
                  <el-radio v-model="form.open_mobile" label="1">是</el-radio>
                  <el-radio v-model="form.open_mobile" label="0">否</el-radio>
                </template>
            </el-form-item>
            <el-form-item label="是否开启API接口">
                <template>
                  <el-radio v-model="form.open_api" label="1">是</el-radio>
                  <el-radio v-model="form.open_api" label="0">否</el-radio>
                </template>
            </el-form-item>
            <el-form-item label="API接口关闭原因">
                <el-input v-model="form.close_reason[0]" clearable placeholder="API接口关闭原因"></el-input>
            </el-form-item>

            <el-divider>定义平台</el-divider>
            <el-form-item v-for="(p, index) in form.platform" :label="'平台自定义值' + index" :key="index">

                <el-input class="dynamic-platform-key" v-model="p.key" placeholder="序列值"></el-input>
                <el-input class="dynamic-platform-value" v-model="p.value" placeholder="平台名称"></el-input>
                <el-button @click.prevent="form.platform.splice(index, 1)" size="mini" type="text">删除</el-button>
            </el-form-item>
             <el-form-item>
                <el-button @click="form.platform.push({'key': null, 'value': ''})" size="mini">新增平台</el-button>
            </el-form-item>

            <el-divider>跨域访问</el-divider>
            <el-form-item v-for="(p,ind) in form.allow_origin" :label="'允许跨域访问的域名' + ind" :key="ind+'SS'">
                <el-input class="dynamic-platform-value" v-model="form.allow_origin[ind]" placeholder="域名地址"></el-input>
                <el-button  @click.prevent="form.allow_origin.splice(ind, 1)" size="mini" type="text">删除</el-button>
            </el-form-item>
             <el-form-item>
                 <el-button @click="form.allow_origin.push('')">新增域名</el-button>
            </el-form-item>

            <el-divider>其他设置</el-divider>
            <el-form-item label="移动中间页地址">
                <el-input  v-model="form.weixin_url[0]" placeholder="域名地址"></el-input>
            </el-form-item>
            <el-form-item label="第三方统计代码">
                <el-input  v-model="form.third_count[0]" type="textarea" :autosize="{ minRows: 4, maxRows: 6}" placeholder="第三方统计代码"></el-input>
            </el-form-item>

            <div style="text-align: center;">
              <el-button style="width:300px"  size="small" type="primary"  @click="handleFormSubmit">保存</el-button>
            </div>

         
        </el-form>
   </el-card>
</template>
<script>
import {AxiosReturn} from '../../assets/axios/index'
export default {
  name: "systemConfiguration",
  data() {
    return {
        form: {
          allow_origin:[],
          beian: "",
          beian_ico: "",
          beian_url:[],
          card_auth:[],
          close_reason:[],
          description:[],
          information:[],
          keywords:[],
          logo:[],
          miitbeian: "",
          miitbeian_ico: "",
          miitbeian_url: [],
          name: [],
          open_api: "",
          open_index: "",
          open_mobile: "",
          platform: [],
          qrcode_logo: [],
          square_logo: [],
          third_count: [],
          title: [],
          weixin_url: [],
        },
        shopLogoImg:[{name:'logo.jpg',url:""}],
        ShopSquare_logo:[{name:'logo.jpg',url:""}],
        // 商城LOGO
        dialogImageUrl: "",
        dialogVisible: false,
        loading: false,
    }
  },
  created(){
    this.getFormData();
  },
  methods: {
    AxiosReturn,
     // 设置配置数据
    getFormData(val) {  
      this.AxiosReturn("setting/method/get.setting.list/",{module:'system_info'}).then(res=>{
        console.log(res)
            let result = res.data;
            this.form.allow_origin=result.allow_origin.value
            this.form.beian=result.beian.value
            this.form.beian_ico=result.beian_ico.value
            this.form.beian_url=result.beian_url.value
            this.form.card_auth=result.card_auth.value
            this.form.close_reason=result.close_reason.value
            this.form.description=result.description.value
            this.form.information=result.information.value
            this.form.keywords=result.keywords.value
            this.form.miitbeian=result.miitbeian.value
            this.form.miitbeian_ico=result.miitbeian_ico.value
            this.form.miitbeian_url=result.miitbeian_url.value
            this.form.name=result.name.value
            this.form.open_api=result.open_api.value.toString()
            this.form.open_index=result.open_index.value.toString()
            this.form.open_mobile=result.open_mobile.value.toString()
            this.form.platform=result.platform.value
            this.form.qrcode_logo=result.qrcode_logo.value
            this.form.third_count=result.third_count.value
            this.form.title=result.title.value
            this.form.weixin_url=result.weixin_url.value
            if(result.logo.value[0].indexOf('http://')=='-1'){
                this.shopLogoImg[0].url='http://'+result.logo.value[0]
            }else{
                this.shopLogoImg[0].url=result.logo.value[0]
            }

            // ShopSquare_logo

            if(result.square_logo.value[0].indexOf('http://')=='-1'){
                this.ShopSquare_logo[0].url='http://'+result.square_logo.value[0]
            }else{
                this.ShopSquare_logo[0].url=result.square_logo.value[0]
            }
      })                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
    },
    handleFormSubmit(){
        this.form.logo=[]
        this.form.square_logo=[]
        this.form.logo.push(this.shopLogoImg[0].url)
        this.form.square_logo.push(this.ShopSquare_logo[0].url)
        console.log('logo',this.shopLogoImg[0].url)
        console.log('square_logo',this.ShopSquare_logo[0].url)

        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });

        this.AxiosReturn('setting/method/set.system.list',this.form).then(res=>{
          loading.close()
          console.log(res)
          if(res.status==200){
            this.$message.success("设置成功")
          }else{
            this.$message.warning(res.message)
          }
        })
    },
    // 商城LOGO
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
      console.log(file);
    },
    // 文件列表移除文件时的钩子
    handleRemove(file, fileList) {
      // console.log(file, fileList);
    },
    //文件超出个数限制时的钩子
    chooseImg(files, fileList) {
      // console.log("文件超出个数限制时的钩子");
      this.$message.warning(`最多可上传一张`);
    },
    // 上传成功
    handsuccess(response, file, fileList) {
      console.log(response, file, fileList);
      for (var img of fileList) {
         this.shopLogoImg[0].url=img.response.data[0].url
      }
    },

    // 商城LOGO
    handlePictureCardPreview_zz(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
      console.log(file);
    },
    // 文件列表移除文件时的钩子
    handleRemove_zz(file, fileList) {
      // console.log(file, fileList);
    },
    //文件超出个数限制时的钩子
    chooseImg_zz(files, fileList) {
      // console.log("文件超出个数限制时的钩子");
      this.$message.warning(`最多可上传一张`);
    },
    // 上传成功
    Squresuccess_zz(response, file, fileList) {
      console.log(response, file, fileList);
      for (var img of fileList) {
         this.ShopSquare_logo[0].url=img.response.data[0].url
      }
    },
  }
}
</script>

<style>
.help-block {
    color: #909399;
    font-size: 12px;
    line-height: 2;
    margin-bottom: -8px;
}
.dynamic-platform-key {
    margin-right: 10px;
    width: 120px;
}

.dynamic-platform-value {
    margin-right: 10px;
    width: 190px;
}
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

