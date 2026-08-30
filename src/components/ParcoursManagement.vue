<script setup>
import { ref } from 'vue'
import {
  Cog6ToothIcon,
  PlusIcon,
  ListBulletIcon,
  PencilSquareIcon,
  TrashIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  BriefcaseIcon,
  MegaphoneIcon,
  UserGroupIcon,
  ClipboardDocumentCheckIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  PlusCircleIcon,
  BookmarkIcon
} from '@heroicons/vue/24/outline'

// 1. État des Parcours
const tracks = ref([
  { id: 1, name: 'Développeur Web', icon: GlobeAltIcon, department: 'IT / Tech', questsCount: 25, assignedEmployees: 12 },
  { id: 2, name: 'Commercial', icon: BriefcaseIcon, department: 'Ventes', questsCount: 20, assignedEmployees: 8 },
  { id: 3, name: 'Marketing', icon: MegaphoneIcon, department: 'Communication', questsCount: 18, assignedEmployees: 5 }
])

const selectedTrack = ref(tracks.value[0])

// 2. État des Quêtes du parcours sélectionné
const quests = ref([
  { id: 1, title: 'Rencontrer mon manager', step: 'Jour 1', points: 100, badge: '—', validation: 'Manager', icon: UserGroupIcon },
  { id: 2, title: 'Compléter mon profil', step: 'Jour 1', points: 50, badge: 'Profil Complété', validation: 'Auto', icon: ClipboardDocumentCheckIcon },
  { id: 3, title: 'Quiz sécurité', step: 'Semaine 1', points: 150, badge: 'Expert Sécurité', validation: 'Quiz (≥80%)', icon: ShieldCheckIcon },
  { id: 4, title: 'Formation Git', step: 'Semaine 1', points: 200, badge: 'Étudiant Modèle', validation: 'Quiz', icon: AcademicCapIcon }
])

// 3. Formulaire d'ajout de Quête
const newQuest = ref({
  title: '',
  step: 'Semaine 1',
  points: 100,
  badge: 'Aucun',
  validation: 'Auto-validation'
})

const handleAddQuest = () => {
  if (!newQuest.value.title.trim()) return

  quests.value.push({
    id: Date.now(),
    title: newQuest.value.title,
    step: newQuest.value.step,
    points: newQuest.value.points,
    badge: newQuest.value.badge === 'Aucun' ? '—' : newQuest.value.badge,
    validation: newQuest.value.validation,
    icon: BookmarkIcon
  })

  // Réinitialisation du formulaire
  newQuest.value.title = ''
  newQuest.value.points = 100
}

const handleDeleteQuest = (id) => {
  quests.value = quests.value.filter(q => q.id !== id)
}

const handleDeleteTrack = (id) => {
  tracks.value = tracks.value.filter(t => t.id !== id)
  if (selectedTrack.value?.id === id && tracks.value.length > 0) {
    selectedTrack.value = tracks.value[0]
  }
}
</script>

<template>
  <div class="space-y-6 text-slate-100 font-sans">
    
    <!-- HEADER -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold flex items-center gap-2 text-white">
          <Cog6ToothIcon class="w-6 h-6 text-indigo-400" />
          <span>Gestion des Parcours & Quêtes</span>
        </h1>
        <p class="text-xs text-slate-400">CRUD complet — Créer, modifier, supprimer</p>
      </div>

      <button class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 font-semibold text-white rounded-xl text-xs flex items-center gap-2 shadow-lg transition cursor-pointer">
        <PlusIcon class="w-4 h-4" />
        <span>Nouveau Parcours</span>
      </button>
    </div>

    <!-- 1. TABLEAU : PARCOURS D'INTÉGRATION EXISTANTS -->
    <div class="bg-[#131b2e]/70 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
      <h3 class="text-sm font-bold text-white mb-4 flex items-center gap-2">
        <ListBulletIcon class="w-5 h-5 text-indigo-400" />
        <span>Parcours d'intégration existants</span>
      </h3>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <th class="pb-3">Parcours</th>
              <th class="pb-3">Département</th>
              <th class="pb-3">Quêtes</th>
              <th class="pb-3">Employés Assignés</th>
              <th class="pb-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60">
            <tr 
              v-for="track in tracks" 
              :key="track.id" 
              @click="selectedTrack = track"
              :class="selectedTrack?.id === track.id ? 'bg-indigo-950/30' : 'hover:bg-slate-800/30'"
              class="transition cursor-pointer"
            >
              <td class="py-3.5 font-bold text-white flex items-center gap-2.5">
                <component :is="track.icon" class="w-5 h-5 text-indigo-400" />
                <span>{{ track.name }}</span>
              </td>
              <td class="py-3.5 text-slate-300">{{ track.department }}</td>
              <td class="py-3.5 text-slate-300 font-medium">{{ track.questsCount }} quêtes</td>
              <td class="py-3.5 text-slate-300 font-medium">{{ track.assignedEmployees }}</td>
              <td class="py-3.5 text-right space-x-3">
                <button class="text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-1">
                  <PencilSquareIcon class="w-4 h-4" />
                  <span>Modifier</span>
                </button>
                <button @click.stop="handleDeleteTrack(track.id)" class="text-rose-400 hover:text-rose-300 font-semibold inline-flex items-center gap-1">
                  <TrashIcon class="w-4 h-4" />
                  <span>Supprimer</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 2. TABLEAU : QUÊTES DU PARCOURS SÉLECTIONNÉ -->
    <div v-if="selectedTrack" class="bg-[#131b2e]/70 border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-bold text-white flex items-center gap-2">
          <DocumentTextIcon class="w-5 h-5 text-indigo-400" />
          <span>Quêtes du parcours « {{ selectedTrack.name }} »</span>
        </h3>
        <a href="#form-add-quest" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 font-semibold text-white rounded-xl text-xs flex items-center gap-1.5 transition">
          <PlusIcon class="w-4 h-4" />
          <span>Ajouter une quête</span>
        </a>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <th class="pb-3">Quête</th>
              <th class="pb-3">Étape</th>
              <th class="pb-3">Points</th>
              <th class="pb-3">Badge</th>
              <th class="pb-3">Type Validation</th>
              <th class="pb-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/60">
            <tr v-for="q in quests" :key="q.id" class="hover:bg-slate-800/30 transition">
              <td class="py-3.5 font-medium text-white flex items-center gap-2">
                <component :is="q.icon" class="w-4 h-4 text-indigo-400" />
                <span>{{ q.title }}</span>
              </td>
              <td class="py-3.5 text-slate-300">{{ q.step }}</td>
              <td class="py-3.5 text-slate-300 font-mono font-bold">{{ q.points }}</td>
              <td class="py-3.5 text-slate-300">{{ q.badge }}</td>
              <td class="py-3.5 text-slate-300">{{ q.validation }}</td>
              <td class="py-3.5 text-right space-x-2">
                <button class="text-slate-400 hover:text-white p-1">
                  <PencilSquareIcon class="w-4 h-4" />
                </button>
                <button @click="handleDeleteQuest(q.id)" class="text-rose-400 hover:text-rose-300 p-1">
                  <TrashIcon class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 3. FORMULAIRE : AJOUTER UNE QUÊTE -->
    <div id="form-add-quest" class="bg-[#131b2e]/70 border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
      <h3 class="text-sm font-bold text-white flex items-center gap-2">
        <PlusCircleIcon class="w-5 h-5 text-indigo-400" />
        <span>Formulaire — Ajouter une quête</span>
      </h3>

      <form @submit.prevent="handleAddQuest" class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div>
          <label class="block text-slate-400 mb-1 font-semibold uppercase text-[10px]">Titre de la quête</label>
          <input 
            v-model="newQuest.title"
            type="text" 
            placeholder="Ex: Formation sécurité incendie"
            class="w-full bg-[#0b0f19] border border-slate-700/70 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label class="block text-slate-400 mb-1 font-semibold uppercase text-[10px]">Étape</label>
          <select v-model="newQuest.step" class="w-full bg-[#0b0f19] border border-slate-700/70 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500">
            <option>Jour 1</option>
            <option>Semaine 1</option>
            <option>Mois 1</option>
          </select>
        </div>

        <div>
          <label class="block text-slate-400 mb-1 font-semibold uppercase text-[10px]">Points</label>
          <input 
            v-model.number="newQuest.points"
            type="number" 
            class="w-full bg-[#0b0f19] border border-slate-700/70 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label class="block text-slate-400 mb-1 font-semibold uppercase text-[10px]">Badge Associé</label>
          <select v-model="newQuest.badge" class="w-full bg-[#0b0f19] border border-slate-700/70 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500">
            <option>Aucun</option>
            <option>Expert Sécurité</option>
            <option>Étudiant Modèle</option>
            <option>Profil Complété</option>
          </select>
        </div>

        <div class="md:col-span-2">
          <label class="block text-slate-400 mb-1 font-semibold uppercase text-[10px]">Type de validation</label>
          <select v-model="newQuest.validation" class="w-full bg-[#0b0f19] border border-slate-700/70 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500">
            <option>Auto-validation</option>
            <option>Validation Manager</option>
            <option>Quiz (≥80%)</option>
          </select>
        </div>

        <div class="md:col-span-2 pt-2">
          <button type="submit" class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition cursor-pointer">
            Enregistrer la quête
          </button>
        </div>
      </form>
    </div>

  </div>
</template>