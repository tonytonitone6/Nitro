<script setup lang="ts">
import { computed } from 'vue';
import useI18nHelpers from 'src/hooks/useI18n';

type Props = {
  modelValue: string;
  disabled?: boolean;
};

type Emits = {
  (event: 'update:modelValue', value: string): void;
  (event: 'send', message: string): void;
};

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
});
const { t } = useI18nHelpers();
const emit = defineEmits<Emits>();

const draft = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value),
});

const isAllowSend = computed(() => {
  return draft.value.trim().length > 0 && !props.disabled;
});

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  draft.value = target.value;
};

const handleSend = () => {
  const message = draft.value.trim();
  if (message && isAllowSend.value) {
    emit('send', message);
    draft.value = '';
  }
};
</script>
<template>
  <footer class="chat-footer">
    <div class="input-wrap">
      <input
        class="input"
        type="text"
        :value="draft"
        :placeholder="t('chat.input.placeholder')"
        @input="handleInput"
        @keydown.enter="handleSend"
      />
      <div class="icon-btn-container">
        <button class="icon-btn attach-btn">
          <i class="fa-solid fa-paperclip"></i>
        </button>
        <button
          class="icon-btn send-btn"
          :title="t('')"
          :disabled="!isAllowSend"
          @click="handleSend"
        >
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </div>
  </footer>
</template>
<style lang="scss" scoped>
@import 'src/css/quasar.variables.scss';

.chat-footer {
  flex: 0 0 auto;
  width: 100%;
}

.input-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  border-radius: 8px;
  padding: 22px 20px;
}

.input {
  border: none;
  flex: 1 1 auto;
  font-size: 14px;
  color: $gray-800;

  &:focus {
    outline: none;
    box-shadow: none;
  }

  &::placeholder {
    color: $gray-500;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.icon-btn-container {
  display: flex;
  align-items: center;
  gap: 20px;
}

.icon-btn {
  cursor: pointer;
  border: none;
  background: none;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $gray-600;
  transition: all 0.2s ease;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &.attach-btn {
    opacity: 0.4;

    &:hover:not(:disabled) {
      opacity: 0.7;
    }
  }

  &.send-btn {
    background: $teal-700;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    color: #fff;

    &:hover:not(:disabled) {
      background: $teal-700;
    }

    &:disabled {
      background: $gray-300;
      color: $gray-500;
    }
  }
}
</style>
