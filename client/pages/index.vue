<template>
  <v-stepper :key="index" v-model="e1" height="100%">
    <v-stepper-header>
      <v-stepper-step :complete="e1 > 1" step="1"> Matchmaking </v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step :complete="e1 > 2" step="2"> Game </v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step :complete="e1 > 2" step="3"> Result </v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1">
        <GameMatchmaking @next="e1 = 2" />
      </v-stepper-content>
      <v-stepper-content step="2">
        <GameCore @next="e1 = 3" />
      </v-stepper-content>
      <v-stepper-content step="3">
        <GameResult @next="index++" />
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'IndexPage',

  middleware: 'auth',

  data: () => ({
    index: 0,
  }),

  computed: {
    e1: {
      get(): number {
        return this.$store.state.easyFix
      },
      set(value: number) {
        this.$store.commit('SET_VALUE', value)
      },
    },
  },
})
</script>

<style>
.v-stepper__items,
.v-stepper__content,
.v-stepper__wrapper {
  height: inherit;
}
</style>
