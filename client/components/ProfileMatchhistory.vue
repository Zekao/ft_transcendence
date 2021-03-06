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
      class="d-flex justify-center align-center pa-4"
    >
      <v-list v-if="!userMatches.length">
        <v-list-item dense>No match yet.</v-list-item>
      </v-list>
      <v-list v-else width="40%">
        <v-list-item
          v-for="(match, i) in userMatches"
          :key="i"
          class="justify-center align-center"
        >
          <v-list-item-action class="justify-center align-center">
            <v-badge
              v-if="match.scoreFirstPlayer > match.scoreSecondPlayer"
              color="orange"
              icon="mdi-crown"
              overlap
            >
              <v-avatar>
                <v-img :src="getAvatarPath(match.FirstPlayer)" />
              </v-avatar>
            </v-badge>
            <v-avatar v-else>
              <v-img :src="getAvatarPath(match.FirstPlayer)" />
            </v-avatar>
            <v-btn>
              {{ match.FirstPlayer.display_name }} -
              {{ match.scoreFirstPlayer }}</v-btn
            >
          </v-list-item-action>
          <v-list-item-action class="justify-center align-center">
            <v-badge
              v-if="match.scoreSecondPlayer > match.scoreFirstPlayer"
              color="orange"
              icon="mdi-crown"
              overlap
            >
              <v-avatar>
                <v-img :src="getAvatarPath(match.SecondPlayer)" />
              </v-avatar>
            </v-badge>
            <v-avatar v-else>
              <v-img :src="getAvatarPath(match.SecondPlayer)" />
            </v-avatar>
            <v-btn>
              {{ match.scoreSecondPlayer }} -
              {{ match.SecondPlayer.display_name }}
            </v-btn>
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
  }),

  async fetch() {
    try {
      await this.$store.dispatch('user/fetchAuthMatchs')
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
      users: (state: any): IUser[] => state.user.users,
      authUserMatches: (state: any): IMatch[] => state.user.authUserMatches,
      selectedUserMatches: (state: any): IMatch[] =>
        state.user.selectedUserMatches,
    }),
    userMatches(): IMatch[] {
      return this.selectedLogin
        ? this.selectedUserMatches
        : this.authUserMatches
    },
  },

  watch: {
    async componentSelected(val: number) {
      if (val !== 3) return
      try {
        await this.$store.dispatch('user/fetchAuthMatchs')
      } catch (err: any) {
        if (err.response.status === 401) {
          this.$store.dispatch('logout')
          this.$router.push('/login')
        }
      }
    },
  },

  methods: {
    async searchUserMatches() {
      const user = this.users.find((el) => el.display_name === this.search)
      if (!user) return
      try {
        await this.$store.dispatch('user/fetchMatchs', user.id)
        this.selectedLogin = this.search
      } catch (err: any) {
        if (err.response.status === 401) {
          this.$store.dispatch('logout')
          this.$router.push('/login')
        }
      }
    },

    getAvatarPath(user: IUser): string {
      return this.$config.imageUrl + user?.avatar || 'default.png'
    },

    clearSearch() {
      this.selectedLogin = ''
      this.search = ''
    },
  },
})
</script>
