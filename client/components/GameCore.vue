<template>
  <div>
      <v-card :height="height" color="#B686D6">
      <canvas
        ref="game"
        height="720"
        width="1080"
        color="blue lighten-1">
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
          position: {
            x: 10,
            y: 50
          }
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
          console.log("both values:", this.position.x, this.position.y);
          // this.context.fillRect(this.position.x, this.position.y, 20, 20);
        this.socket = this.$nuxtSocket({
          channel: "/game",
          auth: {
            Authorization: this.accessToken,
            game: "07efe7b3-207e-48f5-a47d-b64a22a9d37c",
          },
          path: "/api/socket.io/",
        })
        this.socket.on('move', data => {
          console.log('data :', data);
          // if (data >= 0)
            this.position.y = data;
          // else
            // data = 0;
          // if (data <= 600)
            // this.position.y = data;
          // else
            // data = 600;
          this.context.clearRect(0, 0, 720, 1080);
          this.context.fillRect(this.position.x, this.position.y, 20, 120);
        });
        console.log("both values:", this.position.x, this.position.y);
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
            this.context.fillRect(this.position.x, this.position.y, 20, 120); // fonctionne pas va savoir pourquoi
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
