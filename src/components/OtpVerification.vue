<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'

const emit = defineEmits(['verify', 'resend', 'back'])

// Code à 6 chiffres
const digits = reactive(['', '', '', '', '', ''])
const inputRefs = ref([])

// États du formulaire
const loading = ref(false)
const errorMessage = ref('')
const timer = ref(45)
const canResend = ref(false)

// Focus automatique sur le premier champ au chargement
onMounted(() => {
  startTimer()
  if (inputRefs.value[0]) inputRefs.value[0].focus()
})

// Lancement du compte à rebours pour le renvoi de code
const startTimer = () => {
  canResend.value = false
  timer.value = 45
  const interval = setInterval(() => {
    if (timer.value > 0) {
      timer.value--
    } else {
      canResend.value = true
      clearInterval(interval)
    }
  }, 1000)
}

// Gestion de la saisie utilisateur
const handleInput = (index, event) => {
  const val = event.target.value
  // Ne garder que le dernier chiffre tapé
  digits[index] = val.substring(val.length - 1)

  // Passer au champ suivant si rempli
  if (digits[index] && index < 5) {
    nextTick(() => inputRefs.value[index + 1]?.focus())
  }

  // Soumission automatique si tous les champs sont remplis
  if (digits.every(d => d !== '')) {
    submitCode()
  }
}

// Gestion des touches (BackSpace & Flèches)
const handleKeyDown = (index, event) => {
  if (event.key === 'Backspace' && !digits[index] && index > 0) {
    inputRefs.value[index - 1]?.focus()
  } else if (event.key === 'ArrowLeft' && index > 0) {
    inputRefs.value[index - 1]?.focus()
  } else if (event.key === 'ArrowRight' && index < 5) {
    inputRefs.value[index + 1]?.focus()
  }
}

// Gestion du Copier-Coller complet du code
const handlePaste = (event) => {
  event.preventDefault()
  const pastedData = event.clipboardData.getData('text').trim().slice(0, 6)
  if (/^\d+$/.test(pastedData)) {
    pastedData.split('').forEach((char, idx) => {
      if (idx < 6) digits[idx] = char
    })
    if (pastedData.length === 6) {
      submitCode()
    } else {
      inputRefs.value[pastedData.length]?.focus()
    }
  }
}

// Soumission et vérification
const submitCode = () => {
  errorMessage.value = ''
  loading.value = true
  const fullCode = digits.join('')

  // Simulation de vérification API
  setTimeout(() => {
    loading.value = false
    if (fullCode === '123456') { // Exemple de code valide
      emit('verify', fullCode)
    } else {
      errorMessage.value = 'Code de vérification incorrect. Réessayez.'
    }
  }, 1200)
}

// Renvoi de code
const handleResend = () => {
  if (!canResend.value) return
  digits.fill('')
  errorMessage.value = ''
  startTimer()
  emit('resend')
  nextTick(() => inputRefs.value[0]?.focus())
}
</script>

<template>
  <div class="min-h-screen bg-[#0b0f19] text-slate-100 flex items-center justify-center p-4 relative font-sans">
    
    <!-- ARRIÈRE-PLAN AVEC FLOU ET GLOW -->
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0b0f19] to-[#0b0f19] pointer-events-none"></div>

    <!-- CARTE PRINCIPALE -->
    <div class="w-full max-w-md bg-[#121829] border border-slate-800/90 rounded-3xl p-8 shadow-2xl relative z-10 backdrop-blur-xl">
      
      <!-- LOGO ET TÊTE DE CARTE -->
      <div class="flex flex-col items-center text-center space-y-3">
        <div class="w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/10">
          🔐
        </div>
        <h1 class="text-2xl font-black text-white tracking-tight">Double Authentification</h1>
        <p class="text-xs text-slate-400 max-w-xs">
          Un code de sécurité à 6 chiffres a été envoyé à <span class="text-indigo-300 font-semibold">l.bourg@entreprise.com</span>
        </p>
      </div>

      <!-- FORMULAIRE SAISIE CODE OTP -->
      <div class="mt-8 space-y-6">
        
        <div class="flex justify-between gap-2" @paste="handlePaste">
          <input
            v-for="(digit, idx) in digits"
            :key="idx"
            :ref="el => inputRefs[idx] = el"
            type="text"
            inputmode="numeric"
            maxlength="1"
            v-model="digits[idx]"
            @input="handleInput(idx, $event)"
            @keydown="handleKeyDown(idx, $event)"
            :disabled="loading"
            :class="[
              'w-12 h-14 text-center text-xl font-bold rounded-xl bg-[#1b233a] border text-white transition-all duration-150 focus:outline-none',
              errorMessage ? 'border-red-500/60 focus:ring-2 focus:ring-red-500/30' : 'border-slate-700/60 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
            ]"
          />
        </div>

        <!-- MESSAGE D'ERREUR -->
        <p v-if="errorMessage" class="text-xs text-red-400 text-center font-medium bg-red-500/10 py-2 rounded-xl border border-red-500/20">
          {{ errorMessage }}
        </p>

        <!-- BOUTON VALIDER -->
        <button
          @click="submitCode"
          :disabled="loading || digits.some(d => d === '')"
          class="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/20 transition cursor-pointer flex items-center justify-center gap-2"
        >
          <span v-if="loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          <span>{{ loading ? 'Vérification...' : 'Confirmer le code' }}</span>
        </button>

      </div>

      <!-- FOOTER CARTE : RESEND & BACK -->
      <div class="mt-8 pt-6 border-t border-slate-800/80 flex flex-col items-center space-y-3 text-xs">
        <div class="text-slate-400 flex items-center gap-1.5">
          <span>Vous n'avez rien reçu ?</span>
          <button 
            @click="handleResend" 
            :disabled="!canResend"
            :class="[
              'font-bold transition cursor-pointer',
              canResend ? 'text-indigo-400 hover:text-indigo-300 underline' : 'text-slate-600 cursor-not-allowed'
            ]"
          >
            Renvoyer le code <span v-if="!canResend">({{ timer }}s)</span>
          </button>
        </div>

        <button 
          @click="emit('back')" 
          class="text-slate-500 hover:text-slate-300 transition flex items-center gap-1 text-[11px] cursor-pointer mt-2"
        >
          ← Retour à la connexion
        </button>
      </div>

    </div>

    <!-- PIED DE PAGE -->
    <div class="absolute bottom-4 text-center text-[11px] text-slate-600">
      ⚡ © 2026 <strong>Melvine</strong> · Onboardly Security System
    </div>

  </div>
</template>