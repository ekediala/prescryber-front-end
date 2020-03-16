import './registerServiceWorker'

import App from './App.vue'
import Vue from 'vue'
import VuePageTransition from 'vue-page-transition';
import router from './router'
import vuetify from './plugins/vuetify';

Vue.use(VuePageTransition);

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
