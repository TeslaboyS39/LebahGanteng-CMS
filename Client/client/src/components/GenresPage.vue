<script>
export default {
   props: ['currentPage', 'genres'], 
}
</script>

<template>
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
</template>