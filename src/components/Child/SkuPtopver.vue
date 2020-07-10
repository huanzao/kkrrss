<template>
    <el-table :data="scope.row.get_order_goods">
        <el-table-column label="商品ID" prop="goods_code" ></el-table-column>
        <el-table-column label="商品名称" prop="goods_name" width="230px" ></el-table-column>
        <el-table-column label="SKU" prop="goods_sku" ></el-table-column>
        <el-table-column label="规格" prop="key_value" ></el-table-column>
        <el-table-column label="价格" prop="shop_price" ></el-table-column>
        <el-table-column label="数量" prop="qty" ></el-table-column>
    </el-table>
</template>
<script>
    export default {
        props:['get_order_goods']
    }
</script>
