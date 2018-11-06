<template>
  <div class="images">
    <ImageItem v-for="(image, ind) of images" :key="ind" :image="image" />
  </div>
</template>

<script>
import ImageItem from '@/components/ImageItem.vue';

export default {
  name: 'images',
  props: {
    images: {
      type: Array,
      required: true,
    },
  },
  components: {
    ImageItem,
  },
};
</script>

<style lang="scss">
.images {
  width: 100%;
  height: 100%;
  display: flex;
}
</style>
