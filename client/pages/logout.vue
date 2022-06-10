<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'LogoutPage',

  asyncData({ store, redirect }) {
    store.dispatch('logout')
    redirect('/login')
  }
})
</script>
