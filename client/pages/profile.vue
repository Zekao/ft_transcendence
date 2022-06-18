<template>
  <v-sheet height="100%">
    <v-toolbar>
      <v-tabs v-model="componentSelected">
        <v-tab v-for="component in componentList" :key="component">
          {{ component }}
        </v-tab>
      </v-tabs>
    </v-toolbar>
    <v-tabs-items :key="componentSelected" v-model="componentSelected">
      <v-tab-item key="Infos">
        <ProfileInfos />
      </v-tab-item>
      <v-tab-item key="Friends">
        <ProfileFriends />
      </v-tab-item>
      <v-tab-item key="Blocked">
        <ProfileBlocked />
      </v-tab-item>
      <v-tab-item key="Match history">
        <ProfileMatchhistory />
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
    componentSelected: '',
    componentList: ['Infos', 'Friends', 'Blocked', 'Match history'],
  }),
})
</script>
