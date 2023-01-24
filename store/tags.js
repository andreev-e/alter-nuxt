export const state = () => ({
    tags: [],
    countries: [],
});

export const getters = {
    // eslint-disable-next-line no-shadow
    tagsExist: (state) => state.tags.length > 0,
    // eslint-disable-next-line no-shadow
    countriesExist: (state) => state.countries.length > 0,
};

export const mutations = {
    // eslint-disable-next-line no-shadow
    async getTags(state) {
        const res = await this.$axios.$get('/tag');
        state.tags = res.data;
    },
    // eslint-disable-next-line no-shadow
    async getCountries() {
        const res = await this.$axios.$get('/locations');
        state.countries = res.data;
    },
};
