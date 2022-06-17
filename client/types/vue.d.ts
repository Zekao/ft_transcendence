import Vue from 'vue';

declare module '*.vue' {
  export default Vue;
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    shortcuts?: {
      keydown: (ev: any) => boolean,
      cancel: () => boolean,
    }
  }
}
