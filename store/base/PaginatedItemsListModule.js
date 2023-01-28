// eslint-disable-next-line import/no-cycle
import ItemsListModule from './ItemsListModule';

export default class PaginatedItemsListModule extends ItemsListModule {
    getters() {
        return {
            ...super.getters(),
            nextPage: (state) => (
                state.data.links && state.data.links.next ? state.data.meta.current_page + 1 : null
            ),
            meta: (state) => state.data.meta ?? {},
            links: (state) => state.data.links ?? {},
        };
    }
}
