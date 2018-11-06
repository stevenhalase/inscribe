<template>
  <div class="editor">
    <Canvas :image="image" :selectedColor="selectedColor" @colorchange="handleColorChange" />
    <ColorPicker :selectedColor="selectedColor" @colorchange="handleColorChange" />
  </div>
</template>

<script>
import Canvas from '@/components/Canvas.vue';
import ColorPicker from '@/components/ColorPicker.vue';

export default {
  name: 'editor',
  data() {
    return {
      selectedColor: '#7f8c8d',
    };
  },
  props: {
    image: {
      type: Object,
    },
  },
  components: {
    Canvas,
    ColorPicker,
  },
  methods: {
    handleColorChange(newColor) {
      this.selectedColor = newColor;
    }
  }
};
</script>

<style lang="scss">
.editor {
  width: 100%;
  height: 100%;
}
</style>
