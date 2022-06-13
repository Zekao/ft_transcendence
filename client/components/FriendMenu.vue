<template>
<v-menu
      top
      :offset-x="offset"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          dark
          v-bind="attrs" 
          v-on="on"
        >
          {{friend.user_name}}
        </v-btn>
      </template>

      <v-list>
        <v-list-item> Win : {{friend.win}} </v-list-item>
        <v-list-item> Lost : {{friend.loose}} </v-list-item>
        <v-list-item>  Rank : {{friend.rank}} </v-list-item>
        <v-list-item-icon> 
            <v-btn>
                <v-icon :disabled="friend.status === 'OFFLINE'"> mdi-sword-cross</v-icon> 
            </v-btn>
            <v-btn>
                <v-icon color="friend.status !== 'OFFLINE' ? 'deep-purple accent-4' : 'grey'">  mdi-message-outline </v-icon>
            </v-btn>
        </v-list-item-icon>
      </v-list>
    </v-menu>


</template>

<script lang="ts">
export default { 
 name: 'FriendMenu',  
    props: {
        friend: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            offset: true
        }
    }
}
</script>
