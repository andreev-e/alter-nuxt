// eslint-disable-next-line import/no-cycle
import BaseModule from './BaseModule';

export default class ListModule extends BaseModule {
    getters() {
        return {
            ...super.getters(),
            items: (state) => state.data.data ?? [],
            itemsExist: (state, getters) => getters.items.length > 0,
            // eslint-disable-next-line max-len
            itemById: (state, getters) => (id) => getters.items.find((item) => item.id === id) ?? null,
        };
    }

    actions() {
        return {
            ...super.actions(),
        };
    }

    mutations() {
        return {
            ...super.mutations(),
            updateOne: (state, replace) => {
                const items = state.data.data;
                const index = items.findIndex((item) => item.id === replace.id);
                items.splice(index, 1, replace);
            },

            appendOne: (state, item) => {
                const items = state.data.data;
                items.push(item);
            },

            removeOne: (state, id) => {
                const items = state.data.data;
                const index = items.findIndex((item) => item.id === id);

                items.splice(index, 1);
            },
        };
    }
}
