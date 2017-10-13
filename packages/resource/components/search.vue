<template lang="html">
  <div class="search">

    <input :class="{
      'found': filtered[files].length > 0 && show
    }"     @click="show = !show"
           :value="value"
           @input="update($event.target.value)"
           @keyup="filter(value, files, attr)"
           :placeholder="temp">

    <div class="search-results" v-show="filtered[files].length > 0 && show">
      <div class="item"
           v-for="(app, key) in filtered[files]"
           @click="set($event, files)"
       >{{app}}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['value','files', 'attr', 'temp'],
  data() {
    return {
      search: '',
      show: false,
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
    axios.post('/json').then(r => this.raw.apps = r.data)
    axios.get('/files').then(r => {
      this.raw.images = r.data.images
      this.raw.ipas  = r.data.ipas
    })
  },
  methods:{
    filter(search, list, prop=null) {
      this.show = true
      var newlist = list
      list = this.raw[list]
      if (search.length <= 0) return this.filtered[newlist] = []

      var nl = _.sortBy(list, [function (o){
        if (prop)return o[prop].toLowerCase()
        else return o.toLowerCase()
      }])

      nl = _.filter(nl, (o) =>{
       if (prop) return _.includes(o[prop].toLowerCase(), search.toLowerCase())
       else return _.includes(o.toLowerCase(), search.toLowerCase())
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
      this.$emit('chosen', e)
    },

    update(e){
      this.$emit('input', e)
    }
  }
}
</script>

<style lang="css">
.item {
    padding: 1rem;
    font-family: sans-serif;
    background: white;
    box-shadow: 0 2px 6px 0px rgba(0, 0, 0, 0.64);
}
.item:hover {
  cursor: pointer;
  background: #eee;
}
</style>
