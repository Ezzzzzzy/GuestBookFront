import Vue from 'vue'
import { Table, Popconfirm, notification, Icon, Button, Modal, Input, Form, Radio, Select, Divider } from 'ant-design-vue'
import App from './App'
import 'ant-design-vue/dist/antd.css'

Vue.config.productionTip = false

Vue.use(Table)
Vue.use(Popconfirm)
Vue.prototype.$notification = notification;
Vue.use(Icon);
Vue.use(Button);
Vue.use(Modal);
Vue.use(Input);
Vue.use(Form);
Vue.use(Radio);
Vue.use(Select);
Vue.use(Divider);

new Vue({
  render: h => h(App),
}).$mount('#app')
