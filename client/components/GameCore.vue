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
      <button @:click="move('up')">Up</button>
      <button @:click="move('down')">Down</button>
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { NuxtSocket } from 'nuxt-socket-io'
import { IUser } from '@/store/user'

export default Vue.extend({

  props: {
    user: Object as () => IUser
  },

  data: () => ({
    context: {},
    position: {
    x: 0,
    y: 0
    },
    socket: null as NuxtSocket | null,
  }),

  computed: {
    ...mapState({
      authUser: (state: any) => state.user.authUser,
      accessToken: (state: any) => state.token.accessToken,
    })
  },

  mounted() {
    this.socket = this.$nuxtSocket({
      channel: "/game",
      extraHeaders: {
        Authorization: this.accessToken,
        game: "1",
      },
      path: "/api/socket.io/",
    })
    this.socket.on("position", data => {
    this.position = data;
    console.log('new datas:', data);
    // this.context.clearRect(0, 0, this.$refs.game.width, this.$refs.game.height);
    // this.context.fillRect(this.position.x, this.position.y, 20, 20);
    });
  },

  methods: {
    move(direction: string) {
      this.socket.emit("move", direction);
    }
  }
})
</script>
