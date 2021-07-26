<script setup>
import test from "./test.jsx";

import {
  NDataTable,
  NInput,
  NButton,
  NSpace,
  NGrid,
  NGridItem,
} from "naive-ui";

import { h, ref, computed } from "vue";

const columns = [
  {
    title: "网格种类",
    key: "etf",
    rowSpan: (rowData, rowIndex) => (rowIndex === 0 ? 2 : 1),
  },
  {
    title: "挡位",
    key: "grade",
    render: (row) => {
      return row.grade;
    },
  },
  {
    title: "买入/卖出日期",
    render: (row) => {
      return row.buyDate + " / " + (row.sellDate == "" ? "无" : row.sellDate);
    },
  },
  {
    title: "买入/卖出价格",
    render: (row) => {
      return row.buyPrice + " / " + row.sellPrice;
    },
  },
  {
    title: "买入/卖出股数",
    key: "buyNumber",
    render: (row) => {
      return row.buyNumber + " / " + row.sellNumber;
    },
  },
  {
    title: "买入/卖出金额",
    key: "buyTotalPrice",
    render: (row) => {
      return row.buyTotalPrice + " / " + row.sellTotalPrice;
    },
  },
  {
    title: "利润",
    key: "profit",
  },
  {
    title: "状态",
    key: "status",
    // render: (row) => {
    //   // return row.status == 1 ? (
    //   //   h(
    //   //     NButton,
    //   //     { type: "success", size: "small" },
    //   //     { default: () => "完成" }
    //   //   )
    //   // ) : '1111111'
    //   return <n-button>1111111</n-button>;
    // },
  },
];

const originData = ref([
  {
    etf: "证券ETF / 512880",
    grade: "1.00",
    buyDate: "2021-05-25",
    buyNumber: 2000,
    buyPrice: 1.031,
    sellDate: "2021-03-15",
    sellNumber: 1700,
    sellPrice: 1.124,
    status: 1,
  },
  {
    etf: "证券ETF / 512880",
    grade: "1.00",
    buyDate: "2021-05-25",
    buyNumber: 2000,
    buyPrice: 1.031,
    sellDate: "",
    sellNumber: 0,
    sellPrice: 0,
  },
]);

const tableData = computed(() => {
  return originData.value.map((v) => {
    let row = Object.assign({}, v);
    row.buyTotalPrice = (row.buyNumber * row.buyPrice).toFixed(2);
    row.sellTotalPrice = (row.sellNumber * row.sellPrice).toFixed(2);
    row.profit = ((row.sellPrice - row.buyPrice) * row.sellNumber).toFixed(2);
    return row;
  });
});

function toAdd() {
  console.log(data);
}
</script>

<template>
  <div class="page">
    <test></test>

    <n-grid :y-gap="10">
      <n-grid-item :span="24">
        <n-space justify="end">
          <n-button type="primary" @click="toAdd">添加</n-button>
        </n-space>
      </n-grid-item>
      <n-grid-item :span="24">
        <n-data-table :single-line="false" :columns="columns" :data="tableData" />
      </n-grid-item>
    </n-grid>
  </div>
</template>

<style lang="postcss" scoped>
.page {
  padding: 20px 0px 20px;
  width: 1200px;
  margin: 0 auto;
}
</style>