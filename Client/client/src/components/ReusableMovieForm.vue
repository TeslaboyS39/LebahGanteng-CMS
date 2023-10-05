<script>
import ReusableButton from './ReusableButton.vue';

export default {
  props: ['genres', 'currentPage', 'inputAddMovie', 'title', 'buttonText'],
  emits: ['editMovieForm'],
  components: {
    ReusableButton,
  },
  data() {
    return {
      inputMovie: {
        title: '',
        genreId: '',
        synopsis: '',
        trailerUrl: '',
        rating: '',
        imageUrl: ''
      }
    };
  },
  methods: {
    handleInputMovie() {
        if (this.currentPage === 'editmovie') {
          this.$emit('editMovieForm', this.inputMovie);
        } else if (this.currentPage === 'addmovie'){
          this.$emit('addMovieForm', this.inputMovie);          
        }
        // Buat ngirim event dgn data movie yg diisi sama pengguna
        console.log(this.inputMovie);
    }
  },
  created() {
    if (this.currentPage === 'editmovie') {
      this.inputMovie = this.inputAddMovie;
    }
    console.log(this.inputMovie, 'Punya si Reusable');
  }
};
</script>

<template>
  <section id="addmovie-section">
    <div class="add-movie-form">
      <h2>{{title}}</h2>
      <form @submit.prevent="handleInputMovie">
        <label for="title">Title:</label>
        <input v-model="inputMovie.title" type="text" id="title" name="title" />

        <label for="genre">Genre:</label>
        <select v-model="inputMovie.genreId" id="genre" name="genre" >
          <option value="" disabled selected>Select Genre</option>
          <option v-for="genre in genres" :key="genre.id" :value="genre.id">{{ genre.name }}</option>
        </select>

        <label for="synopsis">Synopsis:</label>
        <textarea v-model="inputMovie.synopsis" id="synopsis" name="synopsis" ></textarea>

        <label for="trailer">Trailer URL:</label>
        <input v-model="inputMovie.trailerUrl" type="url" id="trailer" name="trailer" />

        <label for="rating">Rating:</label>
        <input 
          v-model="inputMovie.rating" 
          type="number" id="rating" 
          name="rating" 
          min="1" 
          max="10" 
          placeholder="Enter rating (1-10)"  
        />

        <label for="image">Image URL:</label>
        <input v-model="inputMovie.imageUrl" type="url" id="image" name="image" />

        <ReusableButton type="submit" :text="buttonText"/>
      </form>
    </div>
  </section>
</template>