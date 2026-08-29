<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useAuthStore } from './stores/auth'
import Login from './components/Login.vue'
import Register from './components/Register.vue'
import RhDashboard from './components/RhDashboard.vue'
import ManagerDashboard from './components/ManagerDashboard.vue'
import EmployeeDashboard from './components/EmployeeDashboard.vue'
import WaitingApproval from './components/WaitingApproval.vue'

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
</script>

<template>
  <div class="min-h-screen bg-slate-950 relative">
    
    <!-- BARRE DE COMMANDE TEST (Visuellement au-dessus de tout) -->
    <div class="fixed top-2 right-2 z-50 bg-slate-900/90 border border-slate-700 p-2 rounded-xl flex gap-1.5 text-xs shadow-xl backdrop-blur-md">
      <span class="text-slate-400 self-center font-bold px-1">Vue Rapide :</span>
      <button @click="switchTo('login')" class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition">Login</button>
      <button @click="switchTo('waiting-approval')" class="px-2.5 py-1 bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 rounded-lg transition">Attente</button>
      <button @click="switchTo('employee-dashboard')" class="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition">Employé</button>
      <button @click="switchTo('manager-dashboard')" class="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition">Manager</button>
      <button @click="switchTo('rh-dashboard')" class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition">RH</button>
    </div>

    <!-- ÉCRANS -->
    <Login v-if="currentScreen === 'login'" @login-success="handleLoginSuccess" @go-to-register="currentScreen = 'register'" />
    <Register v-else-if="currentScreen === 'register'" @go-to-login="currentScreen = 'login'" @register-success="handleRegisterSuccess" />
    <WaitingApproval v-else-if="currentScreen === 'waiting-approval'" :currentUser="currentUser" @logout="handleLogout" />
    <RhDashboard v-else-if="currentScreen === 'rh-dashboard'" :currentUser="currentUser" @logout="handleLogout" />
    <ManagerDashboard v-else-if="currentScreen === 'manager-dashboard'" :currentUser="currentUser" @logout="handleLogout" />
    <EmployeeDashboard v-else-if="currentScreen === 'employee-dashboard'" :currentUser="currentUser" @logout="handleLogout" />
  </div>
</template>