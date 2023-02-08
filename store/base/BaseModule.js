import { Request } from 'laravel-request-utils';
import LocalStorage from '../utils/LocalStorage';

Request.setConfig({
    autoRequestCsrfCookie: true,
    csrfCookieUrl: '/api/sanctum/csrf-cookie',
    headers: {},
    withCredentials: false,
});

export default class BaseModule {
    constructor(endpoint, stateParams = {}) {
        this.defaultState = () => ({
            ...stateParams,
            params: {},
            endpoint: `https://api.altertravel.ru/api${endpoint}`,
            loading: false,
            data: {},
            initiallyLoaded: false,
        });
    }

    state() {
        return this.defaultState;
    }

    // eslint-disable-next-line class-methods-use-this
    getters() {
        return {
            data: (state) => state.data,
            loading: (state) => state.loading,
            initiallyLoaded: (state) => state.initiallyLoaded,
            endpoint: (state) => state.endpoint,
        };
    }

    // eslint-disable-next-line class-methods-use-this
    actions() {
        return {
            async get({
                state,
                commit,
            }) {
                if (process.client && state.cached) {
                    if (LocalStorage.has(state.endpoint)) {
                        const item = LocalStorage.get(state.endpoint);
                        if (item.time && item.time > new Date().getTime() - (24 * 60 * 60 * 1000)) {
                            commit('setData', item.data);
                            commit('setInitiallyLoaded', true);
                            return;
                        }
                    }
                }

                commit('setLoading', true);

                // eslint-disable-next-line max-len
                await Request.getInstance().get(state.endpoint, { params: state.params })
                    .then((response) => {
                        if (!Object.prototype.hasOwnProperty.call(state.params, 'page') || (state.params.page !== undefined && state.params.page !== null)) {
                            commit('setData', response.data);
                            if (process.client && state.cached) {
                                LocalStorage
                                    .set(state.endpoint, {
                                        time: new Date().getTime(),
                                        data: response.data,
                                    });
                            }
                        } else {
                            commit('appendData', response.data);
                        }
                    })
                    .finally(() => {
                        commit('setInitiallyLoaded', true);
                        commit('setLoading', false);
                    });
            },
            async remove({ state }, url) {
                await Request.getInstance().delete(url, { params: state.params });
            },
            setParams: ({ commit }, params) => {
                commit('setParams', params);
            },
            clear({
                state,
                commit,
            }) {
                if (process.client && state.cached) {
                    LocalStorage.remove(state.endpoint);
                }

                commit('setData', {});
                commit('setInitiallyLoaded', false);
            },
        };
    }

    mutations() {
        return {
            RESET_STATE: (state) => {
                Object.assign(state, this.defaultState());
            },
            setData: (state, data) => {
                state.data = data;
            },
            appendData: (state, responseData) => {
                const {
                    data,
                    meta,
                    links,
                } = responseData;
                data.forEach((i) => {
                    if (state.data.data.find((fIndex) => fIndex.id === i.id) === undefined) {
                        state.data.data.push(i);
                    }
                });
                state.data.meta = meta;
                state.data.links = links;
            },
            setParams: (state, params) => {
                state.params = params;
            },

            setInitiallyLoaded: (state, data) => {
                state.initiallyLoaded = data;
            },

            setLoading: (state, data) => {
                state.loading = data;
            },

            SET_ID: (state, data) => {
                let { endpoint } = state;
                endpoint = endpoint.replace(':id', data);

                state.endpoint = endpoint;
            },
        };
    }

    getModule() {
        return {
            namespaced: true,
            state: this.state(),
            getters: this.getters(),
            actions: this.actions(),
            mutations: this.mutations(),
        };
    }
}
