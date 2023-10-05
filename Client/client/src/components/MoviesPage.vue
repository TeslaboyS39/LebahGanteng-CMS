<script>
import TableRow from "./TableRow.vue";
import ReusableButton from "./ReusableButton.vue";

export default{
  props: ['currentPage', 'movies'],
  components: {
    TableRow,ReusableButton
  },
  methods: {
    editMovie(movieId) {
        this.$emit('editMovie', movieId);
    },
    updateMovieStatus(movie) {
        this.$emit('update-movie-status', movie);
    },
    addMovie() {
        this.$emit('addMovie');
    }    
  }
};
</script>

<template>
  <section v-if="currentPage === 'showmovies'" id="showmovies-section">
    <div class="movie-collection">
      <h2>Movies Collection</h2>
      <ReusableButton @click="addMovie" text="Add Movie" type="button"/>
      
      <table class="table">
          <thead>
            <tr>
              <th class="table-header">#</th>
              <th class="table-header">Title</th>
              <th class="table-header">Movie Poster</th>
              <th class="table-header">Synopsis</th>
              <th class="table-header">Rating</th>
              <th class="table-header">Trailer</th>
              <th class="table-header">Genre</th>
              <th class="table-header">Author</th>
              <th class="table-header">Status</th>
              <th class="table-header"></th>
            </tr>
          </thead>
          <tbody>
            <table-row
                v-for="(movie, index) in movies"
                :key="movie.id"
                :index="index"
                :movie="movie"
                @editMovie="editMovie"
                @update-movie-status="updateMovieStatus"
            />
          </tbody>
      </table>
    </div>
  </section>
</template>
