<template>
  <v-app dark>
    <v-app-bar app clipped-left height="64">
      <v-btn icon @click="channelVisible = !channelVisible">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" />
      <v-spacer />
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
              <v-list-item-title v-text="item.title" />
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
          <v-list-item>
            <v-select
              v-model="channelPermission"
              :items="channelPermissionList"
              :rules="channelPermissionRules"
              label="Channel permission"
              required
            ></v-select>
          </v-list-item>
          <v-list-item class="justify-center">
            <v-btn :disabled="!valid" @click="createChannel"> Create </v-btn>
          </v-list-item>
        </v-list>
      </v-form>
      <v-divider />
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
          <v-list-item>
            <v-list-item-action>
              <v-icon>{{ channel.name }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="channel.name" />
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <Nuxt />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { IChannel } from '@/store/channel'

export default Vue.extend({
  name: 'DefaultLayout',

  data: () => ({
    title: 'ft_transcendance',
    valid: false,
    channelVisible: false,
    channelName: '',
    channelStatus: '',
    channelStatusList: ['Public', 'Protected', 'Private'],
    channelPermission: '',
    channelPermissionList: ['Open', 'On invitation'],
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
    channelPermissionRules: [
      (v: string) => !!v || 'Channel permission is required',
    ],
  }),

  computed: {
    ...mapState({
      login: (state: any): string => state.user.authUser.display_name,
      username: (state: any): string => state.user.authUser.user_name,
      avatar: (state: any): string => state.user.authUser.avatar,
      channels: (state: any): IChannel[] => state.channel.channels,
    }),
    imagePath() {
      return 'https://ft.localhost:4500/api/image/' + this.avatar
    },
  },

  async fetch() {
    try {
      await this.$store.dispatch('channel/fetch')
    } catch (err) {
      console.log(err)
    }
  },

  methods: {
    logoutRedirect() {
      this.$store.dispatch('logout')
      this.$router.replace('/login')
    },
    convertChannelStatus(channelStatus: string): string {
      switch (channelStatus) {
        case 'Public':
          return 'PUBLIC'
        case 'Protected':
          return 'PROTECTED'
        case 'Private':
          return 'PRIVATE'
        default:
          return ''
      }
    },
    convertChannelPermission(channelPermission: string): string {
      switch (channelPermission) {
        case 'Open':
          return 'OPEN'
        case 'On invitation':
          return 'ON_INVITE'
        default:
          return ''
      }
    },
    async createChannel() {
      try {
        const channel = {
          name: this.channelName,
          status: (this as any).convertChannelStatus(this.channelStatus),
          permissions: (this as any).convertChannelPermission(this.channelPermission),
          password: 'Hello World!',
        } as IChannel
        await this.$store.dispatch('channel/create', channel)
      } catch (err) {
        console.log(err)
      }
    },
  },
})
</script>

<style>
html {
  overflow: hidden;
}
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
