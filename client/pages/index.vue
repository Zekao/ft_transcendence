<template>
  <v-stepper height="100%" v-model="e1">
    <v-stepper-header>
      <v-stepper-step
        :complete="e1 > 1"
        step="1"
      >
        Matchmaking
      </v-stepper-step>
      <v-divider/>
      <v-stepper-step
        :complete="e1 > 2"
        step="2"
      >
        Pong game
      </v-stepper-step>
      <v-divider/>
      <v-stepper-step step="3">
        Result
      </v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1">
        <v-card
          class="mb-12"
          color="grey lighten-1"
          height="calc(100% - 76px)"
        >
        <v-btn
          color="primary"
          @click="e1 = 2"
        >
          Continue
        </v-btn>

        <v-btn text>
          Cancel
        </v-btn>
        </v-card>
      </v-stepper-content>

      <v-stepper-content step="2">
        <v-card
          class="mb-12"
          color="grey lighten-1"
          height="calc(100% - 76px)"
        >
        <v-btn
          color="primary"
          @click="e1 = 3"
        >
          Continue
        </v-btn>

        <v-btn text>
          Cancel
        </v-btn>
        </v-card>
      </v-stepper-content>

      <v-stepper-content step="3">
        <v-card
          class="mb-12"
          color="grey lighten-1"
          height="calc(100% - 76px)"
        >
        <v-btn
          color="primary"
          @click="e1 = 1"
        >
          Continue
        </v-btn>

        <v-btn text>
          Cancel
        </v-btn>
        </v-card>
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
    e1: 1,
  })
})
</script>

<style>
.v-stepper__items, .v-stepper__content, .v-stepper__wrapper {
  height: inherit
}
</style>
