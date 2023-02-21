import PaginatedItemsListModule from './base/PaginatedItemsListModule';

class RoutesPaginated extends PaginatedItemsListModule {
    constructor() {
        super('/route', { cache: true });
    }
}

export default new RoutesPaginated().getModule();
