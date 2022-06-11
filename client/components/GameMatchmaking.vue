<template>
  <v-card height="calc(100% - 76px)" color="grey lighten-1" class="d-flex d-flex-column justify-center align-center">
    <v-btn
      color="primary"
      @click="$emit('next')"
    >
      Continue
    </v-btn>
    <v-btn text>
      Cancel
    </v-btn>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'GameMatchmaking',
})
</script>
