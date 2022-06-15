<template>
<nav>
    <v-toolbar text >
    <!-- <v-toolbar-side-icon class="grey--text" @click="drawer = !drawer"> </v-toolbar-side-icon> -->
             <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

       <v-toolbar-title class="text-uppercase grey--text">

            <span class="font-weight-light">ft_</span>
            <span>Transcendence </span>
        </v-toolbar-title>
        <v-spacer>  </v-spacer>
        <v-btn text color="grey">
            <span> Sign-out</span>
            <v-icon right > mdi-exit-to-app</v-icon>
        </v-btn>


    </v-toolbar>
            <v-navigation-drawer app v-model="drawer" temporary class="success" >
  <v-list text>
      <v-list-item-group color="primary">
        <v-list-item
          v-for="(link, i) in links"
          :key="i"
          router :to="link.route"
        >
          <v-list-item-icon>
            <v-icon v-text="link.icon"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="link.text"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
    </v-navigation-drawer>
</nav>
</template>


<script>
export default {
    data() {
        return {
            drawer: false,
            links: [
                {icon: 'mdi-account-circle-outline', text: 'Account', route: '/Account'},
                {icon: 'mdi-podium', text: 'Podium', route: '/Podium'},
                {icon: 'mdi-table-tennis', text: 'Play', route: '/Game'},
                {icon: 'mdi-account-multiple', text: 'Friends', route: '/Friends'},
                {icon: 'mdi-chat', text: 'chat', route: '/Chat'}
            ]
        }
    }
}
</script>
