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
              <v-btn class="mr-2" @click="changeUser(message.id)">{{
                getUser(message.id).display_name
              }}</v-btn>
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
    user: {
      type: Object as () => IUser,
      default: {} as IUser,
    },
  },

  data: () => ({
    messageText: '',
    messages: [] as { id: string; message: string }[],
    socket: null as NuxtSocket | null,
  }),

  async fetch() {
    try {
      const res = await this.$axios.$get(`/chat/me/${this.user.display_name}`)
      this.messages = res.length
        ? [...res.map((el: string) => JSON.parse(el))]
        : []
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    } catch (err: any) {
      if (err.response.status === 401) {
        this.$store.dispatch('logout')
        this.$router.push('/login')
      }
    }
  },

  computed: {
    ...mapState({
      accessToken: (state: any): string => state.token.accessToken,
      authUser: (state: any): IUser => state.user.authUser,
      users: (state: any): IUser[] => state.user.users,
    }),
    value: {
      get(): boolean {
        return this.$store.state.isFriendMenu
      },
      set(value: boolean) {
        this.$store.commit('FRIEND_MENU', value)
      },
    },
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
    this.socket.on('msg', (id, message) => {
      this.messages.push({ id, message })
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    })
  },

  methods: {
    emitMessageOnChannel() {
      const messageTextFormated = this.messageText.trim()
      if (this.socket && messageTextFormated) {
        this.socket.emit('msg', messageTextFormated)
        this.messageText = ''
      }
    },

    scrollToBottom() {
      const container = this.$el.querySelector('#' + this.user.display_name)
      if (container !== null) container.scrollTop = container.scrollHeight
    },
    getUser(id: string): IUser {
      return this.users.find((el) => el.id === id) || ({} as IUser)
    },
    changeUser(id: string) {
      this.$store.commit('SELECTED_USER', this.getUser(id))
      this.value = true
    },
  },
})
</script>
