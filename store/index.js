export const state = () => ({
    counter: 0,
});

export const getters = {
    // eslint-disable-next-line no-shadow
    getCounter(state) {
        return state.counter;
    },
};

export const mutations = {
    // eslint-disable-next-line no-shadow
    increment(state) {
        // eslint-disable-next-line no-unused-expressions
        state.counter + 1;
    },
};

export const actions = {
    // eslint-disable-next-line no-shadow
    async fetchCounter({ state }) {
    // make request
        const res = { data: 10 };
        state.counter = res.data;
        return res.data;
    },
};
