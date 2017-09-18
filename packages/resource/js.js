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
    e.preventDefault()
    if (e.target.hash === '#contact') {
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
    apps: require('./sideload-apps.json'),
    searchResults: require('./sideload-apps.json'),
    contact: {},
    store: ""
  },
  methods: {
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

      //  console.log(testing);
    },
  }
})
