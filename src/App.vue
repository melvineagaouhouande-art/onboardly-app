<script setup>
import { ref } from 'vue'
import Home from './components/Home.vue' // <-- Importez votre composant d'accueil ici
import { ref, onMounted, computed, watch } from 'vue'
import { useAuthStore } from './stores/auth'
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
const currentScreen = ref('login')
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
  } else if (!['login', 'register'].includes(currentScreen.value)) {
    currentScreen.value = 'login'
  }
}

// Vérifier la session au démarrage
onMounted(async () => {
  if (authStore.isAuthenticated) {
    try {
      await authStore.fetchUser()
      updateRoute()
    } catch (e) {
      currentScreen.value = 'login'
    }
  } else {
    currentScreen.value = 'login'
  }
})

// Observer les changements de l'utilisateur
watch(() => authStore.currentUser, () => {
  updateRoute()
})

const currentUser = computed(() => authStore.currentUser)

// --- FONCTION DE SWITCH RAPIDE (DEV/TEST) ---
const switchTo = (screen) => {
  currentScreen.value = screen
  
  // Injecte un profil factice selon l'écran pour alimenter tes composants (Uniquement pour UI Test)
  if (!authStore.isAuthenticated) {
    if (screen === 'rh-dashboard') {
      authStore.user = { prenom: 'Sophie', nom: 'RH', email: 'rh@entreprise.com', role: 'admin_rh', statut_compte: 'actif' }
    } else if (screen === 'manager-dashboard') {
      authStore.user = { prenom: 'Marc', nom: 'Manager', email: 'marc@entreprise.com', role: 'manager', statut_compte: 'actif' }
    } else if (screen === 'employee-dashboard') {
      authStore.user = { prenom: 'Léa', nom: 'Employé', email: 'lea@entreprise.com', role: 'employe', statut_compte: 'actif' }
    } else if (screen === 'waiting-approval') {
      authStore.user = { prenom: 'Jean', nom: 'Dupont', email: 'jean@entreprise.com', role: 'employe', statut_compte: 'en_attente' }
    }
  }
}

const handleLoginSuccess = async (userData) => {
  updateRoute()
}

const handleRegisterSuccess = () => {
  currentScreen.value = 'login'
}

const handleLogout = async () => {
  await authStore.logout()
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
    <!-- ÉCRANS -->
    <Login v-if="currentScreen === 'login'" @login-success="handleLoginSuccess" @go-to-register="currentScreen = 'register'" />
    <Register v-else-if="currentScreen === 'register'" @go-to-login="currentScreen = 'login'" @register-success="handleRegisterSuccess" />
    <WaitingApproval v-else-if="currentScreen === 'waiting-approval'" :currentUser="currentUser" @logout="handleLogout" />
    <RhDashboard v-else-if="currentScreen === 'rh-dashboard'" :currentUser="currentUser" @logout="handleLogout" />
    <ManagerDashboard v-else-if="currentScreen === 'manager-dashboard'" :currentUser="currentUser" @logout="handleLogout" />
    <EmployeeDashboard v-else-if="currentScreen === 'employee-dashboard'" :currentUser="currentUser" @logout="handleLogout" />
  </div>
</template>