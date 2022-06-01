<template>
  <div class="podium">
    <h1 class="subheading grey--text">This is an podium page</h1>
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
          <div> {{item.user}} </div>
          <v-divider></v-divider>
        </v-flex>
         <v-flex xs3 sm2 md1>
          <div> {{item.win}} </div>
        <v-divider></v-divider>
        </v-flex>
         <v-flex xs3 sm2 md1>
          <div> {{item.lost}} </div>
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
export default { 
  data() {
    return {
      ranks: [
        { rank: 1, user: 'lusehair', win: 13, lost:2, ratio: 1.80}, 
        { rank: 2, user: 'clitorine', win: 10, lost:1, ratio: 1.73}, 
        { rank: 3, user: 'foutriquet', win: 9, lost:1, ratio: 1.70}, 
        { rank: 4, user: 'MacLahann', win: 30, lost:8, ratio: 0.80}, 
        { rank: 5, user: 'DEFCON', win: 10, lost:5, ratio: 0.5}, 
        { rank: 6, user: 'CAPCOM', win: 13, lost:9, ratio: 0.49}, 
        { rank: 7, user: 'Peter Strip', win: 0, lost:23, ratio: 0.03}

      ]
    }
  }
}
</script>

<style>
.rank {
  border-left: 4px solid black;
}

</style>