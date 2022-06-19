<template>
  <v-card
    height="calc(100% - 114px)"
    color="grey lighten-1"
    class="d-flex justify-center align-center ma-6 pa-4"
  >
    <v-progress-circular
      v-if="$fetchState.pending"
      indeterminate
      color="primary"
    ></v-progress-circular>
    <v-list v-else-if="$fetchState.error">
      <v-list-item dense>Failed to load friend list.</v-list-item>
    </v-list>
    <v-list v-else-if="!authUserFriends.length">
      <v-list-item dense>No friends yet.</v-list-item>
    </v-list>
    <v-list v-else>
      <v-list-item v-for="(user, i) in authUserFriends" :key="i" class="my-2">
        <v-badge :color="colorStatus(user)" overlap class="mr-4">
          <v-avatar
            ><v-img :src="'https://ft.localhost:4500/api/image/' + user.avatar"
          /></v-avatar>
        </v-badge>
        <v-btn @click="changeUser(user)">
          {{ user.display_name }}
        </v-btn>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { IUser } from '@/store/user'
import { NuxtSocket } from 'nuxt-socket-io'

export default Vue.extend({
  name: 'ProfileFriends',

  data: () => ({
    socket: null as NuxtSocket | null,
  //   authUserFriends: [
  //     { user_name: 'Test1', display_name: 'TEST1', avatar: 'https://ft.localhost:4500/api/image/default.png', win: 2, loose: 1, rank: 9, status: 'ONLINE' },
  //     { user_name: 'Test2', display_name: 'TEST2', avatar: 'https://ft.localhost:4500/api/image/default.png', win: 2, loose: 1, rank: 9, status: '' },
  //   ],
  }),

  async fetch() {
    await this.$store.dispatch('user/fetchAuthFriends')
  },

  computed: {
    ...mapState({
      accessToken: (state: any): string => state.token.accessToken,
      authUserFriends: (state: any): IUser[] => state.user.authUserFriends,
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
      auth: {
        Authorization: this.accessToken,
      },
      path: '/api/socket.io/',
    } as any)
    this.socket.on('notification', (userID, status) => {
        if (status === 'connect') {
          const user = this.authUserFriends.find(el => el.id === userID)
          if (!user) return
          const newUser = { ...user }
          newUser.status = 'ONLINE'
          this.$store.commit('user/UPDATE_AUTH_FRIEND', newUser)
        } else if (status === 'disconnect') {
          const user = this.authUserFriends.find(el => el.id === userID)
          if (!user) return
          const newUser = { ...user }
          newUser.status = 'OFFLINE'
          this.$store.commit('user/UPDATE_AUTH_FRIEND', newUser)
        } else if (status === 'ingame') {
          const user = this.authUserFriends.find(el => el.id === userID)
          if (!user) return
          const newUser = { ...user }
          newUser.in_game = 'IN_GAME'
          this.$store.commit('user/UPDATE_AUTH_FRIEND', newUser)
        } else if (status === 'outgame') {
          const user = this.authUserFriends.find(el => el.id === userID)
          if (!user) return
          const newUser = { ...user }
          newUser.in_game = 'OUT_GAME'
          this.$store.commit('user/UPDATE_AUTH_FRIEND', newUser)
        }
      })
  },

  methods: {
    changeUser(user: IUser) {
      this.$store.commit('SELECTED_USER', user)
      this.value = true
    },

    colorStatus(user: IUser) {
      if (user.in_game === 'IN_GAME' && user.status === 'ONLINE') {
        return 'blue'
      } else if (user.status === 'ONLINE') {
        return 'green'
      } else {
        return 'red'
      }
    },
  },
})
</script>
