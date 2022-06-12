<template>
  <v-card height="calc(100% - 114px)" color="grey lighten-1" class="ma-6">
    <v-toolbar rounded="0">
      <v-text-field
        v-model="search"
        prepend-icon="mdi-magnify"
        label="Login"
        outlined
        dense
        hide-details
        class="mr-2"
      />
      <v-btn outlined class="mr-2" @click="searchUserMatches">
        Search
      </v-btn>
      <v-btn outlined @click="clearSearch"> Clear </v-btn>
    </v-toolbar>
    <v-card
      height="calc(100% - 64px)"
      color="#00000000"
      class="d-flex justify-center align-center"
      :key="selectedLogin"
    >
      <v-progress-circular
        v-if="$fetchState.pending"
        indeterminate
        color="primary"
      ></v-progress-circular>
      <v-list v-else-if="$fetchState.error">
        <v-list-item dense>Failed to load match history.</v-list-item>
      </v-list>
      <v-list v-else-if="!userMatches.length">
        <v-list-item dense>No match yet.</v-list-item>
      </v-list>
      <v-list v-else>
        <v-list-item v-for="(match, i) in userMatches" :key="i">
          {{ match.id }}
        </v-list-item>
      </v-list>
    </v-card>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { IMatch } from '@/store/match'
import { IUser } from '@/store/user'

export default Vue.extend({
  name: 'ProfileMatchhistory',

  data: () => ({
    search: '',
    selectedLogin: '',
  }),

  computed: {
    ...mapState({
      users: (state: any): IUser[] => state.user.users,
      authUserMatches: (state: any): IMatch[] => state.user.authUserMatches,
      selectedUserMatches: (state: any): IMatch[] => state.user.selectedUserMatches,
    }),
    userMatches() {
      return this.selectedLogin ? this.selectedUserMatches : this.authUserMatches
    }
  },

  async fetch() {
    await this.$store.dispatch('user/fetchAuthMatches')
  },

  methods: {
    async searchUserMatches() {
      const user = this.users.filter(el => el.display_name === this.search)
      try {
        await this.$store.dispatch('user/fetchMatches', user[0] ? user[0].id : '0')
        this.selectedLogin = this.search
      } catch(err) {
        console.log(err)
      }
    },
    clearSearch() {
      this.selectedLogin = ''
    }
  }
})
</script>
