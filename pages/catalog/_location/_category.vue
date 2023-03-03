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
                let { location } = redirect;
                if (location) {
                    location = location.split(',');
                    if (location.length > 1) {
                        location = location.slice(0, 2);
                        location.forEach((chunk, key) => { location[key] = this.urlSlug(chunk); });
                        return `/region/${location.join('/')}`;
                    }
                    if (this.startsWithCapital(location[0])) {
                        return `/region/${this.urlSlug(location[0])}`;
                    }
                    return `/tag/${this.urlSlug(redirect[0])}`;
                }
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
