import { createApp } from 'vue'
import App from './App.vue'
import { Row, Col, Space, Table, Form, Button, Input, DatePicker, InputNumber, Tag, Modal, } from "ant-design-vue"

const components = [Row, Col, Space, Table, Form, Form.Item, Button, Input, DatePicker, InputNumber, Tag, Modal];
const app = createApp(App);

components.forEach(component => app.component(component.name, component))

app.mount('#app')
