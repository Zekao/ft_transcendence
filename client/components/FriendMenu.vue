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
        <v-list-item-icon> 
            <v-btn :disabled="isMe || isBlockedByMe">
                <v-icon :disabled="friend.status === 'OFFLINE'"> mdi-sword-cross</v-icon> 
            </v-btn>
            <v-btn :disabled="isMe || isBlockedByMe">
                <v-icon color="friend.status !== 'OFFLINE' ? 'deep-purple accent-4' : 'grey'" >  mdi-message-outline </v-icon>
            </v-btn>
        </v-list-item-icon>
         <!-- :disabled="friend.status === 'OFFLINE'"> mdi-sword-cross </v-list-item-icon> -->
        <!-- <v-list-item-icon :color="friend.status !== 'OFFLINE' ? 'deep-purple accent-4' : 'grey'"> mdi-message-outline </v-list-item-icon>  -->
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
 
    // isFriend() {
    //     for (let i = 0; i < this.authUserFriends.length; i++) {
    //         if (this.authUserFriends[i].user_name === this.friend.user_name) {
    //             this.isfriend = true;
    //         }
    //         }
    // },
    //},
    
    // methods: { 
    //    @arg: this.friend.id => this.userID
    //     isAuthUserFriendWith(userID: string): boolean {
    //       return this.authUserFriends.filter(el => el.id === userID).length === 1
    //     }
    // },

})
</script>
