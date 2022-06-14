<template>
  <v-sheet width="100%">
  <v-toolbar v-if="locked">
    <v-toolbar>
      <v-text-field
        v-model="messageText"
        dense
        outlined
        hide-details
        class="mr-2"
      ></v-text-field>
      <v-btn icon @click="emitPassword"><v-icon>mdi-lock</v-icon></v-btn>
    </v-toolbar>
  </v-toolbar>
  <v-sheet v-else width="100%">
    <v-toolbar v-if="isAuthUserAdmin" class="d-flex justify-center">
      <v-menu v-if="isAuthUserOwner">
        <template #activator="{ on }">
          <v-btn small class="mr-2" v-on="on" @click="fetchAdmin">
            Admin
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="(user, i) in users" :key="i">
            <v-list-item-content class="mr-2"> {{ user.display_name }} </v-list-item-content>
            <v-btn @click="removeAdmin">Remove</v-btn>
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
            <v-list-item-content class="mr-2"> {{ user.display_name }} </v-list-item-content>
            <v-btn @click="unbanUser">Unban</v-btn>
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
            <v-list-item-content class="mr-2"> {{ user.display_name }} </v-list-item-content>
            <v-btn @click="unmuteUser">Unmute</v-btn>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn v-if="isAuthUserOwner" small icon class="mr-2" @click="deleteChannel">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card :id="channel.name" height="320px" class="overflow-y-auto">
      <v-list>
        <v-list-item v-for="(message, i) in messages" :key="i">
          <v-list-item-content>
            {{ message.login }}
          </v-list-item-content>
          <v-btn v-if="isAuthUserAdmin" x-small icon class="mr-2">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-btn v-if="isAuthUserAdmin" x-small icon>
            <v-icon>mdi-volume-off</v-icon>
          </v-btn>
          <v-list-item-content class="text-right">
            <div>{{ message.message }}</div>
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
      ></v-text-field>
      <v-btn icon @click="emitMessageOnChannel"><v-icon>mdi-pencil</v-icon></v-btn>
      <v-btn icon @click="emitLogoutOnChannel"><v-icon>mdi-logout</v-icon></v-btn>
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

export default Vue.extend({

  props: {
    channel: Object as () => IChannel
  },

  data: () => ({
    owner: false,
    admin: false,
    locked: true,
    messageText: '',
    messages: [] as { login: string, message: string }[],
    admins: [] as IUser[],
    banned: [] as IUser[],
    muted: [] as IUser[],
    socket: null as NuxtSocket | null,
  }),

  computed: {
    ...mapState({
      accessToken: (state: any) => state.token.accessToken,
      users: (state: any) => state.user.users,
    }),
    isAuthUserOwner() {
      return this.owner
    },
    isAuthUserAdmin() {
      return this.admin
    }
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
      channel: '/channel',
      extraHeaders: {
        Authorization: this.accessToken,
        channel: this.channel.name,
      },
      path: "/api/socket.io/",
    })
    this.socket.on('channel', (login, message) => {
      console.log(login, message)
      this.messages.push({login, message})
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
    async deleteChannel() {
      console.log(this.channel.id)
    },
    emitMessageOnChannel() {
      const messageTextFormated = this.messageText.trim()
      if (this.socket && messageTextFormated) {
        this.socket.emit('channel', { type: 'msg', message: messageTextFormated }, (resp: any) => {
            console.log(resp)
        })
        this.messageText = ''
      }
    },
    emitLogoutOnChannel() {
      console.log(this.channel.id)
    },
    emitPassword() {
      this.locked = false
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    },
    removeAdmin() {
      console.log(this.admins)
    },
    unbanUser() {
      console.log(this.banned)
    },
    unmuteUser() {
      console.log(this.muted)
    },
    fetchAdmin() {
      console.log(this.admins)
    },
    fetchBanned() {
      console.log(this.banned)
    },
    fetchMuted() {
      console.log(this.muted)
    }
  }
})
</script>
