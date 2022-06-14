<template>
  <v-sheet width="100%">
    <v-card :id="channelName" height="320px" class="overflow-y-auto">
      <v-list>
        <v-list-item v-for="(message, i) in messages" :key="i">
          {{ message }}
        </v-list-item>
      </v-list>
    </v-card>
    <v-toolbar>
      <v-text-field
        v-model="messageText"
        hide-details
      ></v-text-field>
      <v-btn icon @click="emitHelloWorld"><v-icon>mdi-pencil</v-icon></v-btn>
    </v-toolbar>
  </v-sheet>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { NuxtSocket } from 'nuxt-socket-io'

export default Vue.extend({

  props: {
    channelName: String as () => string
  },

  data: () => ({
    messageText: '',
    messages: [] as string[],
    socket: null as NuxtSocket | null,
  }),

  computed: {
    ...mapState({
      accessToken: (state: any) => state.token.accessToken,
    })
  },

  mounted() {
    this.socket = this.$nuxtSocket({
      extraHeaders: {
        Authorization: this.accessToken,
        channel: this.channelName,
      },
      path: "/api/socket.io/",
    })
    this.socket.on('channel', (msg, cb) => {
      this.messages.push(msg)
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    })
  },

  methods: {
    emitHelloWorld() {
      if (this.socket) {
        this.socket.emit('channel', 'Hello World!', (resp: any) => {
            console.log(resp)
        })
      }
    },
    scrollToBottom() {
      const container = this.$el.querySelector('#' + this.channelName) || {} as Element
      container.scrollTop = container.scrollHeight
    }
  }
})
</script>
