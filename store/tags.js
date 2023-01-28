import ItemsListModule from './base/ItemsListModule';

class Tags extends ItemsListModule {
    constructor() {
        super('/tag');
    }
}

export default new Tags().getModule();
