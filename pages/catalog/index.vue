<template>
    <div>
        1Redirecting...
        {{ $route.params }}
        to: {{ to }}
    </div>
</template>

<script>
    import str from '../../mixins/str';

    export default {
        mixins: [str],
        computed: {
            to() {
                let redirect = this.$route.params.id;
                if (redirect) {
                    redirect = redirect.split(',');
                    if (redirect.length > 1) {
                        redirect = redirect.slice(0, 2);
                        redirect.forEach((chunk, key) => { redirect[key] = this.urlSlug(chunk); });
                        redirect = `/region/${redirect.join('/')}`;
                        return redirect;
                    }
                    if (this.startsWithCapital(redirect[0])) {
                        return `/region/${this.urlSlug(redirect[0])}`;
                    }
                    return `/tag/${this.urlSlug(redirect[0])}`;
                }
                return '/';
            },
        },
        mounted() {
            this.$router.push(this.to);
        },
    };
</script>

<style scoped>

</style>
