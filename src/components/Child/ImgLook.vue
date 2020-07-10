<template>
    <div id="imgLook">
        <el-dialog title="查看图片" :visible.sync="pageShow" @close='LookClose'>
            <el-carousel style="height:400px;overflow:hidden;background:#80989b;" arrow="always">
                <el-carousel-item v-for="(item,index) in imgList" :key="index" style="height:400px;text-align:center;line-height: 400px;">
                    <img :src="item" style="height:400px">
                </el-carousel-item>
            </el-carousel>
        </el-dialog>
    </div>
</template>
<script>
import {mapState,mapMutations} from 'vuex'
    export default{
        props:['imgList',],
        data(){
            return{
                pageShow:false
            }
        },
        computed:{
            ...mapState(["imgLookshow"])
        },
        watch:{
            imgLookshow:function (value) {
                if(value){
                    this.pageShow=value
                }
            }
        },
        methods:{
            ...mapMutations(['setImgLookShow']),
            LookClose(){
                this.setImgLookShow(false)
            }
        }
    }
</script>
<style>
    #imgLook .el-carousel__container{
        height: 400px;
    }
    #imgLook .is-active .el-carousel__button{
            background-color: #00bc12;
    }
    #imgLook .el-dialog__body{
        padding: 10px;
    }
</style>