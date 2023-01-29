import PaginatedItemsListModule from './base/PaginatedItemsListModule';

class User extends PaginatedItemsListModule {
    constructor() {
        super('/user');
    }
}

export default new User().getModule();
