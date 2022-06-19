<template>
  <v-sheet height="100%">
    <v-toolbar>
      <v-tabs v-model="componentSelected">
        <v-tab v-for="component in componentList" :key="component">
          {{ component }}
        </v-tab>
      </v-tabs>
    </v-toolbar>
    <v-tabs-items v-model="componentSelected">
      <v-tab-item>
        <ProfileInfos />
      </v-tab-item>
      <v-tab-item>
        <ProfileFriends />
      </v-tab-item>
      <v-tab-item>
        <ProfileBlocked />
      </v-tab-item>
      <v-tab-item>
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
    componentList: ['Infos', 'Friends', 'Blocked', 'Match history'],
  }),

  computed: {
    componentSelected: {
      get(): number {
        return this.$store.state.selectedComponent
      },
      set(val: number) {
        this.$store.commit('SET_COMPONENT', val)
      },
    },
  },
})
</script>
