//返回值的函数
export function AxiosReturn(url,params){
    let that=this
    return this.axios.post(url, params).then(function(res) {
      if (res.data.status === 200) {
        return res.data
      }else{
        that.$message.warning(res.data.message)
        console.log('err',res)
      }
    })
    .catch(function(error) {
      console.log(error);
    });
}

//全局分页操作--页面大小变化的函数 select
//val 组件值  url:api接口 prop:加餐 arrName:当返回数据不是result || results 时赋值用
export function pageSizeChange(val,url,prop,arrName) { //分页 
  let _this=this
  this.pagesize=val
  let mypage={}
  if(prop){
    for(var i in prop){
      mypage[i]=prop[i]
    }
  }

  let _url=url
  // if(this.isSearch){
  //     _url=this.searchAPI
  //     let mySearchData=this.shaixuan
  //     Object.keys(mySearchData).forEach(function(key){
  //       mypage[key]=mySearchData[key]
  //     });
  // }

  mypage.page_size=this.pagesize
  mypage.page_no=this.pagenum

  this.axios({
    method: 'post',
    url: _url,
    data:mypage
  }).then((res)=>{
    if(res.data.status === 200){
        console.log('页面大小改变',res.data.data)
        let result=res.data.data[arrName]
        _this.tableData=result
    }else{
      console.log(res)
      this.$message.warning('查看输出')
    }
})
.catch((error)=>{
    this.$message.error(error)
})
}

//全局分页操作--页数变化的函数 option
//val 组件值  url:api接口 prop:加餐 arrName:当返回数据不是result || results 时赋值用
export function  pageNumberChange(val,url,prop,arrName) { 
  let _this=this
  this.pagenum=val
  let mypage={}
  if(prop){
    for(var i in prop){
      mypage[i]=prop[i]
    }
  }

  let _url=url
  // if(this.isSearch){
  //     _url=this.searchAPI
  //     let mySearchData=this.shaixuan
  //     Object.keys(mySearchData).forEach(function(key){
  //       mypage[key]=mySearchData[key]
  //     });
  // }

  mypage.page_size=this.pagesize
  mypage.page_no=this.pagenum
  this.axios({
    method: 'post',
    url: _url,
    data:mypage
  }).then((res)=>{
    if(res.data.status === 200){
        console.log('页面大小改变',res.data.data)
        let result=res.data.data[arrName]
        _this.tableData=result
    }else{
      console.log(res)
      this.$message.warning('查看输出')
    }
})
.catch((error)=>{
    this.$message.error(error)
})
}


//导出Excel表格
//第一个参数：表头   第二个参数是：表头对应的this.tableData的键   第三个是文件名可以为空 4当this.tableData有两级时把key传过来
export function myExprotExcel(headerArr,keyArr,filename,arrName){
    if(headerArr.length!==keyArr.length){
      this.$message.warning('表头数据与数组中的数据不能一一匹配')
      return
    }
    import('@/vendor/Export2Excel').then(excel => {
        const tHeader = headerArr
        const filterVal = keyArr
        let list =this[arrName] 
        console.log('导出函数的List',list)
        const data = aaa(filterVal, list)
        excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: filename,
            autoWidth: true,
            bookType: 'xlsx'
            })
        })
  }
  //导出依赖函数
function aaa(filterVal,jsonData,key) {
  if(key){
    return jsonData.map(
      (v,index) => filterVal.map(j => {
        var a=j.split('.')[1]
        return v[key][a]
      })
    )
  }else{
    return jsonData.map(v => filterVal.map(j => {
        return v[j]
    }))
  }
}

//返回此刻时间
export function nowDate(){
  let now=new Date()  
  return now.getFullYear()+'-'+(now.getMonth() + 1)+'-'+now.getDate()+'  '+now.getHours()+':'+now.getMinutes()+":"+now.getSeconds()
}

export function UnixDate(num){
  let now=new Date(num*1000)  
  return now.getFullYear()+'-'+(now.getMonth() + 1)+'-'+now.getDate()+'  '+now.getHours()+':'+now.getMinutes()+":"+now.getSeconds()
}

////全局删除操作
export function myDelete(index,text,params,url,showurl,arrname){
  this.$confirm(`此操作将永久删除${text}, 是否继续?`, '提示', {
    cancelButtonText: '取消',
    confirmButtonText: '确定',
    type: 'warning'
  }).then(() => {
    this.axios({
      method: 'post',
      headers:{'Authorization':'Bearer '+localStorage.token},
      url: url,
      data:this.$qs.stringify(params)
    }).then((res)=>{
        if(res.data.response==="fail"){
          this.$message({
            message: res.data.results,
            type: 'warning'
          });
        }else{
          if(this.tableData.length===1){
            var key={IndexPage:this.currentPage-1,PageSize:this.pagesize}
            this.axios({
              method: 'post',
              headers:{'Authorization':'Bearer '+localStorage.token},
              url: showurl,
              data:this.$qs.stringify(key)
            }).then((res)=>{
                
                this.totalpage=res.data.totalpage
                if(arrname){
                  this.tableData=res.data[arrname]
                }else{
                  this.tableData=res.data.result
                }
            })
        }else{
          this.totalpage=this.totalpage*1-1
        }
        this.tableData.splice(index,1);
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        }
    }).catch((err)=>{
        console.log(err)
        this.$notify.error({
          title: '错误',
          message: '网路错误，请稍后再试'
        })
    })
  }).catch((err) => {
    this.$message({
      type: 'info',
      message: '已取消删除'
    });          
  });
}

  // 导出
export function  orderImport() {
    if(this.multipleSelection.length===0){
      this.$message.warning('请先选择要导出的数据')
      return
    }
    this.multipleSelection=JSON.parse(this.multipleSelection)
    this.multipleSelection.map(ite=>{
        console.log(ite.trade_status)
        if(ite.trade_status==0){
          ite.trade_status='待审核'
        }else if(ite.trade_status==1){
          ite.trade_status='待发货'
        }else if(ite.trade_status==2){
          ite.trade_status='已发货'
        }else if(ite.trade_status==3){
          ite.trade_status='已完成'
        }else if(ite.trade_status==4){
          ite.trade_status='删除'
        }else if(ite.trade_status==5){
          ite.trade_status='问题订单'
        }else{
          ite.trade_status=ite.trade_status
        }
        return ite
    })
    let headArr=[]
    let keyArr=[]
    for(var iit of this.clos){
        if(iit.isChecked){
          if(iit.label=="商品信息"){
            console.log('一次就好一次就好一次就好一次就好')
            this.multipleSelection.map(item=>{
              item.myid=""
              item.myname=""
              item.mysku=""
              item.myguige=""
              item.myprice=""
              item.mycount=""
              for(var enen of item.get_order_goods){
                item.myid+=enen.goods_code
                item.myname+=enen.goods_name
                item.mysku+=enen.goods_sku
                item.myguige+=enen.key_value
                item.myprice+=enen.market_price
                item.mycount+=enen.qty
              }
              return item
            })
            headArr.push('商品ID','商品名称','SKU','规格','价格','数量')
            keyArr.push('myid','myname','mysku','myguige','myprice','mycount')
          }else{
            headArr.push(iit.label)
            keyArr.push(iit.prop)
          }
        }
    }
    console.log('qweqqqqqqqq',headArr)
    console.log('qweeeeqweqwe',keyArr)
    console.log('kao',this.tableData)
    this.myExprotExcel(headArr,keyArr,'订单列表','multipleSelection',true)
  }