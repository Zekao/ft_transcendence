<template>
  <v-card
    height="calc(100% - 114px)"
    color="grey lighten-1"
    class="d-flex justify-center align-center ma-6 pa-4"
  >
    <v-list v-if="!authUserFriends.length">
      <v-list-item dense>No friends yet.</v-list-item>
    </v-list>
    <v-list v-else>
      <v-list-item v-for="(user, i) in authUserFriends" :key="i" class="my-2">
        <v-badge :color="colorStatus(user)" overlap class="mr-4">
          <v-avatar
            ><v-img :src="$config.imageUrl + user.avatar"
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
import { NuxtSocket } from 'nuxt-socket-io'
import { IUser } from '@/store/user'

export default Vue.extend({
  name: 'ProfileFriends',

  data: () => ({
    socket: null as NuxtSocket | null,
  }),

  async fetch() {
    try {
      await this.$store.dispatch('user/fetchAuthFriends')
    } catch (err: any) {
      if (err.response.status === 401) {
        this.$store.dispatch('logout')
        this.$router.push('/login')
      }
    }
  },

  computed: {
    ...mapState({
      componentSelected: (state: any): number => state.selectedComponent,
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

  watch: {
    async componentSelected(val: number) {
      if (val !== 1) return
      try {
        await this.$store.dispatch('user/fetchAuthFriends')
      } catch (err: any) {
        if (err.response.status === 401) {
          this.$store.dispatch('logout')
          this.$router.push('/login')
        }
      }
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
        const user = this.authUserFriends.find((el) => el.id === userID)
        if (!user) return
        const newUser = { ...user }
        newUser.status = 'ONLINE'
        this.$store.commit('user/UPDATE_AUTH_FRIEND', newUser)
      } else if (status === 'disconnect') {
        const user = this.authUserFriends.find((el) => el.id === userID)
        if (!user) return
        const newUser = { ...user }
        newUser.status = 'OFFLINE'
        this.$store.commit('user/UPDATE_AUTH_FRIEND', newUser)
      } else if (status === 'ingame') {
        const user = this.authUserFriends.find((el) => el.id === userID)
        if (!user) return
        const newUser = { ...user }
        newUser.in_game = 'IN_GAME'
        this.$store.commit('user/UPDATE_AUTH_FRIEND', newUser)
      } else if (status === 'outgame') {
        const user = this.authUserFriends.find((el) => el.id === userID)
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
