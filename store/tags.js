export const state = () => ({
    list: [],
});

export const mutations = {
    // eslint-disable-next-line no-shadow
    add(state, text) {
        state.list.push({
            text,
            done: false,
        });
    },
    // eslint-disable-next-line no-shadow
    remove(state, { todo }) {
        state.list.splice(state.list.indexOf(todo), 1);
    },
    // eslint-disable-next-line no-shadow
    toggle(state, todo) {
        todo.done = !todo.done;
    },
};
