<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import useChatRoom from './hooks/useChatRoom';
import useChatInput from './hooks/useChatInput';
import ChatHeader from './components/ChatHeader.vue';
import ChatMessages from './components/ChatMessages.vue';
import ChatInput from './components/ChatInput.vue';
import useI18nHelpers from 'src/hooks/useI18n';

const props = withDefaults(
  defineProps<{
    open: boolean;
    right?: number;
    bottom?: number;
    panelWidth?: number;
    panelHeight?: number;
    initialMessage?: string;
  }>(),
  {
    right: 24,
    bottom: 80,
    panelWidth: 580,
    panelHeight: 520,
    initialMessage: 'Welcome to Nitra AI',
  },
);
const { t } = useI18nHelpers();
const { draft, clear } = useChatInput();
const innerOpen = ref(false);
const isOpen = computed(() => props.open || innerOpen.value);

const panelStyle = computed(() => ({
  position: 'absolute' as const,
  width: `${props.panelWidth}px`,
  height: `${props.panelHeight}px`,
  right: `${props.right}px`,
  bottom: `${props.bottom}px`,
}));

const emit = defineEmits<{
  (event: 'close'): void;
}>();

const { addMessage, createConversation, messages, isProcessingMessage } = useChatRoom({
  initialMessage: props.initialMessage || t('messages.welcome'),
});

const handleClose = () => {
  emit('close');
};

const handleSend = (message: string) => {
  addMessage(message);
  clear();
};

onMounted(() => {
  createConversation();
});
</script>
<template>
  <transition name="fade">
    <section v-if="isOpen" :style="panelStyle">
      <ChatHeader @close="handleClose" />
      <ChatMessages
        :messages="messages"
        :is-processing-message="isProcessingMessage"
        :panel-width="props.panelWidth"
      />
      <ChatInput
        v-model="draft"
        :placeholder="t('chat.input.placeholder')"
        :disabled="isProcessingMessage"
        @send="handleSend"
      />
    </section>
  </transition>
</template>

<style lang="scss" scoped>
@import 'src/css/quasar.variables.scss';

section {
  display: flex;
  flex-direction: column;
  background: $gray-0;
  border: 1px solid $gray-200;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.fade-enter-from,
.fade-leave-to {
  transform: scale(0.9);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition:
    transform 0.22s ease,
    opacity 0.22s ease;
  transform-origin: bottom right;
}
</style>
