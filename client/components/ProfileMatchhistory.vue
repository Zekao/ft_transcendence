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
      <v-btn outlined class="mr-2" @click="searchUserMatchs">
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
      <v-list v-else-if="!userMatchs.length">
        <v-list-item dense>No match yet.</v-list-item>
      </v-list>
      <v-list v-else width="40%">
        <v-list-item v-for="(match, i) in userMatchs" :key="i">
          <v-list-item-content class="justify-center">
            <!-- {{ match.FirstPlayer }}  -->
             <v-badge centered
                color="orange"
                icon="mdi-crown"
                overlap>
             <v-avatar> <v-img :src="getUser(userMatchs.FirstPlayer).avatar"/> </v-avatar>
             </v-badge>
            <FriendMenu :friend = getUser(match.FirstPlayer) />

          </v-list-item-content>
          <v-list-item-content class="justify-center">
            {{ match.scoreFirstPlayer + ' - ' + match.scoreSecondPlayer }}
          </v-list-item-content>
          <v-list-item-content class="justify-center">
            <!-- {{ match.SecondPlayer }} -->
              <v-avatar> <v-img :src="getUser(userMatchs.FirstPlayer).avatar"/> </v-avatar>
            <FriendMenu :friend = getUser(match.SecondPlayer) />

          </v-list-item-content>
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
    // authUserMatches: [
    //   { FirstPlayer: 'nao', SecondPlayer: 'gaga', scoreFirstPlayer: 4, scoreSecondPlayer: 0 }
    // ],
  }),

  computed: {
    ...mapState({
      users: (state: any): IUser[] => state.user.users,
      authUserMatches: (state: any): IMatch[] => state.user.authUserMatches,
      selectedUserMatchs: (state: any): IMatch[] => state.user.selectedUserMatchs,
    }),
    userMatchs() {

      console.log(this.authUserMatches);
      return this.selectedLogin ? this.selectedUserMatchs : this.authUserMatches
    }
  },

  async fetch() {
    await this.$store.dispatch('user/fetchAuthMatchs')
  },

  methods: {
    async searchUserMatchs() {
      const user = this.users.filter(el => el.display_name === this.search)
      try {
        await this.$store.dispatch('user/fetchMatchs', user[0] ? user[0].id : '0')
        this.selectedLogin = this.search
      } catch(err) {
        console.log(err)
      }
    },

     
    getUser(user_name: string) {
      return this.users.filter(el => el.display_name === user_name)
    },

    clearSearch() {
      this.selectedLogin = ''
      this.search = ''
    }
  }
})
</script>
