import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export interface Breed {
  name: string
  isFavorite: boolean
}

export const useBreedsStore = defineStore('breeds', () => {
  const breeds = ref<string[]>([])
  const favorites = ref<string[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const searchQuery = ref('')

  const breedsWithFavorites = computed(() => {
    return breeds.value.map(name => ({
      name,
      isFavorite: favorites.value.includes(name)
    }))
  })

  const filteredBreeds = computed(() => {
    if (!searchQuery.value.trim()) {
      return breedsWithFavorites.value
    }
    
    const query = searchQuery.value.toLowerCase().trim()
    return breedsWithFavorites.value.filter(breed => 
      breed.name.toLowerCase().includes(query)
    )
  })

  const favoriteBreeds = computed(() => {
    return breeds.value
      .filter(name => favorites.value.includes(name))
      .map(name => ({ name, isFavorite: true }))
  })

  async function fetchBreeds() {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get('/api/breeds')
      breeds.value = response.data
    } catch (err) {
      error.value = 'Failed to fetch dog breeds'
      console.error('Error fetching breeds:', err)
      breeds.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchFavorites() {
    try {
      const response = await axios.get('/api/favorites')
      favorites.value = response.data
    } catch (err) {
      console.error('Error fetching favorites:', err)
      favorites.value = []
    }
  }

  async function addFavorite(breed: string) {
    try {
      await axios.post('/api/favorites', { breed })
      if (!favorites.value.includes(breed)) {
        favorites.value.push(breed)
      }
    } catch (err) {
      console.error('Error adding favorite:', err)
      throw err
    }
  }

  async function removeFavorite(breed: string) {
    try {
      await axios.delete(`/api/favorites/${breed}`)
      const index = favorites.value.indexOf(breed)
      if (index > -1) {
        favorites.value.splice(index, 1)
      }
    } catch (err) {
      console.error('Error removing favorite:', err)
      throw err
    }
  }

  async function toggleFavorite(breed: string) {
    if (favorites.value.includes(breed)) {
      await removeFavorite(breed)
    } else {
      await addFavorite(breed)
    }
  }

  return {
    breeds,
    favorites,
    loading,
    error,
    searchQuery,
    breedsWithFavorites,
    filteredBreeds,
    favoriteBreeds,
    fetchBreeds,
    fetchFavorites,
    addFavorite,
    removeFavorite,
    toggleFavorite
  }
})
