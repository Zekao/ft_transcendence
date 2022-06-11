<template>
  <v-card height="calc(100% - 114px)" color="grey lighten-1" class="d-flex justify-center align-center ma-6">
    <v-progress-circular
      v-if="$fetchState.pending"
      indeterminate
      color="primary"
      ></v-progress-circular>
    <v-list v-else-if="$fetchState.error">
      <v-list-item dense>Failed to load match history.</v-list-item>
    </v-list>
    <v-list v-else-if="!authUserMatches.length">
      <v-list-item dense>No match yet.</v-list-item>
    </v-list>
    <v-list v-else>
      <v-list-item v-for="(match, i) in authUserMatches" :key="i">
        {{ match.id }}
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { IMatch } from '@/store/match'

export default Vue.extend({
  name: 'ProfileMatchhistory',

  computed: {
    ...mapState({
      authUserMatches: (state: any): IMatch[] => state.user.authUserMatches
    })
  },

  async fetch() {
    await this.$store.dispatch('user/fetchAuthMatches')
  }
})
</script>
