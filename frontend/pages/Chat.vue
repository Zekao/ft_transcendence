
<template>
  <div class="chat">
    <h1 class="subheading grey--text">This is an chat page</h1>
  <v-container class="my-5">
   <v-layout row wrap justify-end>
     <v-flex xs12 md5 >

       <v-btn outline block class="primary" >
         <v-icon left> mdi-chat-plus-outline </v-icon> <span>Create channel </span>
        </v-btn>

        <v-btn outline block class="warning">
         <v-icon left> mdi-incognito-off </v-icon> <span>Join Private Channel </span>
       </v-btn>

     </v-flex>
   </v-layout>
  </v-container>
  </div>
</template>

<script>
export default {
}
</script>
