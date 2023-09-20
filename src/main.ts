import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import VueFeather from 'vue-feather';

import './assets/css/materialdesignicons.min.css'
import './assets/css/style.css'
import './assets/css/colors/default.css'
import './assets/css/bootstrap.min.css'

// @ts-ignore
import VueHighlightJS from 'vue3-highlightjs'
import 'highlight.js/styles/github.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueHighlightJS)
app.component(VueFeather.name, VueFeather);
app.mount('#app')
