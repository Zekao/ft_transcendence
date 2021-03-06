<template>
  <v-card
    height="calc(100% - 114px)"
    color="grey lighten-1"
    class="d-flex justify-center align-center ma-6 pa-4"
  >
    <v-list width="40%">
      <v-list-item class="justify-center my-4">
        <v-avatar size="360"><v-img :src="imagePath" /></v-avatar>
      </v-list-item>
      <v-list-item>
        <v-file-input
          v-model="file"
          accept="image/*"
          label="Pick an image on your computer"
        >
          <template #append-outer>
            <v-btn icon :disabled="!file" @click="uploadImage">
              <v-icon>mdi-upload</v-icon>
            </v-btn>
          </template>
        </v-file-input>
      </v-list-item>
      <v-list-item>
        <v-form v-model="isLoginValid" style="width: 100%">
          <v-text-field
            :value="login"
            :rules="loginRules"
            :counter="24"
            label="Login"
            prepend-icon="mdi-account"
            required
            @input="setLoginInput"
            @keydown.enter.prevent="updateLogin"
          >
            <template #append-outer>
              <v-btn icon :disabled="!isLoginValid" @click="updateLogin">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </v-form>
      </v-list-item>
      <v-list-item class="justify-center mb-1">
        <v-menu :close-on-content-click="false">
          <template #activator="{ on }">
            <v-btn x-large class="mr-2" v-on="on"> Player color </v-btn>
          </template>
          <v-color-picker v-model="color"></v-color-picker>
        </v-menu>
        <v-btn icon @click="updateColor">
          <v-icon>mdi-check</v-icon>
        </v-btn>
      </v-list-item>
      <v-list-item class="justify-center">
        <v-menu :close-on-content-click="false">
          <template #activator="{ on }">
            <v-btn x-large v-on="on"> Game color </v-btn>
          </template>
          <v-color-picker v-model="backgroundColor"></v-color-picker>
        </v-menu>
        <v-btn icon @click="updateBackgroundColor">
          <v-icon>mdi-check</v-icon>
        </v-btn>
      </v-list-item>
      <v-list-item>
        <v-btn
          :loading="isImageLoading"
          block
          @click="isTwoFactorAuth ? updateTwoFactorAuth() : fetchQrCode()"
        >
          {{ isTwoFactorAuth ? 'Disable' : 'Enable' }}
          <v-icon class="ml-2 mb-1">mdi-two-factor-authentication</v-icon>
        </v-btn>
        <v-dialog v-model="is2FADialog" width="40%">
          <v-card>
            <v-img :src="`${$config.imageUrl}google/${userName}.png`" />
            <v-list-item>
              <v-otp-input
                v-model="code"
                length="6"
                style="width: 50%"
              ></v-otp-input>
            </v-list-item>
            <v-list-item class="justify-center">
              <v-btn :loading="loading" dense @click="verify"> Verify </v-btn>
            </v-list-item>
          </v-card>
        </v-dialog>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import { NuxtSocket } from 'nuxt-socket-io'
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  name: 'ProfileInfos',

  middleware: 'auth',

  data: () => ({
    isImageLoading: false,
    is2FADialog: false,
    loading: false,
    socket: null as NuxtSocket | null,
    code: '',
    file: {} as Blob,
    isLoginValid: false,
    newLogin: '',
    color: '',
    backgroundColor: '',
    loginRules: [
      (v: string) => !!v || 'Login is required',
      (v: string) => v.length > 3 || 'Login must be more than 3 characters',
      (v: string) => v.length <= 24 || 'Login must be less than 24 characters',
      (v: string) =>
        v.match(/^[a-zA-Z][a-zA-Z0-9]*$/) !== null ||
        'Login must contain valid characters',
    ],
  }),

  computed: {
    ...mapState({
      accessToken: (state: any): string => state.token.accessToken,
      userName: (state: any): string => state.user.authUser.user_name,
      login: (state: any): string => state.user.authUser.display_name || '',
      avatar: (state: any): string => state.user.authUser.avatar,
      isTwoFactorAuth: (state: any): boolean => state.user.authUser.TwoFA,
    }),
    imagePath(): string {
      return this.$config.imageUrl + this.avatar
    },
  },

  mounted() {
    this.socket = this.$nuxtSocket({
      auth: {
        Authorization: this.accessToken,
      },
      path: '/api/socket.io/',
    } as any)
  },

  methods: {
    async uploadImage() {
      if (
        (this.file as any).name &&
        (this.file as any).name.match(/.png$|.jpeg$|.jpg$/)
      ) {
        const formData = new FormData()
        formData.append('image', this.file)
        try {
          await this.$store.dispatch('user/updateAuthAvatar', formData)
          this.file = {} as Blob
        } catch (err: any) {
          if (err.response.status === 401) {
            this.$store.dispatch('logout')
            this.$router.push('/login')
          }
        }
      }
    },

    async updateLogin() {
      try {
        await this.$store.dispatch('user/updateAuth', {
          display_name: this.newLogin,
        })
        if (this.socket) this.socket.emit('notification', 'create')
      } catch (err: any) {
        if (err.response.status === 401) {
          this.$store.dispatch('logout')
          this.$router.push('/login')
        }
      }
    },

    async updateTwoFactorAuth() {
      try {
        await this.$store.dispatch('user/updateAuth', {
          TwoFA: !this.isTwoFactorAuth,
        })
      } catch (err: any) {
        if (err.response.status === 401) {
          this.$store.dispatch('logout')
          this.$router.push('/login')
        }
      }
    },

    async updateColor() {
      if (!this.color) return
      try {
        await this.$store.dispatch('user/updateAuth', {
          color: this.color,
        })
      } catch (err: any) {
        if (err.response.status === 401) {
          this.$store.dispatch('logout')
          this.$router.push('/login')
        }
      }
    },

    async updateBackgroundColor() {
      if (!this.backgroundColor) return
      try {
        await this.$store.dispatch('user/updateAuth', {
          backgroundColor: this.backgroundColor,
        })
      } catch (err: any) {
        if (err.response.status === 401) {
          this.$store.dispatch('logout')
          this.$router.push('/login')
        }
      }
    },

    async fetchQrCode() {
      this.isImageLoading = true
      try {
        await this.$axios.$get('/auth/qrcode')
        setTimeout(() => {
          this.isImageLoading = false
          this.is2FADialog = true
        }, 2000)
      } catch (err: any) {
        if (err.response.status === 401) {
          this.$store.dispatch('logout')
          this.$router.push('/login')
        }
      }
    },

    async verify() {
      try {
        this.loading = true
        await this.$store.dispatch('authTwoFactor', this.code)
        await this.updateTwoFactorAuth()
        this.is2FADialog = false
      } catch (err) {
        this.code = ''
        this.loading = false
      }
    },

    setLoginInput(val: string) {
      this.newLogin = val
    },
  },
})
</script>
