import { defineComponent, ref, reactive, computed, } from 'vue'

export default defineComponent(() => {

  const columns = [
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
      title: "买入/卖出日期",
      customRender: ({ record }) => {
        return (
          record.buyDate + " / " + (record.sellDate == "" ? "无" : record.sellDate)
        );
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
      title: "状态",
      dataIndex: "status",
      customRender: ({ record }) => {
        return "11"
      },
    },
    {
      title: "操作",
      customRender: (row, rowIndex) => {
        return "11"
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

  return () => (
    <a-table columns={columns} data-source={originData}></a-table>
  )
})