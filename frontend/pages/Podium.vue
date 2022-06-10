<template>
  <div class="podium">
    <h1 class="subheading grey--text">This is the podium page</h1>
  <v-container class="my-1">
    <v-card flat class="pa-3">
      <v-layout row wrap>
         <v-flex xs12 md1>
          <div class="caption grey--text"> Rank </div>
        </v-flex>
        <v-flex xs6 sm4 md3>
          <div class="caption grey--text"> Players </div>
        </v-flex>
         <v-flex xs3 sm2 md1>
          <div class="caption grey--text"> Win </div>
        </v-flex>
         <v-flex xs3 sm2 md1>
          <div class="caption grey--text"> Lost </div>
        </v-flex>
         <v-flex xs3 sm2 md1>
          <div class="caption grey--text"> Ratio </div>
        </v-flex>
      </v-layout>
          </v-card>
      <v-layout row wrap v-for="item in ranks" :key="item.rank" :class="'pa-3 rank'">

       <v-flex xs12 md1>
          <div> {{item.rank}} </div>
          <v-divider></v-divider>
        </v-flex>
        <v-flex xs6 sm4 md3>
          <div> {{item.user_name}} </div>
          <v-divider></v-divider>
        </v-flex>
         <v-flex xs3 sm2 md1>
          <div> {{item.win}} </div>
        <v-divider></v-divider>
        </v-flex>
         <v-flex xs3 sm2 md1>
          <div> {{item.loose}} </div>
          <v-divider></v-divider>
        </v-flex>
         <v-flex xs3 sm2 md1>
          <div> {{item.ratio}} </div>
          <v-divider></v-divider>
        </v-flex>
      </v-layout>
  </v-container>
    </div>

</template>

<script>

import axios from 'axios'

export default {
  data() {
    return {
      ranks: []
    }
  },
  mounted(){
    axios
    .get('http://localhost:3000/users/ranklist')
    .then(response => (this.ranks = response.data));
  },
}
</script>

<style>
.rank {
  border-left: 4px solid black;
}

</style>
