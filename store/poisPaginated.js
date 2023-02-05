import PaginatedItemsListModule from './base/PaginatedItemsListModule';

class PoisPaginated extends PaginatedItemsListModule {
    constructor() {
        super('/poi');
    }
}

export default new PoisPaginated().getModule();
