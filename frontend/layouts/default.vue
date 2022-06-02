<template>
  <v-app class="blue">
    <MyNavbar />
    <!-- <v-content :aspect-ratio="16/9"> -->
     <v-content class="mx-4 mb-4">
     <router-view></router-view>
    </v-content>

  </v-app>
</template>

<script>

import MyNavbar from '@/components/MyNavbar'


export default {
  name: 'App',
  components: {MyNavbar},
  data(){
    return {
      //
    }
  }
}
</script>

