<script setup>
import { ref } from 'vue'
import Home from './components/Home.vue' // <-- Importez votre composant d'accueil ici
import Login from './components/Login.vue'
import Register from './components/Register.vue'
import RhDashboard from './components/RhDashboard.vue'
import ManagerDashboard from './components/ManagerDashboard.vue'
import EmployeeDashboard from './components/EmployeeDashboard.vue'
import WaitingApproval from './components/WaitingApproval.vue'

// L'écran initial devient 'home'
const currentScreen = ref('home')
const currentUser = ref(null)

const handleLoginSuccess = (userData) => {
  currentUser.value = userData
  if (!userData.isApproved) {
    currentScreen.value = 'waiting-approval'
  } else if (userData.role === 'Gestionnaire RH') {
    currentScreen.value = 'rh-dashboard'
  } else if (userData.role === "Manager d'équipe") {
    currentScreen.value = 'manager-dashboard'
  } else {
    currentScreen.value = 'employee-dashboard'
  }
}

const handleLogout = () => {
  currentUser.value = null
  currentScreen.value = 'login'
}

// Redirige directement sur la page d'accueil
const goHome = () => {
  currentScreen.value = 'home'
}
</script>

<template>
  <div class="min-h-screen bg-slate-950 relative">
    
    <!-- PAGE D'ACCUEIL -->
    <Home 
      v-if="currentScreen === 'home'" 
      @go-to-login="currentScreen = 'login'" 
      @go-to-register="currentScreen = 'register'" 
    />

    <!-- AUTRES ÉCRANS -->
    <Login 
      v-else-if="currentScreen === 'login'" 
      @login-success="handleLoginSuccess" 
      @go-to-register="currentScreen = 'register'" 
      @go-home="goHome"
    />
    <Register 
      v-else-if="currentScreen === 'register'" 
      @go-to-login="currentScreen = 'login'" 
      @go-home="goHome"
    />
    <WaitingApproval 
      v-else-if="currentScreen === 'waiting-approval'" 
      :currentUser="currentUser" 
      @logout="handleLogout"
      @go-home="goHome" 
    />
    <RhDashboard 
      v-else-if="currentScreen === 'rh-dashboard'" 
      :currentUser="currentUser" 
      @logout="handleLogout"
      @go-home="goHome" 
    />
    <ManagerDashboard 
      v-else-if="currentScreen === 'manager-dashboard'" 
      :currentUser="currentUser" 
      @logout="handleLogout"
      @go-home="goHome" 
    />
    <EmployeeDashboard 
      v-else-if="currentScreen === 'employee-dashboard'" 
      :currentUser="currentUser" 
      @logout="handleLogout"
      @go-home="goHome" 
    />
  </div>
</template>