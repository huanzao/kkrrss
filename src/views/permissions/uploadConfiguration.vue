<template>
    <el-card>
       <el-form ref="form" :model="form" label-width="150px" class="demo-ruleForm" size="mini">
           <el-divider>基础设置</el-divider>
           <el-form-item label="默认资源上传模块">
                 <el-radio-group v-model="form.default">
                    <el-radio label="aliyun">本地上传</el-radio>
                    <el-radio label="qiniuyun">七牛云 KODO</el-radio>
                    <el-radio label="alioss">阿里云 OSS</el-radio>
                 </el-radio-group>
               <div class="help-block">在不指定上传模块时，系统默认启用的上传模块</div>
           </el-form-item>
           <el-form-item label="资源获取短地址">
                <el-input v-model="form.oss" clearable placeholder="资源获取短地址"></el-input>
                <div class="help-block" v-html="help_text"></div>
           </el-form-item>
           <el-form-item label="允许上传的图片后缀">
                <el-tag :key="tag" v-for="tag in dynamicTags" closable :disable-transitions="false" @close="handleClose(tag)"> {{tag}}</el-tag>
                <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm"></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
           </el-form-item>
           <el-form-item label="允许上传的文件后缀">
                <el-tag :key="tag" v-for="tag in dynamicTagsTag" closable :disable-transitions="false" @close="handleCloseTag(tag)"> {{tag}}</el-tag>
                <el-input class="input-new-tag" v-if="inputVisibleTag" v-model="inputValueTag" ref="saveTagInputTag" size="small" @keyup.enter.native="handleInputConfirmTag" @blur="handleInputConfirmTag"></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInputTag">+ New Tag</el-button>
           </el-form-item>
           <el-form-item label="附件上传大小限制">
                <el-select v-model="form.file_size" filterable placeholder="请选择">
                  <el-option v-for="item in options" :key="item.value"  :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
           </el-form-item>
           <el-form-item label="上传令牌有效时长(秒)">
                <el-input-number v-model="form.token_expires" controls-position="right"  @change="handleChange" :min="0"></el-input-number>
                <div class="help-block">获得上传令牌后多少秒后视为无效</div>
           </el-form-item>

           <el-divider>本地上传</el-divider>
           <el-form-item label="资源绑定域名别名">
                <el-input v-model="form.careyshop_url" clearable placeholder="资源绑定域名别名"></el-input>
                <div class="help-block">(本地上传)绑定资源目录域名后，Host路径将变为该值，不必添加地址前缀</div>
           </el-form-item>

           <el-divider>七牛云 KODO</el-divider>
           <el-form-item label="AccessKey(AK)">
                <el-input v-model="form.qiniu_access_key" clearable placeholder="AccessKey(AK)"></el-input>
                <div class="help-block" v-html="AKhelp_text"></div>
           </el-form-item>
           <el-form-item label="SecretKey(SK)">
                <el-input v-model="form.qiniu_secret_key" clearable placeholder="SecretKey(SK)"></el-input>
                <div class="help-block" v-html="SKhelp_text"></div>
           </el-form-item>
           <el-form-item label="存储空间名称">
                <el-input v-model="form.qiniu_bucket" clearable placeholder="存储空间名称"></el-input>
                <div class="help-block" v-html="BKhelp_text"></div>
           </el-form-item>
           <el-form-item label="外链域名">
                <el-input v-model="form.qiniu_url" clearable placeholder="外链域名"></el-input>
                <div class="help-block" v-html="qiniu_url_text + '，不必添加地址前缀'"></div>
           </el-form-item>

           <el-divider>阿里云 OSS</el-divider>
           <el-form-item label="AccessKey ID">
                <el-input v-model="form.aliyun_access_key" clearable placeholder="AccessKey ID"></el-input>
                <div class="help-block" v-html="aLAkId_help_text"></div>
           </el-form-item>
           <el-form-item label="AccessKey Secret">
                <el-input v-model="form.aliyun_secret_key" clearable placeholder="SecretKey(SK)"></el-input>
                <div class="help-block" v-html="secret_help_text"></div>
           </el-form-item>
           <el-form-item label="Bucket 名称">
                <el-input v-model="form.aliyun_bucket" clearable placeholder="Bucket 名称"></el-input>
                <div class="help-block" v-html="aLiBucket_help_text"></div>
           </el-form-item>
           <el-form-item label="Bucket 域名">
                <el-input v-model="form.aliyun_url" clearable placeholder="Bucket 域名"></el-input>
                <div class="help-block" v-html="aLiDamin_text + '，不必添加地址前缀'"></div>
           </el-form-item>
           <el-form-item label="EndPoint">
                <el-input v-model="form.aliyun_endpoint" clearable placeholder="EndPoint"></el-input>
                <div class="help-block" v-html="aLiendpoint_text"></div>
           </el-form-item>
           <el-form-item label="RoleArn">
                <el-input v-model="form.aliyun_rolearn" clearable placeholder="RoleArn"></el-input>
                <div class="help-block" v-html="aLirolearn_text"></div>
           </el-form-item>




          <div style="text-align: center;">
            <el-button style="width:300px"  size="small" type="primary"  @click="handleFormSubmit">保存</el-button>
          </div>




       </el-form>
    </el-card>

</template>
<script>
import {AxiosReturn} from '../../assets/axios/index'
import axios from 'axios'
export default {
  name: "uploadConfiguration",
  data() {
    return {
      form: {
         default:'',
         oss:'',
         image_ext:'',
         file_ext:'',
         file_size:"", 
         token_expires:0, 
         qiniu_access_key:'',
         qiniu_secret_key:"",       
         qiniu_bucket:'',
         qiniu_url:'',
         aliyun_access_key:'',
         aliyun_secret_key:'',
         aliyun_bucket:'',
         aliyun_url:'',
         aliyun_endpoint:'',
         aliyun_rolearn:'',
      },
       help_text:null,
       AKhelp_text:null,
       SKhelp_text:null,
       BKhelp_text:null,
       qiniu_url_text:null,
       aLAkId_help_text:null,
       secret_help_text:null,
       aLiBucket_help_text:null,
       aLiDamin_text:null,
       aLiendpoint_text:null,
       aLirolearn_text:null,


       dynamicTags: ['标签一', '标签二', '标签三'],
       inputVisible: false,
       inputValue: '',
       
       dynamicTagsTag: ['标签一', '标签二', '标签三'],
       inputVisibleTag: false,
       inputValueTag: '',

       options: [
          {
            value: '1M',
            label: '1M'
          }, {
            value: '2M',
            label: '2M'
          }, {
            value: '3M',
            label: '3M'
          }, {
            value: '5M',
            label: '5M'
          }, {
            value: '10M',
            label: '10M'
          }, {
            value: '50M',
            label: '50M'
          }, {
            value: '100M',
            label: '100M'
          }
       ],
       
    }
  },
  created(){
    this.getFormData();
  },
  methods:{
    AxiosReturn,
     // 设置配置数据
    getFormData() {
      this.AxiosReturn("setting/method/get.setting.list/",{module:'upload'}).then(res=>{
            this.form.default = res.data.default.value;
            this.form.oss = res.data.oss.value;
            this.help_text = res.data.image_ext.help_text;
            this.dynamicTags = res.data.image_ext.value.split(",");
            this.dynamicTagsTag = res.data.file_ext.value.split(',');
            this.form.file_size = res.data.file_size.value;
            this.form.token_expires = res.data.token_expires.value;
            this.form.qiniu_access_key =res.data.qiniu_access_key.value;
            this.AKhelp_text = res.data.qiniu_access_key.help_text;
            this.SKhelp_text = res.data.qiniu_secret_key.help_text;
            this.form.qiniu_secret_key = res.data.qiniu_secret_key.value;
            this.BKhelp_text = res.data.qiniu_bucket.help_text;
            this.form.qiniu_bucket = res.data.qiniu_bucket.value;
            this.form.qiniu_url = res.data.qiniu_url.value;
            this.qiniu_url_text = res.data.qiniu_url.help_text;
            this.aLAkId_help_text = res.data.aliyun_access_key.help_text;
            this.form.aliyun_access_key = res.data.aliyun_access_key.value;
            this.secret_help_text = res.data.aliyun_secret_key.help_text;
            this.form.aliyun_secret_key = res.data.aliyun_secret_key.value;
            this.aLiBucket_help_text = res.data.aliyun_bucket.help_text;
            this.form.aliyun_bucket = res.data.aliyun_bucket.value;
            this.form.aliyun_url = res.data.aliyun_url.value;
            this.aLiDamin_text = res.data.aliyun_url.help_text;
            this.form.aliyun_endpoint = res.data.aliyun_endpoint.value;
            this.aLiendpoint_text = res.data.aliyun_endpoint.help_text;
            this.form.aliyun_rolearn = res.data.aliyun_rolearn.value;
            this.aLirolearn_text = res.data.aliyun_rolearn.help_text;
      })
    },
    handleChange(value) {
    },
    handleFormSubmit(){
        this.form.image_ext = this.dynamicTags.join(",")
        this.form.file_ext = this.dynamicTagsTag.join(",")
        
        this.AxiosReturn("setting/method/set.upload.list/",this.form).then(res=>{
             if(res.status==200){
               this.$message.success('上传成功')
             }else{
               this.$message.warning(res.message)
             }
        })
    },
    // 允许上传的图片后缀
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    // 允许上传的文件后缀
    handleCloseTag(tag) {
      this.dynamicTagsTag.splice(this.dynamicTagsTag.indexOf(tag), 1);
    },

    showInputTag() {
      this.inputVisibleTag = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInputTag.$refs.input.focus();
      });
    },

    handleInputConfirmTag() {
      let inputValue = this.inputValueTag;
      if (inputValue) {
        this.dynamicTagsTag.push(inputValue);
      }
      this.inputVisibleTag = false;
      this.inputValueTag = '';
    }
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
.el-tag + .el-tag {
    margin-left: 10px;
}
.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}
.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}
</style>

