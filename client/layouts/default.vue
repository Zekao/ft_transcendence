<template>
  <v-app dark>
    <v-app-bar app clipped-left height="64">
      <v-btn icon @click="channelVisible = !channelVisible">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
      <v-toolbar-title> {{ title }} </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu transition="slide-x-reverse-transition" offset-y>
        <template #activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on">
            <v-avatar>
              <v-img :src="imagePath"></v-img>
            </v-avatar>
            <v-col>
              {{ login ? login : username }}
            </v-col>
          </v-btn>
        </template>

        <v-list class="mt-6">
          <v-list-item
            v-for="(item, i) in items"
            :key="i"
            :to="item.to"
            router
            exact
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title> {{ item.title }} </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-navigation-drawer v-model="channelVisible" app clipped width="360">
      <v-form v-model="valid">
        <v-toolbar>
          <v-icon class="mr-3"> mdi-playlist-plus </v-icon>
          Create channel
        </v-toolbar>
        <v-list>
          <v-list-item>
            <v-text-field
              v-model="channelName"
              :rules="channelNameRules"
              :counter="24"
              label="Channel name"
              required
            ></v-text-field>
          </v-list-item>
          <v-list-item>
            <v-select
              v-model="channelStatus"
              :items="channelStatusList"
              :rules="channelStatusRules"
              label="Channel status"
              required
            ></v-select>
          </v-list-item>
          <v-list-item v-if="channelStatus === 'Protected'">
            <v-text-field
              v-model="channelPassword"
              :rules="channelPasswordRules"
              :counter="24"
              label="Channel password"
              required
            ></v-text-field>
          </v-list-item>
          <v-list-item class="justify-center">
            <v-btn :disabled="!valid" @click="createChannel"> Create </v-btn>
          </v-list-item>
        </v-list>
      </v-form>
      <v-divider></v-divider>
      <v-toolbar>
        <v-icon class="mr-3"> mdi-playlist-minus </v-icon>
        Browse channels
      </v-toolbar>
      <v-list v-if="!channels.length">
        <v-list-item>
          <v-list-item-subtitle> No channel available. </v-list-item-subtitle>
        </v-list-item>
      </v-list>
      <v-list v-else>
        <v-list-group v-for="(channel, i) in channels" :key="i">
          <template #activator>
            <v-list-item-content>
              <v-list-item-title>{{ channel.name }}</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item class="px-0">
            <ChannelRoom :key="i" :channel="channel"></ChannelRoom>
          </v-list-item>
        </v-list-group>
      </v-list>
      <v-divider></v-divider>
      <v-toolbar>
        <v-icon class="mr-3"> mdi-account-supervisor </v-icon>
        Private messages
      </v-toolbar>
      <v-list v-if="!usersFiltered.length">
        <v-list-item>
          <v-list-item-subtitle> No user available. </v-list-item-subtitle>
        </v-list-item>
      </v-list>
      <v-list v-else>
        <v-list-group v-for="(user, i) in usersFiltered" :key="i">
          <template #activator>
            <v-list-item-content>
              <v-list-item-title>{{ user.display_name }}</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item class="px-0">
            <MessageRoom :key="i" :user="user"></MessageRoom>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <Nuxt></Nuxt>
    </v-main>
    <FriendMenu/>
    <v-card v-if="invite" style="position: fixed; bottom: 40px; right: 50px">
        <v-list-item>
          <v-list-item-content class="text-center">
            <p>New invitation from {{ inviteUserName }}</p>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-action>
            <v-btn x-large @click="acceptInvitation">
              Accept
            </v-btn>
          </v-list-item-action>
          <v-list-item-action>
            <v-btn x-large @click="refuseInvitation">
              Refuse
            </v-btn>
          </v-list-item-action>
        </v-list-item>
    </v-card>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { NuxtSocket } from 'nuxt-socket-io'
import { IChannel } from '@/store/channel'
import { IUser } from '~/store/user'

export default Vue.extend({
  name: 'DefaultLayout',

  data: () => ({
    title: 'ft_transcendance',
    invite: false,
    inviteMatchId: '',
    inviteUserName: '',
    valid: false,
    channelVisible: false,
    channelName: '',
    channelStatus: '',
    channelStatusList: ['Public', 'Protected'],
    channelPassword: '',
    items: [
      {
        icon: 'mdi-gamepad-square',
        title: 'Game',
        to: '/',
      },
      {
        icon: 'mdi-account',
        title: 'Profile',
        to: '/profile',
      },
      {
        icon: 'mdi-logout',
        title: 'Logout',
        to: '/logout',
      },
    ],
    channelNameRules: [
      (v: string) => !!v || 'Name is required',
      (v: string) => v.length <= 24 || 'Name must be less than 24 characters',
    ],
    channelStatusRules: [(v: string) => !!v || 'Channel status is required'],
    channelPasswordRules: [
      (v: string) => !!v || 'Channel password is required',
      (v: string) =>
        v.length >= 8 || 'Channel password must be greater than 8 characters',
      (v: string) =>
        v.length <= 32 || 'Channel password must be less than 32 characters',
    ],
    socket: null as NuxtSocket | null,
  }),

  async fetch() {
    try {
      await Promise.all([
        this.$store.dispatch('channel/fetch'),
        this.$store.dispatch('user/fetch'),
      ])
    } catch (err) {
      console.log(err)
    }
  },

  computed: {
    ...mapState({
      id: (state: any): string => state.user.authUser.id,
      login: (state: any): string => state.user.authUser.display_name,
      username: (state: any): string => state.user.authUser.user_name,
      avatar: (state: any): string => state.user.authUser.avatar,
      accessToken: (state: any): string => state.token.accessToken,
      channels: (state: any): IChannel[] => state.channel.channels,
      users: (state: any): IUser[] => state.user.users,
    }),
    usersFiltered(): IUser[] {
      return this.users.filter(el => el.id !== this.id)
    },
    imagePath(): string {
      return 'https://ft.localhost:4500/api/image/' + this.avatar
    },
  },

  mounted() {
    if (this.$vuetify.breakpoint.mdAndUp) this.channelVisible = true
    this.socket = this.$nuxtSocket({
      auth: {
        Authorization: this.accessToken,
      },
      path: '/api/socket.io/',
    } as any)
    this.socket.on('notification', (authUserName: string, game: string, matchId: string, userName: string) => {
      if (authUserName === this.username && game === 'game') {
        this.invite = true
        this.inviteMatchId = matchId
        this.inviteUserName = userName
      } else if (authUserName === this.username && game === 'join') {
        this.$store.commit('SELECTED_MATCH_ID', matchId)
        if (this.$route.path !== '/') this.$router.replace('/')
        this.invite = false
        this.inviteMatchId = ''
        this.inviteUserName = ''
      }
    })
  },

  methods: {
    logoutRedirect() {
      this.$store.dispatch('logout')
      this.$router.replace('/login')
    },
    convertChannelStatus(channelStatus: string): string {
      if (channelStatus === 'Protected') return 'PROTECTED'
      return 'PUBLIC'
    },
    async createChannel() {
      try {
        const channel = {
          name: this.channelName,
          status: this.convertChannelStatus(this.channelStatus),
          permissions: 'OPEN',
          password:
            this.channelStatus === 'Protected'
              ? this.channelPassword
              : 'Hello World!',
        } as IChannel
        await this.$store.dispatch('channel/create', channel)
      } catch (err) {
        console.log(err)
      }
    },
    acceptInvitation() {
      if (this.socket) {
        this.socket.emit('notification', 'join', this.inviteMatchId)
        this.$store.commit('SELECTED_MATCH_ID', this.inviteMatchId)
        if (this.$route.path !== '/') this.$router.replace('/')
        this.invite = false
        this.inviteMatchId = ''
        this.inviteUserName = ''
      }
    },
    refuseInvitation() {
      if (this.socket) {
        this.socket.emit('notification', 'deny', this.inviteMatchId)
        this.invite = false
        this.inviteMatchId = ''
        this.inviteUserName = ''
      }
    }
  },
})
</script>

<style>
.accent-text {
  color: #ffffff !important;
}
.v-menu__content {
  box-shadow: none;
}
.v-input__icon--prepend {
  font-size: 12px;
}
</style>
