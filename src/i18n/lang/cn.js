/**
 * Created by WebStorm.
 * User: nirongxu
 * Date: 2018/12/8
 * Description: 文件描述
 */
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
const cn = {
  routeName: {
    home: '主页',
    article: '选品',
    publishArticle: '产品分类',
    publishArticleEditor: '发表文章-富文本',
    fenlei: '产品分类',
    productCategory:'产品类别',
    sku: 'SKU',
    productList: '产品列表',
    shenhe: '产品审核',
    icon: '设计',
    renling: "产品认领",
    pricegroup: '价格组',
    prouductlist: '商品列表',
    pinglunguanli: '评价管理',

    sucai: '素材库',
    gongdandetail: '工单明细',

    seo: '优化师',
    orderlist: '订单列表',
    ordertongji: '订单统计',
    shujufenxi: '数据分析',
    guanggaocost: '广告费用导入',
    // productrenling: '商品认领',
    prolist: '商品列表',

    customerservice: '客服',
    ordershenhe: '订单列表',
    daicheck: '待审核',
    yicheck: '已发货',
    problemorder: '问题订单',
    delete: '已删除',
    daideliver: '待发货',
    comment:'商品评论',
    supplychain: '供应链',
    buygoods: '货物采购',
    purchasedetails:"采购明细",
    stock: '库存',
    skuadmin: 'SKU管理',


    SHlogistics: 'SH物流', //SH物流
    productamnagement: '产品管理', //产品管理
    warehousingmanagement: '入库管理',
    outgoods: '出库管理',
    inventorymanagement:'库存管理',
    addLogisticsCompany:'物流公司管理',

    permissions: '系统设置',
    menu: '菜单API管理',
    userlist:"管理员列表",
    rolelist:"角色列表",
    sidebarmenu:"侧边栏菜单管理",
    operationlog:'操作日志',
    debuglog:'调试日志',
    systemConfiguration:'系统配置',
    uploadConfiguration:'上传配置 ',

    pageControl: '页面权限',
    btnControl: '按钮权限',

    builtInIcon: '内置图标',
    shuttleBox: '素材',
    demoShuttle: '穿梭框demo',
    table: '表格',
    multiDataTable: '多选数据表格',
    filterTable: '筛选表格',
    dragSort: '拖拽排序',
    upload: '上传',
    fileUpload: '文件上传',
    editor: '编辑器',
    markdown: 'markdown',
    wangeditor: 'wangeditor',
    multiDirectory: '多级目录',
    'menu2-1': '二级-1',
    'menu2-2': '二级-2',
    'menu2-3': '二级-3',
    'menu3-1': '三级-1',
    'menu3-2': '三级-2',
    'menu3-3': '三级-3',
    'menu4-1': '四级-1',
    'menu4-2': '四级-2',
    'menu5-1': '五级-1',
    systemSettings: '系统设置',
    navMenu: '导航菜单',
  },
  rightMenu: {
    close: '关闭',
    closeOther: '关闭其他',
    closeAll: '全部关闭'
  },
  role: {
    superAdmin: '超级管理员',
    admin: '管理员',
    ordinary: '普通用户'
  },
  userDropdownMenu: {
    basicInfor: '基本资料',
    changePassword: '修改密码',
    refresh:'重载菜单',
    clearCache:'清除缓存',
    logout: '退出'
  },

  ...zhLocale //  合并element-ui内置翻译
}

export default cn
