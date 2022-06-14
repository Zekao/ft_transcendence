<template>
  <v-sheet width="100%">
    <v-card :id="channel.name" height="320px" class="overflow-y-auto">
      <v-list>
        <v-list-item v-for="(message, i) in messages" :key="i">
          {{ message.login }} - {{ message.message }}
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
      ></v-text-field>
      <v-btn icon @click="emitMessageOnChannel"><v-icon>mdi-pencil</v-icon></v-btn>
    </v-toolbar>
  </v-sheet>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { NuxtSocket } from 'nuxt-socket-io'
import { IChannel } from '~/store/channel'

export default Vue.extend({

  props: {
    channel: Object as () => IChannel
  },

  data: () => ({
    messageText: '',
    messages: [] as { login: string, message: string }[],
    socket: null as NuxtSocket | null,
  }),

  computed: {
    ...mapState({
      accessToken: (state: any) => state.token.accessToken,
    })
  },

  async fetch() {
    try {
      const res = await this.$axios.$get(`/channel/${this.channel.id}/history`)
      this.messages = [...res.map((el: string) => el.charAt(0) === '{' ? JSON.parse(el) : el)]
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    } catch(err) {
      console.log(err)
    }
  },

  mounted() {
    console.log(this.channel)
    this.socket = this.$nuxtSocket({
      extraHeaders: {
        Authorization: this.accessToken,
        channel: this.channel.name,
      },
      path: "/api/socket.io/",
    })
    this.socket.on('channel', (login, message) => {
      this.messages.push({login, message})
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    })
  },

  methods: {
    emitMessageOnChannel() {
      const messageTextFormated = this.messageText.trim()
      if (this.socket && messageTextFormated) {
        this.socket.emit('channel', messageTextFormated, (resp: any) => {
            console.log(resp)
        })
        this.messageText = ''
      }
    },
    scrollToBottom() {
      const container = this.$el.querySelector('#' + this.channel.name)
      if (container !== null) container.scrollTop = container.scrollHeight
    }
  }
})
</script>
