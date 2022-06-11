<template>
  <v-sheet height="100%">
    <v-toolbar>
      <v-tabs v-model="componentSelected">
        <v-tab
          v-for="component in componentList"
          :key="component">
          {{ component }}
        </v-tab>
      </v-tabs>
      <v-text-field
        v-model="usernameSelected"
        prepend-icon="mdi-magnify"
        label="Search user"
        outlined
        dense
        hide-details
        class="mr-2"/>
      <v-btn outlined @click="usernameSelected = ''">
        Clear
      </v-btn>
    </v-toolbar>
    <v-tabs-items v-model="componentSelected">
      <v-tab-item key="Infos">
        <ProfileInfos/>
      </v-tab-item>
      <v-tab-item key="Friends">
        <ProfileFriends/>
      </v-tab-item>
      <v-tab-item key="Match history">
        <ProfileMatchhistory/>
      </v-tab-item>
      <v-tab-item key="Stats">
        <ProfileStats/>
      </v-tab-item>
    </v-tabs-items>
  </v-sheet>

</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'ProfilePage',

  middleware: 'auth',

  data: () => ({
    usernameSelected: '',
    componentSelected: '',
    componentList: [
      'Infos', 'Friends', 'Match history', 'Stats',
    ]
  })
})
</script>

<style>
.v-window, .v-window__container, .v-window-item {
  height: inherit
}
</style>
