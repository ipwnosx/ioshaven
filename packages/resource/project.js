//require('popper')
//require('bootstrap')
window.Vue = require('vue')
window._ = require('lodash');
window.axios = require('axios');
const $env = require('../../env.json')



$(document).ready(function (){
  if (location.pathname == "/") $("body").addClass("landing")
  $('#paypalDonate').hide()
  $('.paypalDonateTrigger').click(function(e) {
    e.preventDefault()
    $('#paypalDonate').submit()
  })

  $('a').click(function (e) {
    if (e.target.hash === '#contact') {
      e.preventDefault()
      $('#contactform').modal('show')
      $('#contactform').on('shown.bs.modal', function () {
        $(this).scrollTop(0);
      })
    }
  })
})

Vue.component('flexbox', require('./components/flexbox.vue'))
Vue.component('search', require('./components/searchbar.vue'))
Vue.component('contact', require('./components/contact.vue'))
Vue.component('popup', require('./components/popup.vue'))
Vue.component('contactitem', require('./components/contactItem.vue'))

// Vue.config.devtools = (process.NODE_ENV === 'development')
// Vue.config.debug = (process.NODE_ENV === 'development')
// Vue.config.silent = !(process.NODE_ENV === 'development')

const app = new Vue({
  el: '#app',
  data: {
    adverts: require('./adverts.json'),
    apps: [],
    searchResults: [],
    searchResultsTags: [],
    contact: {},
    store: "",
    loading: true
  },
  mounted() {
    axios.get('https://dashboard.ioshaven.co')
    .then(res => {
      this.apps = res.data
      this.searchResults = res.data
      this.searchResultsTags = res.data
      // this.child()
      this.loading = false
    })
    .catch(err => {
      this.apps = require('./sideload-apps.json')
      this.searchResults = require('./sideload-apps.json')
      this.loading = false
    })
  },
  methods: {
    $advert(){
      let keys = Object.keys(this.adverts)
      let random = Math.floor(Math.random() * keys.length)
      return keys[random]
    },
    child: function(value){

      this.searchResults = _.sortBy(this.apps, [function (o){
        return o.title.toLowerCase()
      }])
      //

      this.searchResultsTags = _.sortBy(this.apps, [function (o){
        return o.title.toLowerCase()
      }])

      this.searchResultsTags = _.sortBy(this.searchResultsTags, [function (o){
        return _.includes(o.tags, this.store)
      }])

      this.searchResults = _.filter(this.searchResults, (o) =>{
       return _.includes(o.title.toLowerCase(), this.store.toLowerCase())
      })

      if (value.unsigned) {
        this.searchResults = _.filter(this.searchResults, (o) => {
          return o.dl != null && o.dl != ""
        })
      }

      if (value.signed) {
        this.searchResults = _.filter(this.searchResults, (o) => {
          return o.signed != null && o.signed != ""
        })
      }

      if (value.tags) {
        this.searchResults = _.filter(this.searchResults, (o) => {
          return o.tags != null && o.tags != ""
        })
      }

      // let withTags = []
      let withAds = []
      let amount = 7

      let getAd = () =>{
        let obj = this.adverts[this.$advert()]
        obj.advert = this.$advert()
        return obj
      }

      _.forEach(this.searchResults, (app, index) => {
        app.advert = false
        withAds.push(app)
        if (index%amount == amount-1) withAds.push(getAd())
      })

      if (this.searchResults.length < amount-1) this.searchResults.push(getAd())
      else this.searchResults = withAds

    },
  }
})
