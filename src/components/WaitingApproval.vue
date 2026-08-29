<script setup>
import { 
  ClockIcon, 
  CheckCircleIcon, 
  ArrowLeftOnRectangleIcon, 
  BoltIcon 
} from '@heroicons/vue/24/outline'

const props = defineProps({
  currentUser: {
    type: Object,
    default: () => ({ firstName: 'Nouveau', lastName: 'Collaborateur', email: 'employe@entreprise.com' })
  }
})

defineEmits(['logout', 'check-status'])
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
    
    <!-- Halos lumineux en arrière-plan -->
    <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

    <div class="max-w-md w-full bg-[#1e293b]/70 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl text-center space-y-6 relative z-10">
      
      <!-- Icône Animation Attente (Heroicons) -->
      <div class="w-20 h-20 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 animate-pulse">
        <ClockIcon class="w-10 h-10" />
      </div>

      <!-- Titre et explication -->
      <div class="space-y-2">
        <h1 class="text-2xl font-bold text-white">Compte en cours de validation</h1>
        <p class="text-sm text-slate-400">
          Bonjour <strong class="text-slate-200">{{ currentUser?.firstName }}</strong>, votre demande d'inscription a bien été reçue !
        </p>
      </div>

      <!-- Liste de statut -->
      <div class="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-3 text-left">
        <p class="flex items-center gap-2">
          <CheckCircleIcon class="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Inscription enregistrée</span>
        </p>
        <p class="flex items-center gap-2 text-amber-400 font-medium">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <span>En attente de validation RH</span>
        </p>
        <p class="text-slate-500 text-[11px] pt-2 border-t border-slate-800/80 leading-relaxed">
          Un email vous sera envoyé dès que votre accès aura été validé par l'équipe Administration RH.
        </p>
      </div>

      <!-- Boutons d'actions -->
      <div class="space-y-3 pt-2">
        <button 
          @click="$emit('logout')"
          class="w-full py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center space-x-2"
        >
          <ArrowLeftOnRectangleIcon class="w-4 h-4 text-slate-400" />
          <span>Se déconnecter</span>
        </button>
      </div>

    </div>

    <!-- Footer subtil -->
    <div class="flex items-center space-x-1.5 text-xs text-slate-600 mt-8">
      <BoltIcon class="w-3.5 h-3.5 text-indigo-500 fill-indigo-500/20" />
      <span>Onboardly — Sécurité & Validation RH</span>
    </div>
  </div>
</template>