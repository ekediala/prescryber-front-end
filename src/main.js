import './registerServiceWorker'

import App from './App.vue'
import Vue from 'vue'
import VuePageTransition from 'vue-page-transition';
import router from './router'
import vuetify from './plugins/vuetify';
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

Vue.use(VuePageTransition);

Vue.use(Loading);

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
