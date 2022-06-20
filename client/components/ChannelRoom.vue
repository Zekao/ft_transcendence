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
        <template v-if="channel.status !== 'PRIVATE'">
          <v-menu v-if="isAuthUserOwner" :close-on-content-click="false">
            <template #activator="{ on }">
              <v-btn small icon class="mr-2" v-on="on">
                <v-icon>mdi-lock</v-icon>
              </v-btn>
            </template>
            <v-card class="d-flex flex-column justify-center">
              <v-form v-model="valid">
                <v-text-field
                  v-model="newPassword"
                  :rules="passwordRules"
                  :counter="24"
                  label="Password"
                  dense
                  outlined
                  class="ma-2"
                ></v-text-field>
                <v-btn :disabled="!valid" class="ma-2" @click="changePassword">
                  Change password
                </v-btn>
                <v-btn :disabled="!valid" class="ma-2" @click="updatePassword">
                  {{ channel.status === 'PROTECTED' ? 'Disable' : 'Enable' }}
                </v-btn>
              </v-form>
            </v-card>
          </v-menu>
        </template>
        <template v-else>
          <v-menu :close-on-content-click="false">
            <template #activator="{ on }">
              <v-btn small icon class="mr-2" v-on="on">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <v-card class="d-flex flex-column justify-center">
              <v-form v-model="valid">
                <v-text-field
                  v-model="newUser"
                  label="Login"
                  dense
                  outlined
                  class="ma-2"
                ></v-text-field>
                <v-btn :disabled="!valid" class="ma-2" @click="addUser">
                  Add
                </v-btn>
              </v-form>
            </v-card>
          </v-menu>
        </template>
        <v-menu v-if="isAuthUserOwner">
          <template #activator="{ on }">
            <v-btn small class="mr-2" v-on="on" @click="fetchAdmin">
              Admin
            </v-btn>
          </template>
          <v-list v-if="!admins.length">
            <v-list-item-subtitle class="mx-2">
              No admins
            </v-list-item-subtitle>
          </v-list>
          <v-list v-else>
            <v-list-item v-for="(user, i) in admins" :key="i">
              <v-list-item-content class="mr-2">
                {{ user.display_name }}
              </v-list-item-content>
              <v-btn @click="unsetAdmin(user.user_name)">Remove</v-btn>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-menu>
          <template #activator="{ on }">
            <v-btn small class="mr-2" v-on="on" @click="fetchBanned">
              Banned
            </v-btn>
          </template>
          <v-list v-if="!banned.length">
            <v-list-item-subtitle class="mx-2">
              No banned
            </v-list-item-subtitle>
          </v-list>
          <v-list v-else>
            <v-list-item v-for="(user, i) in banned" :key="i">
              <v-list-item-content class="mr-2">
                {{ user.display_name }}
              </v-list-item-content>
              <v-btn @click="unsetBan(user.user_name)">Unban</v-btn>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-menu>
          <template #activator="{ on }">
            <v-btn small class="mr-2" v-on="on" @click="fetchMuted">
              Muted
            </v-btn>
          </template>
          <v-list v-if="!muted.length">
            <v-list-item-subtitle class="mx-2"> No muted </v-list-item-subtitle>
          </v-list>
          <v-list v-else>
            <v-list-item v-for="(user, i) in muted" :key="i">
              <v-list-item-content class="mr-2">
                {{ user.display_name }}
              </v-list-item-content>
              <v-btn @click="unsetMute(user.user_name)">Unmute</v-btn>
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
                <v-btn small class="mr-2" @click="changeUser(message.id)">{{
                  getUser(message.id).display_name
                }}</v-btn>
                <v-btn
                  v-if="isAuthUserOwner"
                  x-small
                  icon
                  class="mr-2"
                  @click="setAdmin(message.id)"
                >
                  <v-icon>mdi-account-supervisor</v-icon>
                </v-btn>

                <v-btn
                  v-if="isAuthUserAdmin"
                  x-small
                  icon
                  class="mr-2"
                  @click="setBan(message.id)"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>

                <v-btn
                  v-if="isAuthUserAdmin"
                  x-small
                  icon
                  @click="setMute(message.id)"
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
        <v-btn v-if="loggedIn" icon @click="emitLogoutOnChannel"
          ><v-icon>mdi-logout</v-icon></v-btn
        >
        <v-btn v-else icon @click="emitLoginOnChannel"
          ><v-icon>mdi-login</v-icon></v-btn
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

export default Vue.extend({
  props: {
    channel: {
      type: Object as () => IChannel,
      default: {} as IChannel,
    },
  },

  data: () => ({
    valid: false,
    unlocked: false,
    password: '',
    loggedIn: false,
    newPassword: '',
    newUser: '',
    messageText: '',
    messages: [] as { id: string; message: string }[],
    owner: {} as IUser,
    admins: [] as IUser[],
    banned: [] as IUser[],
    muted: [] as IUser[],
    socket: null as NuxtSocket | null,
    passwordRules: [
      (v: string) => !!v || 'Password is required',
      (v: string) =>
        v.length >= 8 || 'Password must be greater than 8 characters',
      (v: string) =>
        v.length <= 32 || 'Password must be less than 32 characters',
    ],
  }),

  async fetch() {
    try {
      const [owners, admins, history] = await Promise.all([
        this.$axios.$get(`/channel/${this.channel.id}/members?role=owner`),
        this.$axios.$get(`/channel/${this.channel.id}/members?role=admin`),
        this.$axios.$get(`/channel/${this.channel.id}/history`),
      ])
      this.owner = owners[0]
      this.admins = admins
      this.messages = history.length
        ? [...history.map((el: string) => JSON.parse(el))]
        : []
      this.$nextTick(() => {
        this.scrollToBottom()
      })
      this.loggedIn = true
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
      selectedUser: (state: any): IUser => state.selectedUser,
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
    isAuthUserOwner(): boolean {
      return this.owner.id === this.authUser.id
    },
    isAuthUserAdmin(): boolean {
      return (
        this.isAuthUserOwner ||
        this.admins.find((el) => el.id === this.authUser.id) !== undefined
      )
    },
    isLocked(): boolean {
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
    this.socket.on('channel', async (id, message) => {
      if (id === 'update') {
        const admins = await this.$axios
          .$get(`/channel/${this.channel.id}/members?role=admin`)
          .catch((err) => {
            if (err.response.status === 401) {
              this.$store.dispatch('logout')
              this.$router.push('/login')
            }
          })
        this.admins = admins
      } else if (this.loggedIn) {
        this.messages.push({ id, message })
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      }
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
      channel.status =
        this.channel.status === 'PROTECTED' ? 'PUBLIC' : 'PROTECTED'
      try {
        await this.$axios.$patch(`/channel/${this.channel.id}`, channel)
      } catch (err) {
        this.newPassword = ''
      }
    },
    async addUser() {
      const user = this.users.find((el) => el.display_name === this.newUser)
      if (!user) {
        this.newUser = ''
        return
      }
      try {
        await this.$axios.$post(
          `/channel/${this.channel.id}/members?user=${user.id}`
        )
      } catch (err) {
        this.newUser = ''
      }
    },
    async deleteChannel() {
      try {
        await this.$store.dispatch('channel/delete', this.channel.id)
        this.$emit('delete')
      } catch (err: any) {
        if (err.response.status === 401) {
          this.$store.dispatch('logout')
          this.$router.push('/login')
        }
      }
    },
    emitMessageOnChannel() {
      const messageTextFormated = this.messageText.trim()
      if (this.socket && this.loggedIn && messageTextFormated) {
        this.socket.emit('channel', 'msg', messageTextFormated)
        this.messageText = ''
      }
    },
    async emitLoginOnChannel() {
      if (this.socket) {
        this.socket.emit('channel', 'action', 'login')
        const history = await this.$axios.$get(
          `/channel/${this.channel.id}/history`
        )
        this.messages = history.length
          ? [...history.map((el: string) => JSON.parse(el))]
          : []
        this.$nextTick(() => {
          this.scrollToBottom()
        })
        this.loggedIn = true
      }
    },
    emitLogoutOnChannel() {
      if (this.socket) {
        this.socket.emit('channel', 'action', 'logout')
        this.messages = []
        this.loggedIn = false
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
        this.socket.emit('channel', 'action', 'mute', user, '5')
      }
    },
    unsetAdmin(user: string) {
      if (this.socket && user) {
        this.socket.emit('channel', 'action', 'unadmin', user)
        this.admins = this.admins.filter((el) => el.user_name !== user)
      }
    },
    unsetBan(user: string) {
      if (this.socket && user) {
        this.socket.emit('channel', 'action', 'unban', user)
        this.banned = this.banned.filter((el) => el.user_name !== user)
      }
    },
    unsetMute(user: string) {
      if (this.socket && user) {
        this.socket.emit('channel', 'action', 'unmute', user)
        this.muted = this.muted.filter((el) => el.user_name !== user)
      }
    },
    async fetchAdmin() {
      try {
        const res = await this.$axios.$get(
          `/channel/${this.channel.id}/members?role=admin`
        )
        this.admins = res
      } catch (err) {
        this.admins = []
      }
    },
    async fetchBanned() {
      try {
        const res = await this.$axios.$get(
          `/channel/${this.channel.id}/members?role=ban`
        )
        this.banned = res
      } catch (err) {
        this.banned = []
      }
    },
    async fetchMuted() {
      try {
        const res = await this.$axios.$get(
          `/channel/${this.channel.id}/members?role=muted`
        )
        this.muted = res
      } catch (err) {
        this.muted = []
      }
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
