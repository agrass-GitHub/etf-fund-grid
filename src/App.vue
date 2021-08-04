<template>
  <div class="page">
    <a-modal v-model:visible="form.visible" :title="form.title" width="1000px" @ok="onSubmit" validateTrigger="blur">
      <a-form ref="formRef" :model="form.data" :rules="dynamicFormRules" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
        <a-row :gutter="16">
          <a-col v-for="item in dynamicFormItems" :key="item.prop" :span="8">
            <a-form-item :label="item.label" :name="item.prop">
              <component :is="item.is" v-model:value="form.data[item.prop]" v-bind="item.props" style="width:100%"></component>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
    <div class="search-panel">
      <a-space>
        <a-button type="primary" @click="toAdd">新增</a-button>
      </a-space>
    </div>
    <a-table :columns="tableColumns" :data-source="tableData" bordered size="middle" rowKey="id">
      <template #status="{ record }">
        <a-tag v-if="record.status==1" color="success">已成交</a-tag>
        <a-tag v-else color="processing">挂单中</a-tag>
      </template>
      <template #menu="{record}">
        <a-space>
          <a-button type="primary" size="small" :disabled="record.status==1" @click="toFinish(record)">成交</a-button>
          <a-button type="primary" size="small">新增</a-button>
          <a-button type="primary" size="small">编辑</a-button>
          <a-button type="primary" size="small">删除</a-button>
        </a-space>
      </template>
    </a-table>
  </div>
</template>
 
<script>
import { ref, reactive, computed, toRaw, nextTick } from "vue";
import moment from "moment";

export default {
  name: "ETF-FUND-GRID",
  setup() {
    const formRef = ref();
    const form = reactive({
      visible: false,
      title: "",
      state: "",
      data: {
        etf: "证券ETF",
        code: "512880",
        grade: "1.00",
        buyDateMoment: moment(),
        buyNumber: 0,
        buyPrice: 0,
        sellDateMoment: null,
        sellNumber: 0,
        sellPrice: 0,
        status: 0,
      },
      items: [
        {
          prop: "etf",
          label: "网格品种",
          is: "a-input",
        },
        {
          prop: "code",
          label: "网格代码",
          is: "a-input-number",
        },
        {
          prop: "grade",
          label: "网格挡位",
          is: "a-input-number",
          props: {
            precision: 2,
            step: 0.05,
            max: 1,
            min: 0.05,
          },
        },
        {
          prop: "buyDateMoment",
          label: "买入时间",
          is: "a-date-picker",
        },
        {
          prop: "buyPrice",
          label: "买入价格",
          is: "a-input-number",
          rules: [
            { required: true, message: "买入价格必填" },
            {
              min: 0.1,
              message: "买入价格不可为0",
              type: "number",
            },
          ],
          props: {
            precision: 2,
            formatter: (v) => `￥ ${v}`,
          },
        },
        {
          prop: "buyNumber",
          label: "买入股数",
          is: "a-input-number",
          rules: [
            { required: true, message: "买入股数必填" },
            {
              min: 100,
              message: "股数最少为 100",
              type: "number",
            },
            {
              validator(rule, value) {
                if (value % 100 != 0) {
                  return Promise.reject("必须是 100 的整数");
                }
                return Promise.resolve();
              },
            },
          ],
          props: {
            precision: 0,
            step: 100,
          },
        },
        {
          prop: "sellDateMoment",
          label: "卖出时间",
          is: "a-date-picker",
          display: () => form.state != "add",
        },
        {
          prop: "sellPrice",
          label: "卖出价格",
          is: "a-input-number",
          rules: [
            { required: true, message: "卖出价格必填" },
            {
              min: 0.1,
              message: "卖出价格不可为0",
              type: "number",
            },
          ],
          props: {
            precision: 2,
            formatter: (v) => `￥ ${v}`,
          },
          display: () => form.state != "add",
        },
        {
          prop: "sellNumber",
          label: "卖出股数",
          is: "a-input-number",
          display: () => form.state != "add",
          props: {
            precision: 0,
            step: 100,
          },
          rules: [
            { required: true, message: "卖出股数必填" },
            {
              min: 100,
              message: "卖出股数最少为 100",
              type: "number",
            },
            {
              validator: (rule, value) => {
                if (value % 100 != 0) {
                  return Promise.reject("必须是 100 的整数");
                }
                if (value > form.data.buyNumber) {
                  return Promise.reject(
                    "卖出股票数不可大于买入股票数量" + form.data.buyNumber
                  );
                }
                return Promise.resolve();
              },
            },
          ],
        },
      ],
    });
    const tableData = reactive([]);
    const tableColumns = [
      {
        title: "网格种类",
        dataIndex: "etf",
      },
      {
        title: "挡位",
        dataIndex: "grade",
        customRender: ({ record }) => {
          return record.grade;
        },
      },
      {
        title: "状态",
        dataIndex: "status",
        slots: { customRender: "status" },
      },
      {
        title: "买入/卖出日期",
        customRender: ({ record }) => {
          return record.buyDate + " / " + record.sellDate;
        },
      },
      {
        title: "买入/卖出价格",
        customRender: ({ record }) => {
          return record.buyPrice + " / " + record.sellPrice;
        },
      },
      {
        title: "买入/卖出股数",
        dataIndex: "buyNumber",
        customRender: ({ record }) => {
          return record.buyNumber + " / " + record.sellNumber;
        },
      },
      {
        title: "买入/卖出金额",
        dataIndex: "buyTotalPrice",
        customRender: ({ record }) => {
          return record.buyTotalPrice + " / " + record.sellTotalPrice;
        },
      },
      {
        title: "利润",
        dataIndex: "profit",
        customRender: ({ record }) => {
          return record.profit + " / " + record.profitRate;
        },
      },

      {
        title: "操作",
        slots: { customRender: "menu" },
      },
    ];

    const dynamicFormItems = computed(() => {
      return form.items.filter((item) => {
        return item.display ? item.display() : true;
      });
    });

    const dynamicFormRules = computed(() => {
      let obj = {};
      dynamicFormItems.value.forEach((item) => {
        let required = [{ required: true, message: item.label + "必填" }];
        obj[item.prop] = item.rules || required;
      });
      return obj;
    });

    function guid() {
      return "xxxxxxxx".replace(/[x]/g, (c) => {
        let r = (Math.random() * 16) | 0;
        let v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }

    function buildRow(data) {
      let row = Object.assign({}, data);
      row.buyDate = row.buyDateMoment
        ? moment(row.buyDateMoment).format("YYYY-MM-DD")
        : "-";
      row.sellDate = row.sellDateMoment
        ? moment(row.sellDateMoment).format("YYYY-MM-DD")
        : "-";
      let buyNumber = Number(row.buyNumber);
      let buyPrice = Number(row.buyPrice);
      let sellNumber = Number(row.sellNumber);
      let sellPrice = Number(row.sellPrice);

      row.buyTotalPrice = (buyNumber * buyPrice).toFixed(2);
      row.sellTotalPrice = (sellNumber * sellPrice).toFixed(2);
      row.profit = ((sellPrice - buyPrice) * sellNumber).toFixed(2);
      row.profitRate =
        ((Number(row.profit) / Number(row.buyTotalPrice)) * 100).toFixed(2) +
        "%";
      console.log(Number(row.profit), Number(row.buyTotalPrice));
      return row;
    }

    function toAdd() {
      form.visible = true;
      form.title = "新增网格记录";
      form.status = 0;
      form.state = "add";
      form.data.id = guid();
      nextTick(() => {
        formRef.value.resetFields();
      });
    }

    function toFinish(record) {
      form.visible = true;
      form.title = "成交网格记录";
      form.state = "finish";
      form.data = Object.assign({}, record);
    }

    function toEdit(record) {
      form.visible = true;
      form.title = "编辑网格记录";
      form.state = "edit";
      form.data = Object.assign({}, record);
    }

    function onSubmit() {
      formRef.value
        .validate()
        .then(() => {
          form.visible = false;
          let transformData = buildRow(form.data);
          if (form.state == "add") {
            tableData.push(transformData);
          }
          if (form.state == "finish") {
            let index = tableData.findIndex((v) => v.id == transformData.id);
            transformData.status = 1;
            tableData.splice(index, 1, transformData);
          }
        })
        .catch((err) => {
          console.log("error", err);
        });
    }

    return {
      formRef,
      form,
      dynamicFormItems,
      dynamicFormRules,
      tableData,
      tableColumns,
      toAdd,
      toFinish,
      toEdit,
      onSubmit,
    };
  },
};
</script>
 
<style >
.page {
  padding: 20px;
}

.search-panel {
  display: flex;
  margin-bottom: 10px;
  justify-content: flex-end;
}
</style>