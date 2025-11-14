import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import {createRouter,createWebHashHistory} from  'vue-router'
const pinia = createPinia()
const app = createApp(App)
const router = createRouter({
    history: createWebHashHistory(),
    routes:[]
})
app.use(pinia)
app.use(router)
app.mount('#app')