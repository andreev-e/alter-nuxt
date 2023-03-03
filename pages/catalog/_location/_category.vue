<template>
    <div>
        2Redirecting...
        {{ $route.params }}
        to: {{ to }}
    </div>
</template>

<script>

    import str from '../../../mixins/str';

    export default {
        mixins: [str],
        computed: {
            to() {
                const redirect = this.$route.params;
                return `/region/${this.urlSlug(redirect.location)}/${redirect.category}`;
            },
        },
        created() {
            this.$router.push(this.to);
        },
    };
</script>

<style scoped>

</style>
