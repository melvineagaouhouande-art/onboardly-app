<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../services/api'
import ParcoursManagement from './ParcoursManagement.vue'
import EmployeeBadges from './EmployeeBadges.vue'
import EmployeeDashboard from './EmployeeDashboard.vue'

// Importation des icônes Heroicons
import {
  BoltIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  TrophyIcon,
  UserGroupIcon,
  BellIcon,
  DocumentTextIcon,
  ArrowLeftOnRectangleIcon,
  ArrowDownTrayIcon,
  DocumentArrowDownIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  XMarkIcon,
  WrenchScrewdriverIcon,
  CheckCircleIcon,
  ClockIcon,
  CheckIcon,
  NoSymbolIcon,
  ArrowPathIcon,
  SparklesIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  currentUser: {
    type: Object,
    default: () => ({ prenom: 'Melvine', nom: 'RH', role: 'admin_rh' })
  }
})

const emit = defineEmits(['logout'])

// Menu actif de la sidebar
const activeMenu = ref('dashboard')

// Gestion de l'aperçu stagiaire
const selectedEmployeeForPreview = ref(null)

// Données dynamiques de l'API
const users = ref([])
const stagiaires = ref([])
const parcoursList = ref([])
const loading = ref(false)
const actionLoading = ref(null)
const userFilter = ref('all') // 'all', 'en_attente', 'actif', 'suspendu'
const notification = ref(null)

const showNotification = (msg, type = 'success') => {
  notification.value = { msg, type }
  setTimeout(() => { notification.value = null }, 4000)
}

// Chargement complet des données depuis l'API Laravel
const loadDashboardData = async () => {
  loading.value = true
  try {
    const [usersRes, stagiairesRes, parcoursRes] = await Promise.allSettled([
      api.get('/users'),
      api.get('/stagiaires'),
      api.get('/parcours')
    ])

    if (usersRes.status === 'fulfilled') {
      users.value = Array.isArray(usersRes.value.data) ? usersRes.value.data : []
    }
    if (stagiairesRes.status === 'fulfilled') {
      stagiaires.value = Array.isArray(stagiairesRes.value.data) ? stagiairesRes.value.data : []
    }
    if (parcoursRes.status === 'fulfilled') {
      parcoursList.value = Array.isArray(parcoursRes.value.data) ? parcoursRes.value.data : []
    }
  } catch (err) {
    console.error("Erreur de chargement du Dashboard RH:", err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDashboardData()
})

// Validation ou modification du statut d'un compte (Valider / Suspendre)
const handleUserStatusChange = async (userId, newStatus) => {
  actionLoading.value = userId
  try {
    await api.patch(`/users/${userId}/statut`, { statut_compte: newStatus })
    
    // Notification visuelle
    const statusMsg = newStatus === 'actif' ? 'Compte validé et activé avec succès !' : `Compte passé en statut : ${newStatus}`
    showNotification(statusMsg, 'success')
    
    // Mise à jour de l'état local immédiatement
    const u = users.value.find(user => user.id === userId)
    if (u) u.statut_compte = newStatus
  } catch (err) {
    showNotification("Erreur lors de la modification du statut du compte.", "error")
  } finally {
    actionLoading.value = null
  }
}

// Calculs des métriques dynamiques
const pendingUsersCount = computed(() => users.value.filter(u => u.statut_compte === 'en_attente').length)
const activeUsersCount = computed(() => users.value.filter(u => u.statut_compte === 'actif').length)
const totalUsersCount = computed(() => users.value.length)
const totalStagiairesCount = computed(() => stagiaires.value.length || users.value.filter(u => u.role === 'employe').length)

// Filtrage dynamique des utilisateurs
const filteredUsers = computed(() => {
  if (userFilter.value === 'all') return users.value
  return users.value.filter(u => u.statut_compte === userFilter.value)
})

const openPreview = (emp) => {
  selectedEmployeeForPreview.value = {
    name: `${emp.prenom || emp.firstName || ''} ${emp.nom || emp.lastName || ''}`,
    role: emp.poste || emp.role || 'Stagiaire',
    initials: `${(emp.prenom || 'E')[0]}${(emp.nom || 'S')[0]}`
  }
}

const closePreview = () => {
  selectedEmployeeForPreview.value = null
}
</script>

<template>
  <div class="min-h-screen bg-[#0b0f19] text-slate-100 flex font-sans w-full overflow-x-hidden">
    
    <!-- Toast Notification -->
    <div 
      v-if="notification" 
      :class="notification.type === 'success' ? 'bg-emerald-600/90 border-emerald-400' : 'bg-rose-600/90 border-rose-400'"
      class="fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl border text-white text-sm font-semibold shadow-2xl backdrop-blur-md flex items-center gap-2 animate-bounce"
    >
      <CheckCircleIcon v-if="notification.type === 'success'" class="w-5 h-5" />
      <ExclamationTriangleIcon v-else class="w-5 h-5" />
      <span>{{ notification.msg }}</span>
    </div>

    <!-- 1. SIDEBAR GAUCHE -->
    <aside class="w-64 bg-[#0f172a]/60 border-r border-slate-800/60 flex flex-col justify-between shrink-0">
      <div>
        <!-- Logo Header -->
        <div class="p-6">
          <div class="flex items-center space-x-2">
            <div class="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <BoltIcon class="w-4 h-4 fill-white" />
            </div>
            <span class="text-xl font-black tracking-wider text-white">Onboardly</span>
          </div>
          <p class="text-[11px] text-slate-500 font-semibold mt-1">Espace Administrateur RH</p>
        </div>

        <!-- Navigation Menu -->
        <nav class="px-3 space-y-1">
          <button 
            @click="activeMenu = 'dashboard'"
            :class="activeMenu === 'dashboard' ? 'bg-indigo-600/20 text-white font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'"
            class="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm transition cursor-pointer"
          >
            <ChartBarIcon class="w-5 h-5 text-indigo-400 shrink-0" />
            <span>Tableau de bord</span>
          </button>

          <!-- Notification Badge pour les Inscriptions en Attente -->
          <button 
            @click="activeMenu = 'users'"
            :class="activeMenu === 'users' ? 'bg-indigo-600/20 text-white font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'"
            class="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition cursor-pointer"
          >
            <div class="flex items-center space-x-3">
              <UserGroupIcon class="w-5 h-5 text-indigo-400 shrink-0" />
              <span>Utilisateurs & Validation</span>
            </div>
            <span v-if="pendingUsersCount > 0" class="px-2 py-0.5 bg-amber-500 text-slate-950 font-extrabold text-xs rounded-full animate-pulse">
              {{ pendingUsersCount }}
            </span>
          </button>

          <button 
            @click="activeMenu = 'quests'"
            :class="activeMenu === 'quests' ? 'bg-indigo-600/20 text-white font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'"
            class="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm transition cursor-pointer"
          >
            <Cog6ToothIcon class="w-5 h-5 text-indigo-400 shrink-0" />
            <span>Parcours & Quêtes</span>
          </button>

          <button 
            @click="activeMenu = 'badges'"
            :class="activeMenu === 'badges' ? 'bg-indigo-600/20 text-white font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'"
            class="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm transition cursor-pointer"
          >
            <TrophyIcon class="w-5 h-5 text-indigo-400 shrink-0" />
            <span>Badges & Récompenses</span>
          </button>

          <button 
            @click="activeMenu = 'alerts'"
            :class="activeMenu === 'alerts' ? 'bg-indigo-600/20 text-white font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'"
            class="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm transition cursor-pointer"
          >
            <BellIcon class="w-5 h-5 text-indigo-400 shrink-0" />
            <span>Alertes & Notifs</span>
          </button>

          <button 
            @click="activeMenu = 'reports'"
            :class="activeMenu === 'reports' ? 'bg-indigo-600/20 text-white font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'"
            class="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm transition cursor-pointer"
          >
            <DocumentTextIcon class="w-5 h-5 text-indigo-400 shrink-0" />
            <span>Rapports</span>
          </button>
        </nav>
      </div>

      <!-- Profil Utilisateur en Bas de Sidebar -->
      <div class="p-4 border-t border-slate-800/60 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-sm text-white shadow-lg shadow-indigo-600/30 uppercase">
            {{ (currentUser.prenom || 'M')[0] }}{{ (currentUser.nom || 'R')[0] }}
          </div>
          <div>
            <h4 class="text-sm font-bold text-white leading-none">{{ currentUser.prenom || 'Melvine' }} {{ currentUser.nom || '' }}</h4>
            <span class="text-[11px] text-indigo-400 font-semibold">Responsable RH</span>
          </div>
        </div>
        <button @click="$emit('logout')" class="text-slate-500 hover:text-rose-400 transition cursor-pointer p-1" title="Déconnexion">
          <ArrowLeftOnRectangleIcon class="w-5 h-5" />
        </button>
      </div>
    </aside>

    <!-- 2. CONTENU PRINCIPAL DYNAMIQUE -->
    <main class="flex-1 p-8 space-y-6 overflow-y-auto">
      
      <!-- MENU 1 : TABLEAU DE BORD (ANALYTICS) -->
      <template v-if="activeMenu === 'dashboard'">
        <!-- Top Header : Titre + Boutons Export & Refresh -->
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold flex items-center gap-2 text-white">
              <ChartBarIcon class="w-7 h-7 text-indigo-400" />
              <span>Analytics RH — Vue d'ensemble</span>
            </h1>
            <p class="text-xs text-slate-400 mt-0.5">Suivi en temps réel des inscriptions et parcours au Bénin</p>
          </div>

          <div class="flex gap-3">
            <button 
              @click="loadDashboardData" 
              class="px-3.5 py-2 bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/40 rounded-xl text-xs font-semibold text-indigo-200 flex items-center gap-2 transition cursor-pointer"
            >
              <ArrowPathIcon :class="{ 'animate-spin': loading }" class="w-4 h-4" />
              <span>Actualiser</span>
            </button>
            <button class="px-4 py-2 bg-[#1e293b]/70 hover:bg-[#1e293b] border border-slate-700/60 rounded-xl text-xs font-semibold text-slate-200 flex items-center gap-2 transition cursor-pointer">
              <DocumentArrowDownIcon class="w-4 h-4 text-slate-400" />
              <span>Exporter PDF</span>
            </button>
          </div>
        </div>

        <!-- Métriques de synthèse (4 Cartes Dynamiques) -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-[#131b2e]/60 border border-slate-800/80 rounded-2xl p-5 text-center shadow-lg">
            <div class="text-3xl font-black text-indigo-400 mb-1">{{ totalUsersCount }}</div>
            <div class="text-xs font-medium text-slate-400">Total Comptes Inscrits</div>
          </div>

          <div class="bg-[#131b2e]/60 border border-slate-800/80 rounded-2xl p-5 text-center shadow-lg">
            <div class="text-3xl font-black text-amber-400 mb-1">{{ pendingUsersCount }}</div>
            <div class="text-xs font-medium text-slate-400">Inscriptions en attente RH</div>
          </div>

          <div class="bg-[#131b2e]/60 border border-slate-800/80 rounded-2xl p-5 text-center shadow-lg">
            <div class="text-3xl font-black text-emerald-400 mb-1">{{ activeUsersCount }}</div>
            <div class="text-xs font-medium text-slate-400">Comptes Actifs</div>
          </div>

          <div class="bg-[#131b2e]/60 border border-slate-800/80 rounded-2xl p-5 text-center shadow-lg">
            <div class="text-3xl font-black text-purple-400 mb-1">{{ totalStagiairesCount }}</div>
            <div class="text-xs font-medium text-slate-400">Stagiaires & Employés</div>
          </div>
        </div>

        <!-- Bandeau d'alerte des Inscriptions en attente -->
        <div v-if="pendingUsersCount > 0" class="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-sm font-medium text-amber-300 flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <ExclamationTriangleIcon class="w-5 h-5 text-amber-400 shrink-0" />
            <span><strong>{{ pendingUsersCount }} inscription(s)</strong> nécessitent votre validation pour passer en statut actif.</span>
          </div>
          <button @click="activeMenu = 'users'; userFilter = 'en_attente'" class="bg-amber-500 text-slate-950 px-4 py-1.5 rounded-xl font-bold text-xs hover:bg-amber-400 transition cursor-pointer">
            Valider maintenant →
          </button>
        </div>

        <!-- Tableau : Stagiaires & Progression -->
        <div class="bg-[#131b2e]/60 border border-slate-800/80 rounded-2xl p-6 shadow-lg">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-base font-bold text-white flex items-center gap-2">
              <UserGroupIcon class="w-5 h-5 text-indigo-400" />
              <span>Liste des Stagiaires & Progression</span>
            </h3>
            <span class="text-xs text-slate-400">{{ stagiaires.length }} stagiaire(s) en base</span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead>
                <tr class="text-slate-400 border-b border-slate-800 uppercase tracking-wider text-xs font-bold">
                  <th class="pb-3">Stagiaire</th>
                  <th class="pb-3">Poste</th>
                  <th class="pb-3">Points</th>
                  <th class="pb-3">Date d'arrivée</th>
                  <th class="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/60">
                <tr v-for="stg in stagiaires" :key="stg.id" class="hover:bg-slate-800/30 transition">
                  <td class="py-4 font-semibold text-white flex items-center space-x-3">
                    <span class="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 font-bold flex items-center justify-center text-xs">
                      {{ (stg.prenom || 'S')[0] }}{{ (stg.nom || 'T')[0] }}
                    </span>
                    <div>
                      <p class="font-bold">{{ stg.prenom }} {{ stg.nom }}</p>
                      <p class="text-xs text-slate-400 font-normal">{{ stg.email }}</p>
                    </div>
                  </td>
                  <td class="py-4 text-slate-300">{{ stg.poste || 'Stagiaire' }}</td>
                  <td class="py-4 text-amber-400 font-bold font-mono">{{ stg.points || 0 }} pts</td>
                  <td class="py-4 text-slate-400 text-xs">{{ stg.date_debut || stg.created_at?.split('T')[0] || 'N/A' }}</td>
                  <td class="py-4 text-right">
                    <button 
                      @click="openPreview(stg)" 
                      class="px-3.5 py-1.5 bg-indigo-600/30 hover:bg-indigo-600 border border-indigo-500/50 text-indigo-200 hover:text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ml-auto cursor-pointer"
                    >
                      <EyeIcon class="w-4 h-4" />
                      <span>Aperçu</span>
                    </button>
                  </td>
                </tr>
                <tr v-if="stagiaires.length === 0">
                  <td colspan="5" class="py-8 text-center text-slate-500 text-xs">Aucun stagiaire enregistré pour le moment.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>

      <!-- MENU 2 : UTILISATEURS & VALIDATION DES INSCRIPTIONS (DYNAMIQUE API) -->
      <template v-else-if="activeMenu === 'users'">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold flex items-center gap-2 text-white">
              <UserGroupIcon class="w-7 h-7 text-indigo-400" />
              <span>Gestion des Utilisateurs & Validation RH</span>
            </h1>
            <p class="text-xs text-slate-400 mt-0.5">Validez les inscriptions et gérez les comptes collaborateurs</p>
          </div>

          <button 
            @click="loadDashboardData" 
            class="px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/40 rounded-xl text-xs font-semibold text-indigo-200 flex items-center gap-2 transition cursor-pointer"
          >
            <ArrowPathIcon :class="{ 'animate-spin': loading }" class="w-4 h-4" />
            <span>Rafraîchir les données</span>
          </button>
        </div>

        <!-- Filtres par Statut -->
        <div class="flex gap-2 border-b border-slate-800 pb-3">
          <button 
            @click="userFilter = 'all'"
            :class="userFilter === 'all' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800'"
            class="px-4 py-2 rounded-xl text-xs transition cursor-pointer"
          >
            Tous ({{ users.length }})
          </button>
          <button 
            @click="userFilter = 'en_attente'"
            :class="userFilter === 'en_attente' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800'"
            class="px-4 py-2 rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5"
          >
            <span>En attente de validation</span>
            <span class="px-2 py-0.2 bg-amber-950 text-amber-200 font-extrabold rounded-full text-[10px]">{{ pendingUsersCount }}</span>
          </button>
          <button 
            @click="userFilter = 'actif'"
            :class="userFilter === 'actif' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800'"
            class="px-4 py-2 rounded-xl text-xs transition cursor-pointer"
          >
            Comptes Actifs ({{ activeUsersCount }})
          </button>
        </div>

        <!-- Tableau des Utilisateurs -->
        <div class="bg-[#131b2e]/60 border border-slate-800/80 rounded-2xl p-6 shadow-lg">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead>
                <tr class="text-slate-400 border-b border-slate-800 uppercase tracking-wider text-xs font-bold">
                  <th class="pb-3">Utilisateur</th>
                  <th class="pb-3">Rôle</th>
                  <th class="pb-3">Département</th>
                  <th class="pb-3">Email Vérifié</th>
                  <th class="pb-3">Statut Compte</th>
                  <th class="pb-3 text-right">Actions RH</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/60">
                <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-slate-800/30 transition">
                  <!-- Identité -->
                  <td class="py-4 font-semibold text-white flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 font-bold flex items-center justify-center text-sm uppercase">
                      {{ (user.prenom || 'U')[0] }}{{ (user.nom || 'S')[0] }}
                    </div>
                    <div>
                      <p class="font-bold text-white">{{ user.prenom }} {{ user.nom }}</p>
                      <p class="text-xs text-slate-400 font-normal">{{ user.email }}</p>
                    </div>
                  </td>

                  <!-- Rôle -->
                  <td class="py-4">
                    <span 
                      :class="{
                        'bg-purple-500/20 text-purple-300 border-purple-500/30': user.role === 'employe',
                        'bg-blue-500/20 text-blue-300 border-blue-500/30': user.role === 'manager',
                        'bg-emerald-500/20 text-emerald-300 border-emerald-500/30': user.role === 'admin_rh'
                      }"
                      class="px-3 py-1 rounded-xl text-xs font-semibold border uppercase tracking-wider"
                    >
                      {{ user.role === 'admin_rh' ? 'Admin RH' : user.role }}
                    </span>
                  </td>

                  <!-- Département -->
                  <td class="py-4 text-slate-300 text-xs">
                    {{ user.departement?.nom || 'Général' }}
                  </td>

                  <!-- Email Vérifié (OTP) -->
                  <td class="py-4">
                    <span v-if="user.email_verified_at" class="inline-flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                      <CheckCircleIcon class="w-4 h-4" />
                      <span>Vérifié</span>
                    </span>
                    <span v-else class="inline-flex items-center gap-1 text-amber-400 text-xs font-semibold">
                      <ClockIcon class="w-4 h-4" />
                      <span>Non vérifié</span>
                    </span>
                  </td>

                  <!-- Statut Compte -->
                  <td class="py-4">
                    <span v-if="user.statut_compte === 'actif'" class="px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold inline-flex items-center gap-1">
                      <CheckIcon class="w-3.5 h-3.5" />
                      <span>Actif</span>
                    </span>
                    <span v-else-if="user.statut_compte === 'en_attente'" class="px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold inline-flex items-center gap-1 animate-pulse">
                      <ClockIcon class="w-3.5 h-3.5" />
                      <span>En attente validation RH</span>
                    </span>
                    <span v-else class="px-3 py-1 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold inline-flex items-center gap-1">
                      <NoSymbolIcon class="w-3.5 h-3.5" />
                      <span>Suspendu</span>
                    </span>
                  </td>

                  <!-- Actions RH (Valider / Suspendre) -->
                  <td class="py-4 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <!-- Bouton Valider -->
                      <button 
                        v-if="user.statut_compte !== 'actif'"
                        @click="handleUserStatusChange(user.id, 'actif')"
                        :disabled="actionLoading === user.id"
                        class="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 transition flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCircleIcon class="w-4 h-4" />
                        <span>Valider l'inscription</span>
                      </button>

                      <!-- Bouton Suspendre -->
                      <button 
                        v-if="user.statut_compte === 'actif'"
                        @click="handleUserStatusChange(user.id, 'suspendu')"
                        :disabled="actionLoading === user.id"
                        class="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600 border border-rose-500/40 text-rose-300 hover:text-white rounded-xl text-xs font-semibold transition cursor-pointer"
                      >
                        Suspendre
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredUsers.length === 0">
                  <td colspan="6" class="py-8 text-center text-slate-500 text-xs">Aucun utilisateur trouvé avec ce filtre.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>

      <!-- MENU 3 : GESTION DES PARCOURS & QUÊTES -->
      <ParcoursManagement v-else-if="activeMenu === 'quests'" />

      <!-- MENU 4 : BADGES & RÉCOMPENSES -->
      <EmployeeBadges v-else-if="activeMenu === 'badges'" />

      <!-- AUTRES MENUS (EN CONSTRUCTION) -->
      <div v-else class="bg-[#131b2e]/60 border border-slate-800/80 rounded-2xl p-12 text-center text-slate-400 flex flex-col items-center justify-center">
        <WrenchScrewdriverIcon class="w-12 h-12 text-slate-600 mb-3" />
        <h3 class="text-lg font-bold text-white mb-1">Section en cours de développement</h3>
        <p class="text-xs">La vue <span class="text-indigo-400 font-mono">{{ activeMenu }}</span> sera bientôt disponible.</p>
      </div>

    </main>

    <!-- 3. MODAL APERÇU STAGIAIRE -->
    <div v-if="selectedEmployeeForPreview" class="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex flex-col justify-center items-center p-4">
      <div class="w-full max-w-6xl bg-indigo-950 border border-indigo-700/60 rounded-t-2xl px-6 py-3 flex items-center justify-between shadow-2xl">
        <div class="flex items-center space-x-3 text-xs">
          <span class="px-2.5 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold rounded-lg uppercase tracking-wide">
            Mode Aperçu RH
          </span>
          <span class="text-slate-300">
            Aperçu en direct de : <strong class="text-white">{{ selectedEmployeeForPreview.name }}</strong> ({{ selectedEmployeeForPreview.role }})
          </span>
        </div>

        <button 
          @click="closePreview" 
          class="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition flex items-center gap-1 cursor-pointer"
        >
          <XMarkIcon class="w-4 h-4" />
          <span>Quitter l'aperçu</span>
        </button>
      </div>

      <div class="w-full max-w-6xl h-[85vh] bg-[#0b0f19] border-x border-b border-indigo-700/60 rounded-b-2xl overflow-hidden shadow-2xl">
        <EmployeeDashboard :currentUser="selectedEmployeeForPreview" />
      </div>
    </div>

  </div>
</template>