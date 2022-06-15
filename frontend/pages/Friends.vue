<template>
  <v-card>
    <v-toolbar
      text
                 background-color="deep-purple accent-4"
    >
      <v-toolbar-title >User Profile</v-toolbar-title>

    </v-toolbar>
    <v-tabs flat
        centered
            background-color="deep-purple accent-4"
>
<!-- SLIDEER  -->
      <v-tab>
        <v-icon left>
mdi-account-supervisor
        </v-icon>
        Account Setting
      </v-tab>
      <v-tab             v-on:click="getUsers()"
>
        <v-icon left>
mdi-account-supervisor
        </v-icon>
        Friends
      </v-tab>
      <v-tab>
        <v-icon left>
mdi-account-plus   </v-icon>
       Add Friend
      </v-tab>
      <v-tab>
        <v-icon left>
mdi-account-cancel
        </v-icon>
        Users Blocked
      </v-tab>

<!-- END SLIDER -->

     <!-- START OF ACCOUNT  -->
  <v-tab-item>
    <v-card flat >
<v-card-text>
  <v-container>
    <h3>Lusehair profil </h3>

    <v-row>
    <!-- PROFIL PICTURE  -->
    <v-col cols="6">
      <v-avatar size="250">
      <img
        src= 'http://localhost:3000/users/pon/avatar'
        alt="John">
    </v-avatar>
      </v-col>
            <!-- END OF PROFIL PICTURE  -->

  <!-- PSEUDO ZONE  -->
    <v-col cols="3">
  <h3>{{this.user.data.user_name}}</h3>
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
                  v-model="newPseudo"
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
            v-on:click="submit()"
            @click="dialog = false"
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
        <v-btn centered             v-on:click="getImage()"
 >
          edit avatar
        </v-btn>
      </v-col>
      <!-- END OF EDIT PP -->

    </v-row>
  </v-container>

</v-card-text>
    </v-card>
  </v-tab-item>

    <!-- START OF LIST OF FRIENDS  -->
     <v-tab-item>

       <v-card flat>
          <v-card-text>
            <v-list subheader>

      <v-list-item
        v-for="friend in users"
        :key="friend.id"
      >
              <v-badge  v-if="friend.status == 'online'" left color="green"/>
              <v-badge v-else left color="red"/>

        <!-- <v-list-item-avatar>
          <v-img
            :alt="`${friend.user} avatar`"
            :src="chat.avatar"
          ></v-img>
        </v-list-item-avatar> -->

        <v-list-item-content>
          <v-list-item-title v-text="friend.user_name"></v-list-item-title>
        </v-list-item-content>

        <v-list-item-content>
         win  <v-list-item-title v-text="friend.win"></v-list-item-title>
        </v-list-item-content>

         <v-list-item-content>
         lost  <v-list-item-title v-text="friend.lost"></v-list-item-title>
        </v-list-item-content>

        <v-list-item-content>
         ratio  <v-list-item-title v-text="friend.rank"></v-list-item-title>
        </v-list-item-content>

<!-- HISTORY BUTTON + MODAL  -->
        <v-list-item-icon>

  <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on">
         <v-icon :color="orange">mdi-clipboard-list</v-icon>
        </v-btn>
      </template>
     <v-card>
       <v-list-item
        v-for="chat in gamehistory"
        :key="chat.idGame"
      >
        <v-list-item-content>
         {{chat.player1}}  <v-list-item-title v-text="chat.score1"></v-list-item-title>
        </v-list-item-content>

        <v-list-item-content>
         {{chat.player2}} <v-list-item-title v-text="chat.score2"></v-list-item-title>
        </v-list-item-content>
        </v-list-item>
     </v-card>

    </v-dialog>
    <!-- END OF HISTORY + MODAL -->
        <!-- </v-btn> -->


      <!-- BUTTONS SEND MSG  -->
       <v-btn>
        <v-icon :color="user.status != 'offline' ? 'deep-purple accent-4' : 'grey'">
            mdi-message-outline
          </v-icon>
          </v-btn>
          <!-- END OF BUTTON SEND MSG  -->

          <!-- BUTTON PLAY WITH PLAYER -->
          <v-btn v-if="user.status == 'offline'" disabled>
            <v-icon :color="user.status != offline ? 'green' : 'grey'">          mdi-sword-cross </v-icon>
          </v-btn>

          <v-btn v-else>
            <v-icon :color="user.status == 'online' ? 'green' : 'grey'">          mdi-sword-cross </v-icon>
          </v-btn>
          <!-- END OF BUTTON PLAY WITH HIM  -->
        </v-list-item-icon>
      </v-list-item>
    </v-list>

          </v-card-text>
        </v-card>
      </v-tab-item>
      <!-- END OF LIST OF FRIENDS  -->
      <v-tab-item>
        <v-card
    color="grey lighten-4"
    flat
    height="200px"
    tile
  >
    <v-toolbar dense>

   <v-text-field
            label="Username"
            single-line
          ></v-text-field>
      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>


    </v-toolbar>
  </v-card>
      </v-tab-item>

     <!-- LIST OF BLOCKED USER  -->
     <v-tab-item>
        <v-card flat>
          <v-card-text>
           <v-list subheader>

      <v-list-item v-for="chat in users" :key="chat.status">
        <v-list-item-avatar>
          <v-img :alt="`${chat.title} avatar`" :src="chat.avatar" ></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
         <v-list-item-title v-text="chat.pseudo_name"></v-list-item-title>
        </v-list-item-content>

        <v-list-item-icon>
        <v-btn color="error" @click="deleteItem(chat)">         <v-icon >
mdi-account-off
          </v-icon>
          </v-btn>

        </v-list-item-icon>
      </v-list-item>
    </v-list>
          </v-card-text>
        </v-card>
      </v-tab-item>
      {{avatar}}
      <!-- END OF LIST OF BLOCKED USER  -->
    </v-tabs>
  </v-card>
</template>

<script>
import axios from 'axios'
  export default {
    data () {
      return {
        newPseudo: null,
        user: null,
        avatar: '../test.jpg',
        dialog: false,
        headers: [
          {
            text: 'rank',
            align: 'start',
            sortable: false,
            value: 'rank',
          },
          { text: 'Player', value: 'user' },
          { text: 'Wins Games', value: 'win' },
          { text: 'Losts Games', value: 'lost' },
          { text: 'ratio', value: 'ratio' },
        ],
        users: [
        { rank: 1, user: 'lusehair', win: 13, lost:2, ratio: 1.80, status:'online'},
        { rank: 2, user: 'clitorine', win: 10, lost:1, ratio: 1.73},
        { rank: 3, user: 'foutriquet', win: 9, lost:1, ratio: 1.70},
        { rank: 4, user: 'MacLahann', win: 30, lost:8, ratio: 0.80},
        { rank: 5, user: 'DEFCON', win: 10, lost:5, ratio: 0.5},
        { rank: 6, user: 'CAPCOM', win: 13, lost:9, ratio: 0.49},
        { rank: 7, user: 'Peter Strip', win: 0, lost:23, ratio: 0.03}
        ],
      gamehistory: [
        { idGame: 1, player1: 'lusehair', player2: 'sobriquet', score1: 3, score2: 1},
        { idGame: 2, player1: 'lusehair', player2: 'camaru', score1: 2, score2: 3},
        { idGame: 3, player1: 'lusehair', player2: 'doliprane', score1: 3, score2: 1},
        { idGame: 4, player1: 'lusehair', player2: 'morrety', score1: 3, score2: 1},
        { idGame: 5, player1: 'lusehair', player2: 'camron', score1: 1, score2: 3},
        { idGame: 6, player1: 'lusehair', player2: 'fulli', score1: 3, score2: 1},
      ],
      }
    },
  mounted(){
  axios
  .get('http://localhost:3000/users/pon')
  .then((reponse) => {
    this.user = reponse;
    console.log(this.user)
  });
  // axios.get('http://localhost:3000/users/' + this.user.id + '/avatar/path')
    // axios.get('http://localhost:3000/users/pon/avatar/path')
    //   .then(response => {

    //     avatar = response.data;
    //     //console.log(this.avatar);
    //   });
  },
      //     data () {
      // return {
      //   user: null
      // };
      //   },

methods:{
  async submit(){
        console.log(this.newPseudo);
   let prefix  = "http://www.localhost:3000/users/";
    let suffix = "/username?username=";
    let id = this.user.data.id;
    console.log(this.newPseudo);
      axios.patch(prefix + id + suffix + this.newPseudo, { username: this.newPseudo })     .then(response => {
      console.log(response);
      if (response.status == 209) {
        this.dialog = false;
        this.newPseudo = null;
      }
       else {
      this.user.user_name = this.newPseudo
}
    })

  },
  async getUsers() {
    axios.get('http://localhost:3000/users')
      .then(response => {
        this.users = response.data;
      })
  console.log(this.users);
  const index = this.users.indexOf(this.user);
  console.log(index);
  this.users.splice(index, 1);
  },
  // function get image with axios get request and set it to the avatar of the user
  // async getImage(user) {
  //   axios.get('http://localhost:3000/users/' + this.user.id + '/avatar')
  //     .then(response => {
  //       this.user.avatar = response.data;
  //     })
  // },

}
}


</script>
