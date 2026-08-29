import axios from 'axios'

// Création de l'instance Axios configurée pour pointer vers l'API Laravel
const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Adresse par défaut du serveur de dev Laravel
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Intercepteur pour injecter automatiquement le token JWT dans toutes les requêtes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Intercepteur pour gérer centralement les erreurs globales (ex: 401 Non Authentifié)
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Si l'API renvoie 401 (token expiré ou invalide), on déconnecte l'utilisateur
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Optionnel : recharger la page ou rediriger vers l'écran de login
      window.location.reload()
    }
    return Promise.reject(error)
  }
)

export default api
