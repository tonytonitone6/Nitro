<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import useChatRoom from './hooks';

const props = withDefaults(
  defineProps<{
    open: boolean;
    right?: number;
    bottom?: number;
    panelWidth?: number;
    panelHeight?: number;
  }>(),
  {
    right: 24,
    bottom: 80,
    panelWidth: 580,
    panelHeight: 520,
  },
);

const emit = defineEmits<{
  (event: 'close'): void;
}>();

const handleClose = () => {
  emit('close');
};

const { addMessage, createConversation, messages, isProcessingMessage } = useChatRoom({
  initialMessage: 'Welcome to Nitra AI',
});
const draft = ref('');
const innerOpen = ref(false);
const scrollEl = ref<HTMLElement | null>(null);
const isOpen = computed(() => props.open || innerOpen.value);

const panelStyle = computed(() => ({
  position: 'absolute' as const,
  width: `${props.panelWidth}px`,
  height: `${props.panelHeight}px`,
  right: `${props.right}px`,
  bottom: `${props.bottom}px`,
}));

const send = () => {
  const text = draft.value.trim();
  if (!text) return;
  addMessage(text);
  draft.value = '';
};

const scrollToBottom = () => {
  const el = scrollEl.value;
  if (!el) return;

  el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
};

watch(
  () => messages.value.length,
  () => {
    const elem = scrollEl.value;
    if (!elem) return;

    const contentOverFlow = elem.scrollHeight > elem.clientHeight;
    if (contentOverFlow) {
      scrollToBottom();
    }
  },
);

onMounted(() => {
  createConversation();
});
</script>
<template>
  <section v-if="isOpen" :style="panelStyle">
    <header>
      <div class="header-content">
        <div class="brand">
          <span class="logo">N</span>
          <span class="title">Nitra AI</span>
        </div>
        <span>Hi there,How can we help? </span>
      </div>
      <span class="close-btn" @click="handleClose">
        <i class="fa-solid fa-xmark"></i>
      </span>
    </header>
    <main ref="scrollEl" class="chat-body">
      <div
        v-for="message in messages"
        :key="message.message_id || Math.random()"
        :class="['message', message.sender_id === 'user' ? 'message-user' : 'message-assistant']"
      >
        <div class="message-content">
          {{ message.question }}
        </div>
        <div class="message-timestamp">
          {{ new Date(message.timestamp ?? new Date()).toLocaleTimeString() }}
        </div>
      </div>

      <!-- Loading indicator -->
      <div v-if="isProcessingMessage" class="message message-assistant loading-message">
        <div class="message-content loading-content">
          <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span class="loading-text">AI is typing...</span>
        </div>
      </div>
    </main>
    <footer class="chat-footer">
      <div class="input-wrap">
        <input
          class="input"
          type="text"
          v-model="draft"
          placeholder="Say something..."
          @keydown.enter="send"
        />
        <button class="icon-btn" title="Attach">
          <i class="fa-solid fa-paperclip"></i>
        </button>
        <button class="icon-btn" title="Send" @click="send">
          <i class="fa-solid fa-paper-plane"></i>
        </button>
      </div>
    </footer>
  </section>
</template>

<style lang="scss" scoped>
// Import the variables to use them in this component
@import '../../css/quasar.variables.scss';

section {
  display: flex;
  flex-direction: column;
  background: $gray-0;
  border: 1px solid $gray-200;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

header {
  position: relative;
  background: $teal-700;
  color: white;
  padding: 18px 20px;
  border-radius: 8px 8px 0 0;

  .header-content {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .brand {
    display: flex;
  }

  .close-btn {
    position: absolute;
    right: 16px;
    top: 16px;
    cursor: pointer;
  }
}

.chat-body {
  flex: 1 1 auto;
  min-height: 0;
  overflow: auto;
  padding: 32px 20px 0px;
  scroll-behavior: smooth;
}

.chat-footer {
  flex: 0 0 auto;
  width: 100%;
}

.input-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  background: white;
  border-radius: 8px;
  padding: 22px 20px;
}

.input {
  border: none;
  flex: 1 1 auto;

  &:focus {
    outline: none;
    box-shadow: none;
  }
}

.icon-btn {
  cursor: pointer;
}

// Message styles
.message {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;

  &.message-user {
    align-self: flex-end;
    align-items: flex-end;

    .message-content {
      background: $teal-100;
      color: #000;
      border-radius: 18px 18px 4px 18px;
    }

    .message-timestamp {
      text-align: right;
      margin-right: 8px;
    }
  }

  &.message-assistant {
    align-self: flex-start;
    align-items: flex-start;

    .message-content {
      background: $gray-100;
      color: $gray-800;
      border-radius: 18px 18px 18px 4px;
    }

    .message-timestamp {
      text-align: left;
      margin-left: 8px;
    }
  }
}

.message-content {
  padding: 12px 16px;
  word-wrap: break-word;
  line-height: 1.4;
}

.message-timestamp {
  font-size: 11px;
  color: $gray-500;
  margin-top: 4px;
}

// Loading indicator styles
.loading-message {
  .loading-content {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    background: $gray-100;
    color: $gray-800;
    border-radius: 18px 18px 18px 4px;
  }
}

.typing-indicator {
  display: flex;
  gap: 4px;

  span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: $gray-500;
    animation: typing 1.4s infinite ease-in-out;

    &:nth-child(1) {
      animation-delay: -0.32s;
    }
    &:nth-child(2) {
      animation-delay: -0.16s;
    }
    &:nth-child(3) {
      animation-delay: 0s;
    }
  }
}

.loading-text {
  font-size: 13px;
  color: $gray-600;
  font-style: italic;
}

@keyframes typing {
  0%,
  80%,
  100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
