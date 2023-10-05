<script>
export default {
    props: ['type', 'text']
}
</script>

<template>
    <button :type="type" class="btn btn-primary movie-add-button">{{text}}</button>
</template>