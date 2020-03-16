<template>
  <a class="btn" role="button" v-if="message">
    <v-alert :type="type" text outlined icon="mdi-close" class="text-left">{{ message }}</v-alert>
  </a>
</template>

<script>
export default {
  props: {
    type: { type: String, required: true },
    message: { type: String, required: true }
  },
  name: "Info"
};
</script>

<style>
  .btn {
    text-decoration: none
  }
</style>