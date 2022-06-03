import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')

const app = new Vue({
 el: '#app',
 data: {
  title: 'Nestjs Websockets Chat',
  name: '',
  text: '',
  messages: [],
  socket: null
 },
 methods: {
  sendMessage() {
   if(this.validateInput()) {
    const message = {
    name: this.name,
    text: this.text
   }
   this.socket.emit('msgToServer', message)
   this.text = ''
  }
 },
 receivedMessage(message) {
  this.messages.push(message)
 },
 validateInput() {
  return this.name.length > 0 && this.text.length > 0
 }
},
 created() {
  this.socket = io('http://localhost:3000')
  this.socket.on('msgToClient', (message) => {
   this.receivedMessage(message)
  })
 }
})
