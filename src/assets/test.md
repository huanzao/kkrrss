resetFun(){
    this.isSearch=false
    for(var qkey in this.queryinfo){
        this.queryinfo[qkey]=""
    }
    this.queryinfo.page_no=1 
    this.queryinfo.page_size=10
    this.queryinfo.audit_status=1
    this.getAllList()
}
// 搜索
search() {
    this.isSearch=true
    this.queryinfo.page_no=1 
    this.queryinfo.page_size=10
    this.getAllList()
}

 getAllList() {
      let myParams={}
      if(this.isSearch){
          this.queryinfo.audit_status=1
          myParams=this.queryinfo
          if(this.queryinfo.createtime!=""&&this.queryinfo.createtime!=null){
            this.queryinfo.begin_time=this.queryinfo.createtime[0]
            this.queryinfo.end_time=this.queryinfo.createtime[1]
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
      this.axios.post("product/method/get.product.admin.list/",myParams).then(function(res) {