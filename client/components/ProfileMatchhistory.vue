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
      <v-btn outlined class="mr-2" @click="searchUserMatches"> Search </v-btn>
      <v-btn outlined @click="clearSearch"> Clear </v-btn>
    </v-toolbar>
    <v-card
      :key="selectedLogin"
      height="calc(100% - 64px)"
      color="#00000000"
      class="d-flex justify-center align-center"
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
      <v-list v-else width="40%">
        <v-list-item v-for="(match, i) in userMatches" :key="i">
          <v-list-item-action class="justify-center align-center">
            <!-- {{ match.FirstPlayer }}  -->
            <v-badge
              v-if="match.scoreFirstPlayer > match.scoreSecondPlayer"
              color="orange"
              icon="mdi-crown"
              overlap
            >
              <v-avatar>
                <v-img
                  :src="
                   
                   getAvatarPath(match.FirstPlayer)
                  "
                />
              </v-avatar>
            </v-badge>
            <v-avatar v-else>
              <v-img
                :src="
                  getAvatarPath(match.FirstPlayer)
                "
              />
            </v-avatar>
            <v-btn> {{ match.FirstPlayer.display_name }} {{match.scoreFirstPlayer}} </v-btn>
          </v-list-item-action>
          <v-list-item-content class="justify-center">
            <!-- {{ match.scoreFirstPlayer + ' - ' + match.scoreSecondPlayer }} -->
            
          </v-list-item-content>
          <v-list-item-action class="justify-center align-center">
            <!-- {{ match.SecondPlayer }} -->
            <v-badge
              v-if="match.scoreSecondPlayer > match.scoreFirstPlayer"
              color="orange"
              icon="mdi-crown"
              overlap
            >
              <v-avatar>
                <v-img
                   :src="
                  getAvatarPath(match.SecondPlayer)
                "
               
                />
              </v-avatar>
            </v-badge>
            <v-avatar v-else>
              <v-img
                :src="
                 getAvatarPath(match.SecondPlayer)
                "
              />
            </v-avatar>
            <v-btn>  {{match.scoreSecondPlayer}} {{ match.SecondPlayer.display_name  }} </v-btn>
          </v-list-item-action>
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
    //   {
    //     FirstPlayer: 'gamarcha',
    //     SecondPlayer: 'gamarcha',
    //     scoreFirstPlayer: 4,
    //     scoreSecondPlayer: 0,
    //     winner: '',
    //   },
    // ],
  }),

  computed: {
    ...mapState({
      users: (state: any): IUser[] => state.user.users,
      authUserMatches: (state: any): IMatch[] => state.user.authUserMatches,
      selectedUserMatches: (state: any): IMatch[] =>
        state.user.selectedUserMatches,
    }),
    userMatches() { 
      console.log(this.authUserMatches)

      return this.selectedLogin
        ? this.selectedUserMatches
        : this.authUserMatches
    },
  },

  async fetch() {
    await this.$store.dispatch('user/fetchAuthMatchs')
  },

  methods: {
    async searchUserMatches() {
      const user = this.users.filter((el) => el.display_name === this.search)
      try {
        await this.$store.dispatch(
          'user/fetchMatchs',
          user[0] ? user[0].id : '0'
        )
        this.selectedLogin = this.search
      } catch (err) {
        console.log(err)
      }
    },

    getUserAvatar(userName: string): string {

     const users = this.users.filter((el) => el.user_name === userName)
      console.log(users.length)
      return users.length ? users[0].avatar : ''
    },


    getAvatarPath(userName: IUser): string {

      return 'https://ft.localhost:4500/api/image/' + userName.user_name + '.png'
    },

    clearSearch() {
      this.selectedLogin = ''
      this.search = ''
    },
  },
})
</script>
