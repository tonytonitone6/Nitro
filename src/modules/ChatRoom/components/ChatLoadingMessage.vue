<script setup lang="ts">
import useI18nHelpers from 'src/hooks/useI18n';

const { t } = useI18nHelpers();
</script>
<template>
  <div class="message message-assistant loading-message">
    <div class="message-content loading-content">
      <span class="loading-text">{{ t('chat.processing.thinking') }}</span>
      <div class="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import 'src/css/quasar.variables.scss';

.message {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;

  &.message-assistant {
    align-self: flex-start;
    align-items: flex-start;
  }
}

.message-content {
  padding: 12px 16px;
  word-wrap: break-word;
  line-height: 1.4;
}

.loading-message {
  .loading-content {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    background: $gray-100;
    color: $gray-800;
    border-radius: 4px 18px 18px 18px;
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
