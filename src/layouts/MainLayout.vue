<script setup lang="ts">
import { ref } from 'vue';
import Button from 'src/components/BaseButton/BaseButton.vue';
import ChatRoom from 'src/modules/ChatRoom/ChatRoom.vue';
import useI18nHelpers from 'src/hooks/useI18n';

const toggle = ref(false);
const { t } = useI18nHelpers();

function handleToggle() {
  toggle.value = !toggle.value;
}
</script>
<template>
  <div class="main-layout">
    <ChatRoom :open="toggle" @close="handleToggle" />
    <div class="toggle-button">
      <Button
        size="md"
        variant="primary"
        :label="t('button.common.welcome')"
        @click="handleToggle"
        :style="{ background: '#FB7429', color: '#fff' }"
      >
        <img src="/icons/duotone.svg" width="16px" height="16px" />
      </Button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main-layout {
  width: 100vw;
  height: 100vh;
  position: relative;
}

.toggle-button {
  position: absolute;
  bottom: 30px;
  right: 5px;
}
</style>
