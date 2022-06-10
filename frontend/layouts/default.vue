<template>
  <v-app class="blue">
    <MyNavbar />
     <v-main class="mx-4 mb-4">
     <router-view></router-view>
    </v-main>

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

