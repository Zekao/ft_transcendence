<template>
  <v-app dark>
    <v-app-bar app height="64">
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-menu transition="slide-x-reverse-transition" offset-y>
        <template #activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on">
            <v-avatar>
              <v-img :src="imagePath"></v-img>
            </v-avatar>
            <v-col>
              {{ login }}
            </v-col>
          </v-btn>
        </template>

        <v-list class="mt-6">
          <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-main>
      <Nuxt />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions } from 'vuex'

export default Vue.extend({

  name: 'DefaultLayout',

  data: () => ({
    title: 'ft_transcendance',
    login: 'gamarcha',
    imagePath: 'gamarcha',
    items: [
        {
          icon: 'mdi-apps',
          title: 'Game',
          to: '/',
        },
        {
          icon: 'mdi-account',
          title: 'Profile',
          to: '/profile',
        },
        {
          icon: 'mdi-logout',
          title: 'Logout',
          to: '/logout',
        },
      ],
  }),
  // computed: {
    // ...mapState({
    //   login: (state: any): string => state.user.authenticatedUser.login,
    //   imagePath: (state: any): string => state.user.authenticatedUser.imagePath,
    // }),
    // ...mapGetters({
    //   isTutor: 'user/authenticatedUserIsTutor',
    //   isAdmin: 'user/authenticatedUserIsTutor',
    // }),
  // },
  methods: {
    ...mapActions({
      logout: 'auth/logout',
    }),
    logoutRedirect() {
      this.logout()
      this.$router.replace('/login')
    },
    async fetchUsers() {
      try {
        await this.$store.dispatch('users/fetchUsers')
        await this.$store.dispatch('users/fetchRoles')
      } catch (err) {
        console.log(err)
      }
    },
  },
})
</script>

<style>
html {
  overflow: hidden;
}
.accent-text {
  color: #ffffff !important;
}
.v-menu__content {
  box-shadow: none;
}
.v-input__icon--prepend {
  font-size: 12px;
}
</style>
