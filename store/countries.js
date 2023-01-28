import ItemsListModule from './base/ItemsListModule';

class Countries extends ItemsListModule {
    constructor() {
        super('/countries', { cached: true });
    }
}

export default new Countries().getModule();
