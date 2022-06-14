<template>
  <div>
    <canvas
      ref="game"
      height="calc(100% - 76px)"
      width="600px"
      color="grey lighten-1"
      class="d-flex justify-center align-center"
      style="border: 3px solid black;">
    </canvas>
    <p>
      <v-btn color="primary" @click="$emit('next')"> Quit Match </v-btn>
    </p>
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
      name: 'BlockGame',
      data()  {
        return {
          socket: null as NuxtSocket | null,
          context: {}, // canvas context
          position: {
            x: 50,
            y: 50
          }
        }
      },
      computed: {
          ...mapState({
        accessToken: (state: any) => state.token.accessToken,
        })
      },
      mounted() {
          this.context = this.$refs.game.getContext("2d");
          console.log("both values:", this.position.x, this.position.y);
          // this.context.fillRect(this.position.x, this.position.y, 20, 20);
        this.socket = this.$nuxtSocket({
          channel: "/game",
          extraHeaders: {
            Authorization: this.accessToken,
            game: "300349ec-86b8-48b0-af02-eb31e415fea3",
          },
          path: "/api/socket.io/",
        })
        this.socket.on('move', data => {
          this.position = data;
        this.context.fillRect(this.position.x, this.position.y, 20, 20); // fonctionne pas va savoir pourquoi
        });
          // this.context.clearRect(0, 0, this.$refs.game.width, this.$refs.game.height);
        console.log("both values:", this.position.x, this.position.y);
      },
      shortcuts: {
        keydown: function (event) {
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
        cancel: function () {
            console.log('escape key pressed')
            return false // stop propagation
        },
      },
       methods: {
        keyb(val) {
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