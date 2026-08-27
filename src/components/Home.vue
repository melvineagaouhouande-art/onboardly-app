<script setup>
import { ref } from 'vue'

const emit = defineEmits(['go-to-login', 'go-to-register'])

// Liste des modules applicatifs (7 cases)
const modules = ref([
  {
    id: 'login',
    title: 'Connexion sécurisée',
    subtitle: 'Identifiants + code de vérification par email',
    icon: '🔐',
    locked: false,
    action: () => emit('go-to-login')
  },
  {
    id: 'dashboard',
    title: 'Dashboard Employé',
    subtitle: 'Progression, niveau, points, quêtes actives',
    icon: '📊',
    locked: true
  },
  {
    id: 'tasks',
    title: 'Quêtes & Tâches',
    subtitle: 'Liste par étape (Jour 1, Semaine 1, Mois 1)',
    icon: '🎯',
    locked: true
  },
  {
    id: 'badges',
    title: 'Badges & Récompenses',
    subtitle: 'Badges débloqués/verrouillés, classement',
    icon: '🏆',
    locked: true
  },
  {
    id: 'analytics',
    title: 'Analytics RH',
    subtitle: 'Stats globales, alertes retards, rapports',
    icon: '📈',
    locked: true
  },
  {
    id: 'management',
    title: 'Gestion Parcours',
    subtitle: 'CRUD parcours, quêtes, quiz, attribution',
    icon: '⚙️',
    locked: true
  },
  {
    id: 'tracking',
    title: 'Suivi Individuel',
    subtitle: 'Fiche employé, quêtes validées/en retard',
    icon: '👤',
    locked: true
  }
])
</script>

<template>
  <div class="min-h-screen relative flex flex-col text-slate-100 font-sans">
    
    <!-- 1. Image d'arrière-plan fixe -->
    <div 
      class="fixed inset-0 bg-cover bg-center bg-no-repeat scale-105 z-0"
      style="background-image: url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop');">
    </div>
    
    <!-- 2. Overlay sombre + flou artistique fixe -->
    <div class="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-0"></div>

    <!-- 3. EN-TÊTE FIXE + LOGO FLOOTTANT -->
    <header class="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md px-8 py-4 flex justify-center items-center shadow-lg">
      <!-- "animate-float" fait flotter le logo et le texte -->
      <div class="flex items-center space-x-3.5 cursor-default group animate-float">
        <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 p-[1.5px] shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition duration-300">
          <div class="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
            <svg class="w-5 h-5 text-indigo-400 fill-indigo-400/20" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
          </div>
        </div>
        <span class="text-2xl md:text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-200 uppercase">
          Onboardly
        </span>
      </div>
    </header>

    <!-- 4. Contenu défilable -->
    <div class="relative z-10 flex-1 flex flex-col pt-20">

      <!-- SECTION 1 : Vue d'accueil (Hero) -->
      <section class="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto py-12">
        <span class="px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-xs sm:text-sm font-semibold border border-indigo-500/20 mb-6 backdrop-blur-sm">
          La plateforme d'intégration nouvelle génération
        </span>
        
        <h1 class="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight">
          Simplifiez l'accueil de vos <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">nouveaux talents</span>
        </h1>
        
        <p class="text-base sm:text-lg text-slate-300 max-w-2xl mb-10 leading-relaxed">
          Transformez le parcours d'intégration en une aventure fluide et motivante. Suivez les étapes, débloquez des modules et réussissez chaque prise de poste.
        </p>

        <button 
          @click="$emit('go-to-login')"
          class="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-lg px-9 py-4 rounded-xl transition duration-200 shadow-xl shadow-indigo-600/30 hover:scale-105 cursor-pointer flex items-center space-x-2 mb-12">
          <span>Commencer l'aventure</span>
          <span>➔</span>
        </button>

        <div class="animate-bounce flex flex-col items-center text-slate-400 text-xs space-y-1">
          <span>Découvrir les espaces</span>
          <span>↓</span>
        </div>
      </section>

      <!-- SECTION 2 : Maquettes UX/UI & Portails d'accès -->
      <section class="px-6 py-16 max-w-5xl mx-auto w-full">
        
        <div class="text-center mb-10">
          <h2 class="text-3xl font-extrabold text-white mb-2">Portail d'Onboarding RH et de Suivi Gamifié</h2>
          <p class="text-slate-400 text-sm">Vue d'ensemble des espaces applicatifs</p>
        </div>

        <!-- Grille direct sur les 7 cartes -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16">
          <div 
            v-for="item in modules" 
            :key="item.id"
            @click="item.action ? item.action() : null"
            :class="[
              'relative bg-[#1e293b]/70 border rounded-2xl p-6 transition duration-200 flex flex-col items-center text-center justify-center min-h-[140px] backdrop-blur-md',
              item.locked ? 'border-slate-700/50 opacity-75 cursor-not-allowed' : 'border-slate-700/80 hover:border-indigo-500/60 hover:bg-[#1e293b]/90 cursor-pointer hover:-translate-y-0.5 shadow-lg'
            ]"
          >
            <span v-if="item.locked" class="absolute top-4 right-4 text-xs opacity-60" title="Accès verrouillé">🔒</span>

            <div class="text-3xl mb-3">{{ item.icon }}</div>

            <h3 class="font-bold text-white text-lg mb-1">{{ item.title }}</h3>
            <p class="text-slate-400 text-xs">{{ item.subtitle }}</p>
          </div>
        </div>

        <!-- SECTION SÉCURITÉ & CONFIDENTIALITÉ -->
        <div class="bg-[#1e293b]/50 border border-slate-700/60 rounded-2xl p-6 backdrop-blur-md">
          <h3 class="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span>🔒</span> Sécurité, Politique d'accès & Confidentialité
          </h3>
          
          <p class="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
            Les espaces marqués d'un cadenas sont <strong>verrouillés</strong>. Chaque accès exige une authentification complète (email + mot de passe, puis un code de vérification envoyé par email). Le rôle est déduit du compte et détermine les autorisations d'affichage.
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-400 pt-2 border-t border-slate-800">
            <div class="p-2.5 rounded-lg bg-slate-900/60">
              <p class="font-bold text-blue-400 mb-0.5">🛡️ Admin RH</p>
              <p>Accès total (analytics, gestion parcours, suivi, espaces employé).</p>
            </div>
            <div class="p-2.5 rounded-lg bg-slate-900/60">
              <p class="font-bold text-amber-400 mb-0.5">🤝 Manager</p>
              <p>Uniquement le suivi des collaborateurs de son équipe.</p>
            </div>
            <div class="p-2.5 rounded-lg bg-slate-900/60">
              <p class="font-bold text-purple-400 mb-0.5">👤 Employé / Stagiaire</p>
              <p>Accès exclusif à son espace personnel (aucun accès RH).</p>
            </div>
          </div>
        </div>

      </section>

      <!-- Pied de page -->
      <footer class="mt-auto border-t border-slate-800/80 py-6 text-center text-xs text-slate-400 flex flex-col sm:flex-row justify-between items-center px-8 bg-slate-950/40 backdrop-blur-md">
        <span>⚡ © 2026 <strong>Melvine</strong> · Tous droits réservés</span>
        <span class="mt-2 sm:mt-0">Onboardly — maquettes UX/UI v2 · authentification obligatoire + RBAC</span>
      </footer>

    </div>
  </div>
</template>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
</style>