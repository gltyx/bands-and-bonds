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
  window.location.href = window.location.href.replace(window.location.search, '');
}

createApp(App).mount('#app')

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js")
      .catch(err => console.error("SW registration failed:", err));
  });
}
