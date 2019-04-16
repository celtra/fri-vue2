import Vue from 'vue'
import App from './App.vue'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default-dark.css'
import Gun from 'gun'

Vue.use(VueMaterial)
Vue.prototype.$gun = new Gun()
Vue.config.productionTip = false

new Vue({
    render: h => h(App),
}).$mount('#app')
