<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-gray-900">
              🐕 Dog Breeds Explorer
            </h1>
          </div>
          <nav class="flex space-x-8">
            <router-link
              to="/"
              class="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="{ 'text-blue-600 bg-blue-50': $route.name === 'Home' }"
            >
              All Breeds
            </router-link>
            <router-link
              to="/favorites"
              class="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="{ 'text-blue-600 bg-blue-50': $route.name === 'Favorites' }"
            >
              Favorites ({{ breedsStore.favorites.length }})
            </router-link>
          </nav>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useBreedsStore } from './stores/breeds'

const breedsStore = useBreedsStore()

onMounted(async () => {
  await breedsStore.fetchBreeds()
  await breedsStore.fetchFavorites()
})
</script>
