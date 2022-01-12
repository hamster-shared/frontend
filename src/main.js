// VueJS
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import LangENUS from './common/lang/en-us'
import LangZHCN from './common/lang/zh-cn'

// Ant Design Vue
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

Vue.use(Antd);

// Photoswipe Gallery
import Photoswipe from 'vue-pswipe'
Vue.use(Photoswipe)
Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'zh-cn',
  messages: {
    'en-us': LangENUS,
    'zh-cn': LangZHCN
  }
})
// Template Layouts
import DefaultLayout from './layouts/Default.vue'
import DashboardLayout from './layouts/Dashboard.vue'
import DashboardRTLLayout from './layouts/DashboardRTL.vue'

// Adding template layouts to the vue components.
Vue.component("layout-default", DefaultLayout);
Vue.component("layout-dashboard", DashboardLayout);
Vue.component("layout-dashboard-rtl", DashboardRTLLayout);

// Main application view
import App from './App.vue'

// Vue Router
import router from './router'

// App Styling
import './scss/app.scss';

Vue.config.productionTip = false

import store from './store'

// Initialize Vue
new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
