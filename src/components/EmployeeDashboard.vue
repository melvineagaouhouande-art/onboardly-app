<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../services/api'
import EmployeeBadges from './EmployeeBadges.vue'

// Importation des icônes Heroicons
import {
  BoltIcon,
  ChartBarIcon,
  AcademicCapIcon,
  TrophyIcon,
  BookOpenIcon,
  UserIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  ClipboardDocumentCheckIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  MapPinIcon,
  ArrowRightIcon,
  ArrowPathIcon,
  ArrowLeftOnRectangleIcon,
  CheckIcon
} from '@heroicons/vue/24/outline'

import {
  CheckCircleIcon as CheckCircleSolidIcon,
  TrophyIcon as TrophySolidIcon
} from '@heroicons/vue/24/solid'

const props = defineProps({
  currentUser: {
    type: Object,
    default: () => ({ prenom: 'Collaborateur', nom: '', role: 'employe', email: '' })
  }
})

const emit = defineEmits(['logout', 'go-home'])

// Menu actif : 'dashboard' par défaut
const activeMenu = ref('dashboard')

// États pour les données dynamiques de l'API
const myQuests = ref([])
const availableBadges = ref([])
const loading = ref(true)
const actionLoading = ref(null)
const notification = ref(null)

const showNotification = (msg, type = 'success') => {
  notification.value = { msg, type }
  setTimeout(() => { notification.value = null }, 4000)
}

// Calcul des initiales et nom d'affichage
const userInitials = computed(() => {
  const p = props.currentUser?.prenom || 'E'
  const n = props.currentUser?.nom || 'M'
  return `${p[0]}${n[0]}`.toUpperCase()
})

const userDisplayName = computed(() => {
  if (props.currentUser?.prenom || props.currentUser?.nom) {
    return `${props.currentUser.prenom || ''} ${props.currentUser.nom || ''}`.trim()
  }
  return 'Collaborateur Onboardly'
})

const userRoleLabel = computed(() => {
  if (props.currentUser?.role === 'admin_rh') return 'Administrateur RH'
  if (props.currentUser?.role === 'manager') return 'Manager Référent'
  return props.currentUser?.statut_contrat || 'Stagiaire / Employé'
})

// Dictionnaire pour mapper les icônes Heroicons
const getIconComponent = (iconName) => {
  switch (iconName) {
    case '🤝':
    case 'users':
      return UserGroupIcon
    case '📝':
    case 'profile':
      return ClipboardDocumentCheckIcon
    case '🔐':
    case 'security':
      return ShieldCheckIcon
    case '👥':
    case 'team':
      return UserGroupIcon
    case '📚':
    case 'book':
      return AcademicCapIcon
    default:
      return AcademicCapIcon
  }
}

// 1. CHARGEMENT DES DONNÉES DYNAMIQUES DEPUIS L'API LARAVEL
const fetchDashboardData = async () => {
  loading.value = true
  try {
    const [questsRes, badgesRes] = await Promise.allSettled([
      api.get('/quetes'),
      api.get('/badges')
    ])

    if (questsRes.status === 'fulfilled' && Array.isArray(questsRes.value.data) && questsRes.value.data.length > 0) {
      myQuests.value = questsRes.value.data.map(q => ({
        id: q.id,
        title: q.titre || 'Quête sans titre',
        step: `Ordre : ${q.ordre || 1}`,
        points: q.points || 50,
        status: q.statut || 'todo',
        icon: getIconComponent(q.icone),
        delay: q.delay || null
      }))
    } else {
      // Données de secours par défaut
      myQuests.value = [
        { id: 1, title: 'Rencontrer mon manager', step: 'Jour 1', points: 100, status: 'completed', icon: UserGroupIcon },
        { id: 2, title: 'Compléter mon profil', step: 'Jour 1', points: 50, status: 'completed', icon: ClipboardDocumentCheckIcon },
        { id: 3, title: 'Quiz sécurité informatique', step: 'Semaine 1', points: 150, status: 'todo', delay: null, icon: ShieldCheckIcon },
        { id: 4, title: "Rencontrer l'équipe technique", step: 'Semaine 1', points: 100, status: 'pending_validation', icon: UserGroupIcon },
        { id: 5, title: 'Formation Git & Déploiement', step: 'Semaine 1', points: 200, status: 'todo', icon: AcademicCapIcon }
      ]
    }

    if (badgesRes.status === 'fulfilled' && Array.isArray(badgesRes.value.data)) {
      availableBadges.value = badgesRes.value.data
    }
  } catch (err) {
    console.error('Erreur API Laravel:', err)
  } finally {
    loading.value = false
  }
}

// 2. ACTION DE VALIDATION DE QUÊTE (AVEC MAJ HTTP PUT VERS LARAVEL)
const handleCompleteQuest = async (quest) => {
  if (quest.status === 'todo') {
    actionLoading.value = quest.id
    const previousStatus = quest.status
    quest.status = 'pending_validation'

    try {
      await api.put(`/quetes/${quest.id}`, { statut: 'pending_validation' })
      showNotification("Quête soumise pour validation à votre responsable !", "success")
    } catch (err) {
      console.error("Erreur lors de l'envoi à l'API:", err)
      // En cas d'absence d'ID distant valide, garder le statut local
      showNotification("Quête marquée comme effectuée localement.", "success")
    } finally {
      actionLoading.value = null
    }
  }
}

// 3. PROPRIÉTÉS CALCULÉES (POINTS & PROGRESSION EN TEMPS RÉEL)
const totalPoints = computed(() => {
  return myQuests.value
    .filter(q => q.status === 'completed')
    .reduce((sum, q) => sum + (q.points || 0), 0)
})

const completedQuestsCount = computed(() => {
  return myQuests.value.filter(q => q.status === 'completed').length
})

const progressPercentage = computed(() => {
  if (myQuests.value.length === 0) return 0
  return Math.round((completedQuestsCount.value / myQuests.value.length) * 100)
})

onMounted(() => {
  fetchDashboardData()
})
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

    <!-- 1. SIDEBAR EMPLOYÉ / STAGIAIRE -->
    <aside class="w-64 bg-[#0f172a]/60 border-r border-slate-800/60 flex flex-col justify-between shrink-0">
      <div>
        <div class="p-6">
          <div class="flex items-center space-x-2">
            <div class="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <BoltIcon class="w-4 h-4 fill-white" />
            </div>
            <span class="text-xl font-black tracking-wider text-white">Onboardly</span>
          </div>
          <p class="text-[11px] text-slate-500 font-semibold mt-1">Espace Stagiaire</p>
        </div>

        <nav class="px-3 space-y-1">
          <button 
            @click="activeMenu = 'dashboard'"
            :class="activeMenu === 'dashboard' ? 'bg-indigo-600/20 text-white font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'"
            class="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm transition cursor-pointer"
          >
            <ChartBarIcon class="w-5 h-5 text-indigo-400" />
            <span>Tableau de bord</span>
          </button>

          <button 
            @click="activeMenu = 'quests'"
            :class="activeMenu === 'quests' ? 'bg-indigo-600/20 text-white font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'"
            class="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm transition cursor-pointer"
          >
            <AcademicCapIcon class="w-5 h-5 text-indigo-400" />
            <span>Mes Quêtes</span>
          </button>

          <button 
            @click="activeMenu = 'badges'"
            :class="activeMenu === 'badges' ? 'bg-indigo-600/20 text-white font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'"
            class="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm transition cursor-pointer"
          >
            <TrophyIcon class="w-5 h-5 text-indigo-400" />
            <span>Badges</span>
          </button>

          <button 
            @click="activeMenu = 'resources'"
            :class="activeMenu === 'resources' ? 'bg-indigo-600/20 text-white font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'"
            class="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm transition cursor-pointer"
          >
            <BookOpenIcon class="w-5 h-5 text-indigo-400" />
            <span>Ressources</span>
          </button>

          <button 
            @click="activeMenu = 'profile'"
            :class="activeMenu === 'profile' ? 'bg-indigo-600/20 text-white font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'"
            class="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm transition cursor-pointer"
          >
            <UserIcon class="w-5 h-5 text-indigo-400" />
            <span>Mon Profil</span>
          </button>
        </nav>
      </div>

      <!-- Profil Utilisateur + Déconnexion -->
      <div class="p-4 border-t border-slate-800/60 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-sm text-white shadow-lg shadow-indigo-600/30 uppercase">
            {{ userInitials }}
          </div>
          <div>
            <h4 class="text-sm font-bold text-white leading-none truncate max-w-[100px]">{{ userDisplayName }}</h4>
            <span class="text-[11px] text-slate-400 font-medium capitalize">{{ currentUser?.role || 'Employé' }}</span>
          </div>
        </div>
        <button @click="$emit('logout')" class="text-slate-500 hover:text-rose-400 transition cursor-pointer p-1" title="Déconnexion">
          <ArrowLeftOnRectangleIcon class="w-5 h-5" />
        </button>
      </div>
    </aside>

    <!-- 2. CONTENU PRINCIPAL -->
    <main class="flex-1 p-8 space-y-6 overflow-y-auto">

      <!-- Indicateur de synchro API -->
      <div v-if="loading" class="p-4 bg-indigo-950/40 border border-indigo-800/40 rounded-xl text-xs text-indigo-300 animate-pulse flex items-center gap-2">
        <ArrowPathIcon class="w-4 h-4 animate-spin" />
        <span>Chargement de votre espace personnel...</span>
      </div>

      <!-- MENU 1 : TABLEAU DE BORD -->
      <template v-if="activeMenu === 'dashboard'">
        <!-- Header Stagiaire -->
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-white">Bienvenue, {{ userDisplayName }}</h1>
            <p class="text-xs text-slate-400 mt-0.5">Parcours d'intégration · {{ userRoleLabel }}</p>
          </div>

          <div class="px-4 py-2 bg-indigo-950/60 border border-indigo-800/50 rounded-xl text-xs font-bold text-indigo-300 flex items-center gap-2">
            <TrophySolidIcon class="w-4 h-4 text-amber-400" />
            <span>{{ totalPoints }} Points accumulés</span>
          </div>
        </div>

        <!-- Carte de Progression Globale -->
        <div class="bg-[#131b2e]/60 border border-slate-800/80 rounded-2xl p-6 shadow-lg space-y-3">
          <div class="flex justify-between items-center text-xs">
            <span class="font-bold text-white">Progression Globale du Parcours</span>
            <span class="font-mono font-bold text-indigo-400">{{ progressPercentage }}%</span>
          </div>
          <div class="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
            <div class="bg-indigo-500 h-full rounded-full transition-all duration-500" :style="{ width: progressPercentage + '%' }"></div>
          </div>
          <p class="text-[11px] text-slate-400">{{ completedQuestsCount }} quêtes complétées sur {{ myQuests.length }}</p>
        </div>

        <!-- Grille 2 Colonnes : Quêtes Prioritaires & Badges Récents -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <!-- Quêtes du moment -->
          <div class="bg-[#131b2e]/60 border border-slate-800/80 rounded-2xl p-6 shadow-lg space-y-4">
            <h3 class="text-sm font-bold text-white flex items-center gap-2">
              <AcademicCapIcon class="w-5 h-5 text-indigo-400" />
              <span>Quêtes à réaliser</span>
            </h3>

            <div class="space-y-3 text-xs">
              <div v-for="q in myQuests.slice(0, 4)" :key="q.id" 
                :class="{
                  'bg-rose-500/10 border-rose-500/30': q.status === 'late',
                  'bg-amber-500/10 border-amber-500/30': q.status === 'pending_validation',
                  'bg-slate-900/60 border-slate-800': q.status === 'todo' || q.status === 'completed'
                }"
                class="p-3 border rounded-xl flex items-center justify-between"
              >
                <div class="flex items-center gap-2.5">
                  <component :is="q.icon" class="w-5 h-5 text-indigo-400 shrink-0" />
                  <div>
                    <p class="font-bold text-white">{{ q.title }}</p>
                    <p v-if="q.status === 'late'" class="text-[10px] text-rose-400 flex items-center gap-1">
                      <ExclamationTriangleIcon class="w-3.5 h-3.5 inline" /> En retard {{ q.delay ? 'de ' + q.delay : '' }}
                    </p>
                    <p v-else-if="q.status === 'pending_validation'" class="text-[10px] text-amber-300 flex items-center gap-1">
                      <ClockIcon class="w-3.5 h-3.5 inline" /> En attente validation
                    </p>
                    <p v-else class="text-[10px] text-slate-400">{{ q.step }} · {{ q.points }} pts</p>
                  </div>
                </div>
                
                <button v-if="q.status === 'todo' || q.status === 'late'" @click="handleCompleteQuest(q)" class="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-[11px] cursor-pointer transition">
                  Marquer faite
                </button>
                <span v-else-if="q.status === 'pending_validation'" class="text-[10px] text-amber-400 font-semibold">En cours</span>
                <span v-else class="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircleSolidIcon class="w-4 h-4 text-emerald-400" /> Fait
                </span>
              </div>
            </div>
          </div>

          <!-- Badges Récents & Prochain Objectif -->
          <div class="bg-[#131b2e]/60 border border-slate-800/80 rounded-2xl p-6 shadow-lg space-y-4">
            <h3 class="text-sm font-bold text-white flex items-center gap-2">
              <TrophyIcon class="w-5 h-5 text-amber-400" />
              <span>Mes Récompenses</span>
            </h3>

            <div class="flex gap-3">
              <div class="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex-1 text-center flex flex-col items-center">
                <BoltIcon class="w-7 h-7 text-emerald-400 mb-1" />
                <p class="text-[11px] font-bold text-white">Bienvenue</p>
              </div>
              <div class="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl flex-1 text-center flex flex-col items-center">
                <ClipboardDocumentCheckIcon class="w-7 h-7 text-indigo-400 mb-1" />
                <p class="text-[11px] font-bold text-white">Profil Actif</p>
              </div>
            </div>

            <div class="p-4 bg-indigo-950/30 border border-indigo-800/40 rounded-xl flex items-center justify-between text-xs">
              <div>
                <p class="font-bold text-white">Prochain badge : Expert Sécurité</p>
                <p class="text-[10px] text-slate-400">Complétez le quiz sécurité</p>
              </div>
              <button @click="activeMenu = 'badges'" class="text-indigo-400 hover:underline font-bold text-[11px] cursor-pointer flex items-center gap-1">
                <span>Voir tout</span>
                <ArrowRightIcon class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </template>

      <!-- MENU 2 : MES QUÊTES -->
      <template v-else-if="activeMenu === 'quests'">
        <div>
          <h1 class="text-2xl font-bold text-white mb-1">Mes Quêtes</h1>
          <p class="text-xs text-slate-400">Réalisez vos missions pour accumuler des points et débloquer des badges</p>
        </div>

        <div class="bg-[#131b2e]/60 border border-slate-800/80 rounded-2xl p-6 shadow-lg space-y-3">
          <div v-for="q in myQuests" :key="q.id" class="flex items-center justify-between p-4 bg-[#0b0f19]/80 border border-slate-800 rounded-xl text-xs">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                <component :is="q.icon" class="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <p class="font-bold text-white">{{ q.title }}</p>
                <p class="text-[10px] text-slate-400">{{ q.step }} · <span class="text-amber-400 font-bold">+{{ q.points }} pts</span></p>
              </div>
            </div>

            <div>
              <span v-if="q.status === 'completed'" class="px-3 py-1 bg-emerald-500/20 text-emerald-400 font-bold rounded-lg flex items-center gap-1">
                <CheckCircleIcon class="w-4 h-4" /> Validée
              </span>
              <span v-else-if="q.status === 'pending_validation'" class="px-3 py-1 bg-amber-500/20 text-amber-300 font-bold rounded-lg flex items-center gap-1">
                <ClockIcon class="w-4 h-4" /> En attente
              </span>
              <span v-else-if="q.status === 'late'" class="px-3 py-1 bg-rose-500/20 text-rose-400 font-bold rounded-lg flex items-center gap-1">
                <ExclamationTriangleIcon class="w-4 h-4" /> Retard {{ q.delay ? '(' + q.delay + ')' : '' }}
              </span>
              <button v-else @click="handleCompleteQuest(q)" class="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition cursor-pointer">
                Marquer comme faite
              </button>
            </div>
          </div>
        </div>
      </template>

      <!-- MENU 3 : BADGES -->
      <EmployeeBadges v-else-if="activeMenu === 'badges'" :points="totalPoints" />

      <!-- MENU 4 : RESSOURCES -->
      <template v-else-if="activeMenu === 'resources'">
        <div>
          <h1 class="text-2xl font-bold text-white mb-1">Ressources & Documents</h1>
          <p class="text-xs text-slate-400">Guides, chartes internes et documentation technique</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-[#131b2e]/60 border border-slate-800/80 rounded-2xl p-5 text-xs space-y-2">
            <DocumentTextIcon class="w-8 h-8 text-indigo-400 mb-1" />
            <h4 class="font-bold text-white">Charte Informatique</h4>
            <p class="text-slate-400 text-[11px]">Règles de sécurité et bon usage du matériel.</p>
            <button class="text-indigo-400 hover:underline font-bold text-[11px] cursor-pointer flex items-center gap-1">
              <span>Télécharger PDF</span>
              <ArrowRightIcon class="w-3.5 h-3.5" />
            </button>
          </div>

          <div class="bg-[#131b2e]/60 border border-slate-800/80 rounded-2xl p-5 text-xs space-y-2">
            <GlobeAltIcon class="w-8 h-8 text-indigo-400 mb-1" />
            <h4 class="font-bold text-white">Guide d'Architecture Tech</h4>
            <p class="text-slate-400 text-[11px]">Introduction au stack et conventions de code.</p>
            <button class="text-indigo-400 hover:underline font-bold text-[11px] cursor-pointer flex items-center gap-1">
              <span>Consulter Notion</span>
              <ArrowRightIcon class="w-3.5 h-3.5" />
            </button>
          </div>

          <div class="bg-[#131b2e]/60 border border-slate-800/80 rounded-2xl p-5 text-xs space-y-2">
            <MapPinIcon class="w-8 h-8 text-indigo-400 mb-1" />
            <h4 class="font-bold text-white">Plan des Locaux</h4>
            <p class="text-slate-400 text-[11px]">Accès aux salles de réunion et cafétéria.</p>
            <button class="text-indigo-400 hover:underline font-bold text-[11px] cursor-pointer flex items-center gap-1">
              <span>Voir la carte</span>
              <ArrowRightIcon class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </template>

      <!-- MENU 5 : MON PROFIL DYNAMIQUE -->
      <template v-else-if="activeMenu === 'profile'">
        <div>
          <h1 class="text-2xl font-bold text-white mb-1">Mon Profil</h1>
          <p class="text-xs text-slate-400">Vos informations personnelles et paramètres</p>
        </div>

        <div class="bg-[#131b2e]/60 border border-slate-800/80 rounded-2xl p-6 shadow-lg max-w-xl space-y-4 text-xs">
          <!-- Avatar + Nom réel -->
          <div class="flex items-center space-x-4">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center font-black text-2xl text-white shadow-xl shadow-indigo-600/30 uppercase">
              {{ userInitials }}
            </div>
            <div>
              <h3 class="text-lg font-bold text-white">{{ userDisplayName }}</h3>
              <p class="text-indigo-400 font-semibold capitalize">{{ currentUser?.role || 'Employé' }}</p>
              <span class="inline-flex items-center gap-1 px-2.5 py-0.5 mt-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold rounded-lg text-[10px]">
                <CheckIcon class="w-3 h-3" />
                Compte Actif
              </span>
            </div>
          </div>

          <!-- Champs dynamiques du profil -->
          <div class="pt-4 border-t border-slate-800 space-y-3">
            <div>
              <label class="text-slate-400 block mb-1">Email professionnel</label>
              <input type="email" :value="currentUser?.email || 'N/A'" disabled class="w-full bg-[#0b0f19] border border-slate-700/80 rounded-xl p-3 text-slate-200 font-medium" />
            </div>

            <div>
              <label class="text-slate-400 block mb-1">Rôle / Statut</label>
              <input type="text" :value="userRoleLabel" disabled class="w-full bg-[#0b0f19] border border-slate-700/80 rounded-xl p-3 text-slate-200 font-medium capitalize" />
            </div>

            <div>
              <label class="text-slate-400 block mb-1">Département</label>
              <input type="text" :value="currentUser?.departement?.nom || 'Développement & Technologie'" disabled class="w-full bg-[#0b0f19] border border-slate-700/80 rounded-xl p-3 text-slate-200 font-medium" />
            </div>

            <div v-if="currentUser?.date_arrivee">
              <label class="text-slate-400 block mb-1">Date d'arrivée</label>
              <input type="text" :value="currentUser.date_arrivee" disabled class="w-full bg-[#0b0f19] border border-slate-700/80 rounded-xl p-3 text-slate-200 font-medium" />
            </div>
          </div>
        </div>
      </template>

    </main>
  </div>
</template>