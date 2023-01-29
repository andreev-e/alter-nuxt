import PaginatedItemsListModule from './base/PaginatedItemsListModule';

class Users extends PaginatedItemsListModule {
    constructor() {
        super('/user');
    }
}

export default new Users().getModule();
