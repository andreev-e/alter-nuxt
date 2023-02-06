import PaginatedItemsListModule from './base/PaginatedItemsListModule';

class CommentsPaginated extends PaginatedItemsListModule {
    constructor() {
        super('/comment');
    }
}

export default new CommentsPaginated().getModule();
