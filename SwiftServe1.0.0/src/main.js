import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueChartkick from 'vue-chartkick'
import 'chartkick/chart.js'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueChartkick)

app.mount('#app')


/*"test": "jest --config jest.config.mjs",*/
