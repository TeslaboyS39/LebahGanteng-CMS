<script>
// script disini tidak menggunakan setup(ini baru digunakan untuk composition api)
export default {
    data() {
    return {
      username: '',
      currentPage: '',
      navStatus: 'disabled',
      inputRegister:{
        userName: '',
        email: '',
        password: '',
        phoneNumber: '',
        address: '',
      },
      inputLogin: {
        email: '',
        password: ''
      },
      movies: [],
      genres: [],
      histories: [],
      inputAddMovie: {
        title: '',
        genreId: '',
        synopsis: '',
        trailerUrl: '',
        rating: '',
        imageUrl: ''
      }
    };
  },
  computed: {
    formatDate() {
      return function(dateString) {
        const options = { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric'
          };
        return new Date(dateString).toLocaleDateString("en-US", options);
      }
    }
  },
  methods: {
    async fetchDataMovies() {
      try {
        // console.log('data fetched succesfully')
        const { data } = await axios ({
          method: 'get',
          url: 'http://localhost:3000/movies',
          headers: {
            access_token: localStorage.access_token
          }
        })
        
        // console.log(data);
        this.movies = data
      } catch (error) {
        console.log(error);
      }
    },
    async fetchDataGenres() {
      try {
        // console.log('data fetched succesfully')
        const { data } = await axios ({
          method: 'get',
          url: 'http://localhost:3000/genres',
          headers: {
            access_token: localStorage.access_token
          }
        })
        
        // console.log(data);
        this.genres = data
      } catch (error) {
        console.log(error);
      }
    },
    async fetchDataHistories() {
      try {
        // console.log('data fetched succesfully')
        const { data } = await axios ({
          method: 'get',
          url: 'http://localhost:3000/histories',
          headers: {
            access_token: localStorage.access_token
          }
        })
        
        // console.log(data);
        this.histories = data
      } catch (error) {
        console.log(error);
      }
    },
    switchToLogin() {
      this.currentPage = "login";
    },
    async changePage(page, movieId) {
      this.currentPage = page;
      console.log("changePage triggered with movieId:", movieId);

      if (page === 'editmovie') {
        const movieData = await this.fetchMovieById(movieId);
        console.log("Fetched movieData:", movieData);
        if (movieData) {
          this.inputAddMovie = {
            id: movieData.id,
            title: movieData.title,
            genreId: movieData.genreId,
            synopsis: movieData.synopsis,
            trailerUrl: movieData.trailerUrl,
            rating: movieData.rating,
            imageUrl: movieData.imageUrl,
          };
        }
      }
    },
    async doRegister() {
      try {
        const response = await axios({
          method: 'post',
          url: 'http://localhost:3000/register',
          data: this.inputRegister
        })

        if (response.status === 201) {
          this.switchToLogin();
        }
      } catch (error) {
        console.log(error);
      }
    },
    async doLogin() {
      try {
        const response = await axios({
          method: 'post',
          url: 'http://localhost:3000/login',
          data: this.inputLogin
        })
        // console.log(response);
        // console.log(response.data, '<<<<<< ini response datanya');
        this.currentPage = "dashboard"
        this.navStatus = 'active'

        const accessToken = response.data.access_token;
        const userName = response.data.userName;
        localStorage.setItem('access_token', accessToken)
        localStorage.setItem('userName', userName)

        this.username = localStorage.getItem('userName');        
        this.fetchDataMovies()
        this.fetchDataGenres()
        this.fetchDataHistories()
      } catch (error) {
        console.log(error);
      }
    },
    async addMovie() {
      try {
        const response = await axios ({
          method: 'post',
          url: 'http://localhost:3000/movies',
          data: this.inputAddMovie,
          headers: {
            access_token: localStorage.access_token
          }
        })

        if (response.status === 201) {
          // Buat ngereset kolom inputannya misal dah berhasil ditambahin
          this.inputAddMovie = {
            title: '',
            genre: '',
            synopsis: '',
            trailerUrl: '',
            rating: '',
            imageUrl: ''
          };
          this.fetchDataMovies();
          this.fetchDataHistories();
          this.changePage('showmovies');
        }
      } catch (error) {
        console.log(error);
      }
    },
    async fetchMovieById(movieId) {
      try {
        const { data } = await axios({
          method: 'get',
          url: `http://localhost:3000/movies/${movieId}`,
          headers: {
            access_token: localStorage.access_token,
          },
        })
        console.log("Fetched movie by ID:", data);
        return data
      } catch (error) {
        console.log(error);
      }
    },
    async updateMovie() {
      try {
        const response = await axios({
          method: 'put',
          url: `http://localhost:3000/movies/${this.inputAddMovie.id}`,
          data: this.inputAddMovie,
          headers: {
            access_token: localStorage.access_token,
          },
        })

        if (response.status === 200) {
          this.inputAddMovie = {
            id: '',
            title: '',
            genreId: '',
            synopsis: '',
            trailerUrl: '',
            rating: '',
            imageUrl: '',
          }

          this.fetchDataMovies();
          this.fetchDataHistories();
          this.changePage('showmovies');  
        }
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Forbidden access to update this data!'
      })
      }
    },
    async updateMovieStatus(movie) {
      try {
        const response = await axios({
          method: 'patch',
          url: `http://localhost:3000/movies/${movie.id}`,
          data: {
            status: movie.status
          },
          headers: {
            access_token: localStorage.access_token,
          },
        })

        if (response.status === 200) {
          this.fetchDataHistories();
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Movie status updated successfully.',
          });
          this.changePage('histories');  
        }
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Forbidden access to update this data status!',
        });
      }
    },
    doLogout() {
      localStorage.removeItem('access_token')
      localStorage.removeItem('userName')
      this.currentPage = "register"
      this.navStatus = 'disabled'
      this.username = ', welcome to LG';
    }
  },
  created() {
    if (localStorage.access_token) {
      this.currentPage = 'dashboard'
      this.username = localStorage.userName
      this.navStatus = 'active'
      this.fetchDataMovies()
      this.fetchDataGenres()
      this.fetchDataHistories()
    } else {
      this.currentPage = 'register'
      this.username = ', welcome to LG'      
    }
  }
}
</script>

<template>
<div class="main-container">
  <!-- NAVBAR SECTION -->
  <nav class="navbar navbar-expand-lg bg-body-tertiary" data-bs-theme="dark">
  <div class="container-fluid align-items-center">
    <a class="navbar-brand">
      <img src="https://asset-2.tstatic.net/medan/foto/bank/images/lebah-ganteng_20180504_091841.jpg" alt="Logo" class="logo-img">
      Lebah Ganteng</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
      <div class="navbar-nav align-items-center">
          <a :class="['nav-link', { 'active': currentPage === 'dashboard' }, navStatus]" @click="changePage('dashboard')" href="#">Dashboard</a>
          <a :class="['nav-link', { 'active': currentPage === 'showmovies' }, navStatus]" @click="changePage('showmovies')" href="#">Movies</a>
          <a :class="['nav-link', { 'active': currentPage === 'showgenres' }, navStatus]" @click="changePage('showgenres')" href="#">Genres</a>
          <a :class="['nav-link', { 'active': currentPage === 'histories' }, navStatus]" @click="changePage('histories')" href="#">History</a>
        <div class="nav-item d-flex align-items-center" style="margin-left:85vh">
          <p class="mb-0 me-3">Hi <span id="username">{{username}}</span>!</p>
          <a :class="['nav-link', navStatus]" @click="doLogout()" href="#">Logout</a>
        </div>
      </div>
    </div>
  </div>
  </nav>
  <!-- END NAVBAR SECTION -->

  <!-- PRE LOGIN SECTION -->
  <div class="form-container">
    <!-- REGISTER FORM SECTION -->
    <section v-if="currentPage === 'register'" id="register-section">
      <div class="register-container">
        <h2 class="mb-4">Register</h2>
        <form>
          <div class="mb-3">
            <input v-model="inputRegister.userName" type="text" class="form-control" placeholder="Username" required />
          </div>
          <div class="mb-3">
            <input v-model="inputRegister.email" type="email" class="form-control" placeholder="Email" required />
          </div>
          <div class="mb-3">
            <input v-model="inputRegister.password" type="password" class="form-control" placeholder="Password" required />
          </div>
          <div class="mb-3">
            <input v-model="inputRegister.phoneNumber" type="tel" class="form-control" placeholder="Phone Number" required />
          </div>
          <div class="mb-3">
            <input v-model="inputRegister.address" type="text" class="form-control" placeholder="Address" required />
          </div>
          <button type="submit" @click.prevent="doRegister" class="btn btn-primary">Register</button>
        </form>
        <br>
        <button @click.prevent="switchToLogin" type="button" class="btn btn-warning">Already have an account</button>
      </div>
    </section>
    <!-- END REGISTER FORM SECTION -->

    <!-- LOGIN FORM SECTION -->
    <section v-if="currentPage === 'login'" id="login-section">
      <div class="login-container">
          <h2>Login</h2>
          <form>
              <input v-model="inputLogin.email" type="email" placeholder="Email" required>
              <input v-model="inputLogin.password" type="password" placeholder="Password" required>
              <button type="submit" @click.prevent="doLogin">Login</button>
          </form>
      </div>
    </section>
    <!-- END LOGIN FORM SECTION -->
  </div>
  <!-- END PRE LOGIN SECTION -->

  <!-- POST LOGIN SECTION -->
  <!-- DASHBOARD SECTION -->
  <section v-if="currentPage === 'dashboard'" id="dashboard-section">
    <div class="dashboard-section">
      <h2>Dashboard</h2>
      <hr>
      <div class="dashboard-info">
          <div class="dashboard-item">
              <h3>Total Movies</h3>
              <p>{{movies.length}}</p>
          </div>
          <div class="dashboard-item">
              <h3>Total Genres</h3>
              <p>{{genres.length}}</p>
          </div>
      </div>
    </div>
  </section>
  <!-- END DASHBOARD SECTION -->

  <!-- MOVIES SECTION -->
  <section v-if="currentPage === 'showmovies'" id="showmovies-section">
    <div class="movie-collection">
      <h2>Movies Collection</h2>
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
            <tr v-for="(movie, index) in movies" :key="movie.id">
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
              <td><button class="edit-button" @click="changePage('editmovie', movie.id)">✏️</button></td>
            </tr>
          </tbody>
      </table>
      <button @click="changePage('addmovie')" type="button" class="btn btn-primary movie-add-button">Add Movie</button>
    </div>
  </section>
  <!-- END MOVIES SECTION -->

  <!-- ADD MOVIE FORM SECTION -->
  <section v-if="currentPage === 'addmovie'" id="addmovie-section">
    <div class="add-movie-form">
      <h2>Add Movie</h2>
      <form @submit.prevent="addMovie">
        <label for="title">Title:</label>
        <input v-model="inputAddMovie.title" type="text" id="title" name="title" required />

        <label for="genre">Genre:</label>
        <select v-model="inputAddMovie.genreId" id="genre" name="genre" required>
          <option value="" disabled selected>Select Genre</option>
          <option v-for="genre in genres" :key="genre.id" :value="genre.id">{{ genre.name }}</option>
        </select>

        <label for="synopsis">Synopsis:</label>
        <textarea v-model="inputAddMovie.synopsis" id="synopsis" name="synopsis" required></textarea>

        <label for="trailer">Trailer URL:</label>
        <input v-model="inputAddMovie.trailerUrl" type="url" id="trailer" name="trailer" required />

        <label for="rating">Rating:</label>
        <input 
          v-model="inputAddMovie.rating" 
          type="number" id="rating" 
          name="rating" 
          min="1" 
          max="10" 
          placeholder="Enter rating (1-10)" 
          required 
        />

        <label for="image">Image URL:</label>
        <input v-model="inputAddMovie.imageUrl" type="url" id="image" name="image" required />

        <button type="submit">Add Movie</button>
      </form>
    </div>
  </section>
  <!-- END ADD MOVIE FORM SECTION -->

  <!-- EDIT MOVIE FORM SECTION -->
  <section v-if="currentPage === 'editmovie'" id="editmovie-section">
    <div class="edit-movie-form">
      <h2>Edit Movie</h2>
      <form @submit.prevent="updateMovie">
        <label for="edit-title">Title:</label>
        <input v-model="inputAddMovie.title" type="text" id="edit-title" name="edit-title" required />

        <label for="edit-genre">Genre:</label>
        <select v-model="inputAddMovie.genreId" id="edit-genre" name="edit-genre" required>
          <option value="" disabled selected>Select Genre</option>
          <option v-for="genre in genres" :key="genre.id" :value="genre.id">{{ genre.name }}</option>
        </select>

        <label for="edit-synopsis">Synopsis:</label>
        <textarea v-model="inputAddMovie.synopsis" id="edit-synopsis" name="edit-synopsis" required></textarea>

        <label for="edit-trailer">Trailer URL:</label>
        <input v-model="inputAddMovie.trailerUrl" type="url" id="edit-trailer" name="edit-trailer" required />

        <label for="edit-rating">Rating:</label>
        <input 
          v-model="inputAddMovie.rating" 
          type="number" id="edit-rating" 
          name="edit-rating" 
          min="1" 
          max="10" 
          placeholder="Enter rating (1-10)" 
          required 
        />

        <label for="edit-image">Image URL:</label>
        <input v-model="inputAddMovie.imageUrl" type="url" id="edit-image" name="edit-image" required />

        <button type="submit">Update Movie</button>
      </form>
    </div>
  </section>
  <!-- END EDIT MOVIE FORM SECTION -->
  
  <!-- GENRES SECTION -->
  <section v-if="currentPage === 'showgenres'" id="showgenres-section">
    <div class="genre-collection">
      <h2>Genres List</h2>
      <table class="table">
          <thead>
            <tr>
              <th class="table-header">#</th>
              <th class="table-header">Name</th>
              <th class="table-header"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(genre, index) in genres" :key="genre.id">
              <td>{{index + 1}}</td>
              <td>{{genre.name}}</td>
              <td><button class="edit-button">✏️</button></td>
            </tr>
          </tbody>
      </table>
      <button class="btn btn-primary genre-add-button" disabled>Add Genre</button>
    </div>
  </section>
  <!-- END GENRES SECTION -->

  <!-- HISTORIES SECTION -->
  <section v-if="currentPage === 'histories'" id="histories-section">
    <div class="history-logs">
      <h2>History Logs</h2>
      <table class="table">
        <thead>
          <tr>
            <th class="table-header">#</th>
            <th class="table-header">Movies Name</th>
            <th class="table-header">Description</th>
            <th class="table-header">Created At</th>
            <th class="table-header">Updated By</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(history, index) in histories" :key="history.id">
            <td>{{index + 1}}</td>
            <td>{{history.title}}</td>
            <td>{{history.description}}</td>
            <td>{{formatDate(history.createdAt)}}</td>
            <td>{{history.updatedBy}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
  <!-- END HISTORY SECTION -->
</div>
</template>

<style scoped>
/* navbar beserta isinya */
p {
  color: white;
  margin: 0;
}

.nav-link.active {
  font-weight: bold; 
}

.navbar-brand {
  font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  background-color: #535d67;
  padding: 7px;
  border-radius: 5px;
}

.logo-img {
  height: 30px; 
  margin-right: 6px; 
  border-radius: 5px;
}

/* Register and Login section */
.register-container,
.login-container {
  background-color: #e6dddd;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin: 20px auto;
  max-width: 400px;
  text-align: center;
}

.login-container {
  margin-top: 25vh;
}

.register-container h2,
.login-container h2 {
  margin-bottom: 20px;
}

.register-container form,
.login-container form {
  display: flex;
  flex-direction: column;
}

.register-container input,
.login-container input,
.register-container select {
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.register-container button,
.login-container button {
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

#register-section {
  padding-bottom: 0.009vh;
}

#login-section {
  padding-bottom: 25.3vh;
}

/* setelah login nampilin dashboard di homepagenya */
.dashboard-section {
  background-color: #dbd4d4;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin: 14.7px auto;
  max-width: 600px;
  text-align: center;
  margin-top: 25vh;
}

.dashboard-info {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.dashboard-item {
  flex: 1;
  padding: 20px;
  background-color: #007bff;
  color: #fff;
  border-radius: 8px;
  margin-right: 10px;
}

.dashboard-item:last-child {
  margin-right: 0;
  /* Biar genrenya gak usah pakai margin */
}

.dashboard-item h3 {
  margin-bottom: 10px;
  font-size: 18px;
}

.dashboard-item p {
  font-size: 39px;
  font-weight: bold;
}

#dashboard-section {
  padding-bottom: 25.7vh;
}

/* menu showmovies */
.table {
  margin-left: 35px;
  margin-top: auto;
  width: 90%;
}

.movie-collection h2 {
  margin-left: 35px;
  margin-top: 20px;
  margin-bottom: 20px;
}

.movie-add-button {
  margin-top: 10px;
  margin-left: 35px;
  margin-bottom: 10px;
  padding: 10px 20px;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: inline-block;
}

.edit-button {
  padding: 6px 10px;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.poster-image {
  width: 100px;
  height: 150px;
  object-fit: cover;
  border-radius: 5px;
}

/* form add movie */
.add-movie-form {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin: 20px auto;
  max-width: 600px;
  text-align: center;
}

.add-movie-form label {
  display: block;
  margin-bottom: 5px;
  text-align: left;
}

.add-movie-form input[type="text"],
.add-movie-form input[type="url"],
.add-movie-form select,
.add-movie-form textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.add-movie-form button {
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-movie-form input[type="number"] {
  width: 85vh;
}

/* form edit movie */
.edit-movie-form {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin: 20px auto;
  max-width: 600px;
  text-align: center;
}

.edit-movie-form label {
  display: block;
  margin-bottom: 5px;
  text-align: left;
}

.edit-movie-form input[type="text"],
.edit-movie-form input[type="url"],
.edit-movie-form select,
.edit-movie-form textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.edit-movie-form button {
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.edit-movie-form input[type="number"] {
  width: 85vh;
}

/* menu show genres */
.table {
  margin-left: 35px;
  margin-top: auto;
  width: 90%;
}

.genre-collection h2 {
  margin-left: 35px;
  margin-top: 20px;
  margin-bottom: 20px;
}

.genre-add-button {
  margin-top: 10px;
  margin-left: 35px;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 22.4vh;
}

/* menu show history */
.history-logs {
  border-radius: 8px;
  margin-top: 20px;
  width: 90%;
  padding-bottom: 30px;
}

.history-logs th,
.history-logs td {
  padding: 10px;
  border: 1px solid #ccc;
}

.history-logs h2 {
  margin-left: 35px;
  margin-top: 10px;
  margin-bottom: 20px;
}

.main-container {
  background-image: url('https://i.pinimg.com/originals/f1/16/fc/f116fc1b93496a90dfaca1fb9a7411ff.jpg');
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
}

</style>
