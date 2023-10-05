<script>
export default {
    props: ['username', 'currentPage', 'navStatus', 'changePage', 'doLogout'],
}
</script>

<template>
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
</template>
