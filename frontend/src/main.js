/**
 * Premier's Awards: Nomination Application
 * Developer: Spencer Rose (BCGov, PSA/PSECI)
 * Version: 1.0.0
 * Module: main.js
 *
 * **/

import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import { BootstrapVue } from 'bootstrap-vue'
import '../node_modules/bootstrap/dist/css/bootstrap.css'
import '../node_modules/bootstrap-vue/dist/bootstrap-vue.css'
import router from '@/routes'
import store from '@/services/store.services'

Vue.use(BootstrapVue)
Vue.use(VueRouter)
Vue.config.productionTip = false

// instantiate app
new Vue({
    store,
    el: '#app',
    router,
    render(h) { return h(App) },
    async beforeMount () {
      await store.dispatch('login')
    }
})


