// import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

import vue3GoogleLogin from 'vue3-google-login'

const app = createApp(App)

app.use(vue3GoogleLogin, {
  clientId: '246465031590-6a0eoo88tgq68n85ihhh34mj9sdivldi.apps.googleusercontent.com'
})

app.mount('#app')
