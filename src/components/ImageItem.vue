<template>
  <div class="image-item">
    <div @click="editImage" class="image-item-data" :style="{ backgroundImage: `url(${image.canvasData})` }"></div>
  </div>
</template>

<script>
export default {
  name: 'image-item',
  props: {
    image: {
      type: Object,
      required: true,
    },
  },
  methods: {
    editImage() {
      this.$router.push({ name: 'editor', params: { image: this.image } });
    }
  }
};
</script>

<style lang="scss">
.image-item {
  width: 300px;
  height: 300px;
  border-radius: 4px;
  box-shadow: 0px 0px 44px -16px rgba(0,0,0,0.5);
  border: 1px solid #2980b9;
  margin: 15px;

  &:hover {
    cursor: pointer;
    border: 1px solid #3498db;
    box-shadow: 0px 0px 44px -16px rgba(0,0,0,0.6);
  }

  .image-item-data {
    width: 100%;
    height: 100%;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
  }
}
</style>
