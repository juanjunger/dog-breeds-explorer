<template>
  <div>
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">Favorite Breeds</h2>
      <p class="text-gray-600 mb-6">Your collection of favorite dog breeds</p>
      
      <div class="max-w-md">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search favorite breeds..."
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>
    </div>

    <div v-if="filteredFavorites.length === 0 && !searchQuery" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No favorites yet</h3>
      <p class="mt-1 text-sm text-gray-500">Start adding breeds to your favorites by clicking the heart icon.</p>
      <div class="mt-6">
        <router-link
          to="/"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Browse All Breeds
        </router-link>
      </div>
    </div>

    <div v-else-if="filteredFavorites.length === 0 && searchQuery" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No favorites found</h3>
      <p class="mt-1 text-sm text-gray-500">Try searching for a different breed name.</p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div
        v-for="breed in filteredFavorites"
        :key="breed.name"
        class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
        @click="openBreedModal(breed.name)"
      >
        <div class="p-6">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-lg font-semibold text-gray-900 capitalize">
              {{ breed.name.replace('-', ' ') }}
            </h3>
            <button
              @click.stop="removeFavorite(breed.name)"
              class="p-2 rounded-full hover:bg-red-50 transition-colors text-red-500"
              title="Remove from favorites"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
          <p class="text-sm text-gray-600">Click to view images</p>
        </div>
      </div>
    </div>

    <!-- Breed Images Modal -->
    <div
      v-if="selectedBreed"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click="closeBreedModal"
    >
      <div
        class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-2xl font-bold text-gray-900 capitalize">
              {{ selectedBreed.replace('-', ' ') }}
            </h3>
            <button
              @click="closeBreedModal"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Images Loading -->
          <div v-if="imagesLoading" class="flex justify-center items-center py-8">
            <div class="loading-spinner"></div>
            <span class="ml-3 text-gray-600">Loading images...</span>
          </div>

          <!-- Images Error -->
          <div v-else-if="imagesError" class="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div class="text-sm text-red-700">{{ imagesError }}</div>
          </div>

          <!-- Images Grid -->
          <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              v-for="(image, index) in breedImages"
              :key="index"
              class="aspect-square rounded-lg overflow-hidden"
            >
              <img
                :src="image"
                :alt="`${selectedBreed} image ${index + 1}`"
                class="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                @error="handleImageError"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useBreedsStore } from '../stores/breeds'
import axios from 'axios'

const breedsStore = useBreedsStore()
const { favoriteBreeds, removeFavorite } = breedsStore
const searchQuery = ref('')

const filteredFavorites = computed(() => {
  if (!searchQuery.value.trim()) {
    return favoriteBreeds
  }
  
  const query = searchQuery.value.toLowerCase().trim()
  return favoriteBreeds.filter(breed => 
    breed.name.toLowerCase().includes(query)
  )
})

const selectedBreed = ref<string | null>(null)
const breedImages = ref<string[]>([])
const imagesLoading = ref(false)
const imagesError = ref<string | null>(null)

async function openBreedModal(breed: string) {
  selectedBreed.value = breed
  imagesLoading.value = true
  imagesError.value = null
  
  try {
    const response = await axios.get(`/api/breeds/${breed}/images`)
    breedImages.value = response.data
  } catch (err) {
    imagesError.value = 'Failed to load breed images'
    console.error('Error fetching breed images:', err)
  } finally {
    imagesLoading.value = false
  }
}

function closeBreedModal() {
  selectedBreed.value = null
  breedImages.value = []
  imagesError.value = null
}

function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement
  img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+'
}
</script>
