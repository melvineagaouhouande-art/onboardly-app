<script setup>
import { ref, onMounted } from 'vue'

const emit = defineEmits(['go-to-register', 'go-to-home', 'login-success'])

const step = ref('credentials') // 'credentials' | 'otp'
const showPassword = ref(false)
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const otpDigits = ref(['', '', '', '', '', ''])
const errorMessage = ref('')

const fetchLoginConfig = async () => {
  return {
    allowPasswordReset: true,
    ssoEnabled: false
  }
}

onMounted(async () => {
  await fetchLoginConfig()
  // Vider explicitement les champs pour contourner l'autofill agressif des navigateurs
  email.value = ''
  password.value = ''
})

// Étape 1 : Saisie des identifiants et envoi du code par mail
const handleLogin = () => {
  errorMessage.value = ''
  if (!email.value || !password.value) {
    alert('Veuillez remplir tous les champs.')
    return
  }

  // Passage à l'étape du code de vérification e-mail
  step.value = 'otp'
}

// Gestion de la saisie fluide casier par casier
const handleOtpInput = (index, event) => {
  const value = event.target.value
  if (value && index < 5) {
    const nextInput = event.target.nextElementSibling
    if (nextInput) nextInput.focus()
  }
}

// Étape 2 : Confirmation du code à 6 chiffres
const handleVerifyOtp = () => {
  const code = otpDigits.value.join('')
  if (code.length < 6) {
    errorMessage.value = 'Veuillez saisir le code complet à 6 chiffres.'
    return
  }

  emit('login-success', {
    email: email.value.trim().toLowerCase(),
    password: password.value,
    rememberMe: rememberMe.value,
    otpCode: code
  })

  email.value = ''
  password.value = ''
  otpDigits.value = ['', '', '', '', '', '']
  step.value = 'credentials'
}
</script>

<template>
  <div class="min-h-screen relative flex flex-col items-center justify-center p-4 py-12 text-slate-100 overflow-hidden">
    
    <!-- Image d'arrière-plan -->
    <div 
      class="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
      style="background-image: url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop');">
    </div>
    
    <!-- Overlay sombre -->
    <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"></div>

    <!-- Contenu principal -->
    <div class="relative z-10 w-full max-w-md flex flex-col items-center">
      
      <!-- Bouton Retour à l'accueil -->
      <button 
        type="button"
        @click="$emit('go-to-home')" 
        class="self-start text-slate-400 hover:text-white text-sm flex items-center space-x-2 mb-4 transition cursor-pointer"
      >
        <span>←</span>
        <span>Retour à l'accueil</span>
      </button>

      <!-- Carte Principale -->
      <div class="w-full bg-[#1e293b]/70 border border-slate-700/60 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md">
        
        <!-- Header du Formulaire avec Logo SVG d'origine -->
        <div class="flex flex-col items-center justify-center mb-8 text-center group cursor-default">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 p-[1.5px] shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition duration-300 mb-3">
            <div class="w-full h-full bg-[#0f172a] rounded-[14px] flex items-center justify-center">
              <svg class="w-6 h-6 text-indigo-400 fill-indigo-400/20" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
            </div>
          </div>
          <span class="text-2xl md:text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-200 uppercase">
            Onboardly
          </span>
          <h1 class="text-lg font-bold text-slate-300 mt-1">
            {{ step === 'credentials' ? 'Connexion à votre espace' : 'Vérification par e-mail' }}
          </h1>
        </div>

        <!-- Message d'erreur dynamique -->
        <p v-if="errorMessage" class="text-xs text-red-400 mb-4 text-center font-medium">⚠️ {{ errorMessage }}</p>

        <!-- Formulaire Étape 1 : Identifiants -->
        <form v-if="step === 'credentials'" @submit.prevent="handleLogin" autocomplete="off" class="space-y-5">
          <div>
            <label class="block text-xs font-bold tracking-wider text-slate-400 uppercase mb-2">Email Professionnel</label>
            <input 
              v-model="email" 
              type="email" 
              autocomplete="off"
              placeholder="prenom.nom@entreprise.com" 
              class="w-full px-4 py-3 bg-[#0f172a]/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition" 
              required 
            />
          </div>

          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="block text-xs font-bold tracking-wider text-slate-400 uppercase">Mot de passe</label>
              <a href="#" class="text-xs text-indigo-400 hover:underline">Mot de passe oublié ?</a>
            </div>
            <div class="relative flex items-center">
              <input 
                v-model="password" 
                :type="showPassword ? 'text' : 'password'" 
                autocomplete="new-password"
                placeholder="••••••••" 
                class="w-full px-4 py-3 pr-12 bg-[#0f172a]/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition" 
                required 
              />
              <button 
                type="button" 
                @click="showPassword = !showPassword" 
                class="absolute right-4 text-slate-400 hover:text-white transition focus:outline-none cursor-pointer"
              >
                <svg v-if="!showPassword" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.04 10.04 0 013.98-.863c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m-6.19-6.19a3 3 0 004.243 4.243M3 3l18 18" />
                </svg>
              </button>
            </div>
          </div>

          <div class="flex items-center space-x-3 pt-1">
            <input v-model="rememberMe" type="checkbox" id="remember" class="w-4 h-4 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
            <label for="remember" class="text-xs text-slate-300 cursor-pointer">
              Se souvenir de moi sur cet appareil
            </label>
          </div>

          <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3.5 rounded-xl transition shadow-lg shadow-indigo-600/30 cursor-pointer text-base mt-4">
            Recevoir mon code par e-mail
          </button>
        </form>

        <!-- Formulaire Étape 2 : Cases de validation par code mail -->
        <div v-else class="space-y-6 text-center">
          <p class="text-xs text-slate-300">
            Un code de vérification à 6 chiffres a été envoyé à <br/><strong class="text-indigo-400">{{ email }}</strong>
          </p>

          <div class="flex justify-center gap-2">
            <input 
              v-for="(digit, i) in otpDigits" 
              :key="i"
              v-model="otpDigits[i]"
              type="text" 
              maxlength="1"
              @input="handleOtpInput(i, $event)"
              class="w-11 h-12 text-center text-xl font-bold bg-[#0f172a] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <button @click="handleVerifyOtp" type="button" class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3.5 rounded-xl transition shadow-lg shadow-indigo-600/30 cursor-pointer text-base">
            Se connecter
          </button>

          <button @click="step = 'credentials'" type="button" class="text-xs text-slate-400 hover:underline block mx-auto cursor-pointer">
            Modifier l'adresse email
          </button>
        </div>

        <p v-if="step === 'credentials'" class="text-slate-400 text-sm mt-6 text-center">
          Pas encore de compte ? 
          <button type="button" @click="$emit('go-to-register')" class="text-indigo-400 hover:underline font-semibold ml-1 cursor-pointer">
            S'inscrire
          </button>
        </p>

      </div>
    </div>
  </div>
</template>