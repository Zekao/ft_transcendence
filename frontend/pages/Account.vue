<template>




</template>

<script>

import axios from 'axios'

export default {
  name: 'App',
  components: {History},
  data(){
    return {
      users: null, 
    }
  },
mounted(){
  axios 
  .get('http://localhost:3000/users')
  .then((reponse) => {
    this.users = reponse;
    console.log(this.users)
  });
},
}

</script>
