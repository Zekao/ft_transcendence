<template>
  <div>
      <v-card :height="height" color="#333333">
      <canvas
        ref="game"
        height="720"
        width="1080">
      </canvas>
    </v-card>
  </div>
  
</template>

<script lang="ts" >
import Vue from 'vue'
import { mapState } from 'vuex'
import { NuxtSocket } from 'nuxt-socket-io'
import VueKeybindings from 'vue-keybindings'
  Vue.use(VueKeybindings, {
      alias: {
          Up: ['w'],
          Down: ['s'],
          Escape: ['Escape']
      }
  })
// keybinds that the user will use
export default Vue.extend({
    // <p>
    //   <v-btn color="primary" @click="$emit('next')"> Quit Match </v-btn>
    // </p>
      name: 'BlockGame',
      data()  {
        return {
          socket: null as NuxtSocket | null,
          context: {}, // canvas context
          score: {
            player1: 0,
            player2: 0
          },
          position: {
            x: 10,
            y: 50
          },
          position2: {
            x: 840,
            y: 10
          },
          ball: {
            x: 500,
            y: 500,
            radius: 10,
          },

        }
      },
      computed: {
          ...mapState({
        accessToken: (state: any) => state.token.accessToken,
        }),
        height () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return 120
          case 'sm': return 360
          case 'md': return 720
          case 'lg': return 720
          case 'xl': return 720
        }
        }
      },
      mounted() {
          this.context = this.$refs.game.getContext("2d");
          // console.log("both values:", this.position.x, this.position.y);
          // this.context.fillRect(this.position.x, this.position.y, 20, 20);
        this.socket = this.$nuxtSocket({
          channel: "/game",
          auth: {
            Authorization: this.accessToken,
            game: "614d9a89-feff-44ac-be08-883735d1cde7",
          },
          path: "/api/socket.io/",
        })
        this.socket.on('move', (data, data2) => {
          // console.log('======== DIFFERENT VALUES ========');
          // console.log('data is:', data);
          // console.log('data2 is:', data2);
          // console.log('======== DIFFERENT VALUES ========');
            if (this.position.y != data) {
                this.position.y = data;
            }
            else if (this.position2.y != data2) {
                this.position2.y = data2;
            }
            // a voir pour mettre tout ca dans une fonction direct car c'est juste l'affichage // 
            this.context.clearRect(0, 0, 1080, 1920);
            this.context.fillStyle = "white";
            this.context.font = "30px Arial";
            this.context.fillText(this.score.player1, 370, 50);
            this.context.fillRect(420, 0, 3, 1000);
            this.context.fillText(this.score.player2, 460, 50);
            this.context.fillStyle = "grey";
            this.context.fillRect(this.position.x, this.position.y, 20, 120);
            this.context.fillRect(this.position2.x, this.position2.y, 20, 120);
            // a voir pour mettre tout ca dans une fonction direct car c'est juste l'affichage // 
            if (this.score.player1 >= 5) {
                this.context.clearRect(0, 0, 1080, 1920);
                this.$emit('next')
            }
            else if (this.score.player2 >= 5) {
                this.context.clearRect(0, 0, 1080, 1920);
                this.$emit('next')
            }
        });
      },
      shortcuts: {
        keydown (event) {
          if (event.key === 'w') {
              this.move('up');
          }
          else if (event.key === 's') {
            this.move('down');
          }
          else if (event.key === 'Escape') {
            this.move('stop');
          }
          return false // stop alias calling
        },
        cancel () {
            console.log('escape key pressed')
            return false // stop propagation
        },
      },
       methods: {
        keyb(val) {
             this.context.clearRect(0, 0, 720, 1080);
            // this.context.fillRect(this.position.x, this.position.y, 20, 120); // fonctionne pas va savoir pourquoi
            console.log("both values:", this.position.x, this.position.y);
             this.socket.emit('customBinding', val);
        },
        move(direction) {
          if (direction == 'up') {
            console.log('up pressed');
          }
          else if (direction == 'down') {
            console.log('down pressed');
          }
          else if (direction == 'stop') {
            console.log('stop pressed -> user supposed to leave');
          }
          this.socket.emit("move", direction);
        }
      }
  })
</script>

<style scoped></style>
