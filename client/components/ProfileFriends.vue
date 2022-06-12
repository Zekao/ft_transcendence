<template>
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
          login
          <v-list-item-title v-text="user.user_name"></v-list-item-title>
        </v-list-item-content>

        <v-list-item-content>
         win  <v-list-item-title v-text="user.win"></v-list-item-title>
        </v-list-item-content>

        <v-list-item-content>
         lost  <v-list-item-title v-text="user.loose"></v-list-item-title>
        </v-list-item-content>

        <v-list-item-content>
         rank #  <v-list-item-title v-text="user.rank"></v-list-item-title>
        </v-list-item-content>

                <v-list-item-icon>

  <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on">
         <v-icon :color="orange">mdi-clipboard-list</v-icon>
        </v-btn>
      </template>
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


      <!-- BUTTONS SEND MSG  -->
       <v-btn>
        <v-icon :color="user.status != 'OFFLINE' ? 'deep-purple accent-4' : 'grey'">
            mdi-message-outline
          </v-icon>
          </v-btn>
          <!-- END OF BUTTON SEND MSG  -->

          <!-- BUTTON PLAY WITH PLAYER -->
          <v-btn v-if="user.status == 'OFFLINE'" disabled>
            <v-icon :color="user.status != 'OFFLINE' ? 'green' : 'grey'">          mdi-sword-cross </v-icon>
          </v-btn>

          <v-btn v-else>
            <v-icon :color="user.status == 'ONLINE' ? 'green' : 'grey'">          mdi-sword-cross </v-icon>
          </v-btn>
          <!-- END OF BUTTON PLAY WITH HIM  -->
        <v-btn>
          <v-icon color="red"> mdi-delete</v-icon>
        </v-btn>
        </v-list-item-icon>

      </v-list-item>
    </v-list>
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
