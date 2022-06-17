<template>
  <v-container fill-height fluid>
    <v-row justify="center">
      <v-card flat align="center">
        <h1 class="ma-4 text-center">{{ title }}</h1>
        <v-otp-input v-model="code" length="6"></v-otp-input>
        <v-btn
          dark
          x-large
          :elevation="0"
          :loading="loading"
          color="grey darken-3"
          class="ma-4"
          @click="authenticate"
        >
          Authenticate
          <img src="42_logo.svg" class="logo" />
        </v-btn>
      </v-card>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'LoginPage',

  layout: 'login',

  async middleware({ $cookies, redirect, store }) {
    const accessToken = $cookies.get('access_token')
    if (!accessToken) redirect('/login')
    try {
      await store.dispatch('user/fetchAuth')
      store.commit('AUTH_SUCCESS', { accessToken })
    } catch (err) {
      store.dispatch('logout')
      redirect('/login')
    }
  },

  data: () => ({
    title: 'Two factor authentication',
    code: '',
    error: false,
    loading: false,
  }),

  methods: {
    async authenticate() {
      try {
        this.loading = true
        await this.$store.dispatch('authTwoFactor', this.code)
        this.$router.push('/')
      } catch (err) {
        this.error = true
        this.code = ''
        this.loading = false
      }
    },
  },
})
</script>

<style scoped>
.logo {
  height: 1rem;
  margin-left: 0.5rem;
}
</style>
