<template>
  <div>
    <v-card :height="height" color="#333333">
      <canvas ref="game" height="720" width="1080" color="blue lighten-1">
      </canvas>
    </v-card>
  </div>
</template>

<script lang="ts">
import V from 'vue'
import { mapState } from 'vuex'
import { NuxtSocket } from 'nuxt-socket-io'

// keybinds that the user will use
export default V.extend({
  // <p>
  //   <v-btn color="primary" @click="$emit('next')"> Quit Match </v-btn>
  // </p>
  name: 'BlockGame',

  data: () => ({
    socket: null as NuxtSocket | null,
    context: {} as any, // canvas context
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
  }),

  computed: {
    ...mapState({
      accessToken: (state: any) => state.token.accessToken,
      selectedMatchId: (state: any) => state.selectedMatchId,
    }),
    height() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return 120
        case 'sm':
          return 360
        case 'md':
          return 720
        case 'lg':
          return 720
        case 'xl':
          return 720
      }
    },
  },

  watch: {
    selectedMatchId(value: string) {
      if (value) {
        this.socket = this.$nuxtSocket({
         channel: '/game',
         auth: {
           Authorization: this.accessToken,
           game: this.selectedMatchId,
         },
         path: '/api/socket.io/',
       } as any)
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
        })
      }
    }
  },

  mounted() {
    this.context = (this.$refs.game as any).getContext('2d')
    // this.context.fillRect(this.position.x, this.position.y, 20, 20);
    console.log('both values:', this.position.x, this.position.y)
  },

  shortcuts: {
    keydown(event) {
      if (event.key === 'w') {
        this.move('up')
      } else if (event.key === 's') {
        this.move('down')
      } else if (event.key === 'Escape') {
        this.move('stop')
      }
      return false // stop alias calling
    },
    cancel() {
      console.log('escape key pressed')
      return false // stop propagation
    },
  },

  methods: {
    keyb(val: any) {
      if (this.socket) {
        console.log('both values:', this.position.x, this.position.y)
        this.context.fillRect(this.position.x, this.position.y, 20, 120) // fonctionne pas va savoir pourquoi
        this.socket.emit('customBinding', val)
      }
    },
    move(direction: string) {
      if (direction == 'up') {
        console.log('up pressed')
      } else if (direction == 'down') {
        console.log('down pressed')
      } else if (direction == 'stop') {
        console.log('stop pressed -> user supposed to leave')
      }
      if (this.socket) {
        this.socket.emit('move', direction)
      }
    },
  },
})
</script>

<style scoped></style>
