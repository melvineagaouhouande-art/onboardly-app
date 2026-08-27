<script setup>
import { ref } from 'vue'
import Login from './components/Login.vue'
import Register from './components/Register.vue'
import RhDashboard from './components/RhDashboard.vue'
import ManagerDashboard from './components/ManagerDashboard.vue'
import EmployeeDashboard from './components/EmployeeDashboard.vue'
import WaitingApproval from './components/WaitingApproval.vue'

const currentScreen = ref('login')
const currentUser = ref(null)

// --- FONCTION DE SWITCH RAPIDE (DEV/TEST) ---
const switchTo = (screen) => {
  currentScreen.value = screen
  
  // Injecte un profil factice selon l'écran pour alimenter tes composants
  if (screen === 'rh-dashboard') {
    currentUser.value = { firstName: 'Sophie', lastName: 'RH', email: 'rh@entreprise.com', role: 'Gestionnaire RH', isApproved: true }
  } else if (screen === 'manager-dashboard') {
    currentUser.value = { firstName: 'Marc', lastName: 'Manager', email: 'marc@entreprise.com', role: 'Manager d\'équipe', isApproved: true }
  } else if (screen === 'employee-dashboard') {
    currentUser.value = { firstName: 'Léa', lastName: 'Employé', email: 'lea@entreprise.com', role: 'Employé', isApproved: true }
  } else if (screen === 'waiting-approval') {
    currentUser.value = { firstName: 'Jean', lastName: 'Dupont', email: 'jean@entreprise.com', role: 'Employé', isApproved: false }
  }
}

const handleLoginSuccess = (userData) => {
  currentUser.value = userData
  // Tes conditions de redirection...
}

const handleLogout = () => {
  currentUser.value = null
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
    <Register v-else-if="currentScreen === 'register'" @go-to-login="currentScreen = 'login'" />
    <WaitingApproval v-else-if="currentScreen === 'waiting-approval'" :currentUser="currentUser" @logout="handleLogout" />
    <RhDashboard v-else-if="currentScreen === 'rh-dashboard'" :currentUser="currentUser" @logout="handleLogout" />
    <ManagerDashboard v-else-if="currentScreen === 'manager-dashboard'" :currentUser="currentUser" @logout="handleLogout" />
    <EmployeeDashboard v-else-if="currentScreen === 'employee-dashboard'" :currentUser="currentUser" @logout="handleLogout" />
  </div>
</template>