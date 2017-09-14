<template lang="html">
  <div class="">

    <input class="search"
           :value="value"
           @input="update($event.target.value)"
           @keyup="filter(value, files, attr)"
           :placeholder="temp">

    <div class="search-results">
      <div class="item"
           v-for="(app, key) in filtered[files]"
           @click="set($event, files)"
       >{{app}}</div>
    </div>
  </div>
</template>

<script>
const $apps = require('../sideload-apps.json')
export default {
  props: ['value','files', 'attr', 'temp'],
  data() {
    return {
      search: '',

      raw: {
        apps: [],
        images: [],
        ipas: [],
      },

      filtered: {
        apps: [],
        images: [],
        ipas: []
      }
    }
  },
  mounted() {
    this.raw.apps = $apps
    axios.get('/files').then(r => {
      this.raw.images = r.data.images
      this.raw.ipas  = r.data.ipas
    })
  },
  methods:{
    filter(search, list, prop=null) {
      var newlist = list
      list = this.raw[list]
      if (search.length <= 0) return this.filtered[newlist] = []
      var nl = _.sortBy(list, [function (o){
        if (prop)return o[prop].toLowerCase()
        else return o.toLowerCase()
      }])
      nl = _.filter(nl, (o) =>{
       if (prop) return _.startsWith(o[prop].toLowerCase(), search.toLowerCase())
       else return _.startsWith(o.toLowerCase(), search.toLowerCase())
      })
      let res = []
      _.forEach(nl, item => {
        if (prop) res.push(item[prop])
        else res.push(item)
      })
      return this.filtered[newlist] = res
    },

    set(e, files) {
      this.update(e.target.innerHTML)
      this.filtered[files] = ""
    },

    update(e){
      this.$emit('input', e)
    }
  }
}
</script>

<style lang="css">
</style>
