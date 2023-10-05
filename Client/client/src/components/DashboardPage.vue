<script>
export default {
  props: ['movies', 'genres', 'currentPage'],
};
</script>

<template>
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
</template>