<template>
  <v-card height="calc(100% - 114px)" color="grey lighten-1" class="d-flex justify-center align-center ma-6">
    <v-list width="420px">
      <v-list-item>
        <v-file-input
          accept="image/*"
          label="Pick an image on your computer"
        ></v-file-input>
      </v-list-item>
      <v-list-item>
        <v-text-field
          :value="login"
          :rules="loginRules"
          :counter="24"
          label="Login"
          required
          ></v-text-field>
          <v-btn icon>
            <v-icon>mdi-pencil</v-icon>
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

  data: () => ({
    loginRules: [
      (v: string) => !!v || 'Login is required',
      (v: string) => v.length <= 24 || 'Login must be less than 24 characters',
    ],
  }),

  computed: {
    ...mapState({
      login: (state: any): string => state.user.authUser.user_name,
      imagePath: (state: any): string => state.user.authUser.avatar,
    }),
  }
})
</script>
