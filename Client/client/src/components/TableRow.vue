<script>
export default {
  props: ['index', 'movie'],
  methods: {
    editMovie() {
      this.$emit('editMovie', this.movie.id);
      console.log(this.movie.id);
    },
    updateMovieStatus(movie) {
      this.$emit('update-movie-status', movie);
    }
  }
};
</script>

<template>
  <tr>
    <td>{{index + 1}}</td>
    <td>{{movie.title}}</td>
    <td><img :src="movie.imageUrl" alt="Movie Poster" class="poster-image"></td>
    <td>{{movie.synopsis}}</td>
    <td>⭐{{movie.rating}}/10</td>
    <td><a :href="movie.trailerUrl">Watch Trailer</a></td>
    <td>{{movie.Genre.name}}</td>
    <td>{{movie.User.userName}}</td>
    <td>
      <select v-model="movie.status" @change="updateMovieStatus(movie)">
        <option value="null">Select Status</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
        <option value="Archived">Archived</option>
      </select>
    </td>
    <td><button class="edit-button" @click="editMovie">✏️</button></td>
  </tr>
</template>