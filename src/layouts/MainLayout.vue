<script setup lang="ts">
import { ref } from 'vue';
import Button from '../components/BaseButton/BaseButton.vue';
import ChatRoom from '../modules/ChatRoom/ChatRoom.vue';
const toggle = ref(true);

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
      <Button size="md" variant="primary" label="Ask Natria AI" @click="handleToggle">
        <i class="fa-solid fa-chevron-right"></i>
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
  right: 15%;
}
</style>
