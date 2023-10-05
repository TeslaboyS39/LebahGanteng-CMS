<script>
import { formatDate } from '../helpers/dateFormatter';

export default {
    props: ['currentPage', 'histories'],
    methods: {
        formatDate
    }
}
</script>

<template>
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
</template>