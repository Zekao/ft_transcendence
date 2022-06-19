<template>
  <v-menu v-model="value" :close-on-content-click="false">
    <v-list>
      <v-list-item class="justify-center">
        <v-avatar class="mr-4">
          <v-img
            :src="'https://ft.localhost:4500/api/image/' + friend.avatar"
          />
        </v-avatar>
        <v-list-item-title> {{ friend.display_name }} </v-list-item-title>
      </v-list-item>
      <v-list-item class="justify-center">
        <v-list-item-content class="text-center">
          <v-list-item-title> Win : {{ friend.win }} </v-list-item-title>
        </v-list-item-content>
        <v-list-item-content class="text-center">
          <v-list-item-title> Lost : {{ friend.loose }} </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="!isMe" class="justify-center">
        <v-list-item-content> </v-list-item-content>
        <v-btn
          :disabled="friend.status !== 'ONLINE'"
          :loading="waitingGame"
          class="mr-2"
          @click="emitInvitation"
        >
          Play with
          <v-icon>mdi-sword-cross</v-icon>
        </v-btn>
      </v-list-item>
      <v-list-item v-if="!isMe" class="justify-center">
        <v-btn :disabled="isFriend" class="mr-2" @click="addFriend(friend.id)">
          Add
          <v-icon class="ml-2"> mdi-account-multiple-plus </v-icon>
        </v-btn>
        <v-btn :disabled="!isFriend" @click="removeFriend(friend.id)">
          Remove
          <v-icon class="ml-2"> mdi-account-multiple-remove </v-icon>
        </v-btn>
      </v-list-item>
      <v-list-item v-if="!isMe" class="justify-center">
        <v-btn :disabled="isBlockedByMe" class="mr-2" @click="block(friend.id)">
          Block
          <v-icon class="ml-2"> mdi-account-cancel </v-icon>
        </v-btn>
        <v-btn :disabled="!isBlockedByMe" @click="unblocked(friend.id)">
          Unblock
          <v-icon class="ml-2"> mdi-account-check </v-icon>
        </v-btn>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { NuxtSocket } from 'nuxt-socket-io'
import { IUser } from '@/store/user'
export default Vue.extend({
  name: 'FriendMenu',
  data: () => ({
    socket: null as NuxtSocket | null,
    isfriend: true,
    waitingGame: false,
  }),
  computed: {
    ...mapState({
      friend: (state: any): IUser => state.selectedUser,
      accessToken: (state: any): string => state.token.accessToken,
      userID: (state: any): string => state.user.authUser.id,
      authUserFriends: (state: any): IUser[] => state.user.authUserFriends,
      authUserBlocked: (state: any): IUser[] => state.user.authUserBlocked,
    }),
    value: {
      get(): boolean {
        return this.$store.state.isFriendMenu
      },
      set(value: boolean) {
        this.$store.commit('FRIEND_MENU', value)
      },
    },
    // ImaGhost()
    // {
    //   console.log(this.friend)
    //   if(!this.friend.id)
    //   {
    //     console.log(this.authUser)
    //     this.friend = this.authUser
    //   }
    // },
    // function who return true if friend id is the same as userID or false if not
    isMe(): boolean {
      // this.ImaGhost
      return this.friend.id === this.userID || !this.friend.id
    },
    // function who return true if friend id is in authUserFriends or false if not
    isFriend(): boolean {
      return (
        this.authUserFriends.find((friend) => friend.id === this.friend.id) !==
        undefined
      )
    },
    // function who return true if friend id is in authUserBlocked or false if not
    isBlockedByMe(): boolean {
      return (
        this.authUserBlocked.find((friend) => friend.id === this.friend.id) !==
        undefined
      )
    },
    canWatch(): boolean {
      return (
        this.friend.status === 'ONLINE' &&
        this.friend.in_game === 'IN_GAME' &&
        !this.isMe
      )
      // && this.authUserBlocked.find((friend) => friend.id === this.friend.id) == undefined && !this.isBlockedByMe
    },
  },
  mounted() {
    this.socket = this.$nuxtSocket({
      auth: {
        Authorization: this.accessToken,
      },
      path: '/api/socket.io/',
    } as any)
    this.socket.on('notification', (userID, status) => {
        if (status === 'connect') {
          if (this.friend.id !== userID) return
          const user = { ...this.friend}
          user.status = 'ONLINE'
          this.$store.commit('SELECTED_USER', user)
        } else if (status === 'disconnect') {
          if (this.friend.id !== userID) return
          const user = { ...this.friend}
          user.status = 'OFFLINE'
          this.$store.commit('SELECTED_USER', user)
        } else if (status === 'ingame') {
          if (this.friend.id !== userID) return
          const user = { ...this.friend}
          user.in_game = 'IN_GAME'
          this.$store.commit('SELECTED_USER', user)
        } else if (status === 'outgame') {
          if (this.friend.id !== userID) return
          const user = { ...this.friend}
          user.in_game = 'OUT_GAME'
          this.$store.commit('SELECTED_USER', user)
        }
      })
  },
  methods: {
    async block(userID: string) {
      try {
        await this.$store.dispatch('user/createAuthBlocked', userID)
      } catch (error) {
        console.log(error)
      }
    },
    async unblocked(userID: string) {
      try {
        await this.$store.dispatch('user/deleteAuthBlocked', userID)
      } catch (err) {
        console.log(err)
      }
    },
    async addFriend(userID: string) {
      try {
        await this.$store.dispatch('user/createAuthFriend', userID)
      } catch (err) {
        console.log(err)
      }
    },
    // function remove friend from authUserFriends
    async removeFriend(userID: string) {
      try {
        await this.$store.dispatch('user/deleteAuthFriend', userID)
      } catch (err) {
        console.log(err)
      }
    },
    emitInvitation() {
      if (this.socket) {
        this.waitingGame = true
        this.socket.emit('notification', 'invite', this.friend.user_name)
      }
    },
  },
})
</script>
