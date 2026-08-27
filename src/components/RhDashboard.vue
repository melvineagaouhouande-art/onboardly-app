<script setup>
import { ref } from 'vue'
import ParcoursManagement from './ParcoursManagement.vue'
import EmployeeBadges from './EmployeeBadges.vue'
import EmployeeDashboard from './EmployeeDashboard.vue'

const props = defineProps({
  currentUser: {
    type: Object,
    default: () => ({ firstName: 'Melvine', role: 'Admin RH' })
  }
})

const emit = defineEmits(['logout'])

// Menu actif de la sidebar
const activeMenu = ref('dashboard')

// Gestion de l'aperçu stagiaire
const selectedEmployeeForPreview = ref(null)

const openPreview = (emp) => {
  selectedEmployeeForPreview.value = {
    name: emp.name,
    role: emp.role,
    avatar: emp.initials
  }
}

const closePreview = () => {
  selectedEmployeeForPreview.value = null
}

// Données fictives pour le tableau de bord
const employees = ref([
  { id: 1, initials: 'AK', name: 'Amadou K.', role: 'Développeur', progress: 92, progressColor: 'bg-emerald-400', quests: '23/25', points: '1 840', status: 'check' },
  { id: 2, initials: 'LB', name: 'Léa B.', role: 'Développeur', progress: 68, progressColor: 'bg-indigo-400', quests: '17/25', points: '1 240', status: 'wait' },
  { id: 3, initials: 'FD', name: 'Fatou D.', role: 'Commercial', progress: 45, progressColor: 'bg-amber-400', quests: '9/20', points: '680', status: 'wait' },
  { id: 4, initials: 'KM', name: 'Kofi M.', role: 'Marketing', progress: 20, progressColor: 'bg-rose-400', quests: '4/20', points: '180', status: 'alert' }
])
</script>

<template>
  <div class="min-h-screen bg-[#0b0f19] text-slate-100 flex font-sans">
    
    <!-- 1. SIDEBAR GAUCHE -->
    <aside class="w-64 bg-[#0f172a]/60 border-r border-slate-800/60 flex flex-col justify-between shrink-0">
      <div>
        <!-- Logo Header -->
        <div class="p-6">
          <div class="flex items-center space-x-2">
            <span class="text-indigo-500 text-xl font-black">⚡</span>
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
            <span>📊</span>
            <span>Tableau de bord</span>
          </button>

          <button 
            @click="activeMenu = 'quests'"
            :class="activeMenu === 'quests' ? 'bg-indigo-600/20 text-white font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'"
            class="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm transition cursor-pointer"
          >
            <span>⚙️</span>
            <span>Parcours & Quêtes</span>
          </button>

          <button 
            @click="activeMenu = 'badges'"
            :class="activeMenu === 'badges' ? 'bg-indigo-600/20 text-white font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'"
            class="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm transition cursor-pointer"
          >
            <span>🏆</span>
            <span>Badges & Récompenses</span>
          </button>

          <button 
            @click="activeMenu = 'users'"
            :class="activeMenu === 'users' ? 'bg-indigo-600/20 text-white font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'"
            class="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm transition cursor-pointer"
          >
            <span>👥</span>
            <span>Utilisateurs</span>
          </button>

          <button 
            @click="activeMenu = 'alerts'"
            :class="activeMenu === 'alerts' ? 'bg-indigo-600/20 text-white font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'"
            class="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm transition cursor-pointer"
          >
            <span>🔔</span>
            <span>Alertes</span>
          </button>

          <button 
            @click="activeMenu = 'reports'"
            :class="activeMenu === 'reports' ? 'bg-indigo-600/20 text-white font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'"
            class="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm transition cursor-pointer"
          >
            <span>📄</span>
            <span>Rapports</span>
          </button>

          <button 
            @click="activeMenu = 'settings'"
            :class="activeMenu === 'settings' ? 'bg-indigo-600/20 text-white font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'"
            class="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm transition cursor-pointer"
          >
            <span>⚙️</span>
            <span>Paramètres</span>
          </button>
        </nav>
      </div>

      <!-- Profil Utilisateur en Bas de Sidebar -->
      <div class="p-4 border-t border-slate-800/60 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-sm text-white shadow-lg shadow-indigo-600/30">
            ME
          </div>
          <div>
            <h4 class="text-sm font-bold text-white leading-none">{{ currentUser.firstName || 'Melvine' }}</h4>
            <span class="text-[11px] text-slate-400 font-medium">Admin RH</span>
          </div>
        </div>
        <button @click="$emit('logout')" class="text-slate-500 hover:text-rose-400 text-xs transition cursor-pointer" title="Déconnexion">
          🚪
        </button>
      </div>
    </aside>

    <!-- 2. CONTENU PRINCIPAL DYNAMIQUE -->
    <main class="flex-1 p-8 space-y-6 overflow-y-auto">
      
      <!-- MENU 1 : TABLEAU DE BORD (ANALYTICS) -->
      <template v-if="activeMenu === 'dashboard'">
        <!-- Top Header : Titre + Boutons Export -->
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold flex items-center gap-2 text-white">
              <span>📈</span> Analytics — Vue d'ensemble
            </h1>
            <p class="text-xs text-slate-400 mt-0.5">Suivi en temps réel des intégrations</p>
          </div>

          <div class="flex gap-3">
            <button class="px-4 py-2 bg-[#1e293b]/70 hover:bg-[#1e293b] border border-slate-700/60 rounded-xl text-xs font-semibold text-slate-200 flex items-center gap-2 transition cursor-pointer">
              <span>📄</span> Exporter PDF
            </button>
            <button class="px-4 py-2 bg-[#1e293b]/70 hover:bg-[#1e293b] border border-slate-700/60 rounded-xl text-xs font-semibold text-slate-200 flex items-center gap-2 transition cursor-pointer">
              <span>📊</span> Exporter Excel
            </button>
          </div>
        </div>

        <!-- Métriques de synthèse (4 Cartes) -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-[#131b2e]/60 border border-slate-800/80 rounded-2xl p-5 text-center shadow-lg">
            <div class="text-3xl font-black text-indigo-400 mb-1">47</div>
            <div class="text-xs font-medium text-slate-400">Employés en intégration</div>
          </div>

          <div class="bg-[#131b2e]/60 border border-slate-800/80 rounded-2xl p-5 text-center shadow-lg">
            <div class="text-3xl font-black text-emerald-400 mb-1">72%</div>
            <div class="text-xs font-medium text-slate-400">Taux réussite moyen</div>
          </div>

          <div class="bg-[#131b2e]/60 border border-slate-800/80 rounded-2xl p-5 text-center shadow-lg">
            <div class="text-3xl font-black text-amber-400 mb-1">14j</div>
            <div class="text-xs font-medium text-slate-400">Délai moyen complétion</div>
          </div>

          <div class="bg-[#131b2e]/60 border border-slate-800/80 rounded-2xl p-5 text-center shadow-lg">
            <div class="text-3xl font-black text-rose-500 mb-1">5</div>
            <div class="text-xs font-medium text-slate-400">Retards détectés</div>
          </div>
        </div>

        <!-- Bandeau d'alerte Retards -->
        <div class="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-xs font-medium text-amber-300 flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span>⚠️</span>
            <span><strong>5 employés</strong> ont des quêtes en retard de plus de 3 jours</span>
          </div>
          <button @click="activeMenu = 'alerts'" class="hover:underline font-bold cursor-pointer">Voir les alertes →</button>
        </div>

        <!-- Section Graphiques -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <!-- Graphique 1 : Taux de complétion par parcours -->
          <div class="bg-[#131b2e]/60 border border-slate-800/80 rounded-2xl p-6 shadow-lg">
            <h3 class="text-sm font-bold text-white flex items-center gap-2 mb-6">
              <span>📊</span> Taux de complétion par parcours
            </h3>
            
            <div class="bg-[#0b0f19]/80 rounded-xl p-6 h-52 flex items-end justify-between gap-4">
              <div class="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span class="text-[11px] text-slate-400">86%</span>
                <div class="w-full bg-indigo-500 rounded-lg" style="height: 86%;"></div>
                <span class="text-xs text-slate-400 mt-1">Tech</span>
              </div>

              <div class="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span class="text-[11px] text-slate-400">74%</span>
                <div class="w-full bg-indigo-500/80 rounded-lg" style="height: 74%;"></div>
                <span class="text-xs text-slate-400 mt-1">Ventes</span>
              </div>

              <div class="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span class="text-[11px] text-slate-400">68%</span>
                <div class="w-full bg-indigo-500/70 rounded-lg" style="height: 68%;"></div>
                <span class="text-xs text-slate-400 mt-1">RH</span>
              </div>

              <div class="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span class="text-[11px] text-slate-400">61%</span>
                <div class="w-full bg-indigo-500/60 rounded-lg" style="height: 61%;"></div>
                <span class="text-xs text-slate-400 mt-1">Finance</span>
              </div>

              <div class="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span class="text-[11px] text-slate-400">55%</span>
                <div class="w-full bg-indigo-500/50 rounded-lg" style="height: 55%;"></div>
                <span class="text-xs text-slate-400 mt-1">Support</span>
              </div>
            </div>
          </div>

          <!-- Graphique 2 : Évolution engagement -->
          <div class="bg-[#131b2e]/60 border border-slate-800/80 rounded-2xl p-6 shadow-lg">
            <h3 class="text-sm font-bold text-white flex items-center gap-2 mb-6">
              <span>📈</span> Évolution engagement (4 semaines)
            </h3>

            <div class="bg-[#0b0f19]/80 rounded-xl p-6 h-52 flex flex-col justify-between relative overflow-hidden">
              <div class="absolute inset-0 flex flex-col justify-between p-6 opacity-10 pointer-events-none">
                <div class="border-b border-white w-full"></div>
                <div class="border-b border-white w-full"></div>
                <div class="border-b border-white w-full"></div>
              </div>

              <div class="relative z-10 h-32 w-full flex items-end">
                <svg class="w-full h-full overflow-visible" viewBox="0 0 300 100">
                  <path d="M 0 80 L 100 50 L 200 30 L 300 10" fill="none" stroke="#6366f1" stroke-width="3" />
                  <circle cx="0" cy="80" r="4" fill="#818cf8" />
                  <circle cx="100" cy="50" r="4" fill="#818cf8" />
                  <circle cx="200" cy="30" r="4" fill="#818cf8" />
                  <circle cx="300" cy="10" r="4" fill="#818cf8" />
                </svg>
              </div>

              <div class="flex justify-between text-xs text-slate-400 z-10 pt-2 border-t border-slate-800">
                <span>S1 · 240 pts</span>
                <span>S2 · 320</span>
                <span>S3 · 410</span>
                <span>S4 · 480</span>
              </div>
            </div>
          </div>

        </div>

        <!-- Tableau : Progression par employé -->
        <div class="bg-[#131b2e]/60 border border-slate-800/80 rounded-2xl p-6 shadow-lg">
          <h3 class="text-sm font-bold text-white flex items-center gap-2 mb-6">
            <span>👥</span> Progression par employé (top 10)
          </h3>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px] font-bold">
                  <th class="pb-3">Employé</th>
                  <th class="pb-3">Parcours</th>
                  <th class="pb-3">Progression</th>
                  <th class="pb-3">Quêtes faites</th>
                  <th class="pb-3">Points</th>
                  <th class="pb-3">Statut</th>
                  <th class="pb-3 text-right">Aperçu</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/60">
                <tr v-for="emp in employees" :key="emp.id" class="hover:bg-slate-800/30 transition">
                  <td class="py-4 font-semibold text-white flex items-center space-x-3">
                    <span class="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 font-bold flex items-center justify-center text-[10px]">
                      {{ emp.initials }}
                    </span>
                    <span>{{ emp.name }}</span>
                  </td>
                  <td class="py-4 text-slate-300">{{ emp.role }}</td>
                  <td class="py-4 w-48">
                    <div class="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div :class="emp.progressColor" class="h-full rounded-full" :style="{ width: emp.progress + '%' }"></div>
                    </div>
                  </td>
                  <td class="py-4 text-slate-300 font-mono">{{ emp.quests }}</td>
                  <td class="py-4 text-slate-300 font-bold font-mono">{{ emp.points }}</td>
                  <td class="py-4">
                    <span v-if="emp.status === 'check'" class="w-6 h-6 inline-flex items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 text-xs">✅</span>
                    <span v-else-if="emp.status === 'wait'" class="w-6 h-6 inline-flex items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 text-xs">⏳</span>
                    <span v-else-if="emp.status === 'alert'" class="w-6 h-6 inline-flex items-center justify-center rounded-lg bg-rose-500/20 text-rose-400 text-xs">⚠️</span>
                  </td>
                  <!-- Action aperçu -->
                  <td class="py-4 text-right">
                    <button 
                      @click="openPreview(emp)" 
                      class="px-3 py-1.5 bg-indigo-600/30 hover:bg-indigo-600 border border-indigo-500/50 text-indigo-200 hover:text-white rounded-xl text-[11px] font-semibold transition flex items-center gap-1.5 ml-auto cursor-pointer"
                    >
                      <span>👁️</span> Aperçu Stagiaire
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>

      <!-- MENU 2 : GESTION DES PARCOURS & QUÊTES -->
      <ParcoursManagement v-else-if="activeMenu === 'quests'" />

      <!-- MENU 3 : BADGES & RÉCOMPENSES -->
      <EmployeeBadges v-else-if="activeMenu === 'badges'" />

      <!-- MENU SECONDAIRES (ÉCRANS EN CONSTRUCTION) -->
      <div v-else class="bg-[#131b2e]/60 border border-slate-800/80 rounded-2xl p-12 text-center text-slate-400">
        <span class="text-4xl block mb-3">🛠️</span>
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
          <span>✕</span> Quitter l'aperçu
        </button>
      </div>

      <div class="w-full max-w-6xl h-[85vh] bg-[#0b0f19] border-x border-b border-indigo-700/60 rounded-b-2xl overflow-hidden shadow-2xl">
        <EmployeeDashboard :currentUser="selectedEmployeeForPreview" />
      </div>
    </div>

  </div>
</template>