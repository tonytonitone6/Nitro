<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';
import type { Message } from '../Chat';
import ChatMessage from './ChatMessage.vue';
import ChatLoadingMessage from './ChatLoadingMessage.vue';

type Props = {
  messages: Partial<Message>[];
  isProcessingMessage: boolean;
  panelWidth: number;
};

const props = withDefaults(defineProps<Props>(), {});

const scrollEl = ref<HTMLElement | null>(null);

const scrollToBottom = () => {
  const el = scrollEl.value;
  if (!el) return;

  el.scrollTo({
    top: el.scrollHeight,
    behavior: 'smooth',
  });
};

watch(
  () => props.messages.length,
  async () => {
    await nextTick();

    const el = scrollEl.value;
    if (!el) return;

    const contentOverflow = el.scrollHeight > el.clientHeight;
    if (contentOverflow) {
      scrollToBottom();
    }
  },
);

watch(
  () => props.isProcessingMessage,
  async () => {
    await nextTick();
    scrollToBottom();
  },
);

onMounted(async () => {
  await nextTick(() => {
    scrollToBottom();
  });
});
</script>
<template>
  <main ref="scrollEl" class="chat-body">
    <div v-for="message in messages" :key="message.message_id || Math.random()">
      <ChatMessage :message="message" :panel-width="panelWidth" />
    </div>

    <ChatLoadingMessage v-if="isProcessingMessage" />
  </main>
</template>

<style lang="scss" scoped>
@import 'src/css/quasar.variables.scss';

.chat-body {
  flex: 1 1 auto;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  max-width: 100%;
  padding: 32px 20px 0px;
  scroll-behavior: smooth;
  background: #fff;
  position: relative;
}

.scroll-to-bottom-btn {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: $teal-700;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
  z-index: 10;

  &:hover {
    background: $teal-700;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }

  i {
    font-size: 14px;
  }
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}
</style>
