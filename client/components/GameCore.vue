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
      player2: 0,
    },
    position: {
      x: 0,
      y: 250,
    },
    position2: {
      x: 850,
      y: 250,
    },
    ball: {
      x: 420,
      y: 400,
      radius: 10,
    },
    direction: {
      x: 1,
      y: 1,
    },
    velocity: {
      speed: 0.00005,
    },
  }),
  computed: {
    ...mapState({
      accessToken: (state: any) => state.token.accessToken,
      selectedMatchId: (state: any) => state.selectedMatchId,
      color: (state: any): string => state.user.authUser.color,
      backgroundColor: (state: any): string => state.user.authUser.backgroundColor,
    }),
    height() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return 120
        case 'sm':
          return 720
        case 'md':
          return 720
        case 'lg':
          return 720
        case 'xl':
          return 720
      }
    },
    width() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return 580
        case 'sm':
          return 580
        case 'md':
          return 580
        case 'lg':
          return 580
        case 'xl':
          return 580
      }
    },
  },
  watch: {
    selectedMatchId(value: string) {
      this.socketInit(value)
    },
  },
  mounted() {
    this.context = (this.$refs.game as any).getContext('2d')
    this.context.clearRect(0, 0, 1080, 1920)
    this.socketInit(this.selectedMatchId)
  },
  shortcuts: {
    keydown(event) {
      if (
        event.key === 'w' &&
        (this.position.y >= 13 || this.position2.y >= 13)
      )
        this.move('up')
      else if (
        event.key === 's' &&
        (this.position.y <= 585 || this.position2.y <= 585)
      )
        this.move('down')
      return false // stop alias calling
    },
    cancel() {
      // a utiliser si un joueur deco mais je le fais plus tard la je vais rompich ++
      return false // stop propagation
    },
  },
  methods: {
    updateContent() {
      this.context.clearRect(0, 0, 1080, 1920)
      this.context.fillStyle = this.backgroundColor
      this.context.font = '30px Arial'
      this.context.fillText(this.score.player1, 370, 50)
      this.context.fillRect(420, 0, 3, 1000)
      this.context.fillText(this.score.player2, 460, 50)
      this.context.fillStyle = this.color
      this.context.fillRect(this.position.x, this.position.y, 20, 120)
      this.context.fillRect(this.position2.x, this.position2.y, 20, 120)
      this.moveBall()
      if (this.socket) this.socket.emit('gameAction', 'updateBall')
    },
    // fonction de mouvement de la balle
    clearCircle(x: number, y: number, r: number) {
      for (let i = 0; i < Math.round(Math.PI * r); i++) {
        const angle = (i / Math.round(Math.PI * r)) * 360
        this.context.clearRect(
          x,
          y,
          Math.sin(angle * (Math.PI / 180)) * r,
          Math.cos(angle * (Math.PI / 180)) * r
        )
      }
    },
    endGame() {
      this.context.clearRect(0, 0, 1080, 1920)
      this.clearCircle(this.ball.x, this.ball.y, this.ball.radius)
      this.context.font = '30px Arial'
      this.context.fillText('THE GAME IS FINISHED', 370, 50)
    },
    moveBall() {
      if (this.ball.x === 420 || this.ball.y === 400)
        return ;
      this.context.arc(this.ball.x, this.ball.y, 15, 0, 2 * Math.PI) // TO PUT IN FUNCTION CALL WHEN DATA IS SEND
      this.context.fill()
      this.context.restore()
      this.context.closePath()
      this.context.beginPath()
    },
    move(direction: string) {
      if (this.socket) this.socket.emit('move', direction)
    },

    // SOCKET INIT
    socketInit(matchID: string) {
      if (matchID) {
        this.socket = this.$nuxtSocket({
          channel: '/game',
          auth: {
            Authorization: this.accessToken,
            game: this.selectedMatchId,
          },
          path: '/api/socket.io/',
        } as any)
        this.socket.on('move', (data, boolplayer) => {
          if (boolplayer === 1) {
            if (this.position.y !== data) this.position.y = data
          } else if (boolplayer === 2) {
            if (this.position2.y !== data) this.position2.y = data
          }
        }),
          this.socket.on('gameAction', (data, x, y) => {
            if (data === 'moveBall') {
              this.ball.x = x
              this.ball.y = y
            } else if (data === 'FINISH') {
              this.endGame()
              this.$store.commit('MATCH_DONE', true)
              this.$emit('next')
            } else if (data === 'addOne') this.score.player1 += 1
            else if (data === 'addTwo') this.score.player2 += 1
            else if (data === "Give up") {
              this.context.clearRect(0, 0, 1080, 1920)
              this.$store.commit('MATCH_DONE', true)
              this.$emit('next')
            }
          })
          setInterval(this.updateContent, 17)
      }
    }
  },
})
</script>

<style scoped></style>
