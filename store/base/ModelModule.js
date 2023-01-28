import BaseModule from './BaseModule';

export default class ModelModule extends BaseModule {
    mutations() {
        return {
            ...super.mutations(),

            SET_ID: (state, id) => {
                state.endpoint += state.endpoint.endsWith('/') ? id : `/${id}`;
            },

            SET_PROPERTY: (state, { property, value }) => {
                state.data.data[property] = value;
            },

            APPEND_TO_PROPERTY_ARRAY: (state, { property, item }) => {
                state.data.data[property].push(item);
            },

            UPDATE_PROPERTY_IN_PROPERTY_ARRAY: (state, { property, item }) => {
                const items = state.data.data[property];
                const index = items.findIndex((propertyItem) => propertyItem.id === item.id);
                if (index > -1) {
                    items.splice(index, 1, item);
                }
            },

            REMOVE_PROPERTY_FROM_PROPERTY_ARRAY: (state, { property, id }) => {
                const items = state.data.data[property];
                const index = items.findIndex((propertyItem) => propertyItem.id === id);
                if (index > -1) {
                    items.splice(index, 1);
                }
            },
        };
    }

    getters() {
        return {
            ...super.getters(),

            model: (state) => state.data.data ?? {},
            isEmpty: (state) => !!state.data.data,
        };
    }

    actions() {
        return {
            ...super.actions(),

            setId({ commit }, id) {
                commit('RESET_STATE');
                commit('SET_ID', id);
            },

            setProperty({ commit }, { property, value }) {
                commit('SET_PROPERTY', { property, value });
            },
        };
    }
}
