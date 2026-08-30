<script setup>
import {
  ArrowRightIcon,
  BoltIcon,
  ShieldCheckIcon,
  MapPinIcon,
  UsersIcon,
  UserCircleIcon,
  AcademicCapIcon,
  TrophyIcon,
  ChartBarIcon
} from '@heroicons/vue/24/outline'

defineEmits(['go-to-login', 'go-to-register'])
</script>

<template>
  <div class="min-h-screen relative text-slate-100 font-sans overflow-x-hidden">
    
    <!-- 1. Image d'arrière-plan fixe -->
    <div 
      class="fixed inset-0 bg-cover bg-center bg-no-repeat scale-105 z-0"
      style="background-image: url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop');">
    </div>
    
    <!-- 2. Overlay sombre + flou artistique fixe -->
    <div class="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-0"></div>

    <!-- 3. EN-TÊTE FIXE -->
    <header class="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md px-8 py-4 flex justify-center items-center shadow-lg">
      <div class="flex items-center space-x-3.5 cursor-default group animate-float">
        <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 p-[1.5px] shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition duration-300">
          <div class="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
            <BoltIcon class="w-5 h-5 text-indigo-400 fill-indigo-400/20" />
          </div>
        </div>
        <span class="text-2xl md:text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-200 uppercase">
          Onboardly
        </span>
      </div>
    </header>

    <!-- CONTENU PRINCIPAL SÉPARÉ EN PAGE/SECTIONS -->
    <div class="relative z-10">

      <!-- PAGE 1 : HERO (ACCUEIL) -->
      <section class="min-h-screen flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto pt-20">
        <span class="px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-xs sm:text-sm font-semibold border border-indigo-500/20 mb-6 backdrop-blur-sm flex items-center gap-1.5">
          <BoltIcon class="w-4 h-4" />
          <span>La plateforme d'intégration nouvelle génération</span>
        </span>
        
        <h1 class="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight">
          Simplifiez l'accueil de vos <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">nouveaux talents</span>
        </h1>
        
        <p class="text-base sm:text-lg text-slate-300 max-w-2xl mb-10 leading-relaxed">
          Transformez le parcours d'intégration en une aventure fluide et motivante. Suivez les étapes, débloquez des modules et réussissez chaque prise de poste.
        </p>

        <button 
          @click="$emit('go-to-login')"
          class="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-lg px-9 py-4 rounded-xl transition duration-200 shadow-xl shadow-indigo-600/30 hover:scale-105 cursor-pointer flex items-center gap-2">
          <span>Commencer l'aventure</span>
          <ArrowRightIcon class="w-5 h-5" />
        </button>

        <!-- Indicateur de défilement vers le bas -->
        <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-60 hover:opacity-100 transition">
          <span class="text-xs text-slate-400 mb-1">Découvrir les fonctionnalités</span>
          <div class="w-5 h-8 border-2 border-slate-400 rounded-full flex justify-center p-1">
            <div class="w-1 h-2 bg-slate-400 rounded-full animate-bounce"></div>
          </div>
        </div>
      </section>

      <!-- PAGE 2 : LES 3 FONCTIONNALITÉS -->
      <section class="min-h-screen flex flex-col items-center justify-center px-6 max-w-5xl mx-auto py-20">
        <h2 class="text-2xl md:text-3xl font-extrabold text-white mb-12 text-center">
          Tout ce dont vous avez besoin pour un <span class="text-indigo-400">Onboarding réussi</span>
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          
          <div class="bg-[#1e293b]/70 border border-slate-700/60 rounded-2xl p-6 backdrop-blur-md hover:border-indigo-500/50 transition duration-300">
            <div class="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
              <AcademicCapIcon class="w-6 h-6 text-indigo-400" />
            </div>
            <h3 class="text-lg font-bold text-white mb-2">Parcours d'intégration</h3>
            <p class="text-sm text-slate-400 leading-relaxed">
              Des modules guidés étape par étape pour appréhender l'entreprise et la prise de poste en toute autonomie.
            </p>
          </div>

          <div class="bg-[#1e293b]/70 border border-slate-700/60 rounded-2xl p-6 backdrop-blur-md hover:border-purple-500/50 transition duration-300">
            <div class="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4">
              <TrophyIcon class="w-6 h-6 text-purple-400" />
            </div>
            <h3 class="text-lg font-bold text-white mb-2">Quêtes & Badges</h3>
            <p class="text-sm text-slate-400 leading-relaxed">
              Un système interactif de validation des compétences pour rendre l’apprentissage motivant et ludique.
            </p>
          </div>

          <div class="bg-[#1e293b]/70 border border-slate-700/60 rounded-2xl p-6 backdrop-blur-md hover:border-emerald-500/50 transition duration-300">
            <div class="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
              <ChartBarIcon class="w-6 h-6 text-emerald-400" />
            </div>
            <h3 class="text-lg font-bold text-white mb-2">Suivi de Progression</h3>
            <p class="text-sm text-slate-400 leading-relaxed">
              Un tableau de bord en temps réel pour permettre aux managers et aux RH d'accompagner chaque collaborateur.
            </p>
          </div>

        </div>
      </section>

      <!-- PAGE 3 : SÉCURITÉ & CONFIDENTIALITÉ + FOOTER -->
      <section class="min-h-screen flex flex-col justify-between items-center px-6 max-w-4xl mx-auto pt-24 pb-6">
        
        <div class="my-auto w-full">
          <div class="w-full bg-[#1e293b]/70 border border-slate-700/60 rounded-2xl p-8 backdrop-blur-md text-left shadow-2xl">
            <h3 class="text-base font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2.5">
              <ShieldCheckIcon class="w-6 h-6 text-indigo-400" />
              <span>Sécurité, Politique d'accès & Confidentialité</span>
            </h3>
            
            <p class="text-sm text-slate-300 leading-relaxed mb-6">
              Chaque accès exige une authentification complète (email + mot de passe, puis un code de vérification envoyé par email). Le rôle est déduit du compte et détermine les autorisations d'affichage.
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-400 pt-4 border-t border-slate-800">
              <div class="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col gap-2">
                <div class="flex items-center gap-2">
                  <UsersIcon class="w-5 h-5 text-blue-400" />
                  <p class="font-bold text-blue-400 text-sm">Admin RH</p>
                </div>
                <p>Accès total (analytics, gestion parcours, suivi, espaces employé).</p>
              </div>
              <div class="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col gap-2">
                <div class="flex items-center gap-2">
                  <MapPinIcon class="w-5 h-5 text-amber-400" />
                  <p class="font-bold text-amber-400 text-sm">Manager</p>
                </div>
                <p>Uniquement le suivi des collaborateurs de son équipe.</p>
              </div>
              <div class="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col gap-2">
                <div class="flex items-center gap-2">
                  <UserCircleIcon class="w-5 h-5 text-purple-400" />
                  <p class="font-bold text-purple-400 text-sm">Employé / Stagiaire</p>
                </div>
                <p>Accès exclusif à son espace personnel (aucun accès RH).</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Pied de page -->
        <footer class="w-full border-t border-slate-800/80 py-6 text-center text-xs text-slate-400 flex flex-col sm:flex-row justify-between items-center px-4">
          <div class="flex items-center space-x-1.5">
            <BoltIcon class="w-3.5 h-3.5 text-indigo-500 fill-indigo-500/20" />
            <span>© 2026 <strong>Melvine</strong> · Tous droits réservés</span>
          </div>
          <span class="mt-2 sm:mt-0 text-[11px] text-slate-500">Onboardly v2 · authentification obligatoire + RBAC</span>
        </footer>

      </section>

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