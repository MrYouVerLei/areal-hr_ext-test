import {createApp} from 'vue'
import {Quasar, Dialog, Notify} from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'
import App from './App.vue'
import {router} from './router/routes'
import {createPinia} from "pinia";
import {abilitiesPlugin} from "@casl/vue";
import {ability} from './ability';

const pinia = createPinia()
const myApp = createApp(App)

myApp.use(Quasar, {
    plugins: {
        Dialog,
        Notify
    },
})

myApp.use(router)
myApp.use(pinia)
myApp.use(abilitiesPlugin, ability, {
    useGlobalProperties: true
})
myApp.mount('#app')
