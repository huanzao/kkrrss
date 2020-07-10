<template>
  <div>
    <h1>测试页面</h1>
    <MyDatePicker v-model="datapick"></MyDatePicker>
    <el-button @click="myconsDate">输出</el-button>
  </div>
</template>

<script>
import tiwanCity from '../assets/axios/taiwna.js'
import MyDatePicker from '../components/Child/MyDatePicker'
  export default {
    data () {
      return {
        datapick:"",
        city:[]
      };
    },
    mounted(){
      this.city=this.tiwanCity()
      console.log(this.city)
    },
    methods:{
        tiwanCity,
        myconsDate(){
          console.log(this.datapick)
        }
    },
    components:{
      MyDatePicker
    }

  };
</script>
<style scoped>

</style>