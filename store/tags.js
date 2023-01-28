import ItemsListModule from './base/ItemsListModule';

class Tags extends ItemsListModule {
    constructor() {
        super('/tag', { cached: true });
    }
}

export default new Tags().getModule();
