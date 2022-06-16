import Vue from 'vue'
import VueKeybindings from 'vue-keybindings'
import { Plugin } from '@nuxt/types'

const key: Plugin = () => {
  Vue.use(VueKeybindings, {
    alias: {
      Up: ['w'],
      Down: ['s'],
      Escape: ['Escape'],
    },
  })
}

export default key
