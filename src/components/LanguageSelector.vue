<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const languages = [
  { code: 'zh-tw', name: '繁體中文', flag: '🇹🇼' },
  { code: 'en', name: 'English', flag: '🇺🇸' }
]
</script>

<template>
  <div class="language-selector">
    <label for="languageSelect" class="language-label">Language / 語言</label>
    <select id="languageSelect" v-model="locale" class="language-select">
      <option v-for="language in languages" :key="language.code" :value="language.code" class="language-option">
        {{ language.flag }} {{ language.name }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.language-selector {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.language-label {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.language-select {
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  background: white;
  color: #374151;
  transition: all 0.3s ease;
  cursor: pointer;
  width: 100%;
}

.language-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.language-select:hover {
  border-color: #d1d5db;
}

.language-select option {
  background: white;
  color: #374151;
  padding: 0.5rem;
}

.language-option {
  padding: 0.5rem;
}
</style>
