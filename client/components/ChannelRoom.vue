<template>
  <v-sheet width="100%">
    <v-toolbar v-if="isLocked">
      <v-toolbar>
        <v-text-field
          v-model="password"
          dense
          outlined
          hide-details
          class="mr-2"
        ></v-text-field>
        <v-btn icon @click="sendPassword"><v-icon>mdi-lock</v-icon></v-btn>
      </v-toolbar>
    </v-toolbar>
    <v-sheet v-else width="100%">
      <v-toolbar v-if="isAuthUserAdmin" class="d-flex justify-center">
        <v-menu v-if="isAuthUserOwner" :close-on-content-click="false">
          <template #activator="{ on }">
            <v-btn small icon class="mr-2" v-on="on">
              <v-icon>mdi-lock</v-icon>
            </v-btn>
          </template>
          <v-card class="d-flex flex-column justify-center">
            <v-text-field
                v-model="newPassword"
                dense
                outlined
                hide-details
                class="ma-2"
              ></v-text-field>
              <v-btn class="ma-2" @click="changePassword">
                Change password
              </v-btn>
              <v-btn class="ma-2" @click="updatePassword">
                {{ channel.status === 'PROTECTED' ? 'Disable' : 'Enable' }}
              </v-btn>
          </v-card>
        </v-menu>
        <v-menu v-if="isAuthUserOwner">
          <template #activator="{ on }">
            <v-btn small class="mr-2" v-on="on" @click="fetchAdmin">
              Admin
            </v-btn>
          </template>
          <v-list>
            <v-list-item v-for="(user, i) in users" :key="i">
              <v-list-item-content class="mr-2">
                {{ user.display_name }}
              </v-list-item-content>
              <v-btn @click="setAdmin(user.user_name)">Remove</v-btn>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-menu>
          <template #activator="{ on }">
            <v-btn small class="mr-2" v-on="on" @click="fetchBanned">
              Banned
            </v-btn>
          </template>
          <v-list>
            <v-list-item v-for="(user, i) in users" :key="i">
              <v-list-item-content class="mr-2">
                {{ user.display_name }}
              </v-list-item-content>
              <v-btn @click="setBan(user.user_name)">Unban</v-btn>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-menu>
          <template #activator="{ on }">
            <v-btn small class="mr-2" v-on="on" @click="fetchMuted">
              Muted
            </v-btn>
          </template>
          <v-list>
            <v-list-item v-for="(user, i) in users" :key="i">
              <v-list-item-content class="mr-2">
                {{ user.display_name }}
              </v-list-item-content>
              <v-btn @click="setMute(user.user_name)">Unmute</v-btn>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-btn
          v-if="isAuthUserOwner"
          small
          icon
          class="mr-2"
          @click="deleteChannel"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card :id="channel.name" height="320px" class="overflow-y-auto">
        <v-list>
          <v-list-item
            v-for="(message, i) in messages"
            :key="i"
            three-line
            class="d-flex d-flex-column"
          >
            <v-list-item-content>
              <v-list-item-title class="d-flex d-flex-column align-center mb-1">
                <v-btn small class="mr-2" @click="changeUser(message.login)">{{ message.login }}</v-btn>
                <v-btn
                  v-if="isAuthUserOwner"
                  x-small
                  icon
                  class="mr-2"
                  @click="setAdmin(message.login)"
                >
                  <v-icon>mdi-account-supervisor</v-icon>
                </v-btn>

                <v-btn
                  v-if="isAuthUserAdmin"
                  x-small
                  icon
                  class="mr-2"
                  @click="setBan(message.login)"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>

                <v-btn
                  v-if="isAuthUserAdmin"
                  x-small
                  icon
                  @click="setMute(message.login)"
                >
                  <v-icon>mdi-volume-off</v-icon>
                </v-btn>
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
        <v-btn icon @click="emitLogoutOnChannel"
          ><v-icon>mdi-logout</v-icon></v-btn
        >
      </v-toolbar>
    </v-sheet>
  </v-sheet>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { NuxtSocket } from 'nuxt-socket-io'
import { IChannel } from '@/store/channel'
import { IUser } from '@/store/user'

declare module 'vue/types/vue' {
  interface Vue {
    scrollToBottom: () => void
    getUser: (displayName: string) => IUser
  }
}

export default Vue.extend({
  props: {
    channel: Object as () => IChannel,
  },

  data: () => ({
    owner: true,
    admin: true,
    unlocked: false,
    password: '',
    newPassword: '',
    messageText: '',
    messages: [] as { login: string; message: string }[],
    admins: [] as IUser[],
    banned: [] as IUser[],
    muted: [] as IUser[],
    socket: null as NuxtSocket | null,
  }),

  async fetch() {
    try {
      const res = await this.$axios.$get(`/channel/${this.channel.id}/history`)
      this.messages = res.length
        ? [...res.map((el: string) => JSON.parse(el))]
        : []
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    } catch (err) {
      console.log(err)
    }
  },

  computed: {
    ...mapState({
      accessToken: (state: any): string => state.token.accessToken,
      selectedUser: (state: any): IUser => state.selectedUser,
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
    isAuthUserOwner() {
      return this.owner
    },
    isAuthUserAdmin() {
      return this.admin
    },
    isLocked() {
      return this.channel.status === 'PROTECTED' ? !this.unlocked : false
    },
  },

  mounted() {
    this.socket = this.$nuxtSocket({
      channel: '/channel',
      auth: {
        Authorization: this.accessToken,
        channel: this.channel.name,
        password: this.channel.password,
      },
      path: '/api/socket.io/',
    } as any)
    this.socket.on('channel', (login, message) => {
      this.messages.push({ login, message })
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    })
  },

  methods: {
    scrollToBottom() {
      const container = this.$el.querySelector('#' + this.channel.name)
      if (container !== null) container.scrollTop = container.scrollHeight
    },
    async sendPassword() {
      try {
        await this.$axios.$post(`/channel/${this.channel.id}/password`, {
          password: this.password,
        })
        this.unlocked = true
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      } catch (err) {
        this.password = ''
      }
    },
    async changePassword() {
      const channel = { ...this.channel }
      channel.password = this.newPassword
      try {
        await this.$axios.$patch(`/channel/${this.channel.id}`, channel)
      } catch (err) {
        this.newPassword = ''
      }
    },
    async updatePassword() {
      const channel = { ...this.channel }
      channel.password = this.newPassword
      channel.status = this.channel.status === 'PROTECTED' ? 'PUBLIC' : 'PROTECTED'
      try {
        await this.$axios.$patch(`/channel/${this.channel.id}`, channel)
      } catch(err) {
        console.log(err)
      }
    },
    async deleteChannel() {
      try {
        await this.$store.dispatch('channel/delete', this.channel.id)
      } catch (err) {
        console.log(err)
      }
    },
    emitMessageOnChannel() {
      const messageTextFormated = this.messageText.trim()
      if (this.socket && messageTextFormated) {
        this.socket.emit('channel', 'msg', messageTextFormated)
        this.messageText = ''
      }
    },
    emitLogoutOnChannel() {
      if (this.socket) {
        this.socket.emit('channel', 'action', 'logout')
      }
    },
    setAdmin(user: string) {
      if (this.socket && user) {
        this.socket.emit('channel', 'action', 'admin', user)
      }
    },
    setBan(user: string) {
      if (this.socket && user) {
        this.socket.emit('channel', 'action', 'ban', user)
      }
    },
    setMute(user: string) {
      if (this.socket && user) {
        this.socket.emit('channel', 'action', 'mute', user)
      }
    },
    fetchAdmin() {
      console.log(this.admins)
    },
    fetchBanned() {
      console.log(this.banned)
    },
    fetchMuted() {
      console.log(this.muted)
    },
    getUser(displayName: string): IUser {
      return this.users.find(el => el.display_name === displayName) || {} as IUser
    },
    changeUser(displayName: string) {
      this.$store.commit('SELECTED_USER', this.getUser(displayName))
      this.value = true
    }
  },
})
</script>
