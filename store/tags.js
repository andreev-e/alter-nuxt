export const state = () => ({
    tags: [],
    tagsLoading: false,
    countries: [],
});

export const getters = {
    // eslint-disable-next-line no-shadow
    tagsLoading: (state) => state.tagsLoading,
    // eslint-disable-next-line no-shadow
    tagsExist: (state) => state.tags.length > 0,
    // eslint-disable-next-line no-shadow
    countriesExist: (state) => state.countries.length > 0,
};

export const mutations = {
    // eslint-disable-next-line no-shadow
    async getTags(state) {
        state.tagsLoading = true;
        const res = await this.$axios.$get('/tag');
        state.tags = res.data;
        state.tagsLoading = false;
    },
    // eslint-disable-next-line no-shadow
    async getCountries() {
        const res = await this.$axios.$get('/locations');
        state.countries = res.data;
    },
};
