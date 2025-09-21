<script setup lang="ts">
import { ref } from 'vue';
import Button from '../components/BaseButton/BaseButton.vue';
import ChatRoom from '../modules/ChatRoom/ChatRoom.vue';
const toggle = ref(false);

function handleToggle() {
  toggle.value = !toggle.value;
}

const closeChatRoom = () => {
  toggle.value = false;
};
</script>
<template>
  <div class="main-layout">
    <ChatRoom :open="toggle" @close="closeChatRoom" />
    <div class="toggle-button">
      <Button
        size="md"
        variant="primary"
        label="Ask Natria AI"
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
