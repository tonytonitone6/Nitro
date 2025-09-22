<script setup lang="ts">
import type { CSSProperties } from 'vue';
import type { ButtonVariant, ButtonSize } from './BaseButton.type';

const props = defineProps<{
  label?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: CSSProperties;
}>();

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();
</script>
<template>
  <button
    :style="props.style"
    :disabled="props.disabled || props.loading"
    @click="emit('click', $event)"
    class="base-btn"
    :class="[
      `base-btn---${props.variant || 'primary'}`,
      `base-btn--${props.size || 'md'}`,
      { 'is-loading': props.loading },
    ]"
  >
    <div class="base-btn-content">
      <slot></slot>
      <span v-if="props.label">{{ props.label }}</span>
    </div>
  </button>
</template>
<style lang="scss" scoped>
.base-btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.base-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  border-radius: 999px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &--sm {
    font-size: 0.875rem;
    padding: 6px 12px;
  }

  &--md {
    font-size: 1rem;
    padding: 8px 16px;
  }

  &--lg {
    font-size: 1.125rem;
    padding: 12px 20px;
  }

  &--primary {
    background: #2563eb;
    color: #fff;

    &:hover:not(:disabled) {
      background: #1d4ed8;
    }
  }

  &--secondary {
    background: #e5e7eb;
    color: #111827;

    &:hover:not(:disabled) {
      background: #d1d5db;
    }
  }

  &--danger {
    background: #dc2626;
    color: #fff;

    &:hover:not(:disabled) {
      background: #b91c1c;
    }
  }
}

.spinner {
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  width: 1em;
  height: 1em;
  margin-right: 0.5em;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
