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
            @input="(val) => (newLogin = val)"
          >
            <template #append-outer>
              <v-btn icon :disabled="!isLoginValid" @click="updateLogin">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </v-form>
      </v-list-item>
      <v-list-item>
        <v-btn block @click="updateTwoFactorAuth">
          {{ isTwoFactorAuth ? 'Disable' : 'Enable' }}
          <v-icon class="ml-2 mb-1">mdi-two-factor-authentication</v-icon>
        </v-btn>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
export default Vue.extend({
  name: 'ProfileInfos',
  middleware: 'auth',
  data: () => ({
    file: null as Blob | null,
    isLoginValid: false,
    newLogin: '',
    loginRules: [
      (v: string) => !!v || 'Login is required',
      (v: string) => v.length > 3 || 'Login must be more than 3 characters',
      (v: string) => v.length <= 24 || 'Login must be less than 24 characters',
    ],
  }),

  computed: {
    ...mapState({
      login: (state: any): string => state.user.authUser.display_name,
      avatar: (state: any): string => state.user.authUser.avatar,
      isTwoFactorAuth: (state: any): boolean => state.user.authUser.TwoFA,
    }),
    imagePath() {
      return 'https://ft.localhost:4500/api/image/' + this.avatar
    },
  },

  methods: {
    async uploadImage() {
      if (this.file) {
        const formData = new FormData()
        formData.append('image', this.file)
        try {
          await this.$store.dispatch('user/updateAuthAvatar', formData)
          this.file = null
        } catch (err) {
          console.log(err)
        }
      }
    },
    async updateLogin() {
      try {
        await this.$store.dispatch('user/updateAuth', {
          display_name: this.newLogin,
        })
      } catch (err) {
        console.log(err)
      }
    },
    async updateTwoFactorAuth() {
      try {
        await this.$store.dispatch('user/updateAuth', {
          TwoFA: !this.isTwoFactorAuth,
        })
      } catch (err) {
        console.log(err)
      }
    },
  },
})
</script>

