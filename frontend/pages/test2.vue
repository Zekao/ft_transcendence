<template>
  <div id="example-1">
    <button v-on:click="counter += 1">Add 1</button>
    <p>Le bouton ci-dessus a été cliqué {{ counter }} fois.</p>
  </div>
</template>

<script>
  export default {
    data() {
      return {
      counter: 0
	  };
    },
  };
</script>
