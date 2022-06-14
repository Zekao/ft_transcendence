<template>
<v-menu
      top
      :offset-x="offset"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          dark
          v-bind= attrs 
          v-on= "on" 
          :disabled="isBlockedByMe" 

        >
          {{friend.user_name}}
        </v-btn>
      </template>

      <v-list>
        <v-list-item> Win : {{friend.win}} </v-list-item>
        <v-list-item> Lost : {{friend.loose}} </v-list-item>
        <v-list-item>  Rank : {{friend.rank}} </v-list-item>
        <v-list-item> 
            <v-btn :disabled="isMe">
              Play with {{friend.user_name}} 
                <v-icon :disabled="friend.status === 'OFFLINE'"> mdi-sword-cross</v-icon> 
            </v-btn>
        </v-list-item>
        <v-list-item>
            <v-btn :disabled="isMe">
            chat with {{friend.user_name}}
                <v-icon color="friend.status !== 'OFFLINE' ? 'deep-purple accent-4' : 'grey'" >  mdi-message-outline </v-icon>
            </v-btn>
        </v-list-item>
        <v-list-item>
            <v-btn  :disabled="isBlockedByMe"  @click="block(friend.id)">
            Block
            <v-icon> mdi-block-helper </v-icon>
             </v-btn>
             <v-btn :disabled="!isBlockedByMe"  @click="unblocked(friend.id)">
             Unblock
            <v-icon> mdi-block-helper-remove </v-icon>
              </v-btn>
                        </v-list-item>
          <v-list-item :disabled="!isBlockedByMe">
            <v-btn :disabled="isFriend" @click="addFriend(friend.id)">
              Add 
              <v-icon>
                mdi-account-multiple-plus
              </v-icon>
                          </v-btn>

               <v-btn :disabled="!isFriend" @click="removeFriend(friend.id)">
              Remove 
              <v-icon>
                mdi-account-multiple-plus
              </v-icon>
                            </v-btn>

            </v-list-item>
                <v-list-item>
           
            </v-list-item>


      </v-list>
    </v-menu>


</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { IUser } from '@/store/user'
export default Vue.extend({ 
  
 name: 'FriendMenu',  
    props: {
        friend: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            offset: true,
            isfriend: true, 
        }
    },

    computed: {
       ...mapState({
      authUserFriends: (state: any): IUser[] => state.user.authUserFriends,
      userID: (state: any): string => state.user.authUser.id, 
      authUserBlocked: (state: any): IUser[] => state.user.authUserBlocked,
    }),

    // function who return true if friend id is in authUserFriends or false if not
    isFriend() {
        return this.authUserFriends.find(friend => friend.id === this.friend.id) !== undefined
    },

    // function who return true if friend id is the same as userID or false if not
    isMe() {
        return this.friend.id === this.userID 
    }, 

    // function who return true if friend id is in authUserBlocked or false if not
    isBlockedByMe() {
        return this.authUserBlocked.find(friend => friend.id === this.friend.id) !== undefined
    },
    },

    methods: {
  async block(userID: string)
  {
    try {
    await this.$store.dispatch('user/createAuthBlocked', userID) 
    }
    catch(error) {
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
            await this.$store.dispatch('user/createAuthFriends', userID)
        } catch (err) {
            console.log(err)
        }
    },

    // function remove friend from authUserFriends
    async removeFriend(userID: string) {
        try {
            await this.$store.dispatch('user/deleteAuthFriends', userID)
        } catch (err) {
            console.log(err)
        }
    },
  },
    

})
</script>
