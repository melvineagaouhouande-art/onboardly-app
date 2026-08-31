<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useAuthStore } from './stores/auth'
import Home from './components/Home.vue'
import Login from './components/Login.vue'
import Register from './components/Register.vue'
import RhDashboard from './components/RhDashboard.vue'
import ManagerDashboard from './components/ManagerDashboard.vue'
import EmployeeDashboard from './components/EmployeeDashboard.vue'
import WaitingApproval from './components/WaitingApproval.vue'

const currentScreen = ref('home')
const authStore = useAuthStore()

// Déterminer l'écran courant en fonction de l'état d'authentification
const updateRoute = () => {
  if (authStore.isAuthenticated && authStore.currentUser) {
    const user = authStore.currentUser
    if (user.statut_compte === 'en_attente') {
      currentScreen.value = 'waiting-approval'
    } else if (user.statut_compte === 'actif') {
      if (user.role === 'admin_rh') currentScreen.value = 'rh-dashboard'
      else if (user.role === 'manager') currentScreen.value = 'manager-dashboard'
      else currentScreen.value = 'employee-dashboard'
    }
  } else if (!['login', 'register', 'home'].includes(currentScreen.value)) {
    currentScreen.value = 'home'
  }
}

// Vérifier la session au démarrage
onMounted(async () => {
  if (authStore.isAuthenticated) {
    try {
      await authStore.fetchUser()
      updateRoute()
    } catch (e) {
      currentScreen.value = 'home'
    }
  }
})

// Observer les changements de l'utilisateur
watch(() => authStore.currentUser, () => {
  updateRoute()
})

const currentUser = computed(() => authStore.currentUser)

const handleLoginSuccess = async (userData) => {
  updateRoute()
}

const handleRegisterSuccess = () => {
  currentScreen.value = 'login'
}

const handleLogout = async () => {
  await authStore.logout()
  currentScreen.value = 'home'
}

const goHome = () => {
  currentScreen.value = 'home'
}
</script>

<template>
  <div class="min-h-screen bg-slate-950 relative">
    
    <!-- ÉCRANS -->
    <Home 
      v-if="currentScreen === 'home'" 
      @go-to-login="currentScreen = 'login'" 
      @go-to-register="currentScreen = 'register'" 
    />
    <Login 
      v-else-if="currentScreen === 'login'" 
      @login-success="handleLoginSuccess" 
      @go-to-register="currentScreen = 'register'" 
      @go-home="goHome"
    />
    <Register 
      v-else-if="currentScreen === 'register'" 
      @go-to-login="currentScreen = 'login'" 
      @register-success="handleRegisterSuccess"
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