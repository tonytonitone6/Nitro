<script setup lang="ts">
import type { Product } from 'src/modules/ChatRoom/Chat';

const props = defineProps<{
  product: Product;
}>();

const handleClick = () => {
  window.open(props.product.links.product_url, '_blank');
};
</script>

<template>
  <q-card class="product-card" @click="handleClick">
    <q-card-section>
      <q-img :src="props.product.links.image_url" />
    </q-card-section>
    <q-card-section style="padding: 8px 16px">
      <p>{{ props.product.name }}</p>
    </q-card-section>
  </q-card>
</template>
<style lang="scss" scoped>
.product-card {
  cursor: pointer;
  min-width: 200px;

  .product-card-price {
    p:first-child {
      font-size: 18px;
      font-weight: 600;
      color: #666;
    }

    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
