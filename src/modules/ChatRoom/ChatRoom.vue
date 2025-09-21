<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import useChatRoom from './hooks';
import ProductCard from '../../components/ProductCard/ProductCard.vue';

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
  async () => {
    await nextTick();
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
  <transition name="fade">
    <section v-if="isOpen" :style="panelStyle">
      <header>
        <div class="header-content">
          <div class="brand">
            <span class="logo">
              <img src="/icons/logo.svg" width="46px" height="23px" />
            </span>
            <span class="title">Nitra AI</span>
            <span class="logo">
              <img src="/icons/duotone.svg" width="24px" height="24px" />
            </span>
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
          <div
            v-if="message.products && message.products.length > 0"
            class="products-container-wrap"
          >
            <div class="products-container" :style="{ width: `${props.panelWidth - 32}px` }">
              <ProductCard
                v-for="product in message.products"
                :key="product.id"
                :product="product"
              />
            </div>
          </div>
          <div class="message-timestamp">
            {{ new Date(message.timestamp ?? new Date()).toLocaleTimeString() }}
          </div>
        </div>

        <!-- Loading indicator -->
        <div v-if="isProcessingMessage" class="message message-assistant loading-message">
          <div class="message-content loading-content">
            <span class="loading-text">Thinking</span>
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
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
          <div class="icon-btn-container">
            <button class="icon-btn attach-btn" title="Attach">
              <i class="fa-solid fa-paperclip"></i>
            </button>
            <button class="icon-btn send-btn" title="Send" @click="send">
              <i class="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </footer>
    </section>
  </transition>
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

.products-container-wrap {
  margin-top: 16px;
}

.products-container {
  padding: 1px;
  display: flex;
  overflow-x: auto;
  gap: 5px;
}

header {
  position: relative;
  background: $teal-700;
  color: #fff;
  padding: 18px 20px;
  border-radius: 8px 8px 0 0;

  .header-content {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .title {
    font-size: 30px;
    font-weight: 700;
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
  overflow-x: hidden;
  overflow-y: auto;
  max-width: 100%;
  padding: 32px 20px 0px;
  scroll-behavior: smooth;
  background: #fff;
}

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

  &:focus {
    outline: none;
    box-shadow: none;
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

  &.attach-btn {
    opacity: 0.4;
  }

  &.send-btn {
    background: $teal-700;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    color: #fff;
  }
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
  transform-origin: bottom right; /* 錨在右下角放大 */
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
