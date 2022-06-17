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
        <v-badge
          :color="user.status === 'ONLINE' ? 'green' : 'red'"
          overlap
          class="mr-4"
        >
          <v-avatar><v-img :src="user.avatar" /></v-avatar>
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

export default Vue.extend({
  name: 'ProfileFriends',

  // data: () => ({
  //   authUserFriends: [
  //     { user_name: 'Test1', display_name: 'TEST1', avatar: 'https://ft.localhost:4500/api/image/default.png', win: 2, loose: 1, rank: 9, status: 'ONLINE' },
  //     { user_name: 'Test2', display_name: 'TEST2', avatar: 'https://ft.localhost:4500/api/image/default.png', win: 2, loose: 1, rank: 9, status: '' },
  //   ],
  // }),

  async fetch() {
    await this.$store.dispatch('user/fetchAuthFriends')
  },

  computed: {
    ...mapState({
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

  methods: {
    changeUser(user: IUser) {
      this.$store.commit('SELECTED_USER', user)
      this.value = true
    },
  },
})
</script>
