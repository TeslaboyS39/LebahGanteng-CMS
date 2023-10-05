<script>
import ReusableMovieForm from './ReusableMovieForm.vue';

export default {
  props: ['genres', 'currentPage'],
  emits: ['submit-movie'],
  components: {
    ReusableMovieForm,
  },
  methods: {
    addMovieForm(inputMovie) {
      this.$emit('addMovieForm', inputMovie);
    }
  }
};
</script>

<template>
<ReusableMovieForm 
    :genres="genres"
    title="Add Movie"
    buttonText="Add Movie"
    :currentPage="currentPage"
    @addMovieForm="addMovieForm"
/>
</template>