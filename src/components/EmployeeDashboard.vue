<script setup>
import { ref } from 'vue'
import EmployeeBadges from './EmployeeBadges.vue'

const props = defineProps({
  currentUser: {
    type: Object,
    default: () => ({ name: 'Léa B.', role: 'Développeur Web', avatar: 'LB' })
  }
})

// Menu actif : 'dashboard' par défaut (avec l'ancien design rétabli)
const activeMenu = ref('dashboard')

// Quêtes du stagiaire
const myQuests = ref([
  { id: 1, title: 'Rencontrer mon manager', step: 'Jour 1', points: 100, status: 'completed', icon: '🤝' },
  { id: 2, title: 'Compléter mon profil', step: 'Jour 1', points: 50, status: 'completed', icon: '📝' },
  { id: 3, title: 'Quiz sécurité', step: 'Semaine 1', points: 150, status: 'late', delay: '3 jours', icon: '🔐' },
  { id: 4, title: "Rencontrer l'équipe", step: 'Semaine 1', points: 100, status: 'pending_validation', icon: '👥' },
  { id: 5, title: 'Formation Git', step: 'Semaine 1', points: 200, status: 'todo', icon: '📚' }
])

const handleCompleteQuest = (quest) => {
  if (quest.status === 'todo') {
    quest.status = 'pending_validation'
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#0b0f19] text-slate-100 flex font-sans">
    
    <!-- 1. SIDEBAR EMPLOYÉ / STAGIAIRE -->
    <aside class="w-64 bg-[#0f172a]/60 border-r border-slate-800/60 flex flex-col justify-between shrink-0">
      <div>
        <div class="p-6">
          <div class="flex items-center space-x-2">
            <span class="text-indigo-500 text-xl font-black">⚡</span>
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
            <span>📊</span>
            <span>Tableau de bord</span>
          </button>

          <button 
            @click="activeMenu = 'quests'"
            :class="activeMenu === 'quests' ? 'bg-indigo-600/20 text-white font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'"
            class="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm transition cursor-pointer"
          >
            <span>🎯</span>
            <span>Mes Quêtes</span>
          </button>

          <button 
            @click="activeMenu = 'badges'"
            :class="activeMenu === 'badges' ? 'bg-indigo-600/20 text-white font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'"
            class="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm transition cursor-pointer"
          >
            <span>🏆</span>
            <span>Badges</span>
          </button>

          <button 
            @click="activeMenu = 'resources'"
            :class="activeMenu === 'resources' ? 'bg-indigo-600/20 text-white font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'"
            class="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm transition cursor-pointer"
          >
            <span>📖</span>
            <span>Ressources</span>
          </button>

          <button 
            @click="activeMenu = 'profile'"
            :class="activeMenu === 'profile' ? 'bg-indigo-600/20 text-white font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'"
            class="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm transition cursor-pointer"
          >
            <span>👤</span>
            <span>Mon Profil</span>
          </button>
        </nav>
      </div>

      <div class="p-4 border-t border-slate-800/60 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-sm text-white shadow-lg">
            {{ currentUser.avatar }}
          </div>
          <div>
            <h4 class="text-sm font-bold text-white leading-none">{{ currentUser.name }}</h4>
            <span class="text-[11px] text-slate-400 font-medium">{{ currentUser.role }}</span>
          </div>
        </div>
      </div>
    </aside>

    <!-- 2. CONTENU PRINCIPAL -->
    <main class="flex-1 p-8 space-y-6 overflow-y-auto">

      <!-- MENU 1 : TABLEAU DE BORD (ANCIEN DESIGN RÉTABLI) -->
      <template v-if="activeMenu === 'dashboard'">
        <!-- Header Stagiaire -->
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-white">Bienvenue, {{ currentUser.name }} 👋</h1>
            <p class="text-xs text-slate-400 mt-0.5">Parcours d'intégration · {{ currentUser.role }}</p>
          </div>

          <div class="px-4 py-2 bg-indigo-950/60 border border-indigo-800/50 rounded-xl text-xs font-bold text-indigo-300 flex items-center gap-2">
            <span>🏆</span> 1 240 Points accumulés
          </div>
        </div>

        <!-- Carte de Progression Globale -->
        <div class="bg-[#131b2e]/60 border border-slate-800/80 rounded-2xl p-6 shadow-lg space-y-3">
          <div class="flex justify-between items-center text-xs">
            <span class="font-bold text-white">Progression Globale du Parcours</span>
            <span class="font-mono font-bold text-indigo-400">68%</span>
          </div>
          <div class="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
            <div class="bg-indigo-500 h-full rounded-full transition-all duration-500" style="width: 68%;"></div>
          </div>
          <p class="text-[11px] text-slate-400">17 quêtes complétées sur 25</p>
        </div>

        <!-- Grille 2 Colonnes : Quêtes Prioritaires & Badges Récents -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <!-- Quêtes du moment -->
          <div class="bg-[#131b2e]/60 border border-slate-800/80 rounded-2xl p-6 shadow-lg space-y-4">
            <h3 class="text-sm font-bold text-white flex items-center gap-2">
              <span>🎯</span> Quêtes à réaliser
            </h3>

            <div class="space-y-3 text-xs">
              <div class="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                  <span>🔐</span>
                  <div>
                    <p class="font-bold text-white">Quiz sécurité</p>
                    <p class="text-[10px] text-rose-400">⚠️ En retard de 3 jours</p>
                  </div>
                </div>
                <button @click="activeMenu = 'quests'" class="px-3 py-1 bg-rose-600 text-white rounded-lg font-bold text-[11px] cursor-pointer">Faire</button>
              </div>

              <div class="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                  <span>👥</span>
                  <div>
                    <p class="font-bold text-white">Rencontrer l'équipe</p>
                    <p class="text-[10px] text-amber-300">⏳ En attente validation manager</p>
                  </div>
                </div>
                <span class="text-[10px] text-slate-400">En cours</span>
              </div>

              <div class="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                  <span>📚</span>
                  <div>
                    <p class="font-bold text-white">Formation Git</p>
                    <p class="text-[10px] text-slate-400">Semaine 1 · 200 pts</p>
                  </div>
                </div>
                <button @click="activeMenu = 'quests'" class="px-3 py-1 bg-indigo-600 text-white rounded-lg font-bold text-[11px] cursor-pointer">Démarrer</button>
              </div>
            </div>
          </div>

          <!-- Badges Récents & Prochain Objectif -->
          <div class="bg-[#131b2e]/60 border border-slate-800/80 rounded-2xl p-6 shadow-lg space-y-4">
            <h3 class="text-sm font-bold text-white flex items-center gap-2">
              <span>🏅</span> Mes Récompenses
            </h3>

            <div class="flex gap-3">
              <div class="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex-1 text-center">
                <span class="text-2xl block mb-1">🎉</span>
                <p class="text-[11px] font-bold text-white">Bienvenue</p>
              </div>
              <div class="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl flex-1 text-center">
                <span class="text-2xl block mb-1">📝</span>
                <p class="text-[11px] font-bold text-white">Profil Complété</p>
              </div>
            </div>

            <div class="p-4 bg-indigo-950/30 border border-indigo-800/40 rounded-xl flex items-center justify-between text-xs">
              <div>
                <p class="font-bold text-white">Prochain badge : Expert Sécurité</p>
                <p class="text-[10px] text-slate-400">Complétez le quiz sécurité</p>
              </div>
              <button @click="activeMenu = 'badges'" class="text-indigo-400 hover:underline font-bold text-[11px] cursor-pointer">Voir tout →</button>
            </div>
          </div>

        </div>
      </template>

      <!-- MENU 2 : MES QUÊTES -->
      <template v-else-if="activeMenu === 'quests'">
        <div>
          <h1 class="text-2xl font-bold text-white mb-1">🎯 Mes Quêtes</h1>
          <p class="text-xs text-slate-400">Réalisez vos missions pour accumuler des points et débloquer des badges</p>
        </div>

        <div class="bg-[#131b2e]/60 border border-slate-800/80 rounded-2xl p-6 shadow-lg space-y-3">
          <div v-for="q in myQuests" :key="q.id" class="flex items-center justify-between p-4 bg-[#0b0f19]/80 border border-slate-800 rounded-xl text-xs">
            <div class="flex items-center gap-3">
              <span class="text-xl">{{ q.icon }}</span>
              <div>
                <p class="font-bold text-white">{{ q.title }}</p>
                <p class="text-[10px] text-slate-400">{{ q.step }} · <span class="text-amber-400 font-bold">+{{ q.points }} pts</span></p>
              </div>
            </div>

            <div>
              <span v-if="q.status === 'completed'" class="px-3 py-1 bg-emerald-500/20 text-emerald-400 font-bold rounded-lg">✅ Validée</span>
              <span v-else-if="q.status === 'pending_validation'" class="px-3 py-1 bg-amber-500/20 text-amber-300 font-bold rounded-lg">⏳ En attente</span>
              <span v-else-if="q.status === 'late'" class="px-3 py-1 bg-rose-500/20 text-rose-400 font-bold rounded-lg">⚠️ Retard ({{ q.delay }})</span>
              <button v-else @click="handleCompleteQuest(q)" class="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition cursor-pointer">Marquer comme faite</button>
            </div>
          </div>
        </div>
      </template>

      <!-- MENU 3 : BADGES -->
      <EmployeeBadges v-else-if="activeMenu === 'badges'" />

      <!-- MENU 4 : RESSOURCES -->
      <template v-else-if="activeMenu === 'resources'">
        <div>
          <h1 class="text-2xl font-bold text-white mb-1">📖 Ressources & Documents</h1>
          <p class="text-xs text-slate-400">Guides, chartes internes et documentation technique</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-[#131b2e]/60 border border-slate-800/80 rounded-2xl p-5 text-xs space-y-2">
            <span class="text-2xl block">📄</span>
            <h4 class="font-bold text-white">Charte Informatique</h4>
            <p class="text-slate-400 text-[11px]">Règles de sécurité et bon usage du matériel.</p>
            <button class="text-indigo-400 hover:underline font-bold text-[11px] cursor-pointer">Télécharger PDF →</button>
          </div>

          <div class="bg-[#131b2e]/60 border border-slate-800/80 rounded-2xl p-5 text-xs space-y-2">
            <span class="text-2xl block">🌐</span>
            <h4 class="font-bold text-white">Guide d'Architecture Tech</h4>
            <p class="text-slate-400 text-[11px]">Introduction au stack et conventions de code.</p>
            <button class="text-indigo-400 hover:underline font-bold text-[11px] cursor-pointer">Consulter Notion →</button>
          </div>

          <div class="bg-[#131b2e]/60 border border-slate-800/80 rounded-2xl p-5 text-xs space-y-2">
            <span class="text-2xl block">🏢</span>
            <h4 class="font-bold text-white">Plan des Locaux</h4>
            <p class="text-slate-400 text-[11px]">Accès aux salles de réunion et cafétéria.</p>
            <button class="text-indigo-400 hover:underline font-bold text-[11px] cursor-pointer">Voir la carte →</button>
          </div>
        </div>
      </template>

      <!-- MENU 5 : MON PROFIL -->
      <template v-else-if="activeMenu === 'profile'">
        <div>
          <h1 class="text-2xl font-bold text-white mb-1">👤 Mon Profil</h1>
          <p class="text-xs text-slate-400">Vos informations personnelles et paramètres</p>
        </div>

        <div class="bg-[#131b2e]/60 border border-slate-800/80 rounded-2xl p-6 shadow-lg max-w-xl space-y-4 text-xs">
          <div class="flex items-center space-x-4">
            <div class="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center font-bold text-xl text-white">
              {{ currentUser.avatar }}
            </div>
            <div>
              <h3 class="text-base font-bold text-white">{{ currentUser.name }}</h3>
              <p class="text-slate-400">{{ currentUser.role }}</p>
            </div>
          </div>

          <div class="pt-4 border-t border-slate-800 space-y-3">
            <div>
              <label class="text-slate-400 block mb-1">Email professionnel</label>
              <input type="email" value="lea.b@entreprise.com" disabled class="w-full bg-[#0b0f19] border border-slate-700 rounded-xl p-2.5 text-slate-300" />
            </div>
            <div>
              <label class="text-slate-400 block mb-1">Manager référent</label>
              <input type="text" value="Koffi A. (Lead Tech)" disabled class="w-full bg-[#0b0f19] border border-slate-700 rounded-xl p-2.5 text-slate-300" />
            </div>
          </div>
        </div>
      </template>

    </main>
  </div>
</template>