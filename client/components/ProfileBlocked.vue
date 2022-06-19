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
      <v-list-item dense>Failed to load blocked user list.</v-list-item>
    </v-list>
    <v-list v-else-if="!authUserBlocked.length">
      <v-list-item dense>No user blocked yet.</v-list-item>
    </v-list>
    <v-list v-else>
      <v-list-item v-for="(user, i) in authUserBlocked" :key="i">
        <v-list-item-avatar>
          <v-img :src="'https://ft.localhost:4500/api/image/' + user.avatar" />
        </v-list-item-avatar>
        <v-list-item-content>
          {{ user.display_name }}
        </v-list-item-content>
        <v-list-item-action>
          <v-btn @click="unblocked(user.id)">Unblocked</v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { IUser } from '@/store/user'

export default Vue.extend({
  name: 'ProfileBlocked',

  // data: () => ({
  //   authUserBlocked: [
  //     { user_name: 'Test1', display_name: 'TEST1', avatar: 'https://ft.localhost:4500/api/image/gamarcha.png', win: 2, loose: 1, rank: 9, status: 'ONLINE' },
  //     { user_name: 'Test2', display_name: 'TEST2', avatar: 'https://ft.localhost:4500/api/image/gamarcha.png', win: 2, loose: 1, rank: 9, status: '' },
  //   ],
  // }),

  async fetch() {
    await this.$store.dispatch('user/fetchAuthBlocked')
  },

  computed: {
    ...mapState({
      authUserBlocked: (state: any): IUser[] => state.user.authUserBlocked,
    }),
  },

  methods: {
    async unblocked(userID: string) {
      try {
        await this.$store.dispatch('user/deleteAuthBlocked', userID)
      } catch (err: any) {
        if (err.response.status === 401) {
          this.$store.dispatch('logout')
          this.$router.push('/login')
        }
      }
    },
  },
})
</script>
