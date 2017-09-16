//require('popper')
//require('bootstrap')
window.Vue = require('vue')
window._ = require('lodash');
window.axios = require('axios');
window.$ = window.jquery = require('jquery')
// const $env = require('../../env.json')





Vue.component('search', require('./components/search.vue'))
Vue.component('myform', require('./components/form.vue'))
Vue.component('apps', require('./components/apps.vue'))

Vue.config.devtools = (process.NODE_ENV === 'development')
Vue.config.debug = (process.NODE_ENV === 'development')
Vue.config.silent = !(process.NODE_ENV === 'development')

window.app = new Vue({
  el: '#app',


})
