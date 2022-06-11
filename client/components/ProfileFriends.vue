<template>
  <v-card height="calc(100% - 114px)" color="grey lighten-1" class="d-flex justify-center align-center ma-6">
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
      <v-list-item v-for="(user, i) in authUserFriends" :key="i">
        {{ user.name }}
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

  computed: {
    ...mapState({
      authUserFriends: (state: any): IUser[] => state.user.authUserFriends
    })
  },

  async fetch() {
    await this.$store.dispatch('user/fetchAuthFriends')
  }
})
</script>
