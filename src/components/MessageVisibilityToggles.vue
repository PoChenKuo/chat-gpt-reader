<script setup lang="ts">
import { useI18n } from 'vue-i18n'

interface Props {
  showAssistantMessages: boolean
  showUserMessages: boolean
  showResourceHint: boolean
}

interface Emits {
  (e: 'update:showAssistantMessages', value: boolean): void
  (e: 'update:showUserMessages', value: boolean): void
  (e: 'update:showResourceHint', value: boolean): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()
const { t } = useI18n()

const handleToggle = (propName: 'showAssistantMessages' | 'showUserMessages' | 'showResourceHint', event: Event) => {
  const target = event.target as HTMLInputElement
  emit(`update:${propName}`, target.checked)
}
</script>

<template>
  <!-- Message Visibility Toggles -->
  <div class="visibility-toggles">
    <h4>{{ t('app.config.messageVisibility') }}</h4>
    <div class="toggle-group">
      <div class="toggle-item">
        <label class="toggle-label">
          <input type="checkbox" :checked="showAssistantMessages" @change="handleToggle('showAssistantMessages', $event)"
            class="toggle-input" />
          <span class="toggle-slider"></span>
          <span class="toggle-text">{{ t('app.config.showAssistant') }}</span>
        </label>
      </div>
      <div class="toggle-item">
        <label class="toggle-label">
          <input type="checkbox" :checked="showUserMessages" @change="handleToggle('showUserMessages', $event)"
            class="toggle-input" />
          <span class="toggle-slider"></span>
          <span class="toggle-text">{{ t('app.config.showUser') }}</span>
        </label>
      </div>
      <div class="toggle-item">
        <label class="toggle-label">
          <input type="checkbox" :checked="showResourceHint" @change="handleToggle('showResourceHint', $event)"
            class="toggle-input" />
          <span class="toggle-slider"></span>
          <span class="toggle-text">Show Resource Hint</span>
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped>
.visibility-toggles {
  margin-top: 1rem;
}

.visibility-toggles h4 {
  margin: 0 0 1rem 0;
  color: #1f2937;
  font-size: 1rem;
}

.toggle-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.toggle-item {
  display: flex;
  align-items: center;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
}

.toggle-input {
  display: none;
}

.toggle-slider {
  position: relative;
  width: 44px;
  height: 24px;
  background: #d1d5db;
  border-radius: 12px;
  transition: background 0.3s ease;
}

.toggle-slider::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-input:checked+.toggle-slider {
  background: #3b82f6;
}

.toggle-input:checked+.toggle-slider::before {
  transform: translateX(20px);
}

.toggle-text {
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}
</style>
