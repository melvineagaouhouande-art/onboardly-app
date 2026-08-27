<script setup>
import { ref } from 'vue'

const points = ref(1240)

const unlockedBadges = ref([
  { id: 1, name: 'Bienvenue à Bord', icon: '🎉', bgColor: 'bg-emerald-500/20 text-emerald-400' },
  { id: 2, name: 'Profil Complété', icon: '📝', bgColor: 'bg-indigo-500/20 text-indigo-400' }
])

const lockedBadges = ref([
  { id: 3, name: 'Expert Sécurité', icon: '🔐' },
  { id: 4, name: "Esprit d'Équipe", icon: '👥' },
  { id: 5, name: 'Ambassadeur', icon: '🤝' },
  { id: 6, name: 'Étudiant Modèle', icon: '📚' },
  { id: 7, name: 'Autonome', icon: '🚀' },
  { id: 8, name: 'Onboarded 100%', icon: '🏆' }
])
</script>

<template>
  <div class="p-6 bg-[#0b0f19] min-h-screen text-slate-100 font-sans space-y-6">
    
    <!-- Top Bar Points -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold flex items-center gap-2 text-white">
          <span>🏆</span> Mes Badges & Récompenses
        </h1>
        <p class="text-xs text-slate-400">2 débloqués sur 8 — Continuez comme ça !</p>
      </div>

      <div class="px-4 py-1.5 bg-amber-500/20 border border-amber-500/30 text-amber-300 font-mono font-bold rounded-xl text-sm">
        {{ points }} pts
      </div>
    </div>

    <!-- Section Badges Débloqués -->
    <div class="space-y-3">
      <h3 class="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
        <span>✅</span> Badges débloqués
      </h3>

      <div class="flex gap-4">
        <div v-for="b in unlockedBadges" :key="b.id" class="flex flex-col items-center gap-2">
          <div :class="b.bgColor" class="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl shadow-lg border border-slate-700/50">
            {{ b.icon }}
          </div>
          <span class="text-xs font-semibold text-slate-200">{{ b.name }}</span>
        </div>
      </div>
    </div>

    <!-- Section Badges Verrouillés -->
    <div class="space-y-3 pt-2">
      <h3 class="text-xs font-bold text-slate-400 flex items-center gap-1.5">
        <span>🔒</span> Badges verrouillés
      </h3>

      <div class="grid grid-cols-3 sm:grid-cols-6 gap-4">
        <div v-for="b in lockedBadges" :key="b.id" class="flex flex-col items-center gap-2 opacity-40 hover:opacity-70 transition">
          <div class="w-20 h-20 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-3xl">
            {{ b.icon }}
          </div>
          <span class="text-[11px] text-center text-slate-400 font-medium">{{ b.name }}</span>
        </div>
      </div>
    </div>

    <!-- Banner Prochain Badge -->
    <div class="bg-indigo-950/40 border border-indigo-800/50 rounded-2xl p-5 flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <div class="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-2xl border border-slate-800">
          🔐
        </div>
        <div>
          <h4 class="text-sm font-bold text-white">Prochain badge à débloquer : Expert Sécurité</h4>
          <p class="text-xs text-slate-400 mt-0.5">Complétez le quiz sécurité avec un score ≥ 80%</p>
        </div>
      </div>
      <span class="text-xs font-bold text-indigo-400 font-mono">0%</span>
    </div>

  </div>
</template>