import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import store from './store';
import axios from 'axios';
import VueSocketIO from 'vue-socket.io'
import SocketIO from 'socket.io-client'


Vue.use(new VueSocketIO({
    debug: true,
    connection: SocketIO('http://localhost:3000'),
    vuex: {
      store,
      actionPrefix: "SOCKET_",
    }
  })
);

axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://127.0.0.1:3000/auth/';

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')

