<script setup>
import { ref, onMounted } from 'vue'
import {
  ArrowLeftIcon,
  EyeIcon,
  EyeSlashIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '../stores/auth'

// Déclaration explicite des événements envoyés au composant parent (App.vue)
const emit = defineEmits(['go-to-login', 'go-home', 'register-success'])

// Gestion des étapes : 'form' (saisie) -> 'otp' (cases de vérification mail)
const step = ref('form')

// Variables pour afficher/masquer les mots de passe
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// Variables réactives pour stocker les options
const roleOptions = ref([])
const departmentOptions = ref([])

// Saisie des cases OTP par mail
const otpDigits = ref(['', '', '', '', '', ''])
const otpError = ref('')
const errorMessage = ref('')
const authStore = useAuthStore()

// Dictionnaire pour mapper les sélections aux valeurs attendues par l'API
const roleMap = {
  'Employé (CDI / CDD)': 'employe',
  'Stagiaire / Alternant': 'employe',
  'Prestataire / Consultant': 'employe',
  "Manager d'équipe": 'manager',
  'Administrateur RH': 'admin_rh'
}

const deptMap = {
  'IT / Tech': 1,
  'Ressources Humaines': 2,
  'Marketing & Ventes': 3,
  'Finance & Admin': 4
}

// Fonction de récupération des options
const fetchFormOptions = async () => {
  return {
    roles: Object.keys(roleMap),
    departments: Object.keys(deptMap)
  }
}

// Champs du formulaire
const lastName = ref('')
const firstName = ref('')
const email = ref('')
const role = ref('')
const department = ref('')
const arrivalDate = ref('')
const password = ref('')
const confirmPassword = ref('')
const acceptTerms = ref(false)

// Réinitialisation de l'ensemble du formulaire
const resetForm = () => {
  lastName.value = ''
  firstName.value = ''
  email.value = ''
  arrivalDate.value = ''
  password.value = ''
  confirmPassword.value = ''
  acceptTerms.value = false
  otpDigits.value = ['', '', '', '', '', '']
  otpError.value = ''
  errorMessage.value = ''
  step.value = 'form'
}

// Chargement initial au montage du composant
onMounted(async () => {
  const data = await fetchFormOptions()
  roleOptions.value = data.roles
  departmentOptions.value = data.departments
  
  if (roleOptions.value.length > 0) role.value = roleOptions.value[0]
  if (departmentOptions.value.length > 0) department.value = departmentOptions.value[0]

  resetForm()
})

// Passage à l'étape OTP
const handleRegisterSubmit = async () => {
  errorMessage.value = ''
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Les mots de passe ne correspondent pas.'
    return
  }

  try {
    const payload = {
      nom: lastName.value,
      prenom: firstName.value,
      email: email.value,
      password: password.value,
      password_confirmation: confirmPassword.value,
      role: roleMap[role.value] || 'employe',
      statut_contrat: role.value,
      departement_id: deptMap[department.value] || 1,
      date_arrivee: arrivalDate.value
    }
    
    await authStore.register(payload)
    step.value = 'otp'
  } catch (error) {
    if (error.response?.data?.errors) {
      // Afficher la première erreur de validation
      const errors = error.response.data.errors
      const firstKey = Object.keys(errors)[0]
      errorMessage.value = errors[firstKey][0]
    } else {
      errorMessage.value = error.response?.data?.message || 'Erreur lors de l\'inscription.'
    }
  }
}

// Gestion automatique du focus des 6 cases
const handleOtpInput = (index, event) => {
  const value = event.target.value
  if (value && index < 5) {
    const nextInput = event.target.nextElementSibling
    if (nextInput) nextInput.focus()
  }
}

// Validation finale par code mail
const handleVerifyOtpAndRegister = async () => {
  const code = otpDigits.value.join('')
  otpError.value = ''
  
  if (code.length < 6) {
    otpError.value = 'Veuillez saisir le code complet à 6 chiffres.'
    return
  }

  try {
    await authStore.verifyOtp(email.value, code)
    // Émission de l'événement vers le parent
    emit('register-success', { email: email.value })
    resetForm()
  } catch (error) {
    otpError.value = error.response?.data?.message || 'Code OTP invalide.'
  }
}
</script>

<template>
  <div class="min-h-screen relative flex flex-col items-center justify-center p-4 py-12 text-slate-100 font-sans overflow-hidden">
    
    <!-- 1. Image d'arrière-plan "Modern Corporate" -->
    <div 
      class="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
      style="background-image: url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop');">
    </div>
    
    <!-- 2. Layer d'assombrissement + effet dépoli -->
    <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"></div>

    <!-- 3. Contenu principal -->
    <div class="relative z-10 w-full max-w-2xl flex flex-col items-center">
      
      <!-- Bouton Retour à l'accueil -->
      <button 
        type="button"
        @click="emit('go-home')" 
        class="self-start w-full text-slate-400 hover:text-white text-sm flex items-center space-x-2 mb-4 transition cursor-pointer">
        <ArrowLeftIcon class="w-4 h-4" />
        <span>Retour à l'accueil</span>
      </button>

      <!-- Carte Principale -->
      <div class="w-full bg-[#1e293b]/70 border border-slate-700/60 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md">
        
        <!-- Logo Flash au-dessus, Titre Onboardly -->
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
            {{ step === 'form' ? 'Créer mon compte' : 'Vérification par e-mail' }}
          </h1>
        </div>

        <!-- Barre de progression 3 étapes -->
        <div class="flex items-center justify-center space-x-2 sm:space-x-4 mb-8 text-xs sm:text-sm">
          <div class="flex items-center space-x-2">
            <span class="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">1</span>
            <span class="font-semibold text-indigo-400">Formulaire</span>
          </div>
          <div class="w-6 sm:w-10 h-[2px]" :class="step === 'otp' ? 'bg-indigo-600' : 'bg-slate-700'"></div>
          <div class="flex items-center space-x-2" :class="step === 'otp' ? 'opacity-100' : 'opacity-50'">
            <span class="w-6 h-6 rounded-full font-bold flex items-center justify-center text-xs" :class="step === 'otp' ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300'">2</span>
            <span :class="step === 'otp' ? 'text-indigo-400 font-semibold' : 'text-slate-400'">Vérif. email</span>
          </div>
          <div class="w-6 sm:w-10 h-[2px] bg-slate-700"></div>
          <div class="flex items-center space-x-2 opacity-50">
            <span class="w-6 h-6 rounded-full bg-slate-700 text-slate-300 font-bold flex items-center justify-center text-xs">3</span>
            <span class="text-slate-400">Validation RH</span>
          </div>
        </div>

        <!-- ÉTAPE 1 : FORMULAIRE PRINCIPAL -->
        <form v-if="step === 'form'" @submit.prevent="handleRegisterSubmit" autocomplete="off" class="space-y-5">
          
          <!-- Nom & Prénom -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold tracking-wider text-slate-400 uppercase mb-2">Nom</label>
              <input v-model="lastName" type="text" autocomplete="family-name" placeholder="Ex : BAMBA" class="w-full px-4 py-3 bg-[#0f172a]/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition" required />
            </div>
            <div>
              <label class="block text-xs font-bold tracking-wider text-slate-400 uppercase mb-2">Prénom</label>
              <input v-model="firstName" type="text" autocomplete="given-name" placeholder="Ex : Léa" class="w-full px-4 py-3 bg-[#0f172a]/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition" required />
            </div>
          </div>

          <!-- Email Pro -->
          <div>
            <label class="block text-xs font-bold tracking-wider text-slate-400 uppercase mb-2">Email Professionnel</label>
            <input v-model="email" type="email" autocomplete="off" placeholder="prenom.nom@entreprise.com" class="w-full px-4 py-3 bg-[#0f172a]/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition" required />
          </div>

          <!-- Je suis & Département -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold tracking-wider text-slate-400 uppercase mb-2">Je suis</label>
              <select v-model="role" class="w-full px-4 py-3 bg-[#0f172a]/80 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition cursor-pointer">
                <option v-for="opt in roleOptions" :key="opt" :value="opt">{{ opt }}</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold tracking-wider text-slate-400 uppercase mb-2">Département</label>
              <select v-model="department" class="w-full px-4 py-3 bg-[#0f172a]/80 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 transition cursor-pointer">
                <option v-for="dept in departmentOptions" :key="dept" :value="dept">{{ dept }}</option>
              </select>
            </div>
          </div>

          <!-- Date d'arrivée -->
          <div>
            <label class="block text-xs font-bold tracking-wider text-slate-400 uppercase mb-2">Date d'arrivée</label>
            <input v-model="arrivalDate" type="date" class="w-full px-4 py-3 bg-[#0f172a]/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition" required />
          </div>

          <!-- Mot de passe -->
          <div>
            <label class="block text-xs font-bold tracking-wider text-slate-400 uppercase mb-2">Mot de passe</label>
            <div class="relative flex items-center">
              <input 
                v-model="password" 
                :type="showPassword ? 'text' : 'password'" 
                autocomplete="new-password"
                placeholder="8 caractères min., 1 majuscule, 1 chiffre" 
                class="w-full px-4 py-3 pr-12 bg-[#0f172a]/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition" 
                required 
              />
              <button 
                type="button" 
                @click="showPassword = !showPassword" 
                class="absolute right-4 text-slate-400 hover:text-white transition focus:outline-none cursor-pointer"
              >
                <EyeSlashIcon v-if="!showPassword" class="w-5 h-5" />
                <EyeIcon v-else class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Confirmer Mot de passe -->
          <div>
            <label class="block text-xs font-bold tracking-wider text-slate-400 uppercase mb-2">Confirmer le mot de passe</label>
            <div class="relative flex items-center">
              <input 
                v-model="confirmPassword" 
                :type="showConfirmPassword ? 'text' : 'password'" 
                autocomplete="new-password"
                placeholder="••••••••" 
                class="w-full px-4 py-3 pr-12 bg-[#0f172a]/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition" 
                required 
              />
              <button 
                type="button" 
                @click="showConfirmPassword = !showConfirmPassword" 
                class="absolute right-4 text-slate-400 hover:text-white transition focus:outline-none cursor-pointer"
              >
                <EyeSlashIcon v-if="!showConfirmPassword" class="w-5 h-5" />
                <EyeIcon v-else class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Case à cocher -->
          <div class="flex items-center space-x-3 pt-2">
            <input v-model="acceptTerms" type="checkbox" id="terms" class="w-4 h-4 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer" required />
            <label for="terms" class="text-xs text-slate-300 cursor-pointer">
              J'accepte le <a href="#" class="text-indigo-400 hover:underline">règlement intérieur</a> et la <a href="#" class="text-indigo-400 hover:underline">politique de confidentialité</a> des données RH.
            </label>
          </div>

          <!-- Bouton Soumettre -->
          <button 
            type="submit" 
            class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3.5 rounded-xl transition shadow-lg shadow-indigo-600/30 cursor-pointer text-base mt-4"
          >
             Recevoir mon code de confirmation
          </button>
        </form>

        <!-- ÉTAPE 2 : CASES DE VÉRIFICATION PAR CODE MAIL -->
        <div v-else class="space-y-6 text-center">
          <p class="text-xs text-slate-300 leading-relaxed">
            Un code de vérification à 6 chiffres a été envoyé à <br/><strong class="text-indigo-400">{{ email }}</strong>
          </p>

          <p v-if="otpError" class="text-xs text-rose-400 font-medium flex items-center justify-center gap-1.5">
            <ExclamationTriangleIcon class="w-4 h-4" />
            <span>{{ otpError }}</span>
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

          <button 
            @click="handleVerifyOtpAndRegister" 
            type="button" 
            class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3.5 rounded-xl transition shadow-lg shadow-indigo-600/30 cursor-pointer text-base"
          >
            Valider et soumettre à la RH
          </button>

          <button 
            @click="step = 'form'" 
            type="button" 
            class="text-xs text-slate-400 hover:underline block mx-auto cursor-pointer"
          >
            Modifier les informations saisies
          </button>
        </div>

        <!-- Lien Se connecter -->
        <p v-if="step === 'form'" class="text-slate-400 text-sm mt-6 text-center">
          Déjà un compte ? 
          <button type="button" @click="emit('go-to-login')" class="text-indigo-400 hover:underline font-semibold ml-1 cursor-pointer">
            Se connecter
          </button>
        </p>

        <!-- Encadré d'information RH -->
        <div class="mt-6 p-4 rounded-xl bg-slate-900/90 border border-indigo-500/30 flex items-start space-x-3">
          <InformationCircleIcon class="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <p class="text-xs text-slate-400 leading-relaxed">
            Le compte est créé en statut <span class="text-indigo-300 font-bold">« En attente »</span> : un code de vérification est envoyé par email, puis le <span class="text-indigo-300 font-bold">service RH valide</span> le compte et attribue le rôle. Aucun accès au portail avant validation.
          </p>
        </div>

      </div>
    </div>
  </div>
</template>