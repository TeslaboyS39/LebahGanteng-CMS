<script>
// script disini tidak menggunakan setup(ini baru digunakan untuk composition api)
import Navbar from "./components/Navbar.vue"
import DashboardPage from "./components/DashboardPage.vue"
import MoviesPage from "./components/MoviesPage.vue"
import GenresPage from "./components/GenresPage.vue"
import HistoriesPage from "./components/HistoriesPage.vue"
import { formatDate } from './helpers/dateFormatter';
import AddMovieForm from "./components/AddMovieForm.vue"
import EditMovieForm from "./components/EditMovieForm.vue"
import LoginPage from "./components/LoginPage.vue"
import RegisterPage from "./components/RegisterPage.vue"
// const baseUrl = 'https://client-project-01.fatahillah.shop' // for production
const baseUrl = 'http://localhost:3000' // for testing use

export default {
    components: {
      Navbar, DashboardPage, MoviesPage, GenresPage, HistoriesPage, AddMovieForm, EditMovieForm, LoginPage, RegisterPage
    },
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
    formatDate
  },
  methods: {
    async fetchDataMovies() {
      try {
        // console.log('data fetched succesfully')
        const { data } = await axios ({
          method: 'get',
          url: `${baseUrl}/movies`,
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
          url: `${baseUrl}/genres`,
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
          url: `${baseUrl}/histories`,
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
    async changePage(page) {
      this.currentPage = page;
    },
    async editMovieForm(inputMovie) {
      console.log(inputMovie);
      try {
        const { data } = await axios ({
          method: 'put',
          url: `${baseUrl}/movies/${inputMovie.id}`,
          headers: {
            access_token: localStorage.access_token
          },
          data: inputMovie
        })
        console.log(data);
        this.fetchDataMovies();
        this.fetchDataHistories();
        this.currentPage='showmovies'
      } catch (error) {
        console.log(error);
      }
    },
    async editMovie(movieId) {
      try {
        const movieData = await this.fetchMovieById(movieId);
          this.inputAddMovie = {
            id: movieData.id,
            title: movieData.title,
            genreId: movieData.genreId,
            synopsis: movieData.synopsis,
            trailerUrl: movieData.trailerUrl,
            rating: movieData.rating,
            imageUrl: movieData.imageUrl,
          };
          this.changePage('editmovie') 
      } catch (error) {
        console.log(error);
      }
    },
    async doRegister(value) {
      try {
        const response = await axios({
          method: 'post',
          url: `${baseUrl}/register`,
          data: value
        })
        console.log(response);

        if (response.status === 201) {
          this.switchToLogin();
          Swal.fire("Registration Success!", "Now you're able to sign in.", "success");
        }
      } catch (error) {
        console.log(error);
      }
    },
    async doLogin(inputLogin) {
      try {
        const response = await axios({
          method: 'post',
          url: `${baseUrl}/login`,
          data: inputLogin
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

        Swal.fire("Login Success!", "Welcome to Lebah Ganteng!", "success");
      } catch (error) {
        console.log(error);
      }
    },
    async doGoogleLogin(response) {
      try {
        const { data } = await axios({
          method: 'post',
          url: `${baseUrl}/google-login`,
          headers: {
              credential: response.credential
          },        
        })
        console.log(data);
        this.currentPage = "dashboard"
        this.navStatus = 'active'

        const accessToken = data.access_token;
        const userName = data.userName;
        localStorage.setItem('access_token', accessToken)
        localStorage.setItem('userName', userName)

        this.username = localStorage.getItem('userName');        
        this.fetchDataMovies()
        this.fetchDataGenres()
        this.fetchDataHistories()
        Swal.fire("Login Success!", "Welcome to Lebah Ganteng!", "success");
      } catch (error) {
        console.log(error);
      }
    },
    async addMovieForm(addMovie) {
      try {
        const response = await axios ({
          method: 'post',
          url: `${baseUrl}/movies`,
          data: addMovie,
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
          Swal.fire(
                'Add movie success!',
                'Thank you for add a movie in database',
                'success'
          )
        }
      } catch (error) {
        console.log(error);
        console.log(error.response.data, '<<<server response');
      }
    },
    async fetchMovieById(movieId) {
      try {
        const { data } = await axios({
          method: 'get',
          url: `${baseUrl}/movies/${movieId}`,
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
          url: `${baseUrl}/movies/${this.inputAddMovie.id}`,
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
          
          Swal.fire(
                'Update movie success!',
                'Thank you for update a movie in database',
                'success'
          )
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
          url: `${baseUrl}/movies/${movie.id}`,
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
    },
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
  <Navbar :username="username" :currentPage="currentPage" :navStatus="navStatus" :changePage="changePage" :doLogout="doLogout" />
  <!-- END NAVBAR SECTION -->

  <!-- PRE LOGIN SECTION -->
  <div class="form-container">
    <!-- REGISTER FORM SECTION -->
    <RegisterPage v-if="currentPage === 'register'" 
    @doRegister="doRegister" 
    @switchToLogin="switchToLogin"
    />
    <!-- END REGISTER FORM SECTION -->

    <!-- LOGIN FORM SECTION -->
    <LoginPage v-if="currentPage === 'login'" 
    @doLogin="doLogin"
    @doGoogleLogin="doGoogleLogin"
    />
    <!-- END LOGIN FORM SECTION -->
  </div>
  <!-- END PRE LOGIN SECTION -->

  <!-- POST LOGIN SECTION -->
  <!-- DASHBOARD SECTION -->
  <DashboardPage v-if="currentPage === 'dashboard'" :movies="movies" :genres="genres" :currentPage="currentPage" />
  <!-- END DASHBOARD SECTION -->

  <!-- MOVIES SECTION -->
  <MoviesPage
    v-if="currentPage === 'showmovies'"
    :movies="movies"
    :currentPage="currentPage"
    @editMovie="editMovie"
    @addMovie="changePage('addmovie')"
    @update-movie-status="updateMovieStatus"
  />
  <!-- END MOVIES SECTION -->

  <!-- ADD MOVIE FORM SECTION -->
  <AddMovieForm
    v-if="currentPage === 'addmovie'"
    :genres="genres"
    :currentPage="currentPage"
    @addMovieForm="addMovieForm" 
  />
  <!-- END ADD MOVIE FORM SECTION -->

  <!-- EDIT MOVIE FORM SECTION -->
  <EditMovieForm
    v-if="currentPage === 'editmovie'"
    :genres="genres"
    :inputAddMovie="inputAddMovie"
    :currentPage="currentPage"
    @editMovieForm="editMovieForm" 
  />
  <!-- END EDIT MOVIE FORM SECTION -->
  
  <!-- GENRES SECTION -->
  <GenresPage v-if="currentPage === 'showgenres'" :genres="genres" :currentPage="currentPage" />
  <!-- END GENRES SECTION -->

  <!-- HISTORIES SECTION -->
  <HistoriesPage v-if="currentPage === 'histories'" :histories="histories" :currentPage="currentPage" />
  <!-- END HISTORY SECTION -->
</div>
</template>

<style>
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
  margin: 14.7px auto;
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
  margin: 20px auto;
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
