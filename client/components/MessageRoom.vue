<template>
  <v-sheet width="100%">
    <v-card :id="user.display_name" height="320px" class="overflow-y-auto">
      <v-list>
        <v-list-item
            v-for="(message, i) in messages"
            :key="i"
            three-line
            class="d-flex d-flex-column"
          >
            <v-list-item-content>
              <v-list-item-title class="d-flex d-flex-column align-center mb-1">
                <v-btn class="mr-2">{{ message.login }}</v-btn>
              </v-list-item-title>
              <v-list-item-subtitle class="text-right">{{
                message.message
              }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
      </v-list>
    </v-card>
    <v-toolbar>
      <v-text-field
        v-model="messageText"
        dense
        outlined
        hide-details
        class="mr-2"
        @keyup.enter="emitMessageOnChannel"
      ></v-text-field>
    </v-toolbar>
  </v-sheet>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { NuxtSocket } from 'nuxt-socket-io'
import { IUser } from '@/store/user'

export default Vue.extend({
  props: {
    user: Object as () => IUser,
  },

  data: () => ({
    messageText: '',
    messages: [] as { login: string; message: string }[],
    socket: null as NuxtSocket | null,
  }),

  computed: {
    ...mapState({
      authUser: (state: any) => state.user.authUser,
      accessToken: (state: any) => state.token.accessToken,
    }),
  },

  async fetch() {
    try {
      const res = await this.$axios.$get(`/chat/me/${this.user.display_name}`)
      this.messages = res.length
        ? [...res.map((el: string) => JSON.parse(el))]
        : []
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    } catch(err) {
      console.log(err)
    }
  },

  mounted() {
    this.socket = this.$nuxtSocket({
      channel: '/chat',
      auth: {
        Authorization: this.accessToken,
        msg: this.user.display_name,
      },
      path: '/api/socket.io/',
    } as any)
    this.socket.on('msg', (login, message) => {
      this.messages.push({ login, message })
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    })
  },

  methods: {
    emitMessageOnChannel() {
      const messageTextFormated = this.messageText.trim()
      if (this.socket && messageTextFormated) {
        this.socket.emit('msg', messageTextFormated, (resp: any) => {
          console.log(resp)
        })
        this.messageText = ''
      }
    },

    
    scrollToBottom() {
      const container = this.$el.querySelector('#' + this.user.display_name)
      if (container !== null) container.scrollTop = container.scrollHeight
    },

    // function who get display_name of user by id
  //  getUserDisplayName(id: string) : string {
      //const user = this.state.find((el: IUser) => el.id === id)
      //return user.display_name
   // },
  },
})
</script>
