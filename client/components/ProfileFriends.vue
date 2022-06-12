<template>
  <v-card height="calc(100% - 114px)" color="grey lighten-1" class="ma-6">
        <v-toolbar rounded="0">
      <v-text-field
          v-model="usernameSelected"
          prepend-icon="mdi-magnify"
          label="Login"
          outlined
          dense
          hide-details
          class="mr-2"/>
        <v-btn outlined class="mr-2" @click="usernameSelected = ''">
          Search
        </v-btn>
        <v-btn outlined @click="usernameSelected = ''">
          Clear
        </v-btn>
    </v-toolbar>
        <!-- <v-card height="calc(100% - 64px)" color="#00000000" class="d-flex justify-center align-center"> -->

  <v-card
    height="calc(100% - 114px)"
    color="grey lighten-1"
    class="d-flex justify-center align-center ma-6"
  >
    <v-progress-circular
      v-if="$fetchState.pending"
      indeterminate
      color="primary"
    ></v-progress-circular>
    <v-list v-else-if="$fetchState.error">
      <v-list-item dense>Failed to load friend list.</v-list-item>
    </v-list>
    <v-list v-else-if="!authUserFriends.length">
      <v-list-item dense>No friends yet.</v-list-item>
    </v-list>
    <v-list v-else >
      <v-list-item v-for="(user, i) in authUserFriends" :key="i" subheader>

        <v-badge  v-if="user.status == 'ONLINE'" left color="green"/>
        <v-badge v-else left color="red"/>

        <v-list-item-avatar>
          <v-img :src="user.avatar"></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
        
        <FriendMenu :friend = user />
        </v-list-item-content>

                <v-list-item-icon>

  <v-dialog v-model="dialog" width="500">
       <!-- <v-btn v-bind="attrs" v-on="on">
         <v-icon :color="orange">mdi-clipboard-list</v-icon>
        </v-btn> -->
     <!-- <v-card>
       <v-list-item
        v-for="chat in gamehistory"
        :key="chat.idGame"
      >
        <v-list-item-content>
         {{chat.player1}}  <v-list-item-title v-text="chat.score1"></v-list-item-title>
        </v-list-item-content>

        <v-list-item-content>
         {{chat.player2}} <v-list-item-title v-text="chat.score2"></v-list-item-title>
        </v-list-item-content>
        </v-list-item>
     </v-card> -->

    </v-dialog>
    <!-- END OF HISTORY + MODAL -->
        <!-- </v-btn> -->
        <v-btn>
          <v-icon color="red"> mdi-delete</v-icon>
        </v-btn>
        </v-list-item-icon>

      </v-list-item>
    </v-list>
  </v-card>
 </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { IUser } from '@/store/user'

export default Vue.extend({
  name: 'ProfileFriends',

  data: () => ({
    authUserFriends: [
      { user_name: 'Test1', display_name: 'TEST1', avatar: 'https://ft.localhost:4500/api/image/gamarcha.png', win: 2, loose: 1, rank: 9 },
      { user_name: 'Test2', display_name: 'TEST2', avatar: 'https://ft.localhost:4500/api/image/gamarcha.png', win: 2, loose: 1, rank: 9 },
    ],
  }),

  // computed: {
  //   ...mapState({
  //     authUserFriends: (state: any): IUser[] => state.user.authUserFriends,
  //   }),
  // },

  async fetch() {
    await this.$store.dispatch('user/fetchAuthFriends')
  },
})
</script>
