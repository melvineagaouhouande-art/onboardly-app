<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import {
  ArrowRightIcon,
  BoltIcon,
  ShieldCheckIcon,
  MapPinIcon,
  UsersIcon,
  UserCircleIcon,
  AcademicCapIcon,
  TrophyIcon,
  ChartBarIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'

defineEmits(['go-to-login', 'go-to-register'])

const scrollToSection = (id) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

// Logique du carrousel d'images
const currentSlide = ref(0)
let timer = null

const slides = [
  {
    image: '/images/carousel/slide1.png',
    title: 'Intégration d’Équipe & Collaboration à Cotonou',
    description: 'Accueillez chaleureusement vos nouveaux collaborateurs au Bénin dès leur premier jour.'
  },
  {
    image: '/images/carousel/slide2.png',
    title: 'Parcours de Formation & Leadership',
    description: 'Des programmes d’apprentissage modernes guidés par des managers expérimentés.'
  },
  {
    image: '/images/carousel/slide3.png',
    title: 'Environnement de Travail Digital',
    description: 'Une plateforme intuitive centralisant toutes les ressources nécessaires à la prise de poste.'
  },
  {
    image: '/images/carousel/slide4.png',
    title: 'Gamification & Réussite des Objectifs',
    description: 'Relevez des quêtes, validez des compétences et débloquez des badges en toute autonomie.'
  }
]

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length
}

const goToSlide = (index) => {
  currentSlide.value = index
}

onMounted(() => {
  timer = setInterval(nextSlide, 4500)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="min-h-screen relative text-slate-100 font-sans overflow-x-hidden">
    
    <!-- 1. Image d'arrière-plan fixe (Bureaux modernes d'entreprise au Bénin) -->
    <div 
      class="fixed inset-0 bg-cover bg-center bg-no-repeat scale-105 z-0"
      style="background-image: url('/images/carousel/slide4.png');">
    </div>
    
    <!-- 2. Overlay sombre + flou artistique fixe -->
    <div class="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-0"></div>

    <!-- 3. EN-TÊTE AVEC LOGO À GAUCHE & MENU DE NAVIGATION -->
    <header class="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-6 sm:px-10 py-3.5 flex justify-between items-center shadow-xl">
      
      <!-- Logo et Titre à Gauche -->
      <div @click="scrollToSection('hero')" class="flex items-center space-x-3 cursor-pointer group">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 p-[1.5px] shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition duration-300">
          <div class="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
            <BoltIcon class="w-5 h-5 text-indigo-400 fill-indigo-400/20" />
          </div>
        </div>
        <span class="text-xl sm:text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-200 uppercase">
          Onboardly
        </span>
      </div>

      <!-- Liens du Menu de Navigation -->
      <nav class="hidden md:flex items-center space-x-8 text-base font-semibold text-slate-300">
        <button @click="scrollToSection('hero')" class="hover:text-indigo-400 transition cursor-pointer">Accueil</button>
        <button @click="scrollToSection('features')" class="hover:text-indigo-400 transition cursor-pointer">Fonctionnalités</button>
        <button @click="scrollToSection('security')" class="hover:text-indigo-400 transition cursor-pointer">Sécurité & Accès</button>
      </nav>

      <!-- Boutons d'Action Connexion & Inscription -->
      <div class="flex items-center space-x-2 sm:space-x-3">
        <button 
          @click="$emit('go-to-login')" 
          class="px-4 py-2 text-base font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl transition cursor-pointer">
          Connexion
        </button>
        <button 
          @click="$emit('go-to-register')" 
          class="px-5 py-2.5 text-base font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md shadow-indigo-600/30 transition hover:scale-105 cursor-pointer">
          S'inscrire
        </button>
      </div>
    </header>

    <!-- CONTENU PRINCIPAL SÉPARÉ EN PAGE/SECTIONS -->
    <div class="relative z-10">

      <!-- PAGE 1 : HERO (ACCUEIL) -->
      <section id="hero" class="min-h-screen flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto pt-24 pb-16">
        
        <h1 class="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight">
          Simplifiez l'accueil de vos <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">nouveaux talents</span>
        </h1>
        
        <p class="text-lg sm:text-xl text-slate-200 max-w-2xl mb-8 leading-relaxed font-normal">
          Transformez le parcours d'intégration en une aventure fluide et motivante. Suivez les étapes, débloquez des modules et réussissez chaque prise de poste.
        </p>

        <button 
          @click="$emit('go-to-login')"
          class="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xl px-10 py-4.5 rounded-2xl transition duration-200 shadow-xl shadow-indigo-600/30 hover:scale-105 cursor-pointer flex items-center gap-2.5 mb-10">
          <span>Commencer l'aventure</span>
          <ArrowRightIcon class="w-6 h-6" />
        </button>

        <!-- CARROUSEL D'IMAGES DYNAMIQUE -->
        <div class="w-full max-w-4xl relative group rounded-3xl overflow-hidden border border-slate-700/60 shadow-2xl bg-slate-900/60 backdrop-blur-md">
          <div class="relative h-56 sm:h-72 md:h-80 w-full overflow-hidden">
            <div 
              v-for="(slide, index) in slides" 
              :key="index"
              class="absolute inset-0 transition-all duration-700 ease-in-out transform"
              :class="index === currentSlide ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0 pointer-events-none'"
            >
              <img 
                :src="slide.image" 
                :alt="slide.title" 
                class="w-full h-full object-cover object-center"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-6 sm:p-8 text-left">
                <span class="px-3 py-1 bg-indigo-600/80 text-white text-xs font-bold rounded-lg w-max mb-2 backdrop-blur-sm uppercase tracking-wider">Expérience Onboardly</span>
                <h3 class="text-xl sm:text-2xl font-bold text-white mb-1">{{ slide.title }}</h3>
                <p class="text-sm sm:text-base text-slate-300">{{ slide.description }}</p>
              </div>
            </div>
          </div>

          <!-- Boutons Précédent / Suivant -->
          <button 
            @click="prevSlide" 
            class="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-950/60 border border-slate-700/60 text-white flex items-center justify-center backdrop-blur-md hover:bg-indigo-600 transition cursor-pointer shadow-lg opacity-80 group-hover:opacity-100">
            <ChevronLeftIcon class="w-6 h-6" />
          </button>
          <button 
            @click="nextSlide" 
            class="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-950/60 border border-slate-700/60 text-white flex items-center justify-center backdrop-blur-md hover:bg-indigo-600 transition cursor-pointer shadow-lg opacity-80 group-hover:opacity-100">
            <ChevronRightIcon class="w-6 h-6" />
          </button>

          <!-- Puces de pagination -->
          <div class="absolute bottom-4 right-6 z-20 flex space-x-2">
            <button 
              v-for="(slide, index) in slides" 
              :key="index"
              @click="goToSlide(index)"
              class="w-3 h-3 rounded-full transition-all duration-300 cursor-pointer"
              :class="index === currentSlide ? 'bg-indigo-500 w-8' : 'bg-white/40 hover:bg-white/70'"
            ></button>
          </div>
        </div>
      </section>

      <!-- PAGE 2 : LES 3 FONCTIONNALITÉS -->
      <section id="features" class="min-h-screen flex flex-col items-center justify-center px-6 max-w-5xl mx-auto py-20">
        <h2 class="text-3xl md:text-4xl font-extrabold text-white mb-12 text-center">
          Tout ce dont vous avez besoin pour un <span class="text-indigo-400">Onboarding réussi</span>
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          
          <div class="bg-[#1e293b]/70 border border-slate-700/60 rounded-2xl p-6.5 backdrop-blur-md hover:border-indigo-500/50 transition duration-300">
            <div class="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
              <AcademicCapIcon class="w-6 h-6 text-indigo-400" />
            </div>
            <h3 class="text-xl font-bold text-white mb-2.5">Parcours d'intégration</h3>
            <p class="text-base text-slate-300 leading-relaxed">
              Des modules guidés étape par étape pour appréhender l'entreprise et la prise de poste en toute autonomie.
            </p>
          </div>

          <div class="bg-[#1e293b]/70 border border-slate-700/60 rounded-2xl p-6.5 backdrop-blur-md hover:border-purple-500/50 transition duration-300">
            <div class="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4">
              <TrophyIcon class="w-6 h-6 text-purple-400" />
            </div>
            <h3 class="text-xl font-bold text-white mb-2.5">Quêtes & Badges</h3>
            <p class="text-base text-slate-300 leading-relaxed">
              Un système interactif de validation des compétences pour rendre l’apprentissage motivant et ludique.
            </p>
          </div>

          <div class="bg-[#1e293b]/70 border border-slate-700/60 rounded-2xl p-6.5 backdrop-blur-md hover:border-emerald-500/50 transition duration-300">
            <div class="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
              <ChartBarIcon class="w-6 h-6 text-emerald-400" />
            </div>
            <h3 class="text-xl font-bold text-white mb-2.5">Suivi de Progression</h3>
            <p class="text-base text-slate-300 leading-relaxed">
              Un tableau de bord en temps réel pour permettre aux managers et aux RH d'accompagner chaque collaborateur.
            </p>
          </div>

        </div>
      </section>

      <!-- PAGE 3 : SÉCURITÉ & CONFIDENTIALITÉ + FOOTER -->
      <section id="security" class="min-h-screen flex flex-col justify-between items-center px-6 max-w-5xl mx-auto pt-24 pb-6">
        
        <div class="my-auto w-full">
          <div class="w-full bg-[#1e293b]/70 border border-slate-700/60 rounded-2xl p-8.5 backdrop-blur-md text-left shadow-2xl">
            <h3 class="text-lg font-bold text-slate-100 uppercase tracking-wider mb-4 flex items-center gap-2.5">
              <ShieldCheckIcon class="w-6.5 h-6.5 text-indigo-400" />
              <span>Sécurité, Politique d'accès & Confidentialité</span>
            </h3>
            
            <p class="text-base text-slate-200 leading-relaxed mb-6">
              Chaque accès exige une authentification complète (email + mot de passe, puis un code de vérification envoyé par email). Le rôle est déduit du compte et détermine les autorisations d'affichage.
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-5 text-sm text-slate-300 pt-5 border-t border-slate-800">
              <div class="p-5 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col gap-2">
                <div class="flex items-center gap-2">
                  <UsersIcon class="w-5.5 h-5.5 text-blue-400" />
                  <p class="font-bold text-blue-400 text-base">Admin RH</p>
                </div>
                <p class="text-sm leading-relaxed">Accès total (analytics, gestion parcours, suivi, espaces employé).</p>
              </div>
              <div class="p-5 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col gap-2">
                <div class="flex items-center gap-2">
                  <MapPinIcon class="w-5.5 h-5.5 text-amber-400" />
                  <p class="font-bold text-amber-400 text-base">Manager</p>
                </div>
                <p class="text-sm leading-relaxed">Uniquement le suivi des collaborateurs de son équipe.</p>
              </div>
              <div class="p-5 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col gap-2">
                <div class="flex items-center gap-2">
                  <UserCircleIcon class="w-5.5 h-5.5 text-purple-400" />
                  <p class="font-bold text-purple-400 text-base">Employé / Stagiaire</p>
                </div>
                <p class="text-sm leading-relaxed">Accès exclusif à son espace personnel (aucun accès RH).</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Pied de page -->
        <footer class="w-full border-t border-slate-800/80 py-6 text-center text-sm text-slate-400 flex justify-center items-center px-4">
          <div class="flex items-center space-x-2">
            <BoltIcon class="w-4 h-4 text-indigo-500 fill-indigo-500/20" />
            <span>© 2026 <strong>Onboardly</strong> · Tous droits réservés</span>
          </div>
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