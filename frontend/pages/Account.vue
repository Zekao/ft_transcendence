<template>
  <v-card class="mx-auto" max-width="1000" tile>
      <v-img height="200" src="https://cdn.vuetifyjs.com/images/cards/server-room.jpg"></v-img>
      <v-row style="margin:2.5%;position:absolute; top: 130px">
        <v-list-item>
         <v-list-item-avatar size="100">
            <img
              src="https://www.w3schools.com/howto/img_avatar.png"
              alt="John"
            >
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="title" style="margin-top:20px;">{{info.first_name}} {{info.last_name}}</v-list-item-title>
            <v-list-item-subtitle>Your Rank: {{info.rank}} | {{info.user_name}}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
    </v-row>
  </v-card>
</template>

<script>

import axios from 'axios'

export default {
  name: 'App',
  components: {History},
  data(){
    return {
      info: null,
    }
  },
mounted(){
  axios
  .get('http://localhost:3000/users/0b490f3f-fc29-4e25-af1b-4774d772ddea')
  .then(response => (this.info = response.data));
},
}

</script>
