<template>
  <v-card
    height="calc(100% - 114px)"
    color="grey lighten-1"
    class="d-flex justify-center align-center ma-6 pa-4"
  >
    <v-list v-if="!authUserBlocked.length">
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

  async fetch() {
    try {
      await this.$store.dispatch('user/fetchAuthBlocked')
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
      authUserBlocked: (state: any): IUser[] => state.user.authUserBlocked,
    }),
  },

  watch: {
    async componentSelected(val: number) {
      if (val !== 2) return
      try {
        await this.$store.dispatch('user/fetchAuthBlocked')
      } catch (err: any) {
        if (err.response.status === 401) {
          this.$store.dispatch('logout')
          this.$router.push('/login')
        }
      }
    },
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
