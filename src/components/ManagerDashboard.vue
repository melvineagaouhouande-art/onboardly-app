<script setup>
import {
  UsersIcon,
  ArrowRightOnRectangleIcon,
  UserGroupIcon,
  ClockIcon,
  ChartBarIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  currentUser: {
    type: Object,
    default: () => ({ firstName: 'Manager', lastName: 'Team', email: 'manager@entreprise.com' })
  }
})

defineEmits(['logout'])
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
    
    <!-- En-tête Navigation Manager -->
    <header class="w-full bg-[#1e293b]/80 border-b border-slate-800 px-6 py-4 flex items-center justify-between backdrop-blur-md sticky top-0 z-50">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 p-[1px] flex items-center justify-center shadow-lg shadow-purple-500/10">
          <div class="w-full h-full bg-[#0f172a] rounded-[11px] flex items-center justify-center">
            <UsersIcon class="w-5 h-5 text-purple-400" />
          </div>
        </div>
        <span class="text-xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
          ONBOARDLY <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 ml-2">Espace Manager</span>
        </span>
      </div>

      <div class="flex items-center space-x-4">
        <div class="text-right hidden sm:block">
          <p class="text-sm font-semibold text-slate-200">{{ currentUser?.firstName }} {{ currentUser?.lastName }}</p>
          <p class="text-xs text-slate-400">{{ currentUser?.email }}</p>
        </div>
        
        <!-- Bouton Déconnexion harmonisé -->
        <button 
          type="button"
          @click="$emit('logout')"
          class="px-4 py-2 bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 border border-slate-700 hover:border-rose-500/30 text-slate-300 text-xs font-semibold rounded-xl transition cursor-pointer flex items-center space-x-2"
        >
          <ArrowRightOnRectangleIcon class="w-4 h-4" />
          <span>Déconnexion</span>
        </button>
      </div>
    </header>

    <!-- Contenu Manager -->
    <main class="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-8">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-white">Tableau de bord Manager</h1>
        <p class="text-slate-400 text-sm mt-1">Suivez l'intégration des nouveaux membres de votre équipe.</p>
      </div>

      <!-- Statistiques Équipe -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="bg-[#1e293b]/50 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm space-y-2">
          <div class="flex items-center justify-between">
            <p class="text-xs font-bold uppercase text-purple-400 tracking-wider">Membres de l'équipe</p>
            <UserGroupIcon class="w-5 h-5 text-purple-400/80" />
          </div>
          <p class="text-3xl font-extrabold text-white">8</p>
        </div>

        <div class="bg-[#1e293b]/50 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm space-y-2">
          <div class="flex items-center justify-between">
            <p class="text-xs font-bold uppercase text-indigo-400 tracking-wider">Onboarding en cours</p>
            <ClockIcon class="w-5 h-5 text-indigo-400/80" />
          </div>
          <p class="text-3xl font-extrabold text-white">2</p>
        </div>

        <div class="bg-[#1e293b]/50 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm space-y-2">
          <div class="flex items-center justify-between">
            <p class="text-xs font-bold uppercase text-emerald-400 tracking-wider">Taux de complétion</p>
            <ChartBarIcon class="w-5 h-5 text-emerald-400/80" />
          </div>
          <p class="text-3xl font-extrabold text-white">85%</p>
        </div>
      </div>
    </main>

  </div>
</template>