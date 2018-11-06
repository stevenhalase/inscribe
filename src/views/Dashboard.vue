<template>
  <div class="dashboard">
    <Images :images="images" />
  </div>
</template>

<script>
import Images from '@/components/Images.vue';
import { mapState } from 'vuex';

export default {
  name: 'dashboard',
  computed: {
    ...mapState({
      images: state => state.images,
    }),
  },
  components: {
    Images,
  },
};
</script>
