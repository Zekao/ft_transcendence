<template>
  <v-container fill-height fluid>
    <v-row justify="center">
      <v-card flat align="center">
        <h1 class="ma-4 text-center">{{ title }}</h1>
        <v-btn
          dark
          x-large
          :elevation="0"
          :loading="loading"
          color="grey darken-3"
          class="ma-4"
          @click="login"
        >
          Connexion
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

  middleware({ $cookies, redirect }) {
    const accessToken = $cookies.get('access_token')
    if (accessToken) redirect('/')
  },

  async asyncData({ query, store, redirect }) {
    const { code: authCode } = query
    if (authCode) {
      try {
        const res = await store.dispatch('login', authCode)
        if (res.firstime) redirect('/profile')
        redirect('/')
      } catch (err) {
        return {
          error: true,
        }
      }
    }
  },

  data: () => ({
    title: 'ft_transcendance',
    error: false,
    loading: false,
  }),

  methods: {
    login() {
      this.loading = true
      window.location.href = this.$config.serverLogin ?? ''
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
