<template>
  <v-card height="calc(100% - 114px)" color="grey lighten-1" class="d-flex justify-center align-center ma-6">
    <v-list width="420px">
      <v-list-item>
        <v-file-input
          accept="image/*"
          label="Pick an image on your computer"
        ></v-file-input>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'ProfileInfos',
})
</script>
