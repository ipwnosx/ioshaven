<template lang="html">
  <div class="">
    <search v-model="image" files="images" attr="" temp="Image"></search>
    <search v-model="ipa" files="ipas" attr="" temp="IPA"></search>
    <search v-model="app" files="apps" attr="title" temp="App Title"></search>
  </div>
</template>

<script>
export default {
  data() {
    return {
      image: '',
      ipa: '',
      app: ''
    }
  },
  methods: {
    update(e) {
      this.$emit('input', e)
    }
  }
}
</script>

<style lang="css">
</style>
