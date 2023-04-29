export default {
    watch: {
        page(p) {
            if (p) {
                this.$router.push({ query: { p } });
            }
            if (process.client) {
                this.$refs.top?.$el.scrollIntoView({ behavior: 'smooth' });
            }
            this.fetchPois();
        },
    },
};
