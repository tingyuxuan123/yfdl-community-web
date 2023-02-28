import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import 'element-plus/dist/index.css'

import SvgIcon from '@/components/SvgIcon/index.vue'
import 'virtual:svg-icons-register'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import piniaPluginPersist from 'pinia-plugin-persistedstate'

import '@/assets/icons/icon/iconfont.css'

import './styles/theme.css'
import './styles/index.scss'
import { useChatStore } from './stores/chatStore'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.component('svg-icon', SvgIcon)

const store = createPinia()
store.use(piniaPluginPersist)

app.use(store)
app.use(router)

const chatStore = useChatStore()
//连接服务器
chatStore.connectSocket()
//获取聊天列表
chatStore.getChatUserList()

app.mount('#app')
