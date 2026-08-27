<script setup>
const props = defineProps({
  currentUser: {
    type: Object,
    default: () => ({ firstName: 'Manager', lastName: 'Team', email: 'manager@entreprise.com' })
  }
})

defineEmits(['logout'])
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
    
    <!-- En-tête Navigation Manager -->
    <header class="w-full bg-[#1e293b]/80 border-b border-slate-800 px-6 py-4 flex items-center justify-between backdrop-blur-md sticky top-0 z-50">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 p-[1px] flex items-center justify-center">
          <div class="w-full h-full bg-[#0f172a] rounded-[11px] flex items-center justify-center">
            <svg class="w-5 h-5 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
            </svg>
          </div>
        </div>
        <span class="text-xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
          ONBOARDLY <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 ml-2">Espace Manager</span>
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
          <span>🚪</span>
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
        <div class="bg-[#1e293b]/50 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm">
          <p class="text-xs font-bold uppercase text-purple-400 tracking-wider">Membres de l'équipe</p>
          <p class="text-3xl font-extrabold text-white mt-2">8</p>
        </div>
        <div class="bg-[#1e293b]/50 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm">
          <p class="text-xs font-bold uppercase text-indigo-400 tracking-wider">Onboarding en cours</p>
          <p class="text-3xl font-extrabold text-white mt-2">2</p>
        </div>
        <div class="bg-[#1e293b]/50 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm">
          <p class="text-xs font-bold uppercase text-emerald-400 tracking-wider">Taux de complétion</p>
          <p class="text-3xl font-extrabold text-white mt-2">85%</p>
        </div>
      </div>
    </main>

  </div>
</template>