<template>
  <div class="page">
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

    <!-- 表单 -->
    <n-modal v-model:show="showModal" preset="dialog" title="新增条件单" :show-icon="false" positive-text="提交" style="width:1000px"
      :on-positive-click="formSubmit">
      <n-form :model="formData" ref="formRef" label-placement="left" label-width="70px" style="margin-top:20px">
        <n-grid :cols="24" :x-gap="24" style="width:100%">
          <n-form-item-gi v-for="(item,key) in formItems" :key="key" :label="item.label" :path="key" :span="8">
            <component :is="item.is" v-model:value="formData[key]" v-bind="getComponentProps(item)"></component>
          </n-form-item-gi>
        </n-grid>
      </n-form>
    </n-modal>

  </div>
</template>

<script>
import {
  NDataTable,
  NButton,
  NSpace,
  NGrid,
  NGridItem,
  NTag,
  NModal,
  NDialog,
  NForm,
  NFormItem,
  NFormItemGridItem,
  NInput,
  NInputNumber,
  NDatePicker,
} from "naive-ui";

import { h, ref, reactive, computed, toRefs } from "vue";

export default {
  components: {
    NDataTable,
    NInput,
    NInputNumber,
    NButton,
    NSpace,
    NGrid,
    NGridItem,
    NTag,
    NModal,
    NDialog,
    NForm,
    NFormItem,
    NFormItemGi: NFormItemGridItem,
    NDatePicker,
  },
  setup() {
    let showModal = ref(true);
    let formRef = ref(null);
    let formData = reactive({});
    let formItems = reactive({
      etf: {
        label: "网格品种",
        is: "n-input",
      },
      code: {
        label: "网格代码",
        is: "n-input-number",
        showButton: false,
      },
      grade: {
        label: "网格挡位",
        is: "n-input-number",
        showButton: false,
      },
      buyDate: {
        label: "买入时间",
        is: "n-date-picker",
        type: "date",
      },
      buyNumber: {
        label: "买入股数",
        is: "n-input",
      },
      buyPrice: {
        label: "买入价格",
        is: "n-input",
      },
      sellDate: {
        label: "卖出时间",
        is: "n-input",
      },
      sellNumber: {
        label: "卖出股数",
        is: "n-input",
      },
      sellPrice: {
        label: "卖出价格",
        is: "n-input",
      },
    });

    const columns = [
      {
        title: "网格种类",
        key: "etf",
        // rowSpan: (rowData, rowIndex) => (rowIndex === 0 ? 2 : 1),
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
          return (
            row.buyDate + " / " + (row.sellDate == "" ? "无" : row.sellDate)
          );
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
        render: (row) => {
          return row.profit + " / " + row.profitRate;
        },
      },
      {
        title: "状态",
        key: "status",
        render: (row) => {
          return row.status == 1
            ? h(NTag, { type: "success", size: "small" }, () => "已成交")
            : h(NTag, { type: "info", size: "small" }, () => "挂单中");
        },
      },
      {
        title: "操作",
        render: (row, rowIndex) => {
          return h(NSpace, {}, () => {
            return [
              h(
                NButton,
                { size: "tiny", disabled: row.status == 1 },
                () => "成交"
              ),
              h(NButton, { size: "tiny" }, () => "新增"),
              h(NButton, { size: "tiny" }, () => "编辑"),
              h(NButton, { size: "tiny" }, () => "删除"),
            ];
          });
        },
      },
    ];

    const originData = reactive([
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
      return originData.map((v) => {
        let row = Object.assign({}, v);
        row.buyTotalPrice = (row.buyNumber * row.buyPrice).toFixed(2);
        row.sellTotalPrice = (row.sellNumber * row.sellPrice).toFixed(2);
        row.profit = ((row.sellPrice - row.buyPrice) * row.sellNumber).toFixed(
          2
        );
        row.profitRate =
          ((row.profit / row.buyTotalPrice) * 100).toFixed(2) + "%";
        return row;
      });
    });

    function toAdd() {
      showModal.value = true;
    }

    function formSubmit() {
      originData.push(formData);
    }

    function getComponentProps(formItem) {
      const ignoreKeys = ["is", "label"];
      const props = {};
      Object.keys(formItem).forEach((key) => {
        !ignoreKeys.includes(key) && (props[key] = formItem[key]);
      });
      return props;
    }

    return {
      formData,
      formItems,
      showModal,
      tableData,
      columns,
      toAdd,
      formSubmit,
      getComponentProps,
    };
  },
};
</script>


<style lang="postcss" >
.page {
  padding: 20px 0px 20px;
  width: 1200px;
  margin: 0 auto;
}
.n-input-number {
  width: 100%;
}
</style>