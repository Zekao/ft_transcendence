<template>
  <v-sheet width="100%">
    <v-card :id="user.display_name" height="320px" class="overflow-y-auto">
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
      <v-btn icon @click="emitMessageOnChannel"><v-icon>mdi-pencil</v-icon></v-btn>
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
    user: Object as () => IUser
  },

  data: () => ({
    messageText: '',
    messages: [] as string[],
    socket: null as NuxtSocket | null,
  }),

  computed: {
    ...mapState({
      authUser: (state: any) => state.user.authUser,
      accessToken: (state: any) => state.token.accessToken,
    })
  },

  // async fetch() {
  //   try {
  //     const res = await this.$axios.$get(`/users/${this.authUser.id}/messages/${this.user.id}`)
  //     this.messages = [...res]
  //     this.$nextTick(() => {
  //       this.scrollToBottom()
  //     })
  //   } catch(err) {
  //     console.log(err)
  //   }
  // },

  mounted() {
    this.socket = this.$nuxtSocket({
      extraHeaders: {
        Authorization: this.accessToken,
        msg: this.user.display_name,
      },
      path: "/api/socket.io/",
    })
    this.socket.on('msg', (msg, cb) => {
      this.messages.push(msg)
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
    }
  }
})
</script>
