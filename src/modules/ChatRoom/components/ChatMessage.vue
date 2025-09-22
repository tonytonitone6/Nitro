<script setup lang="ts">
import { computed } from 'vue';
import type { Message } from '../Chat';
import ProductCard from 'src/components/ProductCard/ProductCard.vue';

type Props = {
  message: Partial<Message>;
  panelWidth: number;
};

const props = defineProps<Props>();
const isAssistant = computed(() => props.message.sender_id === 'assistant');

const formatTimestamp = (timestamp?: string) => {
  return new Date(timestamp ?? new Date()).toLocaleTimeString();
};
</script>
<template>
  <div :class="['message', isAssistant ? 'message-assistant' : 'message-user']">
    <div class="message-avatar">
      <img v-if="isAssistant" src="/icons/avatar.svg" />
      <div class="message-content">
        {{ message.question }}
      </div>
    </div>

    <div v-if="message.products && message.products.length > 0" class="products-container-wrap">
      <div class="products-container" :style="{ width: `${panelWidth - 32}px` }">
        <ProductCard v-for="product in message.products" :key="product.id" :product="product" />
      </div>
    </div>

    <div class="message-timestamp">
      {{ formatTimestamp(message.timestamp) }}
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import 'src/css/quasar.variables.scss';

.products-container-wrap {
  margin-top: 16px;
}

.products-container {
  padding: 1px;
  display: flex;
  overflow-x: auto;
  gap: 5px;
}

.message-avatar {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

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
      border-radius: 18px 4px 18px 18px;
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
      border-radius: 4px 18px 18px 18px;
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
}

.message-timestamp {
  font-size: 11px;
  color: $gray-500;
  margin-top: 4px;
}
</style>
