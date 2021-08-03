<template>
  <a-form :model="data" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" style="width:1000px;margin:0 auto">
    <a-row :gutter="16">
      <a-col v-for="(item,key) in items" :key="key" :span="8">
        <a-form-item :label="item.label" v-bind="validateInfos[key]">
          <component :is="item.is" v-model:value="data[key]" style="width:100%"></component>
        </a-form-item>
      </a-col>
    </a-row>
    <a-form-item :label-col="{ span: 6 }" :wrapper-col="{ span: 18, offset: 2 }">
      <a-button type="primary" @click="onSubmit">Create</a-button>
      <a-button style="margin-left: 10px">Cancel</a-button>
    </a-form-item>
  </a-form>
</template>
 
<script>
import { ref, reactive, computed, toRaw } from "vue";
import { Form } from "ant-design-vue";
import moment from "moment";
const useForm = Form.useForm;
console.log(moment());

export default {
  name: "GridForm",
  setup() {
    const items = reactive({
      etf: {
        label: "网格品种",
        is: "a-input",
      },
      code: {
        label: "网格代码",
        is: "a-input-number",
      },
      grade: {
        label: "网格挡位",
        is: "a-input-number",
      },
      buyDate: {
        label: "买入时间",
        is: "a-date-picker",
        type: "date",
      },
      buyNumber: {
        label: "买入股数",
        is: "a-input",
      },
      buyPrice: {
        label: "买入价格",
        is: "a-input",
      },
      sellDate: {
        label: "卖出时间",
        is: "a-input",
      },
      sellNumber: {
        label: "卖出股数",
        is: "a-input",
      },
      sellPrice: {
        label: "卖出价格",
        is: "a-input",
      },
    });
    const data = reactive({
      etf: "xxx",
    });
    const rules = reactive({
      etf: [
        {
          required: true,
          message: "Please select Activity zone",
        },
      ],
    });
    const { resetFields, validate, validateInfos } = useForm(data, rules);
    const onSubmit = () => {
      validate()
        .then(() => {
          console.log(toRaw(data));
        })
        .catch((err) => {
          console.log("error", err);
        });
    };

    return {
      items,
      rules,
      data,
      validateInfos,
      onSubmit,
    };
  },
};
</script>
 
<style lang="scoped" >
</style>