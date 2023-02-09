import PaginatedItemsListModule from './base/PaginatedItemsListModule';

class RoutesPaginated extends PaginatedItemsListModule {
    constructor() {
        super('/route');
    }
}

export default new RoutesPaginated().getModule();
