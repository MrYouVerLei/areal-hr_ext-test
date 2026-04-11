import { createApp } from 'vue'
import { Quasar, Dialog } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'
import App from './App.vue'
import { router } from './router/routes'

const myApp = createApp(App)

myApp.use(Quasar, {
    plugins: {
        Dialog
    },
})

myApp.use(router)
myApp.mount('#app')
