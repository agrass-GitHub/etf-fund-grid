import { createApp } from 'vue'
import App from './App.vue'
import { Table } from "ant-design-vue"

const app = createApp(App)
app.use(Table)
app.mount('#app')
