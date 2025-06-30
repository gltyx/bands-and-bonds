import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { startingLocalData } from './store'

const params = new URLSearchParams(window.location.search);
if (params.has('join')) {
  const localData = localStorage.getItem('bnb-local');
  const local = localData ? JSON.parse(localData) : startingLocalData();
  local.settings.teamId = params.get('join');
  local.settings.online = true;
  localStorage.setItem('bnb-local', JSON.stringify(local));
  window.location.search = '';
}

createApp(App).mount('#app')
