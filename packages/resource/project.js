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

Vue.config.devtools = (process.NODE_ENV === 'development')
Vue.config.debug = (process.NODE_ENV === 'development')
Vue.config.silent = !(process.NODE_ENV === 'development')

const app = new Vue({
  el: '#app',
  data: {
    adverts: require('./adverts.json'),
    apps: require('./sideload-apps.json'),
    searchResults: require('./sideload-apps.json'),
    contact: {},
    store: ""
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


      this.searchResults = _.filter(this.searchResults, (o) =>{
       return _.startsWith(o.title.toLowerCase(), this.store.toLowerCase())
      })

      if (value.unsigned) {
        this.searchResults = _.filter(this.searchResults, (o) => {
          return o.dl != null
        })
      }

      if (value.signed) {
        this.searchResults = _.filter(this.searchResults, (o) => {
          return o.signed != null
        })
      }

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
