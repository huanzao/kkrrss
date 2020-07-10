<template>
    <div>
      <template v-for="(child,c) in menuData" >
        <!-- <el-submenu v-if="child.children.length > 0" :index="child.path" :key="child.index">
          <template slot="title">
            <i :class="child.iconCls?child.iconCls:[fa,fa-file]"></i>
            <span slot="title">{{ $t(`routeName.${child.name}`) }} </span>
          </template>
          <menu-tree :menuData="child.children"></menu-tree>
        </el-submenu> -->

        <el-menu-item  :index="child.path" :key="c">
          <i :class="child.icon"></i>
          <span slot="title">{{ child.name}}</span>
        </el-menu-item>
      </template>
    </div>
</template>

<script>
export default {
  name: 'menuTree',
  props: ['menuData'],
  data() {
    return {
      dataList: "",
    };
  },
   created: function() {
     console.log( '我传过来的数据',this.menuData)
    let that = this;
    this.axios
      .post("menu/method/get.menu.list", {
        module: "admin"
      })
      .then(function(res) {
        if (res.data.status === 200) {
          // console.log(res.data.data);
          let result = res.data.data;
          that.dataList = result;
        
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  },
}
</script>

<style scoped>

</style>
