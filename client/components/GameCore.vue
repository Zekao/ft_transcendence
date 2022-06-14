<template>
  <div>
    <canvas
      ref="game"
      height="calc(100% - 76px)"
      width="600px"
      color="grey lighten-1"
      class="d-flex justify-center align-center"
      style="border: 1px solid black;">
    </canvas>
    <p>
      <button @click="move('up')">Up</button>
      <button @click="move('down')">Down</button>
    </p>
  </div>
</template>

<script lang="ts" >
import Vue from 'vue'
import { mapState } from 'vuex'
import { NuxtSocket } from 'nuxt-socket-io'

export default Vue.extend({
      name: 'BlockGame',
      data()  {
        return {
          socket: null as NuxtSocket | null,
          context: {}, // canvas context
          position: {
            x: 0,
            y: 0
          }
        }
      },

      computed: {
        ...mapState({
      accessToken: (state: any) => state.token.accessToken,
      })
      },

      mounted() {
        // this.context = this.$refs.game.getContext("2d");
        this.socket = this.$nuxtSocket({
          channel: "/game",
          extraHeaders: {
            Authorization: this.accessToken,
            game: "c69c46a9-9f73-44e8-8a74-04e34f1865fe",
          },
          path: "/api/socket.io/",
        })
        this.socket.on("position", data => {
          this.position = data;
          // this.context.clearRect(0, 0, this.$refs.game.width, this.$refs.game.height);
          this.context.fillRect(this.position.x, this.position.y, 20, 20);
        });
      },
      methods: {
        move(direction) {
          console.log("MOVE")
          this.socket.emit("move", direction);
        }
      }
  })
</script>

<style scoped></style>
