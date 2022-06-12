<template>
  <v-card height="calc(100% - 114px)" color="grey lighten-1">
    <div> 

      <v-card-title> {{redismessage}} </v-card-title>

                <v-card flat >
<v-card-text>
  <v-container>

    <v-row>
    <!-- PROFIL PICTURE  -->
    <v-col cols="6">
      <v-avatar size="250">
   <v-img :src="imagePath"></v-img>
    </v-avatar>
      </v-col>
            <!-- END OF PROFIL PICTURE  -->

  <!-- PSEUDO ZONE  -->
    <v-col cols="3">
  <h3>{{login}}</h3>
    </v-col>

      <v-col cols="3">
<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      persistent
      max-width="600px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          dark
          v-bind="attrs"
          v-on="on"
        >
          Edit pseudo
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">Edit Pseudo</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                cols="12"

              >
                <v-text-field
                  label="new pseudo"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
                        @click="dialog = false"

          >
            Close
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false" 
            v-model="newPseudo"

          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
      </v-col>


      <!-- EDIT PP  -->
      <v-col cols="12">
        <v-btn centered             
 >
          edit avatar
        </v-btn>
      </v-col>
      <!-- END OF EDIT PP -->

    </v-row>
  </v-container>

</v-card-text>
    </v-card>


    </div>
 <v-card color="grey lighten-1" class="d-flex justify-center align-center ma-6">
    <v-list width="420px">
      <v-list-item>
        <v-file-input
          accept="image/*"
          label="Pick an image on your computer"
        ></v-file-input>
      </v-list-item>
    </v-list>
  </v-card>
</v-card>
 
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
export default Vue.extend({
  name: 'ProfileInfos', 
  middleware: 'auth',
  data: () => ({
    dialog: false,
    newPseudo: '',
    wsdata: null,
    redismessage: '',
    name: 'ProfileInfos',


  }
  ),
    //})

  // function who create websocket with redis connection and recieve message from redis
  created() {
    console.log("Starting connection to Websocket Server")
    this.wsdata = new WebSocket('wss://echo.websocket.events') 

    this.wsdata.onmessage = (event) => { 
      this.redismessage = event.data; 
      console.log(event.data); 
      }

    this.wsdata.onopen = (event) => { 
     // console.log(event); 
      console.log('Successfully connected to Websocket Server'); 
    }
  }, 


  //  created() {
  //    try {
  //      const ws = new WebSocket('ws://localhost:3001/ws'); 
  //      ws.onmessage = {{data}} => {
  //        this.redismessage = data;
  //        console.log(this.redismessage); 
  //       }
  //      } catch(err) {
  //        console.log(err);
  //      }
  //     }
  

  computed: {
    ...mapState({
      login: (state: any): string => state.user.authUser.user_name,
      imagePath: (state: any): string => state.user.authUser.avatar, 
    }),
  },

  methods: { 

    // async editPseudo() {
    //        console.log(this.newPseudo)
    // try {
    //   await this.$store.dispatch('users/' + this.login + '/' + this.newPseudo, this.newPseudo)
    //   this.dialog = false
    // } catch (err) {
    //   console.log(err)
    // }   
    //   this.dialog = false
    // },
  }
  })
</script>
