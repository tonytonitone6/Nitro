<script setup lang="ts">
import useI18nHelpers from 'src/hooks/useI18n';
defineEmits<{
  (event: 'close'): void;
}>();

const { t } = useI18nHelpers();
</script>
<template>
  <header>
    <div class="header-content">
      <div class="brand">
        <span class="logo">
          <img src="/icons/logo.svg" width="46px" height="23px" />
        </span>
        <span class="title">{{ t('common.company.name') }}</span>
        <span class="logo">
          <img src="/icons/duotone.svg" width="24px" height="24px" />
        </span>
      </div>
      <span>{{ t('common.welcome.message') }}</span>
    </div>
    <span class="close-btn" @click="$emit('close')">
      <i class="fa-solid fa-xmark"></i>
    </span>
  </header>
</template>
<style lang="scss" scoped>
@import 'src/css/quasar.variables.scss';

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
    font-size: 18px;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.8;
    }
  }
}
</style>
