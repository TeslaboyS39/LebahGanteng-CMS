<script>
import ReusableMovieForm from './ReusableMovieForm.vue';

export default {
    props: ['genres', 'currentPage', 'inputAddMovie'],
    emits: ['editMovieForm'],
    components: {
        ReusableMovieForm
    },
    methods: {
        editMovieForm(inputMovie) {
            this.$emit('editMovieForm', inputMovie);
        }
    }
}
</script>

<template>
<div> 
    <ReusableMovieForm 
        :genres="genres"
        title="Edit Movie"
        buttonText="Edit Movie"
        :inputAddMovie="inputAddMovie"
        :currentPage="currentPage"
        @editMovieForm="editMovieForm" 
    />
</div>
</template>