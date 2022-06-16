<template>
  <div>
      <v-card :height="height" width="width" color="#333333">
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
            x: 0,
            y: 250
          },
          position2: {
            x: 850,
            y: 250
          },
          ball: {
            x: 500,
            y: 500,
            radius: 10,
          },
          direction: {
            x: 1,
            y: 1
          },
          velocity:
          {
            speed: 0.00005,
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
          case 'sm': return 720
          case 'md': return 720
          case 'lg': return 720
          case 'xl': return 720
          }
        },
         width () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return 580
          case 'sm': return 580
          case 'md': return 580
          case 'lg': return 580
          case 'xl': return 580
          }
        },
      },
      mounted() {
          this.context = this.$refs.game.getContext("2d");
          this.context.clearRect(0, 0, 1080, 1920);
          this.socket = this.$nuxtSocket({
            channel: "/game",
            auth: {
              Authorization: this.accessToken,
              game: "2b74374f-913b-497a-83a3-1bdc74c0113b",
            },
            path: "/api/socket.io/",
        })
        this.socket.on('move', (data, data2) => {
            if (this.position.y != data) {
                this.position.y = data;
            }
            else if (this.position2.y != data2) {
                this.position2.y = data2;
            }
            if (this.score.player1 >= 5) {
                this.context.clearRect(0, 0, 1080, 1920);
                this.$emit('next')
            }
            else if (this.score.player2 >= 5) {
                this.context.clearRect(0, 0, 1080, 1920);
                this.$emit('next')
            }

        });
            setInterval(this.updateContent, 17);
      },
      shortcuts: {
        keydown (event) {
          if (event.key === 'w') {
            // console.log('both positions of player: ', this.position.y, this.position2.y)
            if (this.position.y >= 13 && this.position2.y >= 13)
              this.move('up');
            else
              return false;
          }
          else if (event.key === 's') {
            // console.log('both positions of player: ', this.position.y, this.position2.y)
            // faudrait que je puisse savoir si c'est le joueur 1 ou le joueur 2 mais je vois pas trop comment pcq j'suis fatigue 
            if (this.position.y <= 585 && this.position2.y <= 585)
              this.move('down');
            else
              return false;
          }
          else if (event.key === 'Escape') {
            this.move('stop');
          }
          return false // stop alias calling
        },
        cancel () {
            // a utiliser si un joueur deco mais je le fais plus tard la je vais rompich ++
            return false // stop propagation
        },
      },
       methods: {
        updateContent( ) {
            let call = 0;
            this.context.clearRect(0, 0, 1080, 1920);
            this.context.fillStyle = "white";
            this.context.font = "30px Arial";
            this.context.fillText(this.score.player1, 370, 50);
            this.context.fillRect(420, 0, 3, 1000);
            this.context.fillText(this.score.player2, 460, 50);
            this.context.fillStyle = "grey";
            this.context.fillRect(this.position.x, this.position.y, 20, 120);
            this.context.fillRect(this.position2.x, this.position2.y, 20, 120);
            this.updateBall();
        },
        keyb(val) {
             this.context.clearRect(0, 0, 720, 1080);
            // this.context.fillRect(this.position.x, this.position.y, 20, 120); // fonctionne pas va savoir pourquoi
             this.socket.emit('customBinding', val);
        },
        randomNumberBetween(min, max) {
            return Math.random() * (max - min) + min;
        },
        resetBall() {
        this.ball.x = 420;
        this.ball.y = 400;
        this.direction = { x: 0 }

        // this.velocity = 0.00005;
        while ( Math.abs(this.direction.x) <= 0.2 || Math.abs(this.direction.x) >= 0.9 ) {
          const heading = this.randomNumberBetween(0, 2 * Math.PI)
          this.direction = { x: Math.cos(heading), y: Math.sin(heading) }
        }
        // on reset la vitesse a celle initiale
        },
        // fonction de mouvement de la balle
        clearCircle( x , y , r ) {
          for( var i = 0 ; i < Math.round( Math.PI * r ) ; i++ ){
              var angle = ( i / Math.round( Math.PI * r )) * 360;
              this.context.clearRect( x , y , Math.sin( angle * ( Math.PI / 180 )) * r , Math.cos( angle * ( Math.PI / 180 )) * r );
          }
        },
        collisionDetection() {
        // do a function to check colision with players
          if (this.ball.x + this.ball.radius >= this.position.x && this.ball.x - this.ball.radius <= this.position.x + 20 && this.ball.y + this.ball.radius >= this.position.y && this.ball.y - this.ball.radius <= this.position.y + 120)
          {
            this.ball.x += 4; 
            this.direction.x = -this.direction.x;
          }
          else if (this.ball.x + this.ball.radius >= this.position2.x && this.ball.x - this.ball.radius <= this.position2.x + 20 && this.ball.y + this.ball.radius >= this.position2.y && this.ball.y - this.ball.radius <= this.position2.y + 120)
          {
            this.ball.x -= 4; 
            this.direction.x = -this.direction.x;
          }
        },
        endGame() {
          this.context.clearRect(0, 0, 1080, 1920);
          this.clearCircle(this.ball.x, this.ball.y, this.ball.radius);
          this.context.font = "30px Arial";
          this.context.fillText("THE GAME IS FINISHED", 370, 50);
        },
        updateBall() {
          if (!this.ball.x || !this.ball.y) {
          this.ball.x = 420;
          this.ball.y = 400;
          }
          if (this.score.player1 >= 5 || this.score.player2 >= 5) {
            this.context.clearRect(0, 0, 1080, 1920);
            this.context.font = "45px Arial";
            this.context.fillText("THE GAME IS FINISHED", 180, 150);
            return ;
          }
            if (this.direction.x == 1 || this.direction.x == -1) {
              while (this.direction.x <= 0.2 || this.direction.x >= 0.9) {
              const heading = this.randomNumberBetween(0, 2 * Math.PI)
              this.direction = { x: Math.cos(heading), y: Math.sin(heading) }
              }
            }

            let deltaTime=300;
            this.ball.x += this.direction.x * this.velocity.speed * deltaTime;
            this.ball.y += this.direction.y * this.velocity.speed * deltaTime;
            // this.context.fillStyle = "purple";
            // this.context.clearRect(0, 0, 1080, 1920);
            this.context.arc(this.ball.x, this.ball.y, 15, 0, 2 * Math.PI);
            this.context.fill();
            this.context.restore();
            this.context.closePath();
            this.context.beginPath();
            this.collisionDetection();
            // on verifie si la balle sort de la canvas
            if (this.ball.x <= 0)
            {
              if (this.score.player2 >= 5) {
                this.endGame();
                this.context.clearRect(0, 0, 1080, 1920);
                this.$emit('next')
              }
              else {
                this.velocity.speed = 0.000050;
                this.score.player2++;
              // this.velocity = 0.0005; // va savoir pourquoi si je reset la velocity, la balle ne bouge plus
                this.resetBall();
              }
            }
            else if (this.ball.x >= 850)
            {
              if (this.score.player1 >= 5) {
                this.endGame();
                this.context.clearRect(0, 0, 1080, 1920);
                this.$emit('next')
              }
              else {
                this.velocity.speed = 0.000050;
                this.score.player1++;
                this.resetBall();
              }
            }

            if (this.ball.x < 0 || this.ball.x > 850) {
              this.direction.x = -this.direction.x;
            }
            if (this.ball.y < 0 || this.ball.y > 720) {
              this.direction.y = -this.direction.y;
            }
            // on verifie si la balle touche le joueur 1
            if (this.ball.x >= this.position.x && this.ball.x <= this.position.x + 20 && this.ball.y >= this.position.y && this.ball.y <= this.position.y + 120) {
              this.direction.x = -this.direction.x;
            } 
            // on verifie si la balle touche le joueur 2
            if (this.ball.x >= this.position2.x && this.ball.x <= this.position2.x + 20 && this.ball.y >= this.position2.y && this.ball.y <= this.position2.y + 120) {
              this.direction.x = -this.direction.x;
            }
            if (this.velocity.speed < 0.05)
              this.velocity.speed += 0.00005;
        },
        move(direction) {
          if (this.score.player1 >= 5 || this.score.player2 >= 5)
            return ;
          this.socket.emit("move", direction);
        }
      }
  })
</script>

<style scoped></style>
